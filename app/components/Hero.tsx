import { Section } from "./Section";

export function Hero() {
  return (

    <Section align="left" heightClass="h-[200vh]" isFirst={true} topClass="top-[35%]">
      <div className="max-w-xl text-center">
  <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-[#B88E52] to-[#8C6B3D] bg-clip-text text-transparent drop-shadow-md">
    Saree Bazar
  </h1>

  <p className="text-xl md:text-2xl font-medium text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]">
  Explore bridal, silk, and designer sarees that blend traditional beauty with contemporary fashion and elegance.
</p>

  <button className="mt-8 px-10 py-4 bg-[#B88E52] hover:bg-[#8C6B3D] text-white font-medium tracking-wide rounded-full transition-all duration-300 shadow-[0_8px_30px_rgb(184,142,82,0.3)] hover:shadow-[0_8px_30px_rgb(184,142,82,0.5)] transform hover:-translate-y-1 mx-auto block">
    Explore Collection
  </button>
</div>

    </Section>
  );
}
