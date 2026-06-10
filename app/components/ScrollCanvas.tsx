"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollCanvas() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Load the video metadata to get its duration
    const handleLoadedMetadata = () => {
      setLoaded(true);
    };

    if (video.readyState >= 1) {
      setLoaded(true);
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const isOutOfView = scrollTop > window.innerHeight * 1.5;

      if (scrollTop > 10 && !isOutOfView) {
        setIsPlaying(true);
        if (video.paused && loaded) {
          video.play().catch(console.error);
        }
      } else if (isOutOfView) {
        // Pause the video to save performance when scrolled past the hero section
        if (!video.paused && loaded) {
          video.pause();
        }
      } else {
        // Scrolled back to the very top
        setIsPlaying(false);
        if (!video.paused && loaded) {
          video.pause();
          video.currentTime = 0; // Reset video to beginning when reverting to image
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial position

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loaded]);

  return (
    <div className="absolute top-0 left-0 w-full h-[150vh] z-0 pointer-events-none">
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[var(--background)]">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 text-peacock-accent" style={{ backgroundColor: "var(--background)" }}>
            <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4 border-peacock-accent/30 border-t-peacock-accent" />
            <div className="text-xl font-light tracking-widest animate-pulse">
              LOADING EXPERIENCE...
            </div>
          </div>
        )}

        {/* Initial Static Image */}
        <div 
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out z-10"
          style={{ opacity: isPlaying ? 0 : 1 }}
        >
          {/* Desktop Image */}
          <img
            src="/first.png" 
            alt="Hero Initial Background Desktop"
            className="hidden md:block w-full h-full object-cover object-center"
          />
          {/* Mobile Image */}
          <img
            src="/mobile.png" 
            alt="Hero Initial Background Mobile"
            className="block md:hidden w-full h-full object-cover object-center"
          />
        </div>

        {/* Video that plays on scroll */}
        <video
          ref={videoRef}
          src="/new.mp4"
          playsInline
          muted
          loop
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out z-0"
          style={{ opacity: loaded && isPlaying ? 1 : 0 }}
        />
        
        {/* Dimmed overlay for better text contrast */}
        <div className="absolute inset-0 z-20 bg-black/5" />
        {/* Bottom fade overlay to blend with the solid background sections below */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/30 to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
}
