import { Section } from "./Section";
import { motion } from "framer-motion";

export function VisitUs() {
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);

  useEffect(() => {
    fetch("/api/backend/shop-info")
      .then((res) => res.json())
      .then((data) => setShopInfo(data))
      .catch((err) => console.error("Failed to load shop info:", err));
  }, []);

  // Fallback values while loading
  const storeName = shopInfo?.storeName || "Saree Bazar";
  const address = shopInfo?.address || "No. 25, Main Street, Colombo, Sri Lanka";
  const phone = shopInfo?.phone || "+94 77 123 4567";
  const openingHours = shopInfo?.openingHours || "Mon – Sat : 9.00 AM – 8.00 PM";

  return (
    <Section align="left" heightClass="h-[100vh]" topClass="top-[30%]">
      <div className="max-w-3xl text-left flex flex-col items-start px-4">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 drop-shadow-[0_2px_15px_rgba(255,255,255,1)]"
        >
          Experience <span className="text-[#B88E52]">Saree Bazar</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl font-medium leading-relaxed text-gray-800 mb-8 drop-shadow-[0_2px_15px_rgba(255,255,255,1)] max-w-2xl"
        >
          Book a personalized virtual try-on session with our experts or visit our flagship store to feel the elegance in person.
        </motion.p>
        
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="px-10 py-4 bg-[#B88E52] hover:bg-[#8C6B3D] text-white font-bold tracking-wide rounded-full transition-all duration-300 shadow-[0_8px_30px_rgb(184,142,82,0.3)] hover:shadow-[0_8px_30px_rgb(184,142,82,0.5)] transform hover:-translate-y-1"
        >
          Book Appointment
        </motion.button>
      </div>
    </Section>
  );
}
