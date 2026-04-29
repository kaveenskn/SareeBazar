"use client";

import { Hero } from "./Hero";
import { Offers } from "./Offers";
import { Collections } from "./Collections";
import { About } from "./About";

export default function ContentOverlay() {
  return (
    <div className="relative z-10 w-full text-white">
      <Hero />
      <Offers />
      <Collections />
      <About />

      {/* Final Spacer */}
      <div className="h-[50vh]"></div>
    </div>
  );
}
