"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
  ImagePlus,
  Film,
  Clock,
  Eye,
  Upload,
  AlertTriangle,
} from "lucide-react";

/* ─── Types ─── */

export interface StudioPost {
  id: string;
  image: string;
  mediaType: "image" | "video";
  caption: string;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  occasion?: string;
  drapingStyle?: string;
  taggedProduct?: {
    id: string;
    name: string;
    image: string;
  };
  status: "published" | "pending" | "rejected";
}

/* ─── Mock Data ─── */

const MOCK_MY_POSTS: StudioPost[] = [
  {
    id: "post-1",
    image:
      "/images/studio/saree_girl_1.png",
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
      image:
        "/images/studio/saree_girl_1.png",
    },
    status: "published",
  },
  {
    id: "post-2",
    image:
      "/images/studio/saree_girl_2.png",
    mediaType: "image",
    caption:
      "Keeping it classic with pastel cotton sarees today. Perfect for office wear! #OOTD #SareeLove",
    likes: 856,
    comments: 22,
    views: 2150,
    createdAt: "2026-06-20T14:15:00Z",
    occasion: "Office",
    drapingStyle: "Bengali",
    taggedProduct: {
      id: "p3",
      name: "Chanderi Cotton – Mint Green",
      image:
        "/images/studio/saree_girl_3.png",
    },
    status: "published",
  },
  {
    id: "post-3",
    image:
      "/images/studio/saree_girl_3.png",
    mediaType: "image",
    caption:
      "Bold colors and bold choices 🔥 Loving this Kanjivaram for the wedding season!",
    likes: 3421,
    comments: 128,
    views: 8900,
    createdAt: "2026-06-15T09:00:00Z",
    occasion: "Wedding",
    drapingStyle: "Nivi",
    taggedProduct: {
      id: "p2",
      name: "Kanjivaram Silk – Deep Maroon",
      image:
        "/images/studio/saree_girl_2.png",
    },
    status: "published",
  },
  {
    id: "post-4",
    image:
      "/images/studio/saree_girl_4.png",
    mediaType: "image",
    caption:
      "Golden hour in a golden saree ☀️ This Mysore silk drapes like a dream.",
    likes: 0,
    comments: 0,
    views: 0,
    createdAt: "2026-06-26T08:00:00Z",
    occasion: "Casual",
    drapingStyle: "Maharashtrian",
    taggedProduct: {
      id: "p4",
      name: "Mysore Silk – Golden Yellow",
      image:
        "/images/studio/saree_girl_4.png",
    },
    status: "pending",
  },
];

/* ─── Helpers ─── */

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const OCCASIONS = ["Wedding", "Festival", "Casual", "Office", "Puja"];
const DRAPING_STYLES = [
  "Nivi",
  "Bengali",
  "Gujarati",
  "Maharashtrian",
  "Kodagu",
  "Other",
];

/* ─── Component ─── */

