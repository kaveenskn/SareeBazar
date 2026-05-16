import { Section } from "./Section";

export function VisitUs() {
  return (
    <Section align="center" heightClass="h-screen" className="">
      <div className="max-w-3xl text-center flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]">
          Experience <span className="text-[#B88E52]">Saree Bazar</span>
        </h2>
        <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-800 mb-8 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]">
          Book a personalized virtual try-on session with our experts or visit our flagship store to feel the elegance in person.
        </p>
        <button className="px-10 py-4 bg-[#B88E52] hover:bg-[#8C6B3D] text-white font-bold tracking-wide rounded-full transition-all duration-300 shadow-[0_8px_30px_rgb(184,142,82,0.3)] hover:shadow-[0_8px_30px_rgb(184,142,82,0.5)] transform hover:-translate-y-1">
          Book Appointment
        </button>
      </div>
    </Section>
  );
}
