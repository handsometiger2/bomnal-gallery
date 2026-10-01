import React, { useState } from 'react';
import { ApartmentProject, RoomType } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { CartierLoupe } from './CartierLoupe';
import {
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Phone,
  FileText,
  Share2,
  Check,
  Layers,
  ArrowRight,
  Eye,
  Sliders,
  CheckCircle2,
  Compass,
  Award
} from 'lucide-react';

interface CartierProductHeroProps {
  project: ApartmentProject;
  allProjects: ApartmentProject[];
  onSelectProject: (p: ApartmentProject) => void;
  onOpenConsultation: (p: ApartmentProject) => void;
  onOpenPresentation: () => void;
  onOpenLightbox: (index: number) => void;
}

export const CartierProductHero: React.FC<CartierProductHeroProps> = ({
  project,
  allProjects,
  onSelectProject,
  onOpenConsultation,
  onOpenPresentation,
  onOpenLightbox,
}) => {
  // Gallery view mode
  const [galleryMode, setGalleryMode] = useState<'main' | 'beforeAfter' | 'loupe' | 'rooms' | 'floorplan'>('main');
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Accordion states (Cartier style)
  const [openAccordions, setOpenAccordions] = useState<{
    description: boolean;
    specs: boolean;
    restoration: boolean;
    services: boolean;
  }>({
    description: true,
    specs: true,
    restoration: false,
    services: false,
  });

  const toggleAccordion = (key: keyof typeof openAccordions) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedRoom = project.roomPhotos[selectedRoomIndex] || project.roomPhotos[0];

  return (
    <section id="cartier-hero-showcase" className="w-full bg-[#FBFBF9] border-b border-[#E8E4DF] pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cartier Breadcrumb & Reference Code */}
        <div className="flex flex-wrap items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#6E6E6E] pb-6 border-b border-[#E8E4DF] mb-8">
          <div className="flex items-center gap-2">
            <span className="hover:text-[#141414] cursor-pointer">MAISON DE LUXE</span>
            <span>/</span>
            <span className="hover:text-[#141414] cursor-pointer">ARCHITECTURE & WATCHMAKING</span>
            <span>/</span>
            <span className="text-[#7A0016] font-semibold">{project.cartierCollection || '산토스 드 까르띠에'}</span>
          </div>

          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span className="font-mono text-[#141414] font-bold bg-[#EFECE6] px-2.5 py-1 text-[10px] tracking-widest border border-[#E0DCD4]">
              REF. {project.refCode || 'CRWSSA0029'}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 hover:text-[#141414] transition-colors text-[10px]"
              title="링크 공유"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨' : '공유하기'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Left Gallery / Right Dossier & CTAs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Gallery & Inspection (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Gallery Perspective Switcher Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E8E4DF]">
              <button
                type="button"
                onClick={() => setGalleryMode('main')}
                className={`px-3 py-2 text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap border-b-2 ${
                  galleryMode === 'main'
                    ? 'border-[#7A0016] text-[#7A0016] font-bold bg-[#F5F2EC]'
                    : 'border-transparent text-[#6E6E6E] hover:text-[#141414]'
                }`}
              >
                01. 메인 아틀리에 뷰
              </button>
              <button
                type="button"
                onClick={() => setGalleryMode('beforeAfter')}
                className={`px-3 py-2 text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
                  galleryMode === 'beforeAfter'
                    ? 'border-[#7A0016] text-[#7A0016] font-bold bg-[#F5F2EC]'
                    : 'border-transparent text-[#6E6E6E] hover:text-[#141414]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                02. 헤리티지 비포 & 애프터
              </button>
              <button
                type="button"
                onClick={() => setGalleryMode('loupe')}
                className={`px-3 py-2 text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
                  galleryMode === 'loupe'
                    ? 'border-[#7A0016] text-[#7A0016] font-bold bg-[#F5F2EC]'
                    : 'border-transparent text-[#6E6E6E] hover:text-[#141414]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                03. 2.4x 마감재 루페 줌
              </button>
              <button
                type="button"
                onClick={() => setGalleryMode('rooms')}
                className={`px-3 py-2 text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap border-b-2 ${
                  galleryMode === 'rooms'
                    ? 'border-[#7A0016] text-[#7A0016] font-bold bg-[#F5F2EC]'
                    : 'border-transparent text-[#6E6E6E] hover:text-[#141414]'
                }`}
              >
                04. 공간별 갤러리 ({project.roomPhotos.length})
              </button>
            </div>

            {/* Main Stage Display */}
            <div className="relative bg-[#F5F4F0] border border-[#E8E4DF] overflow-hidden min-h-[400px] flex items-center justify-center">
              {galleryMode === 'main' && (
                <div className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] group overflow-hidden">
                  <img
                    src={project.thumbnailUrl}
                    alt={project.complexName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Cartier Tag overlay */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 border border-[#E8E4DF] shadow-md">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#7A0016] block">
                      {project.cartierCollection || 'SANTOS DE CARTIER'}
                    </span>
                    <span className="text-xs font-serif-luxury font-bold text-[#141414]">
                      {project.complexName} {project.pyeong}평형 ({project.squareMeters}㎡)
                    </span>
                  </div>

                  {/* Lightbox button */}
                  <button
                    type="button"
                    onClick={() => onOpenLightbox(0)}
                    className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white text-[#141414] border border-[#E8E4DF] flex items-center justify-center shadow-sm transition-transform active:scale-95"
                    title="전체화면 감상"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {galleryMode === 'beforeAfter' && (
                <div className="w-full p-4 sm:p-6 bg-white">
                  <BeforeAfterSlider data={project.beforeAfter} />
                </div>
              )}

              {galleryMode === 'loupe' && (
                <div className="w-full">
                  <CartierLoupe
                    imageUrl={selectedRoom?.imageUrl || project.thumbnailUrl}
                    alt={project.complexName}
                    caption="커서를 사진 위로 움직여 600x1200 포세린 타일 질감과 무몰딩 엣지 라인을 2.4배율 루페로 정밀 검사하세요."
                  />
                </div>
              )}

              {galleryMode === 'rooms' && (
                <div className="w-full flex flex-col">
                  <div className="relative w-full h-[360px] sm:h-[440px] md:h-[480px]">
                    <img
                      src={selectedRoom.imageUrl}
                      alt={selectedRoom.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 text-white">
                      <span className="text-[11px] font-bold tracking-widest uppercase text-amber-300">
                        {selectedRoom.roomNameKo} · ATELIER
                      </span>
                      <h4 className="text-base sm:text-lg font-serif-luxury font-bold text-white mt-0.5">
                        {selectedRoom.title}
                      </h4>
                      <p className="text-xs text-neutral-200 mt-1 max-w-xl line-clamp-2">
                        {selectedRoom.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenLightbox(selectedRoomIndex)}
                      className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white text-[#141414] border border-[#E8E4DF] flex items-center justify-center shadow-sm"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Room highlights bar */}
                  <div className="p-3 bg-[#F8F6F2] border-t border-[#E8E4DF] flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A0016]">시공 디테일:</span>
                    {selectedRoom.highlights.map((hl, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 bg-white border border-[#E0DCD4] text-[#424242]">
                        {hl}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-[#6E6E6E] mb-2 uppercase tracking-wider">
                <span>아틀리에 갤러리 앵글</span>
                <span className="font-mono text-[11px]">
                  {galleryMode === 'rooms' ? `0${selectedRoomIndex + 1} / 0${project.roomPhotos.length}` : '01 / 06'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
                {/* Main thumbnail */}
                <button
                  type="button"
                  onClick={() => {
                    setGalleryMode('main');
                  }}
                  className={`relative w-20 h-16 sm:w-24 sm:h-18 shrink-0 overflow-hidden border-2 transition-all ${
                    galleryMode === 'main' ? 'border-[#7A0016] ring-2 ring-[#7A0016]/20' : 'border-[#E8E4DF] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={project.thumbnailUrl} alt="메인" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 uppercase tracking-tighter">
                    MAIN
                  </span>
                </button>

                {/* Before/After thumbnail */}
                <button
                  type="button"
                  onClick={() => setGalleryMode('beforeAfter')}
                  className={`relative w-20 h-16 sm:w-24 sm:h-18 shrink-0 overflow-hidden border-2 transition-all ${
                    galleryMode === 'beforeAfter' ? 'border-[#7A0016] ring-2 ring-[#7A0016]/20' : 'border-[#E8E4DF] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={project.beforeAfter.beforeImageUrl} alt="비포애프터" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-[#7A0016] text-[9px] text-white text-center py-0.5 uppercase font-bold tracking-tighter">
                    B&A
                  </span>
                </button>

                {/* Room Photos */}
                {project.roomPhotos.map((room, idx) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => {
                      setSelectedRoomIndex(idx);
                      setGalleryMode('rooms');
                    }}
                    className={`relative w-20 h-16 sm:w-24 sm:h-18 shrink-0 overflow-hidden border-2 transition-all ${
                      galleryMode === 'rooms' && selectedRoomIndex === idx
                        ? 'border-[#7A0016] ring-2 ring-[#7A0016]/20'
                        : 'border-[#E8E4DF] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={room.imageUrl} alt={room.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 uppercase truncate px-0.5">
                      {room.roomNameKo}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cartier Savoir-Faire Micro-Pillars underneath left gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E8E4DF] text-center">
              <div className="p-3 bg-white border border-[#E8E4DF]">
                <Compass className="w-4 h-4 text-[#7A0016] mx-auto mb-1" />
                <div className="text-[11px] font-bold text-[#141414]">전용 {project.squareMeters}㎡ ({project.pyeong}평)</div>
                <div className="text-[10px] text-[#6E6E6E]">구조 설계 최적화</div>
              </div>
              <div className="p-3 bg-white border border-[#E8E4DF]">
                <Clock className="w-4 h-4 text-[#7A0016] mx-auto mb-1" />
                <div className="text-[11px] font-bold text-[#141414]">{project.durationWeeks}주 정밀 시공</div>
                <div className="text-[10px] text-[#6E6E6E]">완벽한 공정 관리</div>
              </div>
              <div className="p-3 bg-white border border-[#E8E4DF]">
                <Award className="w-4 h-4 text-[#7A0016] mx-auto mb-1" />
                <div className="text-[11px] font-bold text-[#141414]">5년 공식 품질 보증</div>
                <div className="text-[10px] text-[#6E6E6E]">하자이행증권 발급</div>
              </div>
              <div className="p-3 bg-white border border-[#E8E4DF]">
                <ShieldCheck className="w-4 h-4 text-[#7A0016] mx-auto mb-1" />
                <div className="text-[11px] font-bold text-[#141414]">1:1 수석 감리</div>
                <div className="text-[10px] text-[#6E6E6E]">실명제 시공 보증</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Cartier Atelier Dossier & Boutique CTAs (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white border border-[#E8E4DF] p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Maison Collection & Reference */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#7A0016]">
                    {project.cartierCollection || 'SANTOS DE CARTIER'}
                  </span>
                  <span className="text-[11px] text-[#6E6E6E] font-mono">
                    REF. {project.refCode || 'CRWSSA0029'}
                  </span>
                </div>
                
                {/* Grand Serif Title */}
                <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#141414] tracking-tight leading-snug pt-1">
                  {project.complexName}
                </h1>
                <p className="text-xs uppercase tracking-wider text-[#6E6E6E]">
                  {project.modelEdition || `${project.pyeong}평형 라지 모델`} · {project.style}
                </p>
              </div>

              {/* Price Display */}
              <div className="py-4 border-y border-[#E8E4DF] space-y-1">
                <div className="text-xs uppercase tracking-widest text-[#6E6E6E]">
                  종합 시공 견적 (ESTIMATED DOSSIER)
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#141414]">
                    ₩ {(project.costMillionWon * 10000).toLocaleString()}
                  </span>
                  <span className="text-xs text-[#6E6E6E] font-medium">
                    (VAT 및 기본 설비 포함)
                  </span>
                </div>
                <p className="text-[11px] text-[#8C8275]">
                  * 평당 약 {(project.costMillionWon / project.pyeong).toFixed(1)}백만원 선 / 단지 동일 라인 매매·전세 연계 컨설팅 가능
                </p>
              </div>

              {/* Quick Model Selector (Cartier style timepiece size selector) */}
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-[#6E6E6E] font-semibold block">
                  컬렉션 모델 및 평형 선택 (Select Edition):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {allProjects.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectProject(item)}
                      className={`p-2.5 text-left border transition-all ${
                        item.id === project.id
                          ? 'border-[#7A0016] bg-[#FAF8F5] ring-1 ring-[#7A0016]'
                          : 'border-[#E8E4DF] hover:border-[#141414] bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#141414] truncate">
                          {item.complexName.split(' ')[0]}
                        </span>
                        <span className="text-[10px] font-mono text-[#7A0016] font-semibold">
                          {item.pyeong}평
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6E6E6E] truncate mt-0.5">
                        {item.refCode} · {item.style}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cartier Primary Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* 1. Primary Cartier Red Button */}
                <button
                  type="button"
                  onClick={() => onOpenConsultation(project)}
                  className="w-full py-4 px-6 bg-[#7A0016] hover:bg-[#600011] text-white text-xs font-bold uppercase tracking-[0.25em] transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>부티크 프라이빗 상담 예약 (Book an Appointment)</span>
                </button>

                {/* 2. Secondary Luxury Outline Button */}
                <button
                  type="button"
                  onClick={() => onOpenConsultation(project)}
                  className="w-full py-3.5 px-6 bg-white hover:bg-[#F5F4F0] text-[#141414] border border-[#141414] text-xs font-semibold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>건축 사양서 및 상세 견적서 요청</span>
                </button>

                {/* 3. Direct Phone Consultation */}
                <div className="text-center pt-1">
                  <a
                    href="tel:02-540-8949"
                    className="inline-flex items-center gap-1.5 text-xs text-[#6E6E6E] hover:text-[#7A0016] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#7A0016]" />
                    <span>부티크 아틀리에 직통 문의: <strong className="text-[#141414] underline">02-540-8949</strong></span>
                  </a>
                </div>
              </div>

              {/* Maison Guarantees (Cartier standard perks) */}
              <div className="pt-4 border-t border-[#E8E4DF] space-y-2 text-xs text-[#424242]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7A0016] shrink-0" />
                  <span>무료 현장 정밀 실측 및 3D 입체 투시도 설계 제공</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7A0016] shrink-0" />
                  <span>공인중개사 연계 동일 단지 급매물·로열층 매칭 동시 진행</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7A0016] shrink-0" />
                  <span>안심 계약 에스크로 & 서울보증보험 하자이행증권 100% 발급</span>
                </div>
              </div>

              {/* Fullscreen Presentation Mode launcher */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenPresentation}
                  className="w-full py-2.5 px-4 bg-[#F5F4F0] hover:bg-[#ECE9E2] text-[#141414] text-xs font-medium uppercase tracking-wider flex items-center justify-between border border-[#E8E4DF] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Maximize2 className="w-3.5 h-3.5 text-[#7A0016]" />
                    대화면 모니터/태블릿 브리핑 모드
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* CARTIER ACCORDIONS (Description, Specs, Restoration, Services) */}
            <div className="bg-white border border-[#E8E4DF] divide-y divide-[#E8E4DF]">
              
              {/* Accordion 1: Description & Maison Story */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('description')}
                  className="w-full py-4 px-6 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors"
                >
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#141414]">
                    작품 설명 (Description & Story)
                  </span>
                  {openAccordions.description ? <ChevronUp className="w-4 h-4 text-[#6E6E6E]" /> : <ChevronDown className="w-4 h-4 text-[#6E6E6E]" />}
                </button>
                {openAccordions.description && (
                  <div className="px-6 pb-6 text-xs text-[#424242] leading-relaxed space-y-3 font-sans">
                    <p className="font-serif-luxury text-sm text-[#141414] leading-relaxed italic border-l-2 border-[#7A0016] pl-3 py-1 bg-[#FAF8F5]">
                      "{project.maisonStory || project.subTitle}"
                    </p>
                    <p>
                      {project.subTitle}. 공간의 균형미와 직선의 순수함을 강조한 기하학적 레이아웃으로, 주방과 거실의 불필요한 내력벽 시야를 개선하고 600x1200 광폭 대형 포세린 타일과 무몰딩 평탄화를 통해 시각적 확장감을 극대화했습니다.
                    </p>
                    <div className="pt-2">
                      <span className="font-bold text-[#141414] block mb-1">공인중개사 추천 코멘트:</span>
                      <p className="text-[#6E6E6E]">{project.agentNote}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Materials & Specifications */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('specs')}
                  className="w-full py-4 px-6 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors"
                >
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#141414]">
                    상세 사양 및 마감재 (Specifications)
                  </span>
                  {openAccordions.specs ? <ChevronUp className="w-4 h-4 text-[#6E6E6E]" /> : <ChevronDown className="w-4 h-4 text-[#6E6E6E]" />}
                </button>
                {openAccordions.specs && (
                  <div className="px-6 pb-6 space-y-3 text-xs">
                    <table className="w-full text-left border-collapse">
                      <tbody className="divide-y divide-[#E8E4DF]">
                        <tr>
                          <td className="py-2.5 font-semibold text-[#6E6E6E] w-28 uppercase tracking-wider text-[11px]">단지 및 위치</td>
                          <td className="py-2.5 text-[#141414] font-medium">{project.complexName} ({project.address})</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-semibold text-[#6E6E6E] uppercase tracking-wider text-[11px]">면적 규격</td>
                          <td className="py-2.5 text-[#141414]">공급 {project.pyeong}평형 / 전용 {project.squareMeters}㎡</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-semibold text-[#6E6E6E] uppercase tracking-wider text-[11px]">바닥재 (Floor)</td>
                          <td className="py-2.5 text-[#141414]">{project.materials.floor}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-semibold text-[#6E6E6E] uppercase tracking-wider text-[11px]">벽체 (Wall)</td>
                          <td className="py-2.5 text-[#141414]">{project.materials.wall}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-semibold text-[#6E6E6E] uppercase tracking-wider text-[11px]">주방 (Kitchen)</td>
                          <td className="py-2.5 text-[#141414]">{project.materials.kitchen}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-semibold text-[#6E6E6E] uppercase tracking-wider text-[11px]">욕실 (Bathroom)</td>
                          <td className="py-2.5 text-[#141414]">{project.materials.bathroom}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-semibold text-[#6E6E6E] uppercase tracking-wider text-[11px]">조명 시스템</td>
                          <td className="py-2.5 text-[#141414]">{project.materials.lighting}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Accordion 3: Heritage Restoration Before & After */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('restoration')}
                  className="w-full py-4 px-6 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors"
                >
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#141414]">
                    헤리티지 변신 내역 (Before & After Heritage)
                  </span>
                  {openAccordions.restoration ? <ChevronUp className="w-4 h-4 text-[#6E6E6E]" /> : <ChevronDown className="w-4 h-4 text-[#6E6E6E]" />}
                </button>
                {openAccordions.restoration && (
                  <div className="px-6 pb-6 space-y-4 text-xs">
                    <div className="p-3 bg-[#FAF8F5] border border-[#E8E4DF] space-y-1">
                      <span className="font-bold text-[#7A0016] uppercase text-[10px] tracking-wider block">시공 전 진단:</span>
                      <p className="text-[#6E6E6E] leading-relaxed">{project.beforeAfter.beforeDescription}</p>
                    </div>
                    <div className="p-3 bg-[#F4F8F3] border border-[#D5E5D3] space-y-1">
                      <span className="font-bold text-emerald-800 uppercase text-[10px] tracking-wider block">시공 후 완성도:</span>
                      <p className="text-[#2F4F2F] leading-relaxed">{project.beforeAfter.afterDescription}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 4: Boutique Services & Guarantees */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('services')}
                  className="w-full py-4 px-6 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors"
                >
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#141414]">
                    부티크 서비스 및 품질 보증 (Boutique Services)
                  </span>
                  {openAccordions.services ? <ChevronUp className="w-4 h-4 text-[#6E6E6E]" /> : <ChevronDown className="w-4 h-4 text-[#6E6E6E]" />}
                </button>
                {openAccordions.services && (
                  <div className="px-6 pb-6 text-xs text-[#424242] leading-relaxed space-y-2">
                    <p>
                      <strong>1. 서울보증보험 하자이행보증서 100% 발급:</strong> 완공 후 5년간 구조 및 설비 무상 A/S 지원.
                    </p>
                    <p>
                      <strong>2. 친환경 자재 실명제:</strong> E0 등급 이상의 친환경 접착제, 도장, 수입 도기 사용 보증서 증빙.
                    </p>
                    <p>
                      <strong>3. 공인중개사 직영 원스톱 서비스:</strong> 아파트 매매 계약부터 인테리어 공사 인허가, 입주민 동의서 대행, 최종 잔금까지 일괄 케어.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
