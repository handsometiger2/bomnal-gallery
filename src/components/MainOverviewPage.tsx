import React from 'react';
import { ApartmentProject } from '../types';

interface MainOverviewPageProps {
  projects: ApartmentProject[];
  mainImageUrl?: string;
  onSelectProject: (index: number) => void;
  onOpenAdmin: () => void;
}

export const MainOverviewPage: React.FC<MainOverviewPageProps> = ({
  projects,
  mainImageUrl,
  onSelectProject,
  onOpenAdmin,
}) => {
  // 메인 단일 대표 이미지
  const displayImage =
    mainImageUrl ||
    projects[0]?.thumbnailUrl ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85';

  return (
    <div
      className="relative w-screen h-screen bg-[#0A0A0A] overflow-hidden select-none cursor-pointer"
      onClick={() => onSelectProject(0)}
    >
      {/* 1. 화면 전체에 단 하나만 떠 있는 메인 이미지 */}
      <img
        src={displayImage}
        alt="BOMNAL 메인"
        className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-102"
        draggable={false}
      />

      {/* 2. 미세한 상하단 비네팅 (가독성 유지) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />

      {/* 3. 좌측 상단: BOMNAL 로고 */}
      <header className="absolute top-0 left-0 right-0 z-30 h-16 sm:h-20 px-6 sm:px-12 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <span className="font-serif-luxury font-bold text-xl sm:text-2xl tracking-[0.3em] text-white/95 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
            BOMNAL
          </span>
        </div>

        {/* 우측 상단: 단지별 바로보기 */}
        <nav className="flex items-center gap-4 sm:gap-6 pointer-events-auto py-2 overflow-x-auto no-scrollbar">
          {projects.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProject(idx);
              }}
              className="text-xs sm:text-[13px] tracking-wider text-white/80 hover:text-white transition-colors cursor-pointer drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] whitespace-nowrap"
            >
              {p.complexName}
            </button>
          ))}
        </nav>
      </header>

      {/* 4. 우측 하단 저작권 & 관리자 설정 히든 점 */}
      <footer className="absolute bottom-4 right-6 sm:right-12 z-30 flex items-center gap-3.5 text-white/60 text-[10px] sm:text-[11px] tracking-[0.16em] pointer-events-auto">
        <span className="font-light select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          2026 © All rights reserved the Bomnal
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenAdmin();
          }}
          className="p-1 opacity-30 hover:opacity-100 transition-opacity cursor-pointer focus:outline-none"
          title="관리자 설정"
          aria-label="Admin"
        >
          <span className="block w-1.5 h-1.5 rounded-full bg-white/60 hover:bg-white transition-colors" />
        </button>
      </footer>
    </div>
  );
};
