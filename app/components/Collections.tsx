import { Section } from "./Section";

export function Collections() {
  return (
    <Section align="right">
      <div className="max-w-2xl">
        <h2 className="text-5xl md:text-7xl font-semibold mb-6 text-peacock-accent">
          Curated Collections
        </h2>
        <p className="text-xl text-gray-300 font-light leading-relaxed mb-8">
          From Banarasi brocades to Kanjeevaram silks, each piece tells a story. 
          Discover our diverse array of traditional and contemporary sarees crafted for modern royalty.
        </p>
        <button className="px-8 py-4 border border-peacock-accent text-peacock-accent hover:bg-peacock-accent hover:text-black font-semibold rounded-full transition-all duration-300">
          View Collection
        </button>
      </div>
    </Section>
  );
}
