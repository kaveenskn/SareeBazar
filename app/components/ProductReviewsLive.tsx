"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Star,
  PenLine,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Check,
  X,
  Loader2,
  ShieldCheck,
  AlertCircle,
  PackageCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { isLoggedIn, logoutUser } from "@/lib/authStore";
import { getCart } from "@/lib/cartStore";

const API_BASE = "/api/backend/reviews";

interface ReviewUser {
  _id: string;
  name: string;
}

interface ReviewFromAPI {
  _id: string;
  user: ReviewUser | null;
  rating: number;
  title: string;
  comment: string;
  adminReply: string;
  adminRepliedAt: string | null;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
}

interface RatingBreakdown {
  [key: string]: number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ProductReviewsLiveProps {
  productId: string;
  productRating: number;
  productReviewCount: number;
}

/* ─── Helpers ─── */

function formatDate(dateStr: string): string {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/* ─── Rating Bar Color ─── */
function getRatingBarColor(star: number): string {
  if (star >= 4) return "bg-[#14958f]";
  if (star === 3) return "bg-[#ff905a]";
  return "bg-[#ff3f6c]";
}

export default function ProductReviewsLive({
  productId,
  productRating,
  productReviewCount,
}: ProductReviewsLiveProps) {
  // Reviews state
  const [reviews, setReviews] = useState<ReviewFromAPI[]>([]);
  const [ratingBreakdown, setRatingBreakdown] = useState<RatingBreakdown>({});
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Eligibility state
  const [hasOrdered, setHasOrdered] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ─── Fetch Reviews ─── */
  const fetchReviews = useCallback(
    async (page = 1, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "10",
          sort: "createdAt",
          order: "desc",
        });

        const res = await fetch(
          `${API_BASE}/product/${productId}?${params}`
        );
        const data = await res.json();

        if (res.ok) {
          if (append) {
            setReviews((prev) => [...prev, ...(data.reviews || [])]);
          } else {
            setReviews(data.reviews || []);
          }
          setRatingBreakdown(data.ratingBreakdown || {});
          setPagination(
            data.pagination || { page: 1, limit: 10, total: 0, pages: 0 }
          );
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [productId]
  );

  /* ─── Check Eligibility ─── */
  const checkEligibility = useCallback(async () => {
    if (!isLoggedIn()) {
      setEligibilityChecked(true);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/check-eligibility/${productId}`,
        { headers: getAuthHeaders() }
      );
      const data = await res.json();
      if (res.status === 401) {
        logoutUser();
        setEligibilityChecked(true);
        return;
      }
      if (res.ok) {
        setHasOrdered(data.hasOrdered);
        setHasReviewed(data.hasReviewed);
      }
    } catch {
      // silently fail
    } finally {
      setEligibilityChecked(true);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchReviews(1);
      checkEligibility();
    }
  }, [productId, fetchReviews, checkEligibility]);

  /* ─── Check Cart ─── */
  useEffect(() => {
    if (!productId) return;
    const checkCart = () => {
      const cart = getCart();
      const found = cart.some(item => String(item.productId) === String(productId));
      setInCart(found);
    };
    checkCart();
    window.addEventListener("cart-updated", checkCart);
    return () => window.removeEventListener("cart-updated", checkCart);
  }, [productId]);

  /* ─── Submit Review ─── */
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/product/${productId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          rating: newRating,
          title: newTitle.trim(),
          comment: newComment.trim(),
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        logoutUser();
        toast.error("Your session has expired. Please login again.", { icon: "🔒" });
        setIsModalOpen(false);
        return;
      }

      if (res.ok) {
        toast.success("Review submitted successfully! 🎉");
        setIsModalOpen(false);
        setNewRating(0);
        setNewTitle("");
        setNewComment("");
        setHasReviewed(true);
        // Refresh reviews
        fetchReviews(1);
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Handle Write Review Click ─── */
  const handleWriteReviewClick = () => {
    if (!isLoggedIn()) {
      toast.error("Please login to write a review", { icon: "🔒" });
      return;
    }
    if (hasReviewed) {
      toast("You've already reviewed this product", { icon: "✅" });
      return;
    }
    if (!hasOrdered && !inCart) {
      toast("Add this product to your bag to write a review", {
        icon: "🛍️",
      });
      return;
    }
    setIsModalOpen(true);
  };

  /* ─── Compute rating distribution percentages ─── */
  const totalRatings = Object.values(ratingBreakdown).reduce(
    (a, b) => a + b,
    0
  );

  const getRatingPercent = (star: number) => {
    if (totalRatings === 0) return 0;
    return Math.round(((ratingBreakdown[String(star)] || 0) / totalRatings) * 100);
  };

  const calculateAverageRating = () => {
    if (totalRatings === 0) return productRating || 0;
    let sum = 0;
    for (const star in ratingBreakdown) {
      sum += Number(star) * (ratingBreakdown[star] || 0);
    }
    return sum / totalRatings;
  };

  const displayRating = calculateAverageRating();

  /* ─── Get button label ─── */
  const getReviewButtonInfo = () => {
    if (!eligibilityChecked) return { label: "WRITE A REVIEW", disabled: false };
    if (!isLoggedIn()) return { label: "LOGIN TO REVIEW", disabled: false };
    if (hasReviewed) return { label: "ALREADY REVIEWED", disabled: true };
    if (!hasOrdered && !inCart) return { label: "ADD TO BAG TO REVIEW", disabled: true };
    return { label: "WRITE A REVIEW", disabled: false };
  };

  const buttonInfo = getReviewButtonInfo();

  return (
    <>
      {/* ─── CUSTOMER RATINGS & REVIEWS ─── */}
      <div className="mt-12 mb-4">
        <h2 className="text-[22px] font-bold text-[#282c3f] mb-6">
          Customer Ratings & Reviews
        </h2>
        <div className="bg-white border border-[#eaeaec] rounded-[12px] p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Left: Overall Rating */}
            <div className="flex flex-col items-start justify-center min-w-[150px]">
              <div className="flex items-center gap-2 text-[#282c3f]">
                <span className="text-[52px] font-bold leading-none tracking-tight">
                  {displayRating.toFixed(1)}
                </span>
                <Star
                  size={36}
                  className="fill-[#14958f] text-[#14958f]"
                />
              </div>
              <div className="mt-3">
                <p className="text-[16px] font-bold text-[#282c3f]">
                  Overall Rating
                </p>
                <p className="text-[14px] text-[#535766] mt-0.5">
                  {pagination.total || productReviewCount || 0} Verified Buyers
                </p>
              </div>
            </div>

            {/* Right: Star Distribution */}
            <div className="flex-1 flex flex-col justify-center gap-3 md:pl-4 pt-4 md:pt-0">
              {[5, 4, 3, 2, 1].map((star) => {
                const percent = getRatingPercent(star);
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center justify-end gap-1 w-8 text-[14px] font-bold text-[#282c3f]">
                      {star}{" "}
                      <Star
                        size={12}
                        className="fill-[#535766] text-[#535766]"
                      />
                    </div>
                    <div className="flex-1 h-[6px] bg-[#f5f5f6] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getRatingBarColor(star)}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-right text-[13px] text-[#535766] font-medium">
                      {percent}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="my-8 border-[#eaeaec]" />

          {/* What Customers Say */}
          <div>
            <h3 className="text-[16px] font-bold text-[#282c3f] mb-4">
              What Customers Say
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {[
                "Excellent Fabric",
                "Great Color",
                "Perfect Fit",
                "Premium Quality",
                "Value for Money",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-[#f5f5f6] text-[#282c3f] text-[13px] font-semibold rounded-full hover:bg-[#eaeaec] transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── DETAILED REVIEWS LIST ─── */}
      <div className="mt-8 mb-8">
        {/* Header: Tabs & Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eaeaec] pb-3 mb-6">
          <div className="flex items-center gap-6 text-[15px] font-bold">
            <button className="text-[#ff3f6c] border-b-2 border-[#ff3f6c] pb-3 -mb-[14px]">
              All Reviews
            </button>
          </div>

          {/* Write a Review button with eligibility awareness */}
          <div className="flex items-center gap-3">
            {eligibilityChecked && !isLoggedIn() && (
              <span className="text-[12px] text-[#535766] flex items-center gap-1">
                <AlertCircle size={14} /> Login to review
              </span>
            )}
            {eligibilityChecked && isLoggedIn() && hasReviewed && (
              <span className="text-[12px] text-[#03a685] flex items-center gap-1 font-semibold">
                <Check size={14} /> You reviewed this product
              </span>
            )}
            {eligibilityChecked && isLoggedIn() && !hasOrdered && !inCart && !hasReviewed && (
              <span className="text-[12px] text-[#535766] flex items-center gap-1">
                <PackageCheck size={14} /> Add to bag to review
              </span>
            )}
            <button
              onClick={handleWriteReviewClick}
              disabled={buttonInfo.disabled}
              className={`px-5 py-2.5 rounded-[4px] font-bold text-[14px] flex items-center gap-2 transition-all shadow-sm ${
                buttonInfo.disabled
                  ? "bg-[#eaeaec] text-[#94969f] cursor-not-allowed"
                  : "bg-[#ff3f6c] text-white hover:bg-[#ed315d]"
              }`}
            >
              <PenLine size={16} />
              {buttonInfo.label}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2
              size={28}
              className="text-[#ff3f6c] animate-spin"
            />
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white border border-[#eaeaec] rounded-[12px] p-12 text-center">
            <Star
              size={40}
              className="text-[#eaeaec] mx-auto mb-4"
            />
            <h4 className="text-[16px] font-bold text-[#282c3f] mb-2">
              No reviews yet
            </h4>
            <p className="text-[14px] text-[#535766]">
              Be the first to review this product!
            </p>
          </div>
        ) : (
          <>
            {/* Review Cards */}
            <div className="space-y-6">
              {reviews.map((review) => {
                const userName = review.user?.name || "Anonymous";
                const initial = userName.charAt(0).toUpperCase();

                return (
                  <div
                    key={review._id}
                    className="bg-white border border-[#eaeaec] rounded-[12px] p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#f5f5f6] to-[#eaeaec] border border-[#d4d5d9] flex items-center justify-center text-[#282c3f] font-bold text-[18px] shadow-sm">
                          {initial}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[15px] text-[#282c3f]">
                              {userName}
                            </span>
                            {review.isVerifiedPurchase && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-[#03a685] bg-[#e6f6f4] px-1.5 py-0.5 rounded-sm uppercase">
                                <ShieldCheck size={10} strokeWidth={3} />{" "}
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] text-[#94969f] mt-0.5">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-[#14958f] text-white px-2 py-0.5 rounded-[3px] text-[13px] font-bold">
                        {review.rating}{" "}
                        <Star size={10} className="fill-white" />
                      </div>
                    </div>

                    <div className="mt-4">
                      {review.title && (
                        <h4 className="font-bold text-[15px] text-[#282c3f]">
                          {review.title}
                        </h4>
                      )}
                      <p className="text-[14px] text-[#535766] mt-2 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>

                    {/* Admin Reply */}
                    {review.adminReply && (
                      <div className="mt-4 ml-4 pl-4 border-l-2 border-[#ff3f6c]/30 bg-[#fff5f7] rounded-r-lg py-3 pr-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[11px] font-bold text-[#ff3f6c] uppercase tracking-wide">
                            SareeBazar Reply
                          </span>
                        </div>
                        <p className="text-[13px] text-[#535766] leading-relaxed">
                          {review.adminReply}
                        </p>
                        {review.adminRepliedAt && (
                          <span className="text-[11px] text-[#94969f] mt-1 block">
                            {formatDate(review.adminRepliedAt)}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-5 flex items-center justify-between text-[13px] text-[#94969f] border-t border-[#eaeaec] pt-4">
                      <div className="flex items-center gap-4">
                        <span>Was this helpful?</span>
                        <button className="flex items-center gap-1.5 hover:text-[#14958f] transition-colors font-medium">
                          <ThumbsUp size={16} /> Yes
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-[#ff3f6c] transition-colors font-medium">
                          <ThumbsDown size={16} /> No
                        </button>
                      </div>
                      <button className="flex items-center gap-1 hover:text-[#282c3f] transition-colors">
                        <MoreVertical size={16} /> Report
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {pagination.page < pagination.pages && (
              <div className="mt-8 text-center">
                <button
                  onClick={() =>
                    fetchReviews(pagination.page + 1, true)
                  }
                  disabled={loadingMore}
                  className="bg-white border border-[#d4d5d9] text-[#282c3f] px-6 py-2.5 rounded-[4px] font-bold text-[14px] hover:border-[#282c3f] hover:bg-[#f5f5f6] transition-colors shadow-sm disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />{" "}
                      Loading...
                    </span>
                  ) : (
                    "Load More Reviews"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Write a Review Modal ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div
            className="bg-white rounded-[16px] w-full max-w-lg p-7 relative shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
            style={{ animation: "reviewModalIn 0.25s ease-out" }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#7e818c] hover:text-[#282c3f] transition-colors bg-[#f5f5f6] p-1.5 rounded-full hover:bg-[#eaeaec]"
            >
              <X size={20} />
            </button>

            <h3 className="text-[24px] font-bold text-[#282c3f] mb-1">
              Write a Review
            </h3>
            <p className="text-[14px] text-[#535766] mb-6">
              Share your experience with this product
            </p>

            <form
              onSubmit={handleSubmitReview}
              className="flex flex-col gap-6"
            >
              {/* Star Rating Input */}
              <div>
                <label className="block text-[14px] font-bold text-[#282c3f] mb-3">
                  Overall Rating{" "}
                  <span className="text-[#ff3f6c]">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={36}
                        className={`transition-colors duration-200 ${
                          star <= (hoverRating || newRating)
                            ? "fill-[#14958f] text-[#14958f]"
                            : "fill-[#eaeaec] text-[#eaeaec]"
                        }`}
                      />
                    </button>
                  ))}
                  {newRating > 0 && (
                    <span className="ml-2 text-[14px] text-[#535766] font-medium self-center">
                      {
                        ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                          newRating
                        ]
                      }
                    </span>
                  )}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-[14px] font-bold text-[#282c3f] mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  maxLength={120}
                  className="w-full border-2 border-[#eaeaec] rounded-[8px] px-4 py-3 text-[15px] focus:outline-none focus:border-[#282c3f] transition-colors"
                />
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-[14px] font-bold text-[#282c3f] mb-2">
                  Review Details{" "}
                  <span className="text-[#ff3f6c]">*</span>
                </label>
                <textarea
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What did you like or dislike? How was the fit and fabric?"
                  rows={4}
                  maxLength={2000}
                  className="w-full border-2 border-[#eaeaec] rounded-[8px] px-4 py-3 text-[15px] focus:outline-none focus:border-[#282c3f] transition-colors resize-y"
                ></textarea>
                <p className="text-[12px] text-[#94969f] mt-1 text-right">
                  {newComment.length}/2000
                </p>
              </div>

              {/* Submit Action */}
              <div className="mt-2 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 rounded-[6px] font-bold text-[14px] uppercase tracking-wide text-[#535766] hover:text-[#282c3f] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    newRating === 0 ||
                    !newComment.trim() ||
                    submitting
                  }
                  className="px-8 py-3.5 rounded-[6px] font-bold text-[14px] uppercase tracking-wide bg-[#ff3f6c] text-white hover:bg-[#ed315d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal animation */}
      <style jsx>{`
        @keyframes reviewModalIn {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
