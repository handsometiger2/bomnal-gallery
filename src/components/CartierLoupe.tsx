import React, { useState, useRef } from 'react';
import { Search, ZoomIn } from 'lucide-react';

interface CartierLoupeProps {
  imageUrl: string;
  alt: string;
  caption?: string;
  zoomLevel?: number;
}

export const CartierLoupe: React.FC<CartierLoupeProps> = ({
  imageUrl,
  alt,
  caption,
  zoomLevel = 2.4,
}) => {
  const [showLoupe, setShowLoupe] = useState(false);
  const [loupePos, setLoupePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const LOUPE_SIZE = 160; // diameter in px

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setShowLoupe(false);
      return;
    }

    setLoupePos({ x, y });

    // Background offset calculation for magnifier
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;
    setBgPos({ x: bgX, y: bgY });
    setShowLoupe(true);
  };

  const handleMouseLeave = () => {
    setShowLoupe(false);
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none group">
      <div
        ref={imgContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] bg-[#F5F4F0] rounded-none overflow-hidden cursor-crosshair flex items-center justify-center border border-[#E8E4DF]"
      >
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
        />

        {/* Cartier Inspection Watermark / Helper */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 border border-[#E8E4DF] shadow-xs">
          <ZoomIn className="w-3.5 h-3.5 text-[#7A0016]" />
          <span className="text-[11px] font-medium tracking-wider text-[#141414] uppercase">
            아틀리에 돋보기 루페 (Hover to Zoom)
          </span>
        </div>

        {/* Loupe Circle */}
        {showLoupe && (
          <div
            style={{
              top: `${loupePos.y - LOUPE_SIZE / 2}px`,
              left: `${loupePos.x - LOUPE_SIZE / 2}px`,
              width: `${LOUPE_SIZE}px`,
              height: `${LOUPE_SIZE}px`,
              backgroundImage: `url(${imageUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
              backgroundSize: `${zoomLevel * 100}%`,
            }}
            className="absolute rounded-full border-2 border-[#7A0016] shadow-2xl pointer-events-none z-30 ring-4 ring-white/80"
          >
            {/* Center crosshair dot for Cartier precision watchmaking inspection */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full border border-white/90 bg-[#7A0016]/40" />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#141414] text-white text-[10px] px-2 py-0.5 font-mono">
              2.4x C-LOUPE
            </div>
          </div>
        )}
      </div>

      {caption && (
        <p className="mt-2 text-xs text-[#6E6E6E] font-serif-luxury italic tracking-wide text-center">
          {caption}
        </p>
      )}
    </div>
  );
};
