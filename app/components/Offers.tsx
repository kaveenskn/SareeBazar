import { Section } from "./Section";

export function Offers() {
  return (
    <Section align="left">
      <div className="max-w-2xl">
        <h2 className="text-5xl md:text-7xl font-semibold mb-6 text-peacock-300">
          Exclusive Offers
        </h2>
        <p className="text-xl text-gray-300 font-light leading-relaxed mb-8">
          Embrace the season&apos;s joy with up to 40% off on our premium silk and handcrafted collections. 
          Elevate your wardrobe with the magic of rich textures and vibrant hues.
        </p>
        <button className="px-8 py-4 bg-peacock-500 hover:bg-peacock-accent text-black font-semibold rounded-full transition-all duration-300 transform hover:scale-105">
          Explore Offers
        </button>
      </div>
    </Section>
  );
}
