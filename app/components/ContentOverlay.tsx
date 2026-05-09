"use client";

import { Hero } from "./Hero";
import { Offers } from "./Offers";
import { Collections } from "./Collections";
import { About } from "./About";

import { VisitUs } from "./VisitUs";

export default function ContentOverlay() {
  return (
    <div className="relative z-10 w-full transition-colors duration-300">
      <Hero />
      <Offers />
      <Collections />
      <About />
      <VisitUs />
    </div>
  );
}
