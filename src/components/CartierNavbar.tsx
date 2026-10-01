import React, { useState } from 'react';
import {
  Sparkles,
  Phone,
  Maximize2,
  FileText,
  Search,
  Building2,
  Layers,
  PlusCircle,
  Menu,
  X,
  Compass
} from 'lucide-react';

interface CartierNavbarProps {
  onOpenPresentation: () => void;
  onOpenAddProject: () => void;
  onOpenConsultation: () => void;
  activeMainTab: 'complexes' | 'spaces';
  setActiveMainTab: (tab: 'complexes' | 'spaces') => void;
  onSelectCollection: (col: string) => void;
}

export const CartierNavbar: React.FC<CartierNavbarProps> = ({
  onOpenPresentation,
  onOpenAddProject,
  onOpenConsultation,
  activeMainTab,
  setActiveMainTab,
  onSelectCollection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header id="cartier-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E4DF] shadow-xs">
      
      {/* 1. Top Luxury Banner */}
      <div className="bg-[#141414] text-neutral-300 py-1.5 px-4 text-center text-[10px] sm:text-[11px] uppercase tracking-[0.25em] border-b border-[#2A2A2A] flex items-center justify-between">
        <span className="hidden sm:inline-block text-[#C5A880]">SEOUL BOUTIQUE · ATELIER</span>
        <span className="mx-auto sm:mx-0">
          까르띠에 메종 아틀리에 · 부티크 프라이빗 상담 예약 및 1:1 전담 감리 · 직통 <strong className="text-white font-bold underline">02-540-8949</strong>
        </span>
        <span className="hidden sm:inline-block text-[#C5A880]">HAUTE RÉNOVATION</span>
      </div>

      {/* 2. Main Luxury Maison Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Left Menu / Collections */}
          <div className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-[0.2em] font-medium text-[#141414]">
            <button
              type="button"
              onClick={() => {
                setActiveMainTab('complexes');
                onSelectCollection('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#7A0016] transition-colors"
            >
              전체 컬렉션
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMainTab('complexes');
                onSelectCollection('산토스');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#7A0016] transition-colors font-bold text-[#7A0016]"
            >
              산토스 에디션
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMainTab('spaces');
                window.scrollTo({ top: 500, behavior: 'smooth' });
              }}
              className="hover:text-[#7A0016] transition-colors"
            >
              공간별 아틀리에
            </button>
            <a
              href="#cartier-savoir-faire"
              className="hover:text-[#7A0016] transition-colors"
            >
              사부아페어
            </a>
          </div>

          {/* Center Brand Identity (Cartier Master Logo) */}
          <div className="flex flex-col items-center justify-center text-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="text-2xl sm:text-3xl font-serif-luxury font-bold tracking-[0.25em] text-[#141414] leading-tight hover:text-[#7A0016] transition-colors">
              Cartier
            </div>
            <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#7A0016] font-semibold mt-0.5">
              MAISON HAUTE RÉNOVATION
            </div>
          </div>

          {/* Right Action Icons & Appointment Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Monitor / Tablet Briefing Presentation */}
            <button
              type="button"
              onClick={onOpenPresentation}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 border border-[#E8E4DF] hover:border-[#141414] text-[#141414] text-xs uppercase tracking-wider font-semibold transition-colors"
              title="태블릿 고객 브리핑 모드"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#7A0016]" />
              <span className="hidden md:inline">브리핑 모드</span>
            </button>

            {/* Estimate Dossier Calculator */}
            <button
              type="button"
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E8E4DF] hover:border-[#141414] text-[#141414] text-xs uppercase tracking-wider font-semibold transition-colors"
              title="예상 공사비 계산기"
            >
              <FileText className="w-3.5 h-3.5 text-[#7A0016]" />
              <span className="hidden md:inline">견적 도시에</span>
            </button>

            {/* Cartier Red Primary Action */}
            <button
              type="button"
              onClick={onOpenConsultation}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#7A0016] hover:bg-[#600011] text-white text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>부티크 예약</span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#141414] hover:text-[#7A0016]"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E4DF] bg-white p-4 space-y-3 text-xs uppercase tracking-widest">
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('complexes');
              onSelectCollection('all');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="block w-full text-left py-2 text-[#141414] hover:text-[#7A0016] font-semibold border-b border-[#F0ECE6]"
          >
            전체 컬렉션 둘러보기
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('complexes');
              onSelectCollection('산토스');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="block w-full text-left py-2 text-[#7A0016] font-bold border-b border-[#F0ECE6]"
          >
            산토스 드 까르띠에 에디션
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('spaces');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[#141414] hover:text-[#7A0016] font-semibold border-b border-[#F0ECE6]"
          >
            공간별 아틀리에 갤러리 (Living, Kitchen, Bath)
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenAddProject();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[#141414] hover:text-[#7A0016] font-semibold border-b border-[#F0ECE6]"
          >
            신규 시공 프로젝트 등록
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenPresentation();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-[#7A0016] font-bold"
          >
            대화면 태블릿 프레젠테이션 모드
          </button>
        </div>
      )}

    </header>
  );
};
