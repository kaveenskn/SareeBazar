import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Star, Bot, Truck, ShieldCheck, ArrowRightLeft, Tag } from "lucide-react";
import { products } from "@/mockdata/collections";
import Navbar from "@/app/components/Navbar";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Fallback to a single image if the gallery array is not provided
  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
  const video = product.video;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-white pt-[110px]" style={{ fontFamily: "var(--font-figtree), sans-serif" }}>
      <Navbar />

      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 py-4 text-[13px] text-[#282c3f]">
        <Link href="/" className="hover:text-[#ff3f6c]">Home</Link>
        <span className="mx-2 text-[#94969f]">/</span>
        <Link href="/collections" className="hover:text-[#ff3f6c]">Collections</Link>
        <span className="mx-2 text-[#94969f]">/</span>
        <span className="font-semibold">{product.name}</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 pb-20 flex flex-col lg:flex-row gap-8">
        
        {/* ─── Left Side: Media Gallery (Myntra Style Grid) ─── */}
        <div className="w-full lg:w-[60%] flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Video (if available) - typically placed first or second */}
            {video && (
              <div className="relative aspect-[3/4] bg-[#f5f5f6] overflow-hidden group cursor-pointer">
                <video 
                  src={video} 
                  className="w-full h-full object-cover" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                />
              </div>
            )}
            
            {/* Images */}
            {gallery.map((img, index) => (
              <div key={index} className="relative aspect-[3/4] bg-[#f5f5f6] overflow-hidden group cursor-zoom-in">
                <Image
                  src={img}
                  alt={`${product.name} - Angle ${index + 1}`}
                  fill
                  quality={100}
                  unoptimized={true}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index < 2}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ─── Right Side: Product Details (Sticky) ─── */}
        <div className="w-full lg:w-[40%]">
          <div className="sticky top-[100px] flex flex-col">
            
            {/* Brand & Name */}
            <h1 className="text-[24px] font-bold text-[#282c3f] leading-tight">
              {product.name}
            </h1>
            <p className="text-[20px] text-[#535766] font-normal mt-1 leading-snug">
              {product.category}
            </p>

            {/* Rating Box */}
            <div className="mt-4 inline-flex items-center gap-2 border border-[#eaeaec] rounded-[2px] px-2 py-1 cursor-pointer hover:border-[#282c3f] transition-colors w-max">
              <span className="text-[14px] font-bold text-[#282c3f] flex items-center gap-1">
                {product.rating} <Star size={14} className="fill-[#14958f] text-[#14958f]" />
              </span>
              <span className="w-[1px] h-3 bg-[#d4d5d9]"></span>
              <span className="text-[14px] text-[#535766]">{product.reviews} Ratings</span>
            </div>

            <hr className="my-4 border-[#eaeaec]" />

            {/* Price Section */}
            <div className="flex items-baseline gap-3">
              <span className="text-[24px] font-bold text-[#282c3f]">
                Rs. {product.price.toLocaleString("en-LK")}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-[20px] text-[#7e818c] line-through font-normal">
                    Rs. {product.originalPrice.toLocaleString("en-LK")}
                  </span>
                  <span className="text-[20px] font-bold text-[#ff905a]">
                    ({discountPercent}% OFF)
                  </span>
                </>
              )}
            </div>
            <p className="text-[14px] text-[#03a685] font-bold mt-1">inclusive of all taxes</p>

            {/* Virtual Try-On Highlight */}
            <div className="mt-5 p-4 rounded-[8px] bg-gradient-to-r from-[#7c3aed]/10 to-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] flex items-center justify-center text-white">
                  <Bot size={20} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#282c3f]">See it on yourself!</h4>
                  <p className="text-[12px] text-[#535766]">Use our AI Virtual Try-On feature.</p>
                </div>
              </div>
              <Link href={`/virtual-tryon?saree=${encodeURIComponent(gallery[0])}`}>
                <button className="px-4 py-2 bg-[#282c3f] text-white text-[12px] font-bold uppercase rounded-[4px] hover:bg-black transition-colors">
                  Try Now
                </button>
              </Link>
            </div>

            {/* Size / Fit */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[16px] font-bold text-[#282c3f]">SELECT SIZE</h4>
                <button className="text-[14px] font-bold text-[#ff3f6c] uppercase">Size Chart</button>
              </div>
              <div className="mt-4 flex gap-3">
                <button className="w-14 h-14 rounded-full border-2 border-[#ff3f6c] text-[#ff3f6c] font-bold text-[14px] flex items-center justify-center bg-white hover:bg-[#fff0f3] transition-colors">
                  One Size
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <button className="flex-1 h-14 bg-[#ff3f6c] text-white rounded-[4px] font-bold text-[15px] uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm hover:bg-[#ed315d] transition-colors">
                <ShoppingBag size={20} /> Add to Bag
              </button>
              <button className="flex-1 h-14 bg-white border border-[#d4d5d9] text-[#282c3f] rounded-[4px] font-bold text-[15px] uppercase tracking-wide flex items-center justify-center gap-2 hover:border-[#282c3f] transition-colors">
                <Heart size={20} /> Wishlist
              </button>
            </div>

            {/* Delivery Options */}
            <div className="mt-8">
              <h4 className="text-[16px] font-bold text-[#282c3f] flex items-center gap-2 uppercase">
                Delivery Options <Truck size={18} />
              </h4>
              <div className="mt-4 relative max-w-[300px]">
                <input 
                  type="text" 
                  placeholder="Enter pincode" 
                  className="w-full p-3 pr-20 border border-[#d4d5d9] rounded-[4px] text-[14px] focus:outline-none focus:border-[#282c3f]"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[#ff3f6c]">Check</button>
              </div>
              <p className="text-[13px] text-[#535766] mt-2">
                Please enter PIN code to check delivery time & Pay on Delivery Availability
              </p>
              
              <ul className="mt-5 space-y-3 text-[14px] text-[#535766]">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#535766]"></span>
                  100% Original Products
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#535766]"></span>
                  Pay on delivery might be available
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#535766]"></span>
                  Easy 14 days returns and exchanges
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#535766]"></span>
                  Try & Buy might be available
                </li>
              </ul>
            </div>

            {/* Best Offers */}
            <div className="mt-8 pt-6 border-t border-[#eaeaec]">
              <h4 className="text-[16px] font-bold text-[#282c3f] flex items-center gap-2 uppercase mb-4">
                Best Offers <Tag size={18} />
              </h4>
              <div className="text-[14px] text-[#282c3f]">
                <p className="font-bold">Applicable on: Orders above Rs. 1499</p>
                <p className="text-[#535766] mt-1">Coupon code: <span className="font-bold text-[#282c3f]">SAREE100</span></p>
                <p className="text-[#535766]">Coupon Discount: Rs. 100 off (check cart for final savings)</p>
              </div>
            </div>
            
            <hr className="my-6 border-[#eaeaec]" />

            {/* Product Details */}
            <div>
              <h4 className="text-[16px] font-bold text-[#282c3f] uppercase mb-4">Product Details</h4>
              <p className="text-[14px] text-[#535766] leading-relaxed">
                {product.description}
              </p>
              
              <h5 className="font-bold text-[14px] text-[#282c3f] mt-5 mb-2">Size & Fit</h5>
              <p className="text-[14px] text-[#535766]">Saree Length: 5.5 Metres</p>
              <p className="text-[14px] text-[#535766]">Blouse Piece: 0.8 Metres</p>

              <h5 className="font-bold text-[14px] text-[#282c3f] mt-5 mb-2">Material & Care</h5>
              <p className="text-[14px] text-[#535766]">Fabric: {product.fabric || "Silk blend"}</p>
              <p className="text-[14px] text-[#535766]">Dry Clean only</p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
