"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Section({ children, align = "center" }: { children: React.ReactNode, align?: "left" | "center" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Fade in as it comes into view, stay a bit, then fade out
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);

  let alignmentClass = "items-center text-center";
  if (align === "left") alignmentClass = "items-start text-left";
  if (align === "right") alignmentClass = "items-end text-right";

  return (
    <section ref={ref} className="h-[150vh] flex flex-col justify-center px-8 relative">
      <motion.div 
        style={{ opacity, y }}
        className={`sticky top-1/3 flex flex-col w-full max-w-6xl mx-auto ${alignmentClass}`}
      >
        {children}
      </motion.div>
    </section>
  );
}
