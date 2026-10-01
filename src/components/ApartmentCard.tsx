import React, { useState } from 'react';
import { ApartmentProject } from '../types';
import { Sparkles, ArrowRight, Clock, Coins, MapPin, Layers } from 'lucide-react';

interface ApartmentCardProps {
  project: ApartmentProject;
  onSelect: (project: ApartmentProject) => void;
  onQuickConsult: (project: ApartmentProject) => void;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({
  project,
  onSelect,
  onQuickConsult,
}) => {
  const [showBeforePreview, setShowBeforePreview] = useState<boolean>(false);

  return (
    <div
      id={`apartment-card-${project.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Visual Image Header */}
      <div className="relative aspect-16/10 overflow-hidden bg-neutral-100 cursor-pointer" onClick={() => onSelect(project)}>
        <img
          src={showBeforePreview ? project.beforeAfter.beforeImageUrl : project.thumbnailUrl}
          alt={project.complexName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#141414]/90 backdrop-blur-md text-white border border-white/20">
            REF. {project.refCode || 'CRWSSA0029'}
          </span>

          <span className="px-2 py-0.5 text-[11px] font-semibold bg-white/95 backdrop-blur-md text-[#7A0016] border border-[#E8E4DF]">
            {project.cartierCollection?.split('(')[0] || project.style}
          </span>
        </div>

        {/* Before/After Quick Hover/Click Peek toggle */}
        <div className="absolute bottom-3 left-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowBeforePreview(!showBeforePreview);
            }}
            onMouseEnter={() => setShowBeforePreview(true)}
            onMouseLeave={() => setShowBeforePreview(false)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/70 hover:bg-black/90 text-amber-300 backdrop-blur-md border border-amber-400/30 transition-all shadow"
            title="마우스를 올리거나 클릭하면 시공 전 사진을 바로 봅니다"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{showBeforePreview ? '시공 전 (BEFORE)' : 'B/A 비교 엿보기'}</span>
          </button>
        </div>

        {/* Room photos count badge */}
        <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-black/60 text-white/90 backdrop-blur-md">
            <Layers className="w-3 h-3" />
            {project.roomPhotos.length}개 공간 사진
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Address */}
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 mb-1">
            <MapPin className="w-3 h-3" />
            <span>{project.address}</span>
          </div>

          {/* Title */}
          <div className="text-[10px] uppercase tracking-wider text-[#7A0016] font-bold">
            {project.modelEdition || `${project.pyeong}평형`}
          </div>
          <h3
            onClick={() => onSelect(project)}
            className="text-base sm:text-lg font-serif-luxury font-bold text-[#141414] group-hover:text-[#7A0016] transition-colors cursor-pointer line-clamp-1 mt-0.5"
          >
            {project.complexName}
          </h3>

          <p className="text-xs text-[#6E6E6E] mt-1 line-clamp-2 leading-relaxed">
            {project.subTitle}
          </p>

          {/* Specs: Cost & Duration */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-700">
              <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-400 block">시공비용</span>
                <span className="font-bold text-neutral-900">약 {project.costMillionWon.toLocaleString()}만원</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-700">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-400 block">공사기간</span>
                <span className="font-bold text-neutral-900">{project.durationWeeks}주 올수리</span>
              </div>
            </div>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.features.slice(0, 3).map((f, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-medium"
              >
                {f}
              </span>
            ))}
            {project.features.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-neutral-50 text-neutral-400 font-medium">
                +{project.features.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect(project)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
          >
            <span>상세 갤러리 보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onQuickConsult(project)}
            className="py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-amber-100 text-neutral-700 hover:text-amber-900 text-xs font-medium transition-colors"
            title="고객 상담 견적 메모"
          >
            상담 견적
          </button>
        </div>
      </div>
    </div>
  );
};
