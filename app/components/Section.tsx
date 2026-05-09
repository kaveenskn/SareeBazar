"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Section({ children, align = "center", heightClass = "h-[150vh]", isFirst = false, topClass = "top-1/3" }: { children: React.ReactNode, align?: "left" | "center" | "right", heightClass?: string, isFirst?: boolean, topClass?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Fade in as it comes into view, stay a bit, then fade out
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [isFirst ? 1 : 0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [isFirst ? 0 : 100, 0, 0, -100]);

  let alignmentClass = "items-center text-center";
  if (align === "left") alignmentClass = "items-start text-left";
  if (align === "right") alignmentClass = "items-end text-right";

  return (
    <section ref={ref} className={`${heightClass} flex flex-col justify-start px-8 relative`}>
      <motion.div 
        style={{ opacity, y }}
        className={`sticky ${topClass} flex flex-col w-full max-w-6xl mx-auto ${alignmentClass}`}
      >
        {children}
      </motion.div>
    </section>
  );
}
