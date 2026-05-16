import { Section } from "./Section";

export function About() {
  return (
    <Section align="center" heightClass="h-[200vh]" topClass="top-1/3">
      <div className="max-w-2xl text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]">
          Our <span className="text-[#B88E52]">Heritage</span>
        </h2>
        <p className="text-2xl font-medium leading-relaxed text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]">
          For over three decades, Saree Bazar has been synonymous with authenticity and supreme quality. 
          We partner directly with master weavers across India to bring you the purest fabrics and 
          the most intricate designs, ensuring our rich cultural tapestry thrives.
        </p>
      </div>
    </Section>
  );
}
