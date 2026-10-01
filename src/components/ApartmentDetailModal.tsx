import React, { useState } from 'react';
import { ApartmentProject, RoomType } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { PhotoLightbox } from './PhotoLightbox';
import {
  X,
  Maximize2,
  Calendar,
  Clock,
  Coins,
  Home,
  CheckCircle,
  Phone,
  Share2,
  Copy,
  FileText,
  BadgeCheck,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';

interface ApartmentDetailModalProps {
  project: ApartmentProject;
  onClose: () => void;
  onOpenConsultation: (project: ApartmentProject) => void;
}

export const ApartmentDetailModal: React.FC<ApartmentDetailModalProps> = ({
  project,
  onClose,
  onOpenConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'beforeAfter' | 'spec'>('gallery');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<'all' | RoomType>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const filteredPhotos = selectedRoomFilter === 'all'
    ? project.roomPhotos
    : project.roomPhotos.filter((p) => p.roomType === selectedRoomFilter);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <div
        id="apartment-detail-modal-backdrop"
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
        onClick={onClose}
      >
        <div
          id="apartment-detail-modal-content"
          className="relative bg-white rounded-2xl w-full max-w-5xl my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar with Cartier Atelier Styling */}
          <div className="flex items-start justify-between p-4 sm:p-6 border-b border-[#E8E4DF] bg-white sticky top-0 z-30">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#141414] text-white tracking-widest">
                  REF. {project.refCode || 'CRWSSA0029'}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-bold text-[#7A0016] bg-[#FAF3F2] border border-[#F3DFDE] uppercase tracking-wider">
                  {project.cartierCollection || '산토스 드 까르띠에'}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#F5F4F0] text-[#141414] border border-[#E8E4DF]">
                  {project.modelEdition || `${project.pyeong}평형 라지 모델`}
                </span>
                <span className="text-xs text-[#6E6E6E] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#7A0016]" />
                  완공: {project.completionDate}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#141414] tracking-tight">
                {project.complexName}
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E6E] mt-0.5">{project.subTitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 border border-[#E8E4DF] text-[#141414] hover:bg-[#F5F4F0] transition-colors"
                title="상담 링크 복사"
              >
                {copiedLink ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-[#7A0016]" />
                    <span className="text-[#7A0016] font-bold">복사완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#6E6E6E]" />
                    <span>링크 복사</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                title="닫기"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 sm:px-6 py-3 bg-neutral-50 border-b border-neutral-200/60 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <p className="text-neutral-400 text-[11px]">총 시공 비용</p>
                <p className="font-bold text-neutral-800 text-sm">약 {project.costMillionWon.toLocaleString()}만원</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-neutral-400 text-[11px]">소요 공사 기간</p>
                <p className="font-bold text-neutral-800 text-sm">{project.durationWeeks}주 올수리</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <p className="text-neutral-400 text-[11px]">공간 면적</p>
                <p className="font-bold text-neutral-800 text-sm">{project.pyeong}평 ({project.squareMeters}㎡)</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-neutral-400 text-[11px]">리모델링 컨셉</p>
                <p className="font-bold text-neutral-800 text-sm">{project.style}</p>
              </div>
            </div>
          </div>

          {/* Cartier Maison Story Quote */}
          {project.maisonStory && (
            <div className="px-4 sm:px-6 py-3.5 bg-[#FAF8F5] border-b border-[#E8E4DF] flex items-start gap-3">
              <span className="text-[11px] font-serif-luxury font-bold uppercase tracking-widest text-[#7A0016] mt-0.5 shrink-0">
                MAISON STORY
              </span>
              <p className="text-xs font-serif-luxury italic text-[#424242] leading-relaxed">
                "{project.maisonStory}"
              </p>
            </div>
          )}

          {/* Section Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 sm:px-6 bg-white shrink-0 overflow-x-auto">
            <div className="flex gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`py-3 text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeTab === 'gallery'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                공간별 고화질 갤러리 ({project.roomPhotos.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('beforeAfter')}
                className={`py-3 text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeTab === 'beforeAfter'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                시공 전·후 비교 슬라이더
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('spec')}
                className={`py-3 text-sm font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeTab === 'spec'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                자재 및 시공 스펙표
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* TAB 1: GALLERY */}
            {activeTab === 'gallery' && (
              <div className="space-y-4">
                {/* Room filter chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setSelectedRoomFilter('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                      selectedRoomFilter === 'all'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    전체 공간
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRoomFilter('living')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                      selectedRoomFilter === 'living'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    거실
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRoomFilter('kitchen')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                      selectedRoomFilter === 'kitchen'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    주방
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRoomFilter('bathroom')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                      selectedRoomFilter === 'bathroom'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    욕실
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRoomFilter('bedroom')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                      selectedRoomFilter === 'bedroom'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    침실
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRoomFilter('entrance')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                      selectedRoomFilter === 'entrance'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    현관
                  </button>
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredPhotos.map((photo, idx) => {
                    const originalIdx = project.roomPhotos.findIndex((p) => p.id === photo.id);
                    return (
                      <div
                        key={photo.id}
                        className="group relative rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                        onClick={() => setLightboxIndex(originalIdx >= 0 ? originalIdx : 0)}
                      >
                        <div className="aspect-16/10 overflow-hidden bg-neutral-200">
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                        </div>
                        {/* Hover Overlay with expand icon */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between text-white">
                          <div className="flex justify-between items-start">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/60 text-amber-300">
                              {photo.roomNameKo}
                            </span>
                            <span className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white">
                              <Maximize2 className="w-4 h-4" />
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white mb-1">{photo.title}</h4>
                            <p className="text-xs text-neutral-300 line-clamp-2">{photo.description}</p>
                          </div>
                        </div>

                        {/* Static Bottom label for mobile */}
                        <div className="p-3 bg-white sm:hidden border-t border-neutral-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-900">{photo.title}</span>
                            <span className="text-[11px] text-neutral-500">{photo.roomNameKo}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: BEFORE & AFTER SLIDER */}
            {activeTab === 'beforeAfter' && (
              <div className="space-y-4">
                <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200/50 text-xs text-amber-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>중앙의 슬라이더 바를 잡고 좌우로 드래그하면 시공 전 노후 상태와 시공 후 개선 결과를 실시간으로 비교할 수 있습니다.</span>
                </div>
                <BeforeAfterSlider data={project.beforeAfter} />
              </div>
            )}

            {/* TAB 3: SPECIFICATIONS & MATERIALS */}
            {activeTab === 'spec' && (
              <div className="space-y-6">
                {/* Construction highlights */}
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    핵심 시공 포인트
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {project.features.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/70 text-xs font-medium text-neutral-800"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Materials Breakdown */}
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-neutral-700" />
                    적용 주요 자재 및 브랜드
                  </h4>
                  <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 overflow-hidden text-xs">
                    <div className="grid grid-cols-3 p-3 bg-neutral-50/60 font-semibold text-neutral-700">
                      <span>구분</span>
                      <span className="col-span-2">적용 사양 및 브랜드 상세</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 hover:bg-neutral-50/30">
                      <span className="font-medium text-neutral-500">바닥재 (Floor)</span>
                      <span className="col-span-2 text-neutral-800">{project.materials.floor}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 hover:bg-neutral-50/30">
                      <span className="font-medium text-neutral-500">벽체 (Wall)</span>
                      <span className="col-span-2 text-neutral-800">{project.materials.wall}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 hover:bg-neutral-50/30">
                      <span className="font-medium text-neutral-500">조명 (Lighting)</span>
                      <span className="col-span-2 text-neutral-800">{project.materials.lighting}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 hover:bg-neutral-50/30">
                      <span className="font-medium text-neutral-500">주방 가구 (Kitchen)</span>
                      <span className="col-span-2 text-neutral-800">{project.materials.kitchen}</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 hover:bg-neutral-50/30">
                      <span className="font-medium text-neutral-500">욕실 도기/타일 (Bath)</span>
                      <span className="col-span-2 text-neutral-800">{project.materials.bathroom}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Realtor Agent Advice & Available Listing Notice */}
            <div className="rounded-xl bg-neutral-900 text-white p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-400 text-neutral-950">
                  부동산 공인중개사 코멘트
                </span>
                <span className="text-xs text-neutral-400">전문 상담 지원</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                "{project.agentNote}"
              </p>

              {project.availableListingNotice && (
                <div className="p-3 rounded-lg bg-white/10 border border-white/15 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="text-white font-medium">{project.availableListingNotice}</span>
                  </div>
                  <span className="text-[11px] text-amber-300 font-semibold flex items-center">
                    매물 문의 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Consultation Action */}
          <div className="p-4 border-t border-neutral-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-neutral-500 text-center sm:text-left">
              본 시공 사례와 동일한 스타일로 아파트 매매·전세 후 리모델링 견적 및 공사 일정을 바로 상담해 드립니다.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onOpenConsultation(project)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>이 스타일로 고객 맞춤 견적·상담</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Trigger if open */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={project.roomPhotos}
          initialIndex={lightboxIndex}
          complexName={project.complexName}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
};
