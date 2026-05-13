"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const IMAGES = [
  "/images/signup_login_image/25d1a34f38017a11f8ccc5961641933a.jpg",
  "/images/signup_login_image/black-red-color-jacquard-women-saree-3007.png",
  "/images/signup_login_image/images.jpg",
];

export default function AuthImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-primary-900">
      {/* Background Images */}
      {IMAGES.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt="Saree Bazar Collection"
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Overlay to darken image slightly for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}

      {/* Decorative Branding / Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-wider drop-shadow-md">
          <span className="text-[#B88E52]">Saree</span>Bazar
        </h2>
        <p className="text-white/90 text-lg md:text-xl font-light max-w-md mx-auto drop-shadow">
          Discover the finest collection of premium sarees for every occasion.
        </p>
        
        {/* Slider Indicators */}
        <div className="absolute bottom-10 flex space-x-3">
          {IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-[#B88E52] w-8" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
