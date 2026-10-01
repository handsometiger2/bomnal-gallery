import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ApartmentProject, RoomPhoto } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { CartierLoupe } from './CartierLoupe';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sliders,
  Eye,
  Camera,
  Check,
  ChevronDown
} from 'lucide-react';

interface CartierCenterGalleryProps {
  projects: ApartmentProject[];
  currentProject: ApartmentProject;
  onSelectProject: (project: ApartmentProject) => void;
  onOpenFullscreen: (photos: RoomPhoto[], index: number, title: string) => void;
}

export const CartierCenterGallery: React.FC<CartierCenterGalleryProps> = ({
  projects,
  currentProject,
  onSelectProject,
  onOpenFullscreen,
}) => {
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [stageMode, setStageMode] = useState<'photo' | 'beforeAfter' | 'loupe'>('photo');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const allSlides: RoomPhoto[] = [
    {
      id: `${currentProject.id}-main`,
      roomType: 'living',
      roomNameKo: '전경',
      title: `${currentProject.complexName} 전경`,
      description: currentProject.subTitle,
      imageUrl: currentProject.thumbnailUrl,
      highlights: currentProject.features,
    },
    ...(currentProject.roomPhotos || []),
  ];

  const currentSlide = allSlides[photoIndex] || allSlides[0];
  const totalSlides = allSlides.length;

  const handlePrev = useCallback(() => {
    if (stageMode === 'beforeAfter') {
      setStageMode('photo');
    }
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  }, [stageMode, totalSlides]);

  const handleNext = useCallback(() => {
    if (stageMode === 'beforeAfter') {
      setStageMode('photo');
    }
    setPhotoIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  }, [stageMode, totalSlides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  useEffect(() => {
    setPhotoIndex(0);
    setStageMode('photo');
  }, [currentProject.id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full flex flex-col bg-white text-[#141414] select-none">
      
      {/* 1. Cartier Minimalist Bar */}
      <div className="border-b border-[#E8E4DF] bg-white sticky top-16 sm:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Left: Project Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-[#141414] bg-white hover:bg-[#F9F9F8] text-[#141414] text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <span className="font-serif-luxury text-sm sm:text-base font-bold">
                {currentProject.complexName}
              </span>
              <span className="text-[#6E6E6E] text-xs font-normal">
                ({currentProject.pyeong}평형)
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#6E6E6E] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 bg-white border border-[#E8E4DF] shadow-2xl z-50 py-1 max-h-80 overflow-y-auto">
                {projects.map((p) => {
                  const isSelected = p.id === currentProject.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        onSelectProject(p);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors border-b border-[#F5F2EC] last:border-0 ${
                        isSelected
                          ? 'bg-[#FAF8F5] text-[#7A0016] font-bold'
                          : 'hover:bg-[#F9F9F8] text-[#141414]'
                      }`}
                    >
                      <div>
                        <div className="font-serif-luxury text-sm font-bold">
                          {p.complexName}
                        </div>
                        <div className="text-[11px] text-[#6E6E6E]">
                          {p.pyeong}평형 · {p.address}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#7A0016] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStageMode('photo')}
              className={`px-3.5 py-1.5 text-xs tracking-wider uppercase font-semibold transition-all border flex items-center gap-1.5 ${
                stageMode === 'photo'
                  ? 'bg-[#141414] text-white border-[#141414]'
                  : 'bg-white text-[#6E6E6E] border-[#E8E4DF] hover:border-[#141414]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>사진</span>
            </button>

            <button
              type="button"
              onClick={() => setStageMode(stageMode === 'beforeAfter' ? 'photo' : 'beforeAfter')}
              className={`px-3.5 py-1.5 text-xs tracking-wider uppercase font-semibold transition-all border flex items-center gap-1.5 ${
                stageMode === 'beforeAfter'
                  ? 'bg-[#7A0016] text-white border-[#7A0016]'
                  : 'bg-white text-[#6E6E6E] border-[#E8E4DF] hover:border-[#7A0016]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>시공 전·후</span>
            </button>

            <button
              type="button"
              onClick={() => setStageMode(stageMode === 'loupe' ? 'photo' : 'loupe')}
              className={`px-3.5 py-1.5 text-xs tracking-wider uppercase font-semibold transition-all border flex items-center gap-1.5 ${
                stageMode === 'loupe'
                  ? 'bg-[#7A0016] text-white border-[#7A0016]'
                  : 'bg-white text-[#6E6E6E] border-[#E8E4DF] hover:border-[#7A0016]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>루페</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenFullscreen(allSlides, photoIndex, currentProject.complexName)}
              className="p-2 border border-[#E8E4DF] hover:border-[#141414] text-[#141414] transition-colors ml-1"
              title="전체화면 확대"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* 2. HUGE CENTER PHOTO STAGE */}
      <div className="w-full flex-1 flex flex-col items-center justify-center py-4 px-2 sm:px-6">
        
        {/* Caption */}
        <div className="text-center mb-3">
          <h2 className="text-lg sm:text-xl font-serif-luxury font-bold text-[#141414]">
            {currentSlide.title}
          </h2>
        </div>

        {/* The Big Stage Container */}
        <div className="relative w-full max-w-7xl h-[65vh] sm:h-[75vh] md:h-[82vh] bg-[#F9F9F8] border border-[#E8E4DF] flex items-center justify-center overflow-hidden">
          
          {/* Main Big Photo */}
          {stageMode === 'photo' && (
            <div
              className="w-full h-full flex items-center justify-center cursor-zoom-in"
              onClick={() => onOpenFullscreen(allSlides, photoIndex, currentProject.complexName)}
            >
              <img
                key={currentSlide.imageUrl}
                src={currentSlide.imageUrl}
                alt={currentSlide.title}
                className="max-w-full max-h-full object-contain select-none"
              />
            </div>
          )}

          {/* Large Before & After */}
          {stageMode === 'beforeAfter' && (
            <div className="w-full h-full p-4 sm:p-8 flex items-center justify-center">
              <BeforeAfterSlider data={currentProject.beforeAfter} />
            </div>
          )}

          {/* 2.4x Loupe */}
          {stageMode === 'loupe' && (
            <div className="w-full h-full">
              <CartierLoupe
                imageUrl={currentSlide.imageUrl}
                alt={currentSlide.title}
                caption="마우스를 올리면 2.4배율 루페 렌즈로 디테일을 확대하여 확인하실 수 있습니다."
              />
            </div>
          )}

          {/* Left Nav Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="이전 사진"
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-white/90 hover:bg-white text-[#141414] border border-[#E8E4DF] shadow-lg flex items-center justify-center transition-transform active:scale-95 z-20"
          >
            <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9" />
          </button>

          {/* Right Nav Arrow */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="다음 사진"
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-white/90 hover:bg-white text-[#141414] border border-[#E8E4DF] shadow-lg flex items-center justify-center transition-transform active:scale-95 z-20"
          >
            <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9" />
          </button>

          {/* Pagination Counter */}
          <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 border border-[#E8E4DF] text-xs font-mono font-bold tracking-widest text-[#141414] z-20">
            {String(photoIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </div>
        </div>

        {/* 3. Centered Minimal Thumbnail Strip */}
        <div className="w-full max-w-7xl mt-4 flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2">
          {allSlides.map((slide, idx) => {
            const isActive = idx === photoIndex && stageMode !== 'beforeAfter';
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  setPhotoIndex(idx);
                  if (stageMode === 'beforeAfter') setStageMode('photo');
                }}
                className={`relative w-20 h-14 sm:w-24 sm:h-16 shrink-0 overflow-hidden border-2 transition-all ${
                  isActive
                    ? 'border-[#7A0016] ring-2 ring-[#7A0016]/30 shadow-md scale-105'
                    : 'border-[#E8E4DF] opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};
