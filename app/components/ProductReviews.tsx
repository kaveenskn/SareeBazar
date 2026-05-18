"use client";

import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, MoreVertical, Edit3 } from "lucide-react";
import type { Product } from "@/mockdata/collections";

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  unhelpful: number;
  verified: boolean;
  images?: string[];
}

const dummyReviews: Review[] = [
  {
    id: "r1",
    author: "Anjali M.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    rating: 5,
    date: "12 May 2026",
    title: "Absolutely Stunning and Premium Quality",
    content: "I wore this saree for my sister's wedding and received so many compliments! The fabric feels incredibly soft, and the vibrant color exactly matches the pictures. The intricate embroidery work is flawless. Highly recommend purchasing from SareeBazar!",
    helpful: 45,
    unhelpful: 2,
    verified: true,
  },
  {
    id: "r2",
    author: "Kavya S.",
    rating: 4,
    date: "28 April 2026",
    title: "Beautiful color, good fabric",
    content: "The saree is beautiful, and the material is exactly as described. The delivery was super fast as well. Giving it 4 stars only because the blouse piece was slightly smaller than expected, but otherwise a fantastic buy.",
    helpful: 12,
    unhelpful: 0,
    verified: true,
  },
  {
    id: "r3",
    author: "Priya R.",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    rating: 5,
    date: "15 April 2026",
    title: "Exceeded my expectations",
    content: "The draping is so elegant and effortless. I love the sheer luxury of the fabric against my skin. It's totally worth the price point. Packaging was also very premium.",
    helpful: 34,
    unhelpful: 1,
    verified: true,
  }
];

export default function ProductReviews({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState("all");

  const ratingSummary = {
    5: 75,
    4: 15,
    3: 5,
    2: 3,
    1: 2
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <hr className="mb-12 border-[#eaeaec]" />
      
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[28px] font-bold text-[#282c3f] tracking-tight">Customer Ratings & Reviews</h2>
        <button className="flex items-center gap-2 bg-[#ff3f6c] text-white px-6 py-3 rounded-[4px] font-bold text-[14px] uppercase tracking-wide hover:bg-[#ed315d] transition-colors shadow-sm">
          <Edit3 size={18} /> Write a Review
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Sidebar: Rating Distribution */}
        <div className="w-full lg:w-[35%]">
          <div className="bg-white border border-[#eaeaec] rounded-[12px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-5 mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-[56px] font-bold text-[#282c3f] leading-none tracking-tighter">{product.rating.toFixed(1)}</span>
                <Star className="fill-[#14958f] text-[#14958f] w-10 h-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] font-bold text-[#282c3f]">Overall Rating</span>
                <span className="text-[15px] text-[#535766] mt-1">{product.reviews} Verified Buyers</span>
              </div>
            </div>

            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((star) => {
                const percentage = ratingSummary[star as keyof typeof ratingSummary];
                return (
                  <div key={star} className="flex items-center gap-4 group cursor-pointer">
                    <span className="text-[14px] font-bold text-[#282c3f] w-14 flex items-center gap-1.5 group-hover:text-[#ff3f6c] transition-colors">
                      {star} <Star size={14} className="fill-[#535766] text-[#535766] group-hover:fill-[#ff3f6c] group-hover:text-[#ff3f6c] transition-colors" />
                    </span>
                    <div className="flex-1 h-2.5 bg-[#f5f5f6] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${star >= 4 ? 'bg-[#14958f]' : star === 3 ? 'bg-[#ff905a]' : 'bg-[#ff3f6c]'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-[13px] font-semibold text-[#535766] w-10 text-right group-hover:text-[#282c3f]">{percentage}%</span>
                  </div>
                );
              })}
            </div>
            
            <hr className="my-8 border-[#eaeaec]" />
            
            <div>
              <h4 className="text-[15px] font-bold text-[#282c3f] mb-4">What Customers Say</h4>
              <div className="flex flex-wrap gap-2.5">
                {["Excellent Fabric", "Great Color", "Perfect Fit", "Premium Quality", "Value for Money"].map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-[#f5f5f6] border border-transparent rounded-full text-[13px] text-[#282c3f] font-semibold hover:border-[#ff3f6c] hover:bg-white hover:text-[#ff3f6c] hover:shadow-sm transition-all cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Content: Review List */}
        <div className="w-full lg:w-[65%]">
          {/* Review Filters */}
          <div className="flex items-center gap-8 border-b border-[#eaeaec] mb-8">
            {["All Reviews", "With Images", "Recent"].map((tab) => {
              const tabId = tab.toLowerCase().replace(" ", "-");
              const isActive = activeTab === tabId || (activeTab === "all" && tabId === "all-reviews");
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tabId)}
                  className={`pb-4 text-[16px] font-bold transition-all relative ${isActive ? 'text-[#ff3f6c]' : 'text-[#7e818c] hover:text-[#282c3f]'}`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#ff3f6c] rounded-t-md"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Review Cards */}
          <div className="space-y-10">
            {dummyReviews.map((review) => (
              <div key={review.id} className="border-b border-[#eaeaec] pb-10 last:border-0 hover:bg-[#fcfcfc] p-4 -mx-4 rounded-xl transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.author} className="w-12 h-12 rounded-full object-cover border border-[#eaeaec] shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f5f5f6] to-[#eaeaec] border border-[#d4d5d9] flex items-center justify-center text-[#282c3f] font-bold text-[16px] shadow-sm">
                        {review.author.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-[16px] font-bold text-[#282c3f] flex items-center gap-2">
                        {review.author}
                        {review.verified && (
                          <span className="flex items-center gap-1 text-[11px] bg-[#14958f]/10 text-[#14958f] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            Verified
                          </span>
                        )}
                      </h4>
                      <p className="text-[13px] text-[#7e818c] font-medium mt-0.5">{review.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-[#14958f] text-white px-2.5 py-1 rounded-[4px] text-[14px] font-bold shadow-sm">
                    {review.rating} <Star size={12} className="fill-white" />
                  </div>
                </div>

                <div className="mt-2">
                  <h5 className="text-[16px] font-bold text-[#282c3f] mb-2">{review.title}</h5>
                  <p className="text-[15px] text-[#535766] leading-relaxed">
                    {review.content}
                  </p>
                </div>

                {review.images && review.images.length > 0 && (
                  <div className="mt-5 flex gap-3">
                    {review.images.map((img, idx) => (
                      <img key={idx} src={img} alt="Review attachment" className="w-24 h-24 rounded-[8px] object-cover border border-[#eaeaec] cursor-zoom-in hover:opacity-90 transition-opacity shadow-sm" />
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between text-[14px] text-[#7e818c]">
                  <div className="flex items-center gap-6">
                    <span className="text-[13px] font-medium">Was this helpful?</span>
                    <button className="flex items-center gap-1.5 hover:text-[#14958f] transition-colors font-semibold group">
                      <ThumbsUp size={18} className="group-hover:fill-[#14958f]/20" /> Yes ({review.helpful})
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-[#ff3f6c] transition-colors font-semibold group">
                      <ThumbsDown size={18} className="group-hover:fill-[#ff3f6c]/20" /> No
                    </button>
                  </div>
                  <button className="hover:text-[#282c3f] transition-colors flex items-center gap-1.5 font-medium">
                    <MoreVertical size={16} /> Report
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-8 py-4 border-2 border-[#eaeaec] rounded-[8px] text-[#282c3f] font-bold text-[15px] uppercase tracking-wide hover:border-[#282c3f] hover:bg-[#f5f5f6] transition-all">
            Load More Reviews
          </button>
        </div>
      </div>
    </div>
  );
}
