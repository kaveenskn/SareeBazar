"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 144;

function currentFrame(index: number) {
  return `/New_frames/Imported_Media_202605092037_${index.toString().padStart(3, "0")}.png`;
}

export default function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    // Preload all frames
    const preloadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setLoaded(true);
        }
      };
      // For immediate cached drawing in dev, it might still not trigger onload if very fast
      // But standard practice is what we have above.
      preloadedImages.push(img);
    }
    setImages(preloadedImages);
  }, []);

  useEffect(() => {
    if (!loaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    let animationFrameId: number;
    let targetFrameIndex = 0;
    let currentFrameIndex = 0;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 68;
      renderImage(Math.round(currentFrameIndex));
    };

    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    function drawImageProp(img: HTMLImageElement) {
      if (!canvas || !context) return;
      const canvasAspectRatio = canvas.width / canvas.height;
      const imgAspectRatio = img.width / img.height;
      let renderableHeight, renderableWidth, xStart, yStart;

      // Maintain aspect ratio while covering the whole canvas (object-fit: cover)
      if (imgAspectRatio < canvasAspectRatio) {
        renderableWidth = canvas.width;
        renderableHeight = img.height * (renderableWidth / img.width);
        xStart = 0;
        // Shift image up slightly (negative yStart) to adjust the head position
        yStart = -50;
      } else {
        renderableHeight = canvas.height;
        renderableWidth = img.width * (renderableHeight / img.height);
        yStart = 0;
        xStart = (canvas.width - renderableWidth) / 2;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
    }

    function renderImage(index: number) {
      if (images[index]) {
        drawImageProp(images[index]);
      }
    }

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScrollTop <= 0) return;

      const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(scrollFraction * FRAME_COUNT)
      );
      targetFrameIndex = frameIndex;
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial state

    const update = () => {
      // Smooth interpolation for frame updates
      currentFrameIndex += (targetFrameIndex - currentFrameIndex) * 0.15;

      if (Math.abs(targetFrameIndex - currentFrameIndex) < 0.05) {
        currentFrameIndex = targetFrameIndex;
      }

      renderImage(Math.round(currentFrameIndex));
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [loaded, images]);

  return (
    <div className="fixed top-[68px] left-0 w-full h-[calc(100vh-68px)] z-0 pointer-events-none bg-white">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-peacock-accent bg-white">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4 border-peacock-accent/30 border-t-peacock-accent" />
          <div className="text-xl font-light tracking-widest animate-pulse">
            LOADING EXPERIENCE...
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="block w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: loaded ? 1 : 0 }}
      />
      {/* Dimmed overlay for better text contrast */}
      <div className="absolute inset-0 z-10 bg-black/0" />
    </div>
  );
}
