import React, { useState, useEffect } from 'react';
import { RoomPhoto } from '../types';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, CheckCircle2 } from 'lucide-react';

interface PhotoLightboxProps {
  photos: RoomPhoto[];
  initialIndex: number;
  onClose: () => void;
  complexName: string;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photos,
  initialIndex,
  onClose,
  complexName,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const currentPhoto = photos[currentIndex];

  const handleNext = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.6 : 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photos.length]);

  if (!currentPhoto) return null;

  return (
    <div
      id="photo-lightbox-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md select-none"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="absolute top-0 inset-x-0 h-16 px-4 md:px-6 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white/20 backdrop-blur-sm text-neutral-100">
            {currentPhoto.roomNameKo}
          </span>
          <div>
            <h3 className="text-sm md:text-base font-bold text-white line-clamp-1">{currentPhoto.title}</h3>
            <p className="text-xs text-neutral-400 line-clamp-1">{complexName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom toggle button */}
          <button
            type="button"
            id="lightbox-zoom-btn"
            onClick={toggleZoom}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title={zoomLevel === 1 ? '확대 (Zoom In)' : '원래 크기 (Reset Zoom)'}
          >
            {zoomLevel === 1 ? <ZoomIn className="w-5 h-5" /> : <ZoomOut className="w-5 h-5" />}
          </button>
          {/* Close button */}
          <button
            type="button"
            id="lightbox-close-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="닫기 (ESC)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-12 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Prev */}
        {photos.length > 1 && (
          <button
            type="button"
            id="lightbox-prev-btn"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-transform active:scale-95"
            title="이전 사진 (좌측 화살표)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Current Photo View */}
        <div className="relative max-w-5xl max-h-[75vh] flex items-center justify-center transition-transform duration-200">
          <img
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title}
            className={`max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-transform duration-300 cursor-pointer ${
              zoomLevel > 1 ? 'scale-150' : 'scale-100'
            }`}
            onClick={toggleZoom}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Navigation Next */}
        {photos.length > 1 && (
          <button
            type="button"
            id="lightbox-next-btn"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-transform active:scale-95"
            title="다음 사진 (우측 화살표)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div
        className="absolute bottom-0 inset-x-0 p-4 md:p-6 text-white z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col md:flex-row items-center justify-between gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 max-w-2xl text-center md:text-left">
          <p className="text-xs md:text-sm text-neutral-300 mb-2 leading-relaxed">
            {currentPhoto.description}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
            {currentPhoto.highlights.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/15 text-neutral-200"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="text-xs text-neutral-400 font-mono tracking-wider">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>
    </div>
  );
};