export default function StudioMyPosts() {
  const [posts, setPosts] = useState<StudioPost[]>(MOCK_MY_POSTS);
  const [editingPost, setEditingPost] = useState<StudioPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<StudioPost | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    }
    if (activeMenu) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [activeMenu]);

  /* ─── Delete handler ─── */
  function handleDelete(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setDeletingPost(null);
    setActiveMenu(null);
  }

  /* ─── Save edit handler ─── */
  function handleSaveEdit(updated: StudioPost) {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingPost(null);
    setActiveMenu(null);
  }

  /* ─── Status badge ─── */
  function StatusBadge({ status }: { status: StudioPost["status"] }) {
    const styles = {
      published:
        "bg-emerald-50 text-emerald-600 border-emerald-200/60",
      pending:
        "bg-amber-50 text-amber-600 border-amber-200/60",
      rejected:
        "bg-red-50 text-red-600 border-red-200/60",
    };
    const labels = {
      published: "Live",
      pending: "Under Review",
      rejected: "Rejected",
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${styles[status]}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status === "published"
              ? "bg-emerald-500"
              : status === "pending"
              ? "bg-amber-500 animate-pulse"
              : "bg-red-500"
          }`}
        />
        {labels[status]}
      </span>
    );
  }

  /* ─── Empty State ─── */
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5">
          <ImagePlus size={36} className="text-primary/40" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No posts yet
        </h3>
        <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed">
          Share your first saree look with the community! Tap the{" "}
          <span className="text-primary font-medium">+</span> button to create
          your first post.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── Post Stats Summary ── */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gradient-to-br from-primary/5 to-primary/[0.02] rounded-2xl p-3 text-center border border-primary/10">
            <p className="text-xl font-semibold text-gray-900">
              {posts.length}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Posts</p>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-rose-50/30 rounded-2xl p-3 text-center border border-rose-100/60">
            <p className="text-xl font-semibold text-gray-900">
              {formatCount(
                posts.reduce((sum, p) => sum + p.likes, 0)
              )}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Total Likes</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-50/30 rounded-2xl p-3 text-center border border-blue-100/60">
            <p className="text-xl font-semibold text-gray-900">
              {formatCount(
                posts.reduce((sum, p) => sum + p.views, 0)
              )}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">Total Views</p>
          </div>
        </div>
      </div>

      {/* ── Posts List ── */}
      <div className="px-4 pb-6 space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden
                       shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]
                       transition-shadow duration-300"
          >
            {/* Card Top: Image + Overlay Info */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden group">
              <Image
                src={post.image}
                alt={post.caption}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />

              {/* Status badge */}
              <div className="absolute top-3 left-3">
                <StatusBadge status={post.status} />
              </div>

              {/* Media type badge */}
              <div
                className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/40
                            backdrop-blur-sm text-white text-[10px] font-medium
                            flex items-center gap-1"
              >
                {post.mediaType === "video" ? (
                  <Film size={10} />
                ) : (
                  <ImagePlus size={10} />
                )}
                {post.mediaType === "video" ? "Reel" : "Photo"}
              </div>

              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Stats overlay */}
              <div className="absolute bottom-3 left-3 flex items-center gap-3">
                <span className="flex items-center gap-1 text-white text-xs font-medium">
                  <Heart size={13} fill="white" />
                  {formatCount(post.likes)}
                </span>
                <span className="flex items-center gap-1 text-white text-xs font-medium">
                  <MessageCircle size={13} fill="white" />
                  {formatCount(post.comments)}
                </span>
                <span className="flex items-center gap-1 text-white/80 text-xs">
                  <Eye size={13} />
                  {formatCount(post.views)}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4">
              {/* Caption + Actions row */}
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-gray-800 leading-relaxed line-clamp-2 flex-1">
                  {post.caption}
                </p>

                {/* Three-dot menu */}
                <div className="relative shrink-0" ref={activeMenu === post.id ? menuRef : null}>
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === post.id ? null : post.id)
                    }
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center
                               transition-colors"
                  >
                    <MoreHorizontal size={18} className="text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenu === post.id && (
                    <div
                      className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-gray-200
                                  shadow-lg shadow-black/8 overflow-hidden z-30
                                  animate-[fadeIn_0.15s_ease]"
                    >
                      <button
                        onClick={() => {
                          setEditingPost(post);
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700
                                   hover:bg-gray-50 transition-colors text-left"
                      >
                        <Pencil size={15} className="text-gray-400" />
                        Edit Post
                      </button>
                      <div className="h-px bg-gray-100" />
                      <button
                        onClick={() => {
                          setDeletingPost(post);
                          setActiveMenu(null);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600
                                   hover:bg-red-50 transition-colors text-left"
                      >
                        <Trash2 size={15} className="text-red-400" />
                        Delete Post
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags Row */}
              <div className="flex items-center flex-wrap gap-1.5 mt-3">
                {post.taggedProduct && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/5 text-primary text-[11px] font-medium rounded-full">
                    <span className="w-3.5 h-3.5 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={post.taggedProduct.image}
                        alt=""
                        width={14}
                        height={14}
                        className="w-full h-full object-cover"
                      />
                    </span>
                    {post.taggedProduct.name.length > 25
                      ? post.taggedProduct.name.slice(0, 25) + "…"
                      : post.taggedProduct.name}
                  </span>
                )}
                {post.occasion && (
                  <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[11px] rounded-full border border-gray-100">
                    {post.occasion}
                  </span>
                )}
                {post.drapingStyle && (
                  <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[11px] rounded-full border border-gray-100">
                    {post.drapingStyle}
                  </span>
                )}
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1 mt-3 text-[11px] text-gray-400">
                <Clock size={11} />
                {timeAgo(post.createdAt)}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ══════════════════════════════════════
          Edit Post Modal
      ══════════════════════════════════════ */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onSave={handleSaveEdit}
          onClose={() => setEditingPost(null)}
        />
      )}

      {/* ══════════════════════════════════════
          Delete Confirmation Modal
      ══════════════════════════════════════ */}
      {deletingPost && (
        <DeleteConfirmModal
          post={deletingPost}
          onDelete={handleDelete}
          onClose={() => setDeletingPost(null)}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════
   Edit Post Modal Component
══════════════════════════════════════════ */

function EditPostModal({
  post,
  onSave,
  onClose,
}: {
  post: StudioPost;
  onSave: (updated: StudioPost) => void;
  onClose: () => void;
}) {
  const [caption, setCaption] = useState(post.caption);
  const [occasion, setOccasion] = useState(post.occasion || "");
  const [drapingStyle, setDrapingStyle] = useState(post.drapingStyle || "");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_CAPTION = 300;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setNewImage(url);
  }

  async function handleSave() {
    setIsSaving(true);
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 800));
    onSave({
      ...post,
      caption,
      occasion: occasion || undefined,
      drapingStyle: drapingStyle || undefined,
      image: newImage || post.image,
    });
    setIsSaving(false);
  }

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (newImage) URL.revokeObjectURL(newImage);
    };
  }, [newImage]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[480px] max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl
                    shadow-2xl overflow-hidden flex flex-col
                    animate-[slideUp_0.3s_ease]"
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-900">Edit Post</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Image Preview + Change */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              Media
            </label>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 group">
              <Image
                src={newImage || post.image}
                alt="Post preview"
                fill
                className="object-cover"
                unoptimized={!!newImage}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center
                           transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center
                              opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100
                              transition-all duration-300 shadow-lg"
                >
                  <Upload size={20} className="text-gray-700" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              Caption
            </label>
            <div className="relative">
              <textarea
                value={caption}
                onChange={(e) =>
                  setCaption(e.target.value.slice(0, MAX_CAPTION))
                }
                rows={4}
                className="w-full px-3.5 py-3 text-sm text-gray-900 placeholder-gray-400
                           bg-gray-50/80 rounded-xl border border-gray-200 outline-none
                           focus:border-primary/40 focus:bg-white transition-all resize-none"
              />
              <span
                className={`absolute bottom-3 right-3 text-[11px] font-medium ${
                  caption.length >= MAX_CAPTION
                    ? "text-red-400"
                    : caption.length >= MAX_CAPTION * 0.85
                    ? "text-amber-400"
                    : "text-gray-300"
                }`}
              >
                {caption.length}/{MAX_CAPTION}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full appearance-none px-3 py-2.5 text-sm text-gray-900
                           bg-gray-50/80 rounded-xl border border-gray-200 outline-none
                           focus:border-primary/40 focus:bg-white transition-all pr-8 cursor-pointer"
              >
                <option value="">None</option>
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                Draping Style
              </label>
              <select
                value={drapingStyle}
                onChange={(e) => setDrapingStyle(e.target.value)}
                className="w-full appearance-none px-3 py-2.5 text-sm text-gray-900
                           bg-gray-50/80 rounded-xl border border-gray-200 outline-none
                           focus:border-primary/40 focus:bg-white transition-all pr-8 cursor-pointer"
              >
                <option value="">None</option>
                {DRAPING_STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tagged Product (read-only in edit) */}
          {post.taggedProduct && (
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                Tagged Product
              </label>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200/80">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                  <Image
                    src={post.taggedProduct.image}
                    alt={post.taggedProduct.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-800 truncate">
                    {post.taggedProduct.name}
                  </p>
                  <p className="text-[11px] text-gray-400">Cannot change tagged product</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-700 bg-gray-100
                       hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !caption.trim()}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-white
                       bg-gradient-to-r from-primary to-primary/85
                       shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Check size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Delete Confirmation Modal Component
══════════════════════════════════════════ */

function DeleteConfirmModal({
  post,
  onDelete,
  onClose,
}: {
  post: StudioPost;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    setIsDeleting(true);
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 600));
    onDelete(post.id);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[360px] bg-white rounded-3xl shadow-2xl overflow-hidden
                    animate-[fadeIn_0.2s_ease]"
      >
        {/* Preview image strip */}
        <div className="relative h-28 overflow-hidden">
          <Image
            src={post.image}
            alt=""
            fill
            className="object-cover blur-[2px] scale-105 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-white" />
        </div>

        <div className="px-6 pb-6 -mt-6 relative text-center">
          {/* Warning icon */}
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-red-500" />
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete this post?
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            This action cannot be undone. Your post with{" "}
            <span className="font-medium text-gray-700">
              {formatCount(post.likes)} likes
            </span>{" "}
            and{" "}
            <span className="font-medium text-gray-700">
              {formatCount(post.comments)} comments
            </span>{" "}
            will be permanently removed.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-700 bg-gray-100
                         hover:bg-gray-200 transition-colors"
            >
              Keep Post
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-white bg-red-500
                         hover:bg-red-600 shadow-lg shadow-red-500/20
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
