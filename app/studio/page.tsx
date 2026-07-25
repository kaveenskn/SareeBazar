"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle, MoreHorizontal, Plus, User, ChevronLeft } from "lucide-react";
import Image from "next/image";
import StudioCreatePost from "./StudioCreatePost";
import StudioMyPosts from "./StudioMyPosts";
import { useAuthGate } from "@/lib/useAuthGate";
import AuthGateModal from "@/app/components/AuthGate";
import { StudioContext, type FeedPost } from "./studioStore";
import type { StudioPost } from "./StudioMyPosts";

// ── Initial mock feed posts ──
const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: 1,
    user: {
      username: "saree_styles",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    },
    time: "2 hours ago",
    image: "/images/studio/saree_girl_1.png",
    likes: "1.2k",
    comments: "45",
    caption: "Draped in elegance ✨ The perfect Banarasi silk for this festive season.",
  },
  {
    id: 2,
    user: {
      username: "ethnic_vibes",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    },
    time: "5 hours ago",
    image: "/images/studio/saree_girl_2.png",
    likes: "856",
    comments: "22",
    caption: "Keeping it classic with pastel cotton sarees today. #OOTD",
  },
  {
    id: 3,
    user: {
      username: "traditional_chic",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
    },
    time: "1 day ago",
    image: "/images/studio/saree_girl_3.png",
    likes: "3.4k",
    comments: "128",
    caption: "Bold colors and bold choices. Loving this Kanjivaram drop! ❤️",
  },
];

// ── Initial mock "my posts" ──
const INITIAL_MY_POSTS: StudioPost[] = [
  {
    id: "post-1",
    image: "/images/studio/saree_girl_1.png",
    mediaType: "image",
    caption:
      "Draped in elegance ✨ The perfect Banarasi silk for this festive season. Absolutely loved how the zari work caught the light!",
    likes: 1243,
    comments: 45,
    views: 3420,
    createdAt: "2026-06-24T10:30:00Z",
    occasion: "Festival",
    drapingStyle: "Nivi",
    taggedProduct: {
      id: "p1",
      name: "Banarasi Silk Saree – Royal Blue",
      image: "/images/studio/saree_girl_1.png",
    },
    status: "published",
  },
  {
    id: "post-2",
    image: "/images/studio/saree_girl_2.png",
    mediaType: "image",
    caption: "Keeping it classic with pastel cotton sarees today. Perfect for office wear! #OOTD #SareeLove",
    likes: 856,
    comments: 22,
    views: 2150,
    createdAt: "2026-06-20T14:15:00Z",
    occasion: "Office",
    drapingStyle: "Bengali",
    taggedProduct: {
      id: "p3",
      name: "Chanderi Cotton – Mint Green",
      image: "/images/studio/saree_girl_3.png",
    },
    status: "published",
  },
  {
    id: "post-3",
    image: "/images/studio/saree_girl_3.png",
    mediaType: "image",
    caption: "Bold colors and bold choices 🔥 Loving this Kanjivaram for the wedding season!",
    likes: 3421,
    comments: 128,
    views: 8900,
    createdAt: "2026-06-15T09:00:00Z",
    occasion: "Wedding",
    drapingStyle: "Nivi",
    taggedProduct: {
      id: "p2",
      name: "Kanjivaram Silk – Deep Maroon",
      image: "/images/studio/saree_girl_2.png",
    },
    status: "published",
  },
  {
    id: "post-4",
    image: "/images/studio/saree_girl_4.png",
    mediaType: "image",
    caption: "Golden hour in a golden saree ☀️ This Mysore silk drapes like a dream.",
    likes: 0,
    comments: 0,
    views: 0,
    createdAt: "2026-06-26T08:00:00Z",
    occasion: "Casual",
    drapingStyle: "Maharashtrian",
    taggedProduct: {
      id: "p4",
      name: "Mysore Silk – Golden Yellow",
      image: "/images/studio/saree_girl_4.png",
    },
    status: "pending",
  },
];

type StudioTab = "feed" | "my-posts";

const marqueeTexts = [
  "Saree Bazar", "Elegance", "Tradition", "Silk & Cotton", "New Arrivals", "Studio"
];

