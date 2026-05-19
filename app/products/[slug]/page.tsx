import { notFound } from "next/navigation";
import Link from "next/link";
import { products } from "@/mockdata/collections";
import Navbar from "@/app/components/Navbar";
import ProductView from "@/app/components/ProductView";
import ProductReviews from "@/app/components/ProductReviews";

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

      <ProductView
        product={product}
        gallery={gallery}
        video={video}
        discountPercent={discountPercent}
      />

      {/* Customer Reviews Section */}
      <ProductReviews product={product} />
    </main>
  );
}
