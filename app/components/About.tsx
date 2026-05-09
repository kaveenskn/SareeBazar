import { Section } from "./Section";

export function About() {
  return (
    <Section align="center">
      <div className="max-w-4xl bg-white/40 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/30">
        <h2 className="text-5xl md:text-7xl font-bold mb-8 text-peacock-900 drop-shadow-sm">
          Our Heritage
        </h2>
        <p className="text-2xl font-medium leading-relaxed text-gray-900 drop-shadow-sm">
          For over three decades, Saree Bazar has been synonymous with authenticity and supreme quality. 
          We partner directly with master weavers across India to bring you the purest fabrics and 
          the most intricate designs, ensuring our rich cultural tapestry thrives.
        </p>
      </div>
    </Section>
  );
}
