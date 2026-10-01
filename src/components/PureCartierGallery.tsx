import React, { useState } from 'react';
import { ApartmentProject, RoomPhoto } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { CartierLoupe } from './CartierLoupe';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sliders,
  Eye,
  Layers,
  Sparkles,
  Grid,
  Camera
} from 'lucide-react';

interface PureCartierGalleryProps {
  projects: ApartmentProject[];
  currentProject: ApartmentProject;
  onSelectProject: (project: ApartmentProject) => void;
  onOpenLightbox: (photos: RoomPhoto[], index: number, title: string) => void;
}

type GalleryViewMode = 'main' | 'beforeAfter' | 'loupe' | 'room';

export const PureCartierGallery: React.FC<PureCartierGalleryProps> = ({
  projects,
  currentProject,
  onSelectProject,
  onOpenLightbox,
}) => {
  const [viewMode, setViewMode] = useState<GalleryViewMode>('main');
  const [activeRoomIndex, setActiveRoomIndex] = useState<number>(0);

  const rooms = currentProject.roomPhotos || [];
  const currentRoom = rooms[activeRoomIndex] || rooms[0];

  // List of all view items for pagination
  // 0: Main Photo, 1: Before&After, 2: Loupe, 3+: Rooms
  const totalSlides = 2 + rooms.length; // Main + B&A + Rooms

  const handleNextSlide = () => {
    if (viewMode === 'main') {
      setViewMode('beforeAfter');
    } else if (viewMode === 'beforeAfter') {
      setViewMode('room');
      setActiveRoomIndex(0);
    } else if (viewMode === 'room') {
      if (activeRoomIndex < rooms.length - 1) {
        setActiveRoomIndex((prev) => prev + 1);
      } else {
        setViewMode('main');
      }
    } else if (viewMode === 'loupe') {
      setViewMode('main');
    }
  };

  const handlePrevSlide = () => {
    if (viewMode === 'main') {
      setViewMode('room');
      setActiveRoomIndex(rooms.length - 1);
    } else if (viewMode === 'beforeAfter') {
      setViewMode('main');
    } else if (viewMode === 'room') {
      if (activeRoomIndex > 0) {
        setActiveRoomIndex((prev) => prev - 1);
      } else {
        setViewMode('beforeAfter');
      }
    } else if (viewMode === 'loupe') {
      setViewMode('main');
    }
  };

  // Convert current state to slide index for display
  const getCurrentSlideIndex = () => {
    if (viewMode === 'main') return 1;
    if (viewMode === 'beforeAfter') return 2;
    if (viewMode === 'room') return 3 + activeRoomIndex;
    return 1;
  };

  const handleOpenCurrentInLightbox = () => {
    if (viewMode === 'room') {
      onOpenLightbox(rooms, activeRoomIndex, currentProject.complexName);
    } else {
      // Create photos array starting with main
      const allPhotos: RoomPhoto[] = [
        {
          id: `${currentProject.id}-main`,
          roomType: 'living',
          roomNameKo: '전경',
          title: currentProject.complexName,
          description: currentProject.subTitle,
          imageUrl: currentProject.thumbnailUrl,
          highlights: currentProject.features,
        },
        ...rooms,
      ];
      onOpenLightbox(allPhotos, 0, currentProject.complexName);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-12">
      
      {/* 1. Apartment Project Switcher Tabs (Cartier Serif Navigation) */}
      <div className="border-b border-[#E8E4DF] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 overflow-x-auto gap-2">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#7A0016] font-semibold shrink-0">
              COLLECTIONS:
            </span>
            <div className="flex items-center gap-1 sm:gap-2">
              {projects.map((p) => {
                const isSelected = p.id === currentProject.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelectProject(p);
                      setViewMode('main');
                      setActiveRoomIndex(0);
                    }}
                    className={`px-3 py-1.5 text-xs tracking-wider transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#141414] text-white font-bold'
                        : 'bg-white border border-[#E8E4DF] text-[#6E6E6E] hover:text-[#141414] hover:border-[#141414]'
                    }`}
                  >
                    {p.complexName.split(' ')[0]} ({p.pyeong}평)
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Cartier Gallery Theater */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Title & Space Badge */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5F2EC] border border-[#E8E4DF] text-[11px] tracking-[0.25em] uppercase font-bold text-[#7A0016]">
            {currentProject.cartierCollection || '산토스 드 까르띠에 갤러리'} · REF. {currentProject.refCode || 'CRWSSA0029'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#141414] tracking-tight">
            {currentProject.complexName}
          </h1>
          <p className="text-xs sm:text-sm font-serif-luxury italic text-[#6E6E6E] max-w-xl mx-auto">
            {currentProject.subTitle}
          </p>
        </div>

        {/* Gallery Mode Switcher Bar */}
        <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setViewMode('main')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 border ${
              viewMode === 'main'
                ? 'bg-[#7A0016] text-white border-[#7A0016]'
                : 'bg-white text-[#6E6E6E] border-[#E8E4DF] hover:border-[#141414]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            메인 전경 뷰
          </button>

          <button
            type="button"
            onClick={() => setViewMode('beforeAfter')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 border ${
              viewMode === 'beforeAfter'
                ? 'bg-[#7A0016] text-white border-[#7A0016]'
                : 'bg-white text-[#6E6E6E] border-[#E8E4DF] hover:border-[#141414]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            시공 전·후 비교 (Before & After)
          </button>

          <button
            type="button"
            onClick={() => setViewMode('loupe')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 border ${
              viewMode === 'loupe'
                ? 'bg-[#7A0016] text-white border-[#7A0016]'
                : 'bg-white text-[#6E6E6E] border-[#E8E4DF] hover:border-[#141414]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            2.4배율 루페 돋보기
          </button>

          {/* Rooms Sub-Buttons */}
          {rooms.map((room, idx) => (
            <button
              key={room.id}
              type="button"
              onClick={() => {
                setViewMode('room');
                setActiveRoomIndex(idx);
              }}
              className={`px-3.5 py-2 text-xs uppercase tracking-wider font-semibold transition-all border ${
                viewMode === 'room' && activeRoomIndex === idx
                  ? 'bg-[#141414] text-white border-[#141414]'
                  : 'bg-white text-[#6E6E6E] border-[#E8E4DF] hover:border-[#141414]'
              }`}
            >
              {room.roomNameKo}
            </button>
          ))}
        </div>

        {/* Gallery Display Stage */}
        <div className="relative bg-[#F5F4F0] border border-[#E8E4DF] shadow-sm overflow-hidden">
          
          {/* Main Photo View */}
          {viewMode === 'main' && (
            <div className="relative w-full h-[420px] sm:h-[540px] md:h-[620px] flex items-center justify-center bg-black/5">
              <img
                src={currentProject.thumbnailUrl}
                alt={currentProject.complexName}
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 border border-[#E8E4DF]">
                <span className="text-[10px] uppercase tracking-widest text-[#7A0016] font-bold block">
                  MAIN VIEW
                </span>
                <span className="text-xs font-serif-luxury font-bold text-[#141414]">
                  {currentProject.complexName} 전경
                </span>
              </div>
            </div>
          )}

          {/* Before & After Slider View */}
          {viewMode === 'beforeAfter' && (
            <div className="w-full p-4 sm:p-8 bg-white min-h-[420px] sm:min-h-[540px] flex items-center justify-center">
              <BeforeAfterSlider data={currentProject.beforeAfter} />
            </div>
          )}

          {/* 2.4x Cartier Loupe Inspection View */}
          {viewMode === 'loupe' && (
            <div className="w-full">
              <CartierLoupe
                imageUrl={currentRoom?.imageUrl || currentProject.thumbnailUrl}
                alt={currentProject.complexName}
                caption="사진 위로 마우스를 올려 2.4배율 루페 렌즈로 시공 마감면과 자재 질감을 감상하세요."
              />
            </div>
          )}

          {/* Room Photo View */}
          {viewMode === 'room' && currentRoom && (
            <div className="relative w-full h-[420px] sm:h-[540px] md:h-[620px] flex items-center justify-center bg-black/5">
              <img
                src={currentRoom.imageUrl}
                alt={currentRoom.title}
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 sm:p-6 text-white">
                <span className="text-[10px] font-bold tracking-widest uppercase text-amber-300">
                  {currentRoom.roomNameKo} 갤러리
                </span>
                <h3 className="text-base sm:text-xl font-serif-luxury font-bold text-white mt-0.5">
                  {currentRoom.title}
                </h3>
                <p className="text-xs text-neutral-200 mt-1 max-w-2xl line-clamp-2">
                  {currentRoom.description}
                </p>
              </div>
            </div>
          )}

          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="이전 사진"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-[#141414] border border-[#E8E4DF] shadow-md flex items-center justify-center transition-transform active:scale-95 z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="다음 사진"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-[#141414] border border-[#E8E4DF] shadow-md flex items-center justify-center transition-transform active:scale-95 z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Fullscreen Lightbox Button */}
          <button
            type="button"
            onClick={handleOpenCurrentInLightbox}
            aria-label="전체화면 고화질 감상"
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white text-[#141414] border border-[#E8E4DF] shadow-md flex items-center justify-center transition-transform active:scale-95 z-20"
            title="전체화면 확대 감상"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Slide Indicator (Cartier Pagination: 01 / 05) */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 border border-[#E8E4DF] text-[11px] font-mono font-bold tracking-widest text-[#141414] z-20">
            0{getCurrentSlideIndex()} / 0{totalSlides}
          </div>

        </div>

        {/* 3. Cartier Minimalist Thumbnail Strip */}
        <div className="mt-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 justify-center">
            
            {/* Main view thumb */}
            <button
              type="button"
              onClick={() => setViewMode('main')}
              className={`relative w-20 h-16 sm:w-24 sm:h-18 shrink-0 overflow-hidden border-2 transition-all ${
                viewMode === 'main'
                  ? 'border-[#7A0016] ring-2 ring-[#7A0016]/30'
                  : 'border-[#E8E4DF] opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={currentProject.thumbnailUrl}
                alt="메인"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] text-center uppercase tracking-tighter py-0.5">
                메인
              </span>
            </button>

            {/* Before/After thumb */}
            <button
              type="button"
              onClick={() => setViewMode('beforeAfter')}
              className={`relative w-20 h-16 sm:w-24 sm:h-18 shrink-0 overflow-hidden border-2 transition-all ${
                viewMode === 'beforeAfter'
                  ? 'border-[#7A0016] ring-2 ring-[#7A0016]/30'
                  : 'border-[#E8E4DF] opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={currentProject.beforeAfter.beforeImageUrl}
                alt="비포애프터"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 inset-x-0 bg-[#7A0016] text-white text-[9px] text-center font-bold uppercase tracking-tighter py-0.5">
                B&A
              </span>
            </button>

            {/* Room photos thumbs */}
            {rooms.map((room, idx) => (
              <button
                key={room.id}
                type="button"
                onClick={() => {
                  setViewMode('room');
                  setActiveRoomIndex(idx);
                }}
                className={`relative w-20 h-16 sm:w-24 sm:h-18 shrink-0 overflow-hidden border-2 transition-all ${
                  viewMode === 'room' && activeRoomIndex === idx
                    ? 'border-[#7A0016] ring-2 ring-[#7A0016]/30'
                    : 'border-[#E8E4DF] opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={room.imageUrl}
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] text-center uppercase tracking-tighter py-0.5 truncate px-1">
                  {room.roomNameKo}
                </span>
              </button>
            ))}

          </div>
        </div>

      </div>

      {/* 4. All Apartments Photo Gallery Grid (Clean, Luxury, Pure Gallery) */}
      <div className="bg-[#FAF8F5] border-t border-[#E8E4DF] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#7A0016]">
              OTHER APARTMENT GALLERIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#141414]">
              아파트별 리모델링 갤러리 둘러보기
            </h2>
            <p className="text-xs sm:text-sm font-serif-luxury italic text-[#6E6E6E]">
              사진을 클릭하면 해당 아파트의 고화질 갤러리로 즉시 전환됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p) => {
              const isSelected = p.id === currentProject.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    setViewMode('main');
                    setActiveRoomIndex(0);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className={`group bg-white border cursor-pointer transition-all duration-300 overflow-hidden flex flex-col ${
                    isSelected
                      ? 'border-[#7A0016] ring-2 ring-[#7A0016]/40 shadow-lg'
                      : 'border-[#E8E4DF] hover:border-[#141414] hover:shadow-md'
                  }`}
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-[#F5F4F0]">
                    <img
                      src={p.thumbnailUrl}
                      alt={p.complexName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-white text-[#141414] text-xs uppercase tracking-widest font-bold shadow">
                        갤러리 감상하기
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 bg-[#141414]/90 text-white text-[10px] font-mono tracking-widest px-2 py-0.5">
                      REF. {p.refCode || 'CRWSSA0029'}
                    </div>

                    {isSelected && (
                      <div className="absolute bottom-3 left-3 bg-[#7A0016] text-white text-[10px] font-bold tracking-wider px-2 py-0.5">
                        현재 감상 중
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#7A0016] font-bold">
                        {p.pyeong}평형 · {p.style}
                      </div>
                      <h3 className="text-lg font-serif-luxury font-bold text-[#141414] group-hover:text-[#7A0016] transition-colors mt-0.5">
                        {p.complexName}
                      </h3>
                      <p className="text-xs text-[#6E6E6E] line-clamp-1 mt-1">
                        {p.subTitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E8E4DF] flex items-center justify-between text-xs text-[#6E6E6E]">
                      <span>{p.roomPhotos.length}장의 공간 사진 수록</span>
                      <span className="font-semibold text-[#141414] group-hover:text-[#7A0016]">
                        사진 보기 →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
};
