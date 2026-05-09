import { Section } from "./Section";

export function Offers() {
  return (
    <Section align="right">
      <div className="max-w-2xl bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/30">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-peacock-900 drop-shadow-sm">
          Exclusive Offers
        </h2>
        <p className="text-xl font-medium leading-relaxed mb-8 text-gray-900 drop-shadow-sm">
          Embrace the season&apos;s joy with up to 40% off on our premium silk and handcrafted collections. 
          Elevate your wardrobe with the magic of rich textures and vibrant hues.
        </p>
        <button className="px-8 py-4 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 bg-peacock-700 hover:bg-peacock-900 text-white shadow-lg">
          Explore Offers
        </button>
      </div>
    </Section>
  );
}
