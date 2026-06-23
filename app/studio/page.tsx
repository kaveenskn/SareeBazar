"use client";

import { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal, Plus } from "lucide-react";
import Image from "next/image";
import StudioCreatePost from "./StudioCreatePost";

// Mock data for Studio feed
const studioPosts = [
  {
    id: 1,
    user: {
      username: "saree_styles",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
    },
    time: "2 hours ago",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=750&fit=crop",
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
    image: "https://images.unsplash.com/photo-1583391733958-d15fa6937185?w=600&h=750&fit=crop",
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
    image: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=600&h=750&fit=crop",
    likes: "3.4k",
    comments: "128",
    caption: "Bold colors and bold choices. Loving this Kanjivaram drop! ❤️",
  }
];

export default function StudioPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="fixed inset-0 bg-gray-50 font-sans font-normal z-30 flex justify-center">
      <div className="w-full max-w-[500px] bg-white h-full flex flex-col shadow-sm border-x border-gray-100">
        {/* Spacer for global Navbar to prevent feed scrolling through it */}
        <div className="h-[90px] w-full shrink-0 bg-white"></div>
        
        {/* Isolated Scrollable Feed */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-normal text-gray-900">Studio</h1>
            <span className="text-xs font-normal bg-primary/10 text-primary px-3 py-1 rounded-full">Feed</span>
          </div>

          {/* Feed */}
          <div className="divide-y divide-gray-100">
            {studioPosts.map((post) => (
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
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-normal text-sm text-gray-900">{post.user.username}</span>
                      <span className="mx-1.5 text-gray-300 text-xs">•</span>
                      <button className="text-primary font-normal text-sm hover:text-primary/80 transition-colors">
                        Follow
                      </button>
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
                />
              </div>

              {/* Post Actions */}
              <div className="px-4 pt-4 pb-2">
                <div className="flex items-center space-x-5 mb-3">
                  <button className="flex flex-col items-center group">
                    <Heart size={26} strokeWidth={1.5} className="text-gray-900 group-hover:text-red-500 transition-colors" />
                  </button>
                  <button className="flex flex-col items-center group">
                    <MessageCircle size={26} strokeWidth={1.5} className="text-gray-900 group-hover:text-primary transition-colors" />
                  </button>
                </div>
                
                <div className="text-sm font-normal text-gray-900 mb-1">
                  {post.likes} likes
                </div>
                
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
      </div>

        {/* ── Floating Create Button ── */}
        <button
          onClick={() => setShowCreate(true)}
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

      {/* ── Create Post Overlay ── */}
      {showCreate && (
        <StudioCreatePost onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}
