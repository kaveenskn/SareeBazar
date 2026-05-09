import ScrollCanvas from "./components/ScrollCanvas";
import ContentOverlay from "./components/ContentOverlay";

export const metadata = {
  title: "Saree Bazar | The Legacy of Craftsmanship",
  description: "Experience the legacy of timeless craftsmanship and elegant sarees.",
};

export default function Home() {
  return (
    <main className="min-h-screen relative font-sans selection:bg-peacock-500 selection:text-white">
      <ScrollCanvas />
      <ContentOverlay />
    </main>
  );
}
