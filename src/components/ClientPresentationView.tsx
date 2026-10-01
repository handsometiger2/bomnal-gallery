import React, { useState, useEffect, useCallback } from 'react';
import { ApartmentProject } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Camera,
  ChevronDown
} from 'lucide-react';

interface ClientPresentationViewProps {
  projects: ApartmentProject[];
  initialProjectId?: string;
  onExit: () => void;
  onOpenConsultation?: (project: ApartmentProject) => void;
}

export const ClientPresentationView: React.FC<ClientPresentationViewProps> = ({
  projects,
  initialProjectId,
  onExit,
}) => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState<number>(() => {
    if (!initialProjectId) return 0;
    const found = projects.findIndex((p) => p.id === initialProjectId);
    return found !== -1 ? found : 0;
  });

  const [activeViewType, setActiveViewType] = useState<'photos' | 'beforeAfter'>('photos');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const currentProject = projects[currentProjectIndex] || projects[0];

  const allPhotos = [
    {
      id: `${currentProject.id}-main`,
      title: `${currentProject.complexName} 전경`,
      imageUrl: currentProject.thumbnailUrl,
    },
    ...(currentProject.roomPhotos || []).map((p) => ({
      id: p.id,
      title: p.title,
      imageUrl: p.imageUrl,
    })),
  ];

  const totalPhotos = allPhotos.length;
  const currentPhoto = allPhotos[selectedPhotoIndex] || allPhotos[0];

  const handlePrev = useCallback(() => {
    if (activeViewType === 'beforeAfter') {
      setActiveViewType('photos');
    }
    setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
  }, [activeViewType, totalPhotos]);

  const handleNext = useCallback(() => {
    if (activeViewType === 'beforeAfter') {
      setActiveViewType('photos');
    }
    setSelectedPhotoIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
  }, [activeViewType, totalPhotos]);

  // Keyboard navigation: Left/Right arrows, ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, onExit]);

  return (
    <div
      id="cartier-fullscreen-gallery"
      className="fixed inset-0 z-50 bg-[#111111] text-white flex flex-col select-none overflow-hidden"
    >
      {/* 1. Minimal Cartier Top Bar */}
      <div className="h-16 px-6 sm:px-10 border-b border-neutral-800 flex items-center justify-between bg-[#111111]/95 backdrop-blur-md shrink-0 z-30">
        
        {/* Left: Cartier Logo & Apartment Switcher */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury font-bold text-xl tracking-[0.2em] text-white">
              Cartier
            </span>
            <span className="text-neutral-600 text-xs">|</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880]">
              GALLERY
            </span>
          </div>

          {/* Project Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-xs font-semibold text-neutral-200 transition-colors"
            >
              <span>{currentProject.complexName}</span>
              <span className="text-neutral-400 font-normal">({currentProject.pyeong}평형)</span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-neutral-900 border border-neutral-700 shadow-2xl rounded-lg py-2 z-50 max-h-80 overflow-y-auto">
                {projects.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setCurrentProjectIndex(idx);
                      setSelectedPhotoIndex(0);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-xs transition-colors ${
                      idx === currentProjectIndex
                        ? 'bg-neutral-800 text-[#C5A880] font-bold'
                        : 'text-neutral-300 hover:bg-neutral-800/60'
                    }`}
                  >
                    <span>{p.complexName}</span>
                    <span className="text-neutral-500 text-[11px]">{p.pyeong}평형</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Photo Counter */}
        <div className="hidden sm:flex items-center font-mono text-xs tracking-widest text-neutral-400">
          <span className="text-white font-bold">{String(selectedPhotoIndex + 1).padStart(2, '0')}</span>
          <span className="mx-2 text-neutral-600">/</span>
          <span>{String(totalPhotos).padStart(2, '0')}</span>
        </div>

        {/* Right: View Toggle (Photos vs B&A) & Close */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-md bg-neutral-900 p-1 border border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveViewType('photos')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                activeViewType === 'photos'
                  ? 'bg-white text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>사진</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewType('beforeAfter')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
                activeViewType === 'beforeAfter'
                  ? 'bg-[#7A0016] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>시공 전·후</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onExit}
            className="p-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
            title="닫기 (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Massive Centered Photo Stage (100% Focus - ZERO Sidebars!) */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 bg-[#0D0D0D] overflow-hidden">
        
        {activeViewType === 'photos' ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Big Centered Photo */}
            <img
              key={currentPhoto.imageUrl}
              src={currentPhoto.imageUrl}
              alt={currentPhoto.title}
              className="max-w-full max-h-[78vh] sm:max-h-[82vh] object-contain shadow-2xl transition-opacity duration-300 select-none"
              referrerPolicy="no-referrer"
            />

            {/* Left Nav Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="이전 사진"
              className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-2xl flex items-center justify-center transition-transform active:scale-95 z-20 backdrop-blur-xs"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Right Nav Arrow */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="다음 사진"
              className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 shadow-2xl flex items-center justify-center transition-transform active:scale-95 z-20 backdrop-blur-xs"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </div>
        ) : (
          /* Massive Centered Before & After Slider */
          <div className="w-full max-w-5xl h-full flex items-center justify-center p-4">
            <BeforeAfterSlider data={currentProject.beforeAfter} />
          </div>
        )}
      </div>

      {/* 3. Bottom Minimalist Cartier Thumbnail Strip */}
      <div className="h-20 px-6 border-t border-neutral-800 bg-[#111111]/95 flex items-center justify-center gap-3 shrink-0 overflow-x-auto">
        {allPhotos.map((photo, idx) => {
          const isActive = idx === selectedPhotoIndex && activeViewType === 'photos';
          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => {
                setSelectedPhotoIndex(idx);
                if (activeViewType === 'beforeAfter') setActiveViewType('photos');
              }}
              className={`relative h-14 w-20 sm:w-24 shrink-0 rounded overflow-hidden border-2 transition-all ${
                isActive
                  ? 'border-white scale-105 shadow-lg ring-2 ring-white/40'
                  : 'border-transparent opacity-40 hover:opacity-90'
              }`}
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>

    </div>
  );
};
