import React from 'react';
import {
  Building2,
  Maximize,
  PlusCircle,
  Calculator,
  Phone,
  Layers,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  agencyName: string;
  agencyPhone: string;
  onOpenPresentation: () => void;
  onOpenAddProject: () => void;
  onOpenConsultation: () => void;
  activeMainTab: 'complexes' | 'spaces';
  setActiveMainTab: (tab: 'complexes' | 'spaces') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  agencyName,
  agencyPhone,
  onOpenPresentation,
  onOpenAddProject,
  onOpenConsultation,
  activeMainTab,
  setActiveMainTab,
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Agency Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-md shrink-0">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-neutral-950 tracking-tight leading-tight">
                  {agencyName}
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  리모델링 전문 갤러리
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-500 font-medium">
                아파트 시공 전·후 비교 & 공간별 포트폴리오
              </p>
            </div>
          </div>

          {/* Navigation View Switcher (단지별 매물 / 공간별 모아보기) */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-neutral-100 border border-neutral-200/80">
            <button
              type="button"
              onClick={() => setActiveMainTab('complexes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMainTab === 'complexes'
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              아파트 단지별 갤러리
            </button>
            <button
              type="button"
              onClick={() => setActiveMainTab('spaces')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMainTab === 'spaces'
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              공간별 모아보기 (거실·주방·욕실)
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Phone badge on desktop */}
            <a
              href={`tel:${agencyPhone}`}
              className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{agencyPhone}</span>
            </a>

            {/* Quick Estimate / Consultation */}
            <button
              type="button"
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
              title="견적 계산기 & 고객 상담 카드"
            >
              <Calculator className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">상담 견적기</span>
            </button>

            {/* Add Project Button */}
            <button
              type="button"
              onClick={onOpenAddProject}
              className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-neutral-300 hover:border-neutral-900 text-neutral-700 hover:text-neutral-900 transition-colors"
              title="신규 리모델링 사례 추가"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden md:inline">사례 등록</span>
            </button>

            {/* Presentation Mode */}
            <button
              type="button"
              onClick={onOpenPresentation}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white shadow-md transition-all active:scale-95"
              title="고객 브리핑 전용 전체화면 모드"
            >
              <Maximize className="w-4 h-4 text-amber-400" />
              <span>고객 브리핑 모드</span>
            </button>
          </div>
        </div>

        {/* Mobile View Switcher Tab bar */}
        <div className="flex lg:hidden items-center justify-center p-1 my-2 rounded-xl bg-neutral-100 border border-neutral-200">
          <button
            type="button"
            onClick={() => setActiveMainTab('complexes')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
              activeMainTab === 'complexes'
                ? 'bg-white text-neutral-950 shadow-sm'
                : 'text-neutral-500'
            }`}
          >
            단지별 포트폴리오
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab('spaces')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
              activeMainTab === 'spaces'
                ? 'bg-white text-neutral-950 shadow-sm'
                : 'text-neutral-500'
            }`}
          >
            공간별 모아보기
          </button>
        </div>
      </div>
    </header>
  );
};
