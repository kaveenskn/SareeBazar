import { Section } from "./Section";

export function Offers() {
  return (
    <Section align="right" heightClass="h-[200vh]">
      <div className="max-w-xl">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]">
          Exclusive <span className="text-[#B88E52]">Offers</span>
        </h2>
        <p className="text-xl font-medium leading-relaxed mb-8 text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]">
          Embrace the season&apos;s joy with up to 40% off on our premium silk and handcrafted collections.
          Elevate your wardrobe with the magic of rich textures and vibrant hues.
        </p>
        <button className="px-10 py-4 font-semibold tracking-wide rounded-full transition-all duration-300 transform hover:-translate-y-1 bg-[#B88E52] hover:bg-[#8C6B3D] text-white shadow-[0_8px_30px_rgb(184,142,82,0.3)] hover:shadow-[0_8px_30px_rgb(184,142,82,0.5)]">
          Explore Offers
        </button>
      </div>
    </Section>
  );
}
