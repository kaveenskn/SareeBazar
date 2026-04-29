import { Section } from "./Section";

export function About() {
  return (
    <Section align="center">
      <div className="max-w-4xl">
        <h2 className="text-5xl md:text-7xl font-semibold mb-8 text-peacock-100">
          Our Heritage
        </h2>
        <p className="text-2xl text-peacock-300 font-light leading-relaxed">
          For over three decades, Saree Bazar has been synonymous with authenticity and supreme quality. 
          We partner directly with master weavers across India to bring you the purest fabrics and 
          the most intricate designs, ensuring our rich cultural tapestry thrives.
        </p>
      </div>
    </Section>
  );
}
