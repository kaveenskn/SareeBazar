import Image from "next/image";
import { MapPin, Phone, Clock, Sparkles, Navigation, ArrowUpRight, Send, Flower2, Camera, Globe } from "lucide-react";

export function VisitUs() {
  return (
    <section className="relative w-full py-24 bg-[var(--background)] overflow-hidden">
      {/* Top tag */}
      <div className="flex justify-center items-center mb-16 relative z-10">
        <div className="flex items-center gap-4 text-primary/60">
          <div className="h-[1px] w-12 bg-primary/20"></div>
          <Flower2 size={16} />
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase">Our Boutique</span>
          <div className="h-[1px] w-12 bg-primary/20"></div>
        </div>
      </div>

      {/* Decorative Background Shape */}
      <div className="absolute left-0 top-[35%] w-full h-full z-0 opacity-40 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-auto text-primary/10 fill-current">
          <path d="M0,192L80,181.3C160,171,320,149,480,165.3C640,181,800,235,960,229.3C1120,224,1280,160,1360,128L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
        <div className="w-full h-full bg-primary/10 -mt-1" />
      </div>

      <div className="max-w-[1300px] mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center relative z-10">
        
        {/* Left Side: Image */}
        <div className="w-full lg:w-[45%] relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] h-[550px] lg:h-[650px] flex-shrink-0">
          <Image 
            src="/images/collections/bridal_saree.png" 
            alt="Saree Bazar Boutique"
            fill
            className="object-cover"
          />
          {/* Top-left glass badge */}
          <div className="absolute top-6 left-6 backdrop-blur-md bg-white/10 border border-white/30 rounded-full px-5 py-2.5">
            <p className="text-white/90 text-[10px] uppercase tracking-wider font-serif italic mb-0.5">Since 1998</p>
            <p className="text-white text-[11px] font-bold tracking-widest uppercase">Heritage of Silk</p>
          </div>

          {/* Bottom glass banner */}
          <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-black/30 border border-white/20 rounded-[2rem] p-5 flex justify-between items-center">
            <div>
              <h3 className="text-white text-2xl font-serif mb-1 leading-none">Saree Bazar</h3>
              <p className="text-white/80 text-xs font-medium tracking-wide">A sanctuary of silk & tradition</p>
            </div>
            <button className="w-12 h-12 rounded-full bg-[#c48d40] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
              <ArrowUpRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-[55%] flex flex-col">
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-[1.1] mb-6">
            Visit <span className="italic bg-gradient-to-r from-primary to-[#d4a359] bg-clip-text text-transparent font-bold">Saree Bazar</span>
          </h2>
          
          <p className="text-gray-600 font-medium text-[16px] md:text-[17px] leading-relaxed mb-10 max-w-xl">
            Step into a world of elegance, tradition, and timeless fashion. Explore our exclusive saree collections in person and experience premium customer service.
          </p>

          <div className="flex flex-col gap-4 mb-10">
            {/* Top row cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/90 backdrop-blur-sm border border-black/5 rounded-3xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ae3971] to-[#d3709b] flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary/60 tracking-widest uppercase mb-1">Location</p>
                  <p className="text-gray-800 font-serif text-[15px] leading-snug">No. 25, Main Street,<br/>Colombo, Sri Lanka</p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-black/5 rounded-3xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ae3971] to-[#d3709b] flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary/60 tracking-widest uppercase mb-1">Contact</p>
                  <p className="text-gray-800 font-serif text-[15px] leading-snug">+94 77 123 4567</p>
                </div>
              </div>
            </div>

            {/* Hours card */}
            <div className="bg-white/90 backdrop-blur-sm border border-black/5 rounded-3xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ae3971] to-[#d3709b] flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary/60 tracking-widest uppercase mb-1">Opening Hours</p>
                <p className="text-gray-800 font-serif text-[15px]">Mon – Sat : 9.00 AM – 8.00 PM</p>
              </div>
            </div>

            {/* Quote card */}
            <div className="bg-[#fcf5f8] border border-primary/10 rounded-3xl p-6 flex items-start gap-4 shadow-sm mt-2">
              <Sparkles size={20} className="text-primary flex-shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-gray-700 font-serif italic text-[16px] leading-relaxed">
                "From bridal collections to modern designer sarees, Saree Bazar offers handpicked styles crafted for every special moment."
              </p>
            </div>
          </div>

          {/* Buttons & Socials */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mt-2">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#b34078] to-[#d8896a] text-white font-bold text-[11px] tracking-widest uppercase rounded-full shadow-[0_8px_20px_rgba(161,0,91,0.25)] hover:shadow-[0_8px_25px_rgba(161,0,91,0.4)] hover:-translate-y-0.5 transition-all">
                <Navigation size={14} strokeWidth={2.5} /> Get Directions
              </button>
              <button className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3.5 bg-white border border-primary/20 text-gray-700 hover:text-primary font-bold text-[11px] tracking-widest uppercase rounded-full hover:bg-primary/5 transition-colors shadow-sm">
                Explore Collections <ArrowUpRight size={14} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Follow</span>
              <div className="h-[1px] w-6 bg-gray-300"></div>
              <div className="flex gap-2.5">
                {[Camera, Globe, Send].map((Icon, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border border-primary/20 bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm cursor-pointer">
                    <Icon size={13} strokeWidth={2} />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