export default function StudioPage() {
  const router = useRouter();
  const { requireAuth, showGate, dismissGate, gateAction } = useAuthGate();
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState<StudioTab>("feed");

  // ── Shared post state ──
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);
  const [myPosts, setMyPosts] = useState<StudioPost[]>(INITIAL_MY_POSTS);

  // ── Called by StudioCreatePost on submit ──
  const addPost = useCallback(
    (newPostData: {
      mediaPreview: string;
      caption: string;
      occasion: string;
      drapingStyle: string;
      taggedProduct: StudioPost["taggedProduct"];
    }) => {
      const now = new Date().toISOString();
      const uid = `post-${Date.now()}`;

      // Add to feed (prepend so it's the first card)
      const feedPost: FeedPost = {
        id: Date.now(),
        user: {
          username: "you",
          avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop",
        },
        time: "just now",
        image: newPostData.mediaPreview,
        likes: "0",
        comments: "0",
        caption: newPostData.caption || "New saree look ✨",
        isOwn: true,
      };
      setFeedPosts((prev) => [feedPost, ...prev]);

      // Add to my posts (prepend)
      const myPost: StudioPost = {
        id: uid,
        image: newPostData.mediaPreview,
        mediaType: "image",
        caption: newPostData.caption || "New saree look ✨",
        likes: 0,
        comments: 0,
        views: 0,
        createdAt: now,
        occasion: newPostData.occasion || undefined,
        drapingStyle: newPostData.drapingStyle || undefined,
        taggedProduct: newPostData.taggedProduct ?? undefined,
        status: "pending",
      };
      setMyPosts((prev) => [myPost, ...prev]);
    },
    []
  );

  return (
    <StudioContext.Provider value={{ feedPosts, myPosts, addPost }}>
      <div className="fixed inset-0 bg-gray-50 font-sans font-normal z-30 flex justify-center overflow-hidden">

        {/* Background Text Marquee */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.03] flex items-center justify-center select-none">
          <div className="flex flex-col gap-12 w-[200vw] h-[200vh] -rotate-12 scale-125 justify-center">
            {[0, 1, 2, 3, 4, 5, 6].map((row) => (
              <div
                key={row}
                className={`flex gap-16 w-max ${
                  row % 2 === 0
                    ? "animate-[marquee_120s_linear_infinite]"
                    : "animate-[marquee_150s_linear_infinite_reverse]"
                }`}
              >
                {[...marqueeTexts, ...marqueeTexts, ...marqueeTexts, ...marqueeTexts].map((text, i) => (
                  <span key={`${row}-${i}`} className="text-8xl font-serif font-black text-gray-900 whitespace-nowrap shrink-0">
                    {text} •{" "}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-[500px] bg-white h-full flex flex-col shadow-2xl shadow-primary/5 border-x border-gray-100 z-10 relative">
          {/* Spacer for global Navbar */}
          <div className="h-[90px] w-full shrink-0 bg-white" />

          {/* Isolated Scrollable Feed */}
          <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
            {/* Header with Tabs */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.back()}
                    className="p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <h1 className="text-xl font-normal text-gray-900">Studio</h1>
                </div>
                <span className="text-xs font-normal bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {activeTab === "feed" ? "Feed" : "My Posts"}
                </span>
              </div>

              {/* Tab Bar */}
              <div className="px-4 flex gap-0">
                <button
                  onClick={() => setActiveTab("feed")}
                  className={`flex-1 py-2.5 text-sm font-medium text-center relative transition-colors duration-200 ${
                    activeTab === "feed" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Feed
                  {activeTab === "feed" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[2.5px] bg-primary rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => {
                    if (!requireAuth("view your posts")) return;
                    setActiveTab("my-posts");
                  }}
                  className={`flex-1 py-2.5 text-sm font-medium text-center relative transition-colors duration-200 flex items-center justify-center gap-1.5 ${
                    activeTab === "my-posts" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <User size={14} />
                  My Posts
                  {activeTab === "my-posts" && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[2.5px] bg-primary rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "feed" ? (
              /* ── Feed Tab ── */
              <div className="divide-y divide-gray-100">
                {feedPosts.map((post) => (
                  <article key={post.id} className="py-4">
                    {/* Post Header */}
                    <div className="px-4 flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                          <Image
                            src={post.user.avatar}
                            alt={post.user.username}
                            fill
                            className="object-cover"
                            unoptimized={post.isOwn}
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-normal text-sm text-gray-900">{post.user.username}</span>
                            {!post.isOwn && (
                              <>
                                <span className="mx-1.5 text-gray-300 text-xs">•</span>
                                <button
                                  className="text-primary font-normal text-sm hover:text-primary/80 transition-colors"
                                  onClick={() => requireAuth("follow users")}
                                >
                                  Follow
                                </button>
                              </>
                            )}
                            {post.isOwn && (
                              <>
                                <span className="mx-1.5 text-gray-300 text-xs">•</span>
                                <span className="text-[11px] text-emerald-500 font-medium">You</span>
                              </>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500">{post.time}</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>

                    {/* Post Image */}
                    <div className="relative w-full aspect-[4/5] bg-gray-100">
                      <Image
                        src={post.image}
                        alt={post.caption}
                        fill
                        className="object-cover"
                        unoptimized={post.isOwn}
                      />
                    </div>

                    {/* Post Actions */}
                    <div className="px-4 pt-4 pb-2">
                      <div className="flex items-center space-x-5 mb-3">
                        <button
                          className="flex flex-col items-center group"
                          onClick={() => requireAuth("like posts")}
                        >
                          <Heart size={26} strokeWidth={1.5} className="text-gray-900 group-hover:text-red-500 transition-colors" />
                        </button>
                        <button
                          className="flex flex-col items-center group"
                          onClick={() => requireAuth("comment on posts")}
                        >
                          <MessageCircle size={26} strokeWidth={1.5} className="text-gray-900 group-hover:text-primary transition-colors" />
                        </button>
                      </div>

                      <div className="text-sm font-normal text-gray-900 mb-1">{post.likes} likes</div>

                      <div className="text-sm text-gray-800">
                        <span className="font-normal mr-2">{post.user.username}</span>
                        {post.caption}
                      </div>

                      <button className="text-gray-500 text-sm mt-1">
                        View all {post.comments} comments
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* ── My Posts Tab ── */
              <StudioMyPosts />
            )}
          </div>

          {/* ── Floating Create Button (gated) ── */}
          <button
            onClick={() => {
              if (!requireAuth("create posts")) return;
              setShowCreate(true);
            }}
            className="absolute bottom-24 right-4 w-14 h-14 rounded-full
                       bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/30
                       flex items-center justify-center
                       hover:shadow-xl hover:shadow-primary/40 hover:scale-105
                       active:scale-95 transition-all duration-200 z-40"
            aria-label="Create new post"
          >
            <Plus size={26} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Auth Gate Modal ── */}
        <AuthGateModal show={showGate} onDismiss={dismissGate} action={gateAction} />

        {/* ── Create Post Overlay ── */}
        {showCreate && (
          <StudioCreatePost
            onClose={() => setShowCreate(false)}
            onPostCreated={() => {
              setShowCreate(false);
              // Switch to feed so the user sees their new post
              setActiveTab("feed");
            }}
          />
        )}
      </div>
    </StudioContext.Provider>
  );
}
