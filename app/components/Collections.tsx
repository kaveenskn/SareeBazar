import { Section } from "./Section";

export function Collections() {
  return (
    <Section align="left">
      <div className="max-w-2xl bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/30">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-peacock-900 drop-shadow-sm">
          Curated Collections
        </h2>
        <p className="text-xl font-medium leading-relaxed mb-8 text-gray-900 drop-shadow-sm">
          From Banarasi brocades to Kanjeevaram silks, each piece tells a story. 
          Discover our diverse array of traditional and contemporary sarees crafted for modern royalty.
        </p>
        <button className="px-8 py-4 border-2 font-bold rounded-full transition-all duration-300 border-peacock-900 text-peacock-900 hover:bg-peacock-900 hover:text-white shadow-lg">
          View Collection
        </button>
      </div>
    </Section>
  );
}
