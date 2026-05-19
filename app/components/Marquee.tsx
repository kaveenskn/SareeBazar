export function Marquee() {
  const items = [
    "Timeless Elegance",
    "Bridal Luxury",
    "Handcrafted Beauty",
    "Modern Tradition",
    "Exclusive Saree Collections",
    "Festive Glamour",
    "Premium Silk Sarees",
    "Cultural Grace",
    "Elegant Fashion",
    "Saree Bazar Exclusive",
    "Designer Sarees",
    "Crafted with Heritage",
    "Contemporary Ethnic Style",
    "Luxury Boutique Collection",
    "Celebrate Every Occasion"
  ];

  const marqueeText = items.join(" • ") + " • ";

  return (
    <div className="w-full overflow-hidden bg-[var(--background)] py-6 border-y border-primary/15 select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="text-primary text-base md:text-lg font-serif tracking-widest uppercase">
          {marqueeText}
        </span>
        <span className="text-primary text-base md:text-lg font-serif tracking-widest uppercase" aria-hidden="true">
          {marqueeText}
        </span>
      </div>
    </div>
  );
}
