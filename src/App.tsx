/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_PORTFOLIOS } from './data/mockPortfolios';
import { ApartmentProject } from './types';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Lock
} from 'lucide-react';
import { AdminConsoleModal } from './components/AdminConsoleModal';
import { AdminPasswordModal, setStoredAdminPassword } from './components/AdminPasswordModal';
import { MainOverviewPage } from './components/MainOverviewPage';
import {
  loadApartmentsFromFirestore,
  subscribeApartmentsFromFirestore,
  subscribeAdminPasswordFromFirestore,
  saveApartmentToFirestore,
  BANNED_WOOD_HOUSE_PHOTO
} from './lib/firestoreService';

const STORAGE_KEY = 'bomnal_apartment_gallery_v2';
const LEGACY_STORAGE_KEY = 'bomnal_apartment_gallery';

export default function App() {
  // Navigation view mode: 'home' (메인페이지) | 'gallery' (전체화면 사진 뷰어)
  const [currentView, setCurrentView] = useState<'home' | 'gallery'>('gallery');

  const [projects, setProjects] = useState<ApartmentProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // 캐시된 데이터에 남아있는 목조 주택 사진 즉시 치환
          const cleaned = parsed.map((proj: ApartmentProject) => ({
            ...proj,
            thumbnailUrl: proj.thumbnailUrl?.includes('photo-1600585154340-be6161a56a0c')
              ? 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
              : proj.thumbnailUrl,
            roomPhotos: (proj.roomPhotos || []).map((r) => ({
              ...r,
              imageUrl: r.imageUrl?.includes('photo-1600585154340-be6161a56a0c')
                ? 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
                : r.imageUrl,
            })),
          }));
          return cleaned;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_PORTFOLIOS;
  });

  const [currentProjectIndex, setCurrentProjectIndex] = useState<number>(0);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [isAdminPasswordOpen, setIsAdminPasswordOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Zoom & Pan state for original aspect-ratio image inspection
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const logoClickCountRef = useRef<number>(0);
  const logoClickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset zoom & pan whenever the photo or project changes
  const resetZoom = useCallback(() => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
    currentOffsetRef.current = { x: 0, y: 0 };
  }, []);

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => {
      const next = Math.max(prev - 0.25, 0.5);
      if (next <= 1) {
        setPanOffset({ x: 0, y: 0 });
        currentOffsetRef.current = { x: 0, y: 0 };
      }
      return next;
    });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomScale((prev) => Math.min(prev + 0.15, 4));
    } else {
      setZoomScale((prev) => {
        const next = Math.max(prev - 0.15, 0.5);
        if (next <= 1) {
          setPanOffset({ x: 0, y: 0 });
          currentOffsetRef.current = { x: 0, y: 0 };
        }
        return next;
      });
    }
  };

  // Mouse Drag to Pan when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setPanOffset({ x: newX, y: newY });
    currentOffsetRef.current = { x: newX, y: newY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Real-time live synchronization with Cloud Firestore
  useEffect(() => {
    const unsubscribe = subscribeApartmentsFromFirestore(
      (cloudProjects) => {
        if (cloudProjects && cloudProjects.length > 0) {
          setProjects(cloudProjects);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProjects));
          } catch {
            // ignore
          }
        }
      },
      (err) => {
        console.warn('Real-time Firestore listener notice:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Admin password sync with Cloud Firestore
  useEffect(() => {
    const unsubPwd = subscribeAdminPasswordFromFirestore((cloudPassword) => {
      if (cloudPassword) {
        setStoredAdminPassword(cloudPassword);
      }
    });
    return () => unsubPwd();
  }, []);

  // Save projects to state & localStorage
  const handleUpdateProjects = (updated: ApartmentProject[]) => {
    setProjects(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    if (currentProjectIndex >= updated.length) {
      setCurrentProjectIndex(0);
      setPhotoIndex(0);
    }
  };

  const currentProject = projects[currentProjectIndex] || projects[0];

  // All photos for the currently selected apartment (empty/blank url filter)
  const rawPhotos = [
    ...(currentProject.thumbnailUrl
      ? [{ id: `${currentProject.id}-main`, url: currentProject.thumbnailUrl }]
      : []),
    ...(currentProject.roomPhotos || [])
      .filter((r) => Boolean(r && r.imageUrl && r.imageUrl.trim()))
      .map((r) => ({
        id: r.id,
        url: r.imageUrl,
      })),
  ];

  const allPhotos = rawPhotos;

  const currentPhoto = allPhotos[photoIndex] || allPhotos[0];
  const totalPhotos = allPhotos.length;

  const handlePrev = useCallback(() => {
    resetZoom();
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
  }, [totalPhotos, resetZoom]);

  const handleNext = useCallback(() => {
    resetZoom();
    setPhotoIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
  }, [totalPhotos, resetZoom]);

  // 특정 사진 직접 선택 (앞뒤로 넘기지 않고 즉시 점프)
  const handleSelectPhoto = useCallback((idx: number) => {
    resetZoom();
    setPhotoIndex(idx);
  }, [resetZoom]);

  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  // 활성 썸네일로 가로 스크롤 부드럽게 추종
  useEffect(() => {
    if (!thumbnailScrollRef.current) return;
    const activeEl = thumbnailScrollRef.current.children[photoIndex] as HTMLElement | undefined;
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [photoIndex]);

  // Robust Global Keydown Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 모달 내부의 input/textarea 등에서 타이핑 중일 때는 단축키 오동작 방지
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isTyping = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      // 1. ESC 키로 모달 닫기
      if (e.key === 'Escape' || e.code === 'Escape') {
        if (isAdminOpen) {
          setIsAdminOpen(false);
          return;
        }
        if (isAdminPasswordOpen) {
          setIsAdminPasswordOpen(false);
          return;
        }
      }

      // 2. 관리자 모달 토글 단축키 감지
      // code: 'KeyA'는 한글/영문 입력기 상태와 무관하게 키보드 A 버튼 물리 입력 감지
      const isKeyA =
        e.code === 'KeyA' ||
        e.key.toLowerCase() === 'a' ||
        e.key === 'ㅁ';

      const isModifierPressed = e.altKey || (e.ctrlKey && e.shiftKey) || (e.metaKey && e.shiftKey);

      if (isModifierPressed && isKeyA) {
        e.preventDefault();
        e.stopPropagation();
        setIsAdminPasswordOpen(true);
        return;
      }

      if (isTyping || isAdminOpen || isAdminPasswordOpen) return;

      // 3. 좌우 화살표 사진 넘김
      if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        resetZoom();
      }
    };

    // capture: true로 등록하여 iframe이나 다른 엘리먼트보다 최우선으로 단축키 캡처
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [handlePrev, handleNext, isAdminOpen]);

  // Reset photo index when switching apartment
  const handleSelectProject = (idx: number) => {
    resetZoom();
    setCurrentProjectIndex(idx);
    setPhotoIndex(0);
  };

  // 좌측 상단 'BOMNAL' 로고 클릭 시 메인페이지('home')로 즉시 이동
  const handleLogoClick = () => {
    resetZoom();
    setCurrentView('home');

    // 관리자 비밀번호 창 단축키용 (연속 3회 클릭 시 오픈)
    logoClickCountRef.current += 1;
    if (logoClickTimerRef.current) {
      clearTimeout(logoClickTimerRef.current);
    }
    if (logoClickCountRef.current >= 3) {
      logoClickCountRef.current = 0;
      setIsAdminPasswordOpen(true);
    } else {
      logoClickTimerRef.current = setTimeout(() => {
        logoClickCountRef.current = 0;
      }, 700);
    }
  };

  if (currentView === 'home') {
    return (
      <div className="w-screen min-h-screen bg-[#FDFBF7]">
        <MainOverviewPage
          projects={projects}
          onSelectProject={(idx) => {
            handleSelectProject(idx);
            setCurrentView('gallery');
          }}
          onOpenAdmin={() => setIsAdminPasswordOpen(true)}
        />

        {/* 관리자 비밀번호 입력 모달 */}
        <AdminPasswordModal
          isOpen={isAdminPasswordOpen}
          onClose={() => setIsAdminPasswordOpen(false)}
          onSuccess={() => {
            setIsAdminPasswordOpen(false);
            setIsAdminOpen(true);
          }}
        />

        {/* 관리자 콘솔 모달 */}
        {isAdminOpen && (
          <AdminConsoleModal
            projects={projects}
            onClose={() => setIsAdminOpen(false)}
            onUpdateProjects={handleUpdateProjects}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-[#0A0A0A] text-white flex flex-col overflow-hidden select-none font-sans">
      
      {/* 1. 사진 뷰어 영역 (사진의 원래 비율 object-contain 유지, 마우스 휠 및 드래그 확대/축소 가능) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden z-0 flex items-center justify-center cursor-default bg-black"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out select-none px-4 pt-16 pb-24 sm:px-12 sm:pt-20 sm:pb-28"
          style={{
            transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomScale})`,
            transformOrigin: 'center center',
          }}
        >
          {currentPhoto?.url ? (
            <img
              key={currentPhoto.url}
              src={currentPhoto.url}
              alt={currentProject.complexName || '인테리어 포트폴리오'}
              draggable={false}
              className="w-auto h-auto max-w-full max-h-full object-contain select-none pointer-events-none drop-shadow-2xl"
            />
          ) : (
            <div className="text-white/40 text-sm">등록된 사진이 없습니다.</div>
          )}
        </div>

        {/* 미세한 상하단 비네팅 (텍스트 가독성 확보) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* 2. 상단 헤더 (참고 이미지 스타일: 좌측 상단 상호, 우측 상단 아파트 목록) */}
      <header className="relative z-30 w-full h-16 sm:h-20 px-6 sm:px-12 flex items-center justify-between pointer-events-auto">
        
        {/* 좌측 상단: BOMNAL 로고 - 클릭 시 메인페이지 이동 */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer group select-none py-1 -ml-1 rounded"
          title="메인페이지로 이동"
        >
          <span className="font-serif-luxury font-bold text-lg sm:text-xl tracking-[0.28em] text-white/95 group-hover:text-white transition-colors uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
            BOMNAL
          </span>
        </div>

        {/* 우측 상단: 아파트 목록 (Collection, Materials 스타일의 슬릭한 미니멀 텍스트) */}
        <nav className="flex items-center gap-4 sm:gap-7 overflow-x-auto no-scrollbar py-2">
          {projects.map((p, idx) => {
            const isSelected = idx === currentProjectIndex;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectProject(idx)}
                className={`relative py-1 text-xs sm:text-[13px] tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap focus:outline-none ${
                  isSelected
                    ? 'text-white font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                    : 'text-white/60 hover:text-white font-light drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
                }`}
              >
                <span>{p.complexName}</span>
                {isSelected && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1/5 min-w-[12px] h-[2px] bg-[#990024] rounded-full shadow-[0_0_6px_rgba(153,0,36,0.6)]" />
                )}
              </button>
            );
          })}

          <div className="h-3 w-px bg-white/20 hidden sm:block ml-1" />

          {/* 사진 확대 / 축소 / 리셋 컨트롤 */}
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomScale <= 0.5}
              className="p-1 text-white/70 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
              title="축소 (휠 아래로)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="px-1 text-[10px] font-mono text-white/80 hover:text-white transition-colors cursor-pointer"
              title="배율 초기화 (100%)"
            >
              {Math.round(zoomScale * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomScale >= 4}
              className="p-1 text-white/70 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
              title="확대 (휠 위로)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomScale !== 1 && (
              <button
                type="button"
                onClick={resetZoom}
                className="p-1 text-[#E03B52] hover:text-white transition-colors cursor-pointer ml-0.5"
                title="원본 크기로 복원"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="h-3 w-px bg-white/20 hidden sm:block ml-0.5" />

          {/* 전체화면 토글 */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden sm:block p-1 text-white/60 hover:text-white transition-colors cursor-pointer"
            title={isFullscreen ? '전체화면 종료' : '전체화면 (F11)'}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </nav>

      </header>

      {/* 3. 중앙 및 본체 (화면 클릭 및 좌우 넘김 화살표) */}
      <main className="flex-1 relative w-full h-full flex items-center justify-between px-3 sm:px-8 z-10 pointer-events-none">
        
        {/* 좌측 넘김 화살표 */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="이전 사진"
          className="pointer-events-auto p-3 sm:p-5 bg-black/20 hover:bg-black/50 text-white/70 hover:text-white rounded-full backdrop-blur-xs transition-all active:scale-90 focus:outline-none drop-shadow-md border border-white/10"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5]" />
        </button>

        {/* 우측 넘김 화살표 */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="다음 사진"
          className="pointer-events-auto p-3 sm:p-5 bg-black/20 hover:bg-black/50 text-white/70 hover:text-white rounded-full backdrop-blur-xs transition-all active:scale-90 focus:outline-none drop-shadow-md border border-white/10"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5]" />
        </button>

      </main>

      {/* 4. 하단 영역: 사진 썸네일 스트립 바 & 하단 유틸리티 (원하는 사진을 클릭 한 번으로 즉시 선택) */}
      <footer className="relative z-30 w-full px-4 sm:px-10 pb-4 pt-2 flex flex-col gap-2 pointer-events-auto">
        
        {/* 하단 사진 썸네일 캐러셀 바 (스크롤 가능, 특정 사진 즉시 점프) */}
        {allPhotos.length > 1 && (
          <div className="w-full flex items-center justify-center">
            <div
              ref={thumbnailScrollRef}
              className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto max-w-full px-4 py-1.5 rounded-xl bg-black/55 backdrop-blur-md border border-white/10 shadow-2xl no-scrollbar select-none"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {allPhotos.map((photo, idx) => {
                const isActive = idx === photoIndex;
                return (
                  <button
                    key={photo.id || `thumb-${idx}`}
                    type="button"
                    onClick={() => handleSelectPhoto(idx)}
                    className={`relative shrink-0 rounded overflow-hidden transition-all duration-200 cursor-pointer group focus:outline-none ${
                      isActive
                        ? 'ring-2 ring-white scale-105 opacity-100 shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                        : 'opacity-40 hover:opacity-85 hover:scale-100 ring-1 ring-white/15'
                    } w-12 h-9 sm:w-16 sm:h-11`}
                    title={`${idx + 1}번째 사진 바로보기`}
                  >
                    <img
                      src={photo.url}
                      alt={`사진 ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* 사진 순서 번호 배지 */}
                    <span
                      className={`absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded text-[8px] font-mono leading-none ${
                        isActive ? 'bg-black/80 text-white font-bold' : 'bg-black/60 text-white/80'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 하단 바: 사진 카운터 / 중앙 NEXT / 저작권 및 관리자 메뉴 */}
        <div className="w-full flex items-center justify-between text-white/50 text-[10px] sm:text-[11px] tracking-wider px-2">
          
          {/* 좌측: 현재 사진 카운트 (예: 03 / 12) */}
          <div className="font-mono text-white/70 tracking-widest min-w-[70px]">
            <span className="text-white font-medium">{String(photoIndex + 1).padStart(2, '0')}</span>
            <span className="text-white/30 mx-1">/</span>
            <span>{String(totalPhotos).padStart(2, '0')}</span>
          </div>

          {/* 중앙: NEXT (클릭 시 다음 사진) */}
          <div
            onClick={handleNext}
            className="flex items-center gap-2 tracking-[0.35em] uppercase text-white/60 hover:text-white transition-all cursor-pointer group select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
          >
            <span className="font-light group-hover:tracking-[0.45em] transition-all">NEXT</span>
            <div className="w-3.5 h-px bg-white/40 group-hover:w-5 group-hover:bg-white transition-all" />
          </div>

          {/* 우측: 저작권 및 관리자 자물쇠 버튼 */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="font-light select-none hidden sm:inline drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              2026 © All rights reserved the Bomnal
            </span>

            <button
              type="button"
              onClick={() => setIsAdminPasswordOpen(true)}
              className="p-1.5 opacity-40 hover:opacity-100 transition-all cursor-pointer focus:outline-none hover:scale-110 active:scale-95 text-white/70 hover:text-white"
              title="관리자 설정"
              aria-label="관리자 설정"
            >
              <Lock className="w-3.5 h-3.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" />
            </button>
          </div>
        </div>

      </footer>

      {/* 관리자 비밀번호 입력 모달 */}
      <AdminPasswordModal
        isOpen={isAdminPasswordOpen}
        onClose={() => setIsAdminPasswordOpen(false)}
        onSuccess={() => {
          setIsAdminPasswordOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* 관리자 콘솔 모달 */}
      {isAdminOpen && (
        <AdminConsoleModal
          projects={projects}
          onClose={() => setIsAdminOpen(false)}
          onUpdateProjects={handleUpdateProjects}
        />
      )}

    </div>
  );
}
