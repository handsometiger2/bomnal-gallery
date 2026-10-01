import React, { useState } from 'react';
import { ApartmentProject, RoomType, RoomPhoto } from '../types';
import { PhotoLightbox } from './PhotoLightbox';
import { Maximize2, Building2, CheckCircle2 } from 'lucide-react';

interface SpaceGalleryViewProps {
  projects: ApartmentProject[];
  onSelectProject: (project: ApartmentProject) => void;
}

export const SpaceGalleryView: React.FC<SpaceGalleryViewProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<RoomType | 'all'>('all');
  const [lightboxData, setLightboxData] = useState<{
    photos: RoomPhoto[];
    index: number;
    complexName: string;
  } | null>(null);

  // Flatten all room photos with their parent project
  const allSpacePhotos = projects.flatMap((project) =>
    project.roomPhotos.map((photo) => ({
      photo,
      project,
    }))
  );

  const filteredPhotos = selectedRoom === 'all'
    ? allSpacePhotos
    : allSpacePhotos.filter((item) => item.photo.roomType === selectedRoom);

  const roomTabs: { type: RoomType | 'all'; label: string; count: number }[] = [
    { type: 'all', label: '전체 공간', count: allSpacePhotos.length },
    { type: 'living', label: '거실 (Living)', count: allSpacePhotos.filter(p => p.photo.roomType === 'living').length },
    { type: 'kitchen', label: '주방 (Kitchen)', count: allSpacePhotos.filter(p => p.photo.roomType === 'kitchen').length },
    { type: 'bathroom', label: '욕실 (Bathroom)', count: allSpacePhotos.filter(p => p.photo.roomType === 'bathroom').length },
    { type: 'bedroom', label: '침실 (Bedroom)', count: allSpacePhotos.filter(p => p.photo.roomType === 'bedroom').length },
    { type: 'entrance', label: '현관 (Entrance)', count: allSpacePhotos.filter(p => p.photo.roomType === 'entrance').length },
  ];

  return (
    <div id="space-gallery-view-container" className="space-y-6">
      {/* Intro & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-neutral-900">
            공간별 인테리어 모아보기
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            고객이 희망하는 특정 공간(주방, 거실, 욕실 등)의 리모델링 사례만 모아서 간편하게 비교 안내할 수 있습니다.
          </p>
        </div>

        {/* Room Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {roomTabs.map((tab) => (
            <button
              key={tab.type}
              type="button"
              onClick={() => setSelectedRoom(tab.type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRoom === tab.type
                  ? 'bg-neutral-900 text-white shadow'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
              }`}
            >
              {tab.label} <span className="text-[10px] opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPhotos.map((item, idx) => (
          <div
            key={`${item.project.id}-${item.photo.id}-${idx}`}
            className="group relative bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
          >
            {/* Image Box */}
            <div
              className="relative aspect-16/10 overflow-hidden bg-neutral-100 cursor-pointer"
              onClick={() => {
                const photosInCurrentContext = filteredPhotos.map((f) => f.photo);
                setLightboxData({
                  photos: photosInCurrentContext,
                  index: idx,
                  complexName: item.project.complexName,
                });
              }}
            >
              <img
                src={item.photo.imageUrl}
                alt={item.photo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />

              {/* Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-black/70 text-white backdrop-blur-md">
                  {item.photo.roomNameKo}
                </span>

                <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-white/90 text-neutral-800 backdrop-blur-md">
                  {item.project.pyeong}평형
                </span>
              </div>

              {/* Hover Zoom Icon */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-2.5 rounded-full bg-white/25 backdrop-blur-md text-white border border-white/30">
                  <Maximize2 className="w-5 h-5" />
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-medium text-neutral-700">{item.project.complexName}</span>
                </div>

                <h4 className="text-sm font-bold text-neutral-900 line-clamp-1 mb-1">
                  {item.photo.title}
                </h4>

                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {item.photo.description}
                </p>

                {/* Highlights Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {item.photo.highlights.slice(0, 2).map((h, hIdx) => (
                    <span
                      key={hIdx}
                      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Link to Full Project Modal */}
              <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">
                  REF. {item.project.refCode || 'CRWSSA0029'}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectProject(item.project)}
                  className="text-xs font-semibold text-neutral-800 hover:text-[#7A0016] transition-colors"
                >
                  해당 아파트 갤러리 보기 →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxData && (
        <PhotoLightbox
          photos={lightboxData.photos}
          initialIndex={lightboxData.index}
          complexName={lightboxData.complexName}
          onClose={() => setLightboxData(null)}
        />
      )}
    </div>
  );
};
