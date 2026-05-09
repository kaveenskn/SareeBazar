import { Section } from "./Section";

export function Hero() {
  return (
    <Section align="left">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-peacock-700 to-peacock-900 bg-clip-text text-transparent drop-shadow-sm">
        Saree Bazar
      </h1>
      <p className="text-xl md:text-2xl max-w-2xl font-medium text-peacock-900 drop-shadow-sm">
        Elegance woven in every thread. Experience the legacy of timeless craftsmanship.
      </p>
    </Section>
  );
}
