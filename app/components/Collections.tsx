import { Section } from "./Section";

export function Collections() {
  return (
    <Section align="right" heightClass="h-[200vh]" className="bg-[#fbeff6]">
      <div className="max-w-xl font-figtree">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]">
          Curated <span className="text-[#B88E52]">Collections</span>
        </h2>
        <p className="text-xl font-medium leading-relaxed mb-8 text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]">
          From Banarasi brocades to Kanjeevaram silks, each piece tells a story.
          Discover our diverse array of traditional and contemporary sarees
          crafted for modern royalty.
        </p>

        {/* Collection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 w-full">
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/50 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(184,142,82,0.2)] transition-all duration-300 cursor-pointer">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Banarasi <span className="text-[#B88E52]">Silks</span>
            </h3>
            <p className="text-sm text-gray-700 font-medium">
              Timeless brocades woven with genuine gold threads.
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/50 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(184,142,82,0.2)] transition-all duration-300 cursor-pointer">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Temple <span className="text-[#B88E52]">Kanjeevaram</span>
            </h3>
            <p className="text-sm text-gray-700 font-medium">
              Rich, heavy silks featuring bold temple borders.
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/50 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(184,142,82,0.2)] transition-all duration-300 cursor-pointer sm:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Contemporary <span className="text-[#B88E52]">Linen</span>
            </h3>
            <p className="text-sm text-gray-700 font-medium">
              Breathable, chic styles for the modern workspace or casual
              gatherings.
            </p>
          </div>
        </div>

        <button className="px-10 py-4 border-2 font-bold tracking-wide rounded-full transition-all duration-300 border-[#B88E52] text-[#B88E52] bg-white/50 hover:bg-[#B88E52] hover:text-white shadow-lg hover:shadow-[0_8px_30px_rgb(184,142,82,0.3)] transform hover:-translate-y-1">
          View All Collections
        </button>
      </div>
    </Section>
  );
}
