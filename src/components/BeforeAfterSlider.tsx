import React, { useState, useRef, useCallback } from 'react';
import { BeforeAfterPair } from '../types';
import { Sparkles, SlidersHorizontal, ArrowLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  data: BeforeAfterPair;
  compact?: boolean;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ data, compact = false }) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percent = Math.round((clampedX / rect.width) * 100);
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  return (
    <div id="before-after-slider-container" className="flex flex-col gap-3 w-full select-none">
      {/* Top Header info if not compact */}
      {!compact && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Before & After 비교
            </span>
            <h4 className="text-sm md:text-base font-bold text-neutral-800">{data.title}</h4>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <button
              type="button"
              onClick={() => setSliderPosition(0)}
              className={`px-2 py-1 rounded transition-colors ${
                sliderPosition === 0 ? 'bg-neutral-800 text-white font-medium' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              시공 전 100%
            </button>
            <button
              type="button"
              onClick={() => setSliderPosition(50)}
              className={`px-2 py-1 rounded transition-colors ${
                sliderPosition === 50 ? 'bg-neutral-800 text-white font-medium' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              5:5 분할
            </button>
            <button
              type="button"
              onClick={() => setSliderPosition(100)}
              className={`px-2 py-1 rounded transition-colors ${
                sliderPosition === 100 ? 'bg-neutral-800 text-white font-medium' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              시공 후 100%
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Visual Frame */}
      <div
        ref={containerRef}
        id="slider-interactive-viewport"
        className={`relative overflow-hidden rounded-xl bg-neutral-900 cursor-ew-resize touch-none shadow-md ${
          compact ? 'aspect-16/10' : 'aspect-16/10 md:aspect-16/9'
        }`}
        onMouseDown={handleMouseDown}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Layer 1: AFTER image (Full background) */}
        <img
          src={data.afterImageUrl}
          alt="시공 후 (After)"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Tag: After (Right side) */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-neutral-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow">
            시공 후 (AFTER)
          </span>
        </div>

        {/* Layer 2: BEFORE image (Clipped from left using width percent) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={data.beforeImageUrl}
            alt="시공 전 (Before)"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              height: '100%',
            }}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>

        {/* Tag: Before (Left side) */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-neutral-900/80 backdrop-blur-md text-amber-300 border border-amber-500/30 shadow">
            시공 전 (BEFORE)
          </span>
        </div>

        {/* Vertical Divider Line with handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg border border-neutral-200">
            <ArrowLeftRight className="w-4 h-4 text-neutral-700" />
          </div>
        </div>

        {/* Hint text bottom on hover / initial */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
          <div className="px-3 py-1 text-[11px] rounded-full bg-black/60 backdrop-blur-md text-white/90 flex items-center gap-1.5 shadow">
            <SlidersHorizontal className="w-3 h-3 text-neutral-300" />
            <span>좌우로 슬라이더를 드래그하여 전·후 차이를 확인하세요</span>
          </div>
        </div>
      </div>

      {/* Descriptions */}
      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm mt-1">
          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/70 text-amber-950">
            <div className="font-semibold mb-1 flex items-center gap-1.5 text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              시공 전 상태
            </div>
            <p className="text-neutral-700 leading-relaxed text-xs">{data.beforeDescription}</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/70 text-emerald-950">
            <div className="font-semibold mb-1 flex items-center gap-1.5 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              시공 후 개선 포인트
            </div>
            <p className="text-neutral-700 leading-relaxed text-xs">{data.afterDescription}</p>
          </div>
        </div>
      )}
    </div>
  );
};
