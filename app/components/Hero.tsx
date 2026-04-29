import { Section } from "./Section";

export function Hero() {
  return (
    <Section align="center">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-peacock-100 to-peacock-500 bg-clip-text text-transparent">
        Saree Bazar
      </h1>
      <p className="text-xl md:text-2xl text-peacock-100 max-w-2xl font-light">
        Elegance woven in every thread. Experience the legacy of timeless craftsmanship.
      </p>
    </Section>
  );
}
