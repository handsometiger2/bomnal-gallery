import React, { useState } from 'react';
import { ApartmentProject, PyeongRange } from '../types';
import { Sparkles, ArrowRight, Eye, SlidersHorizontal, Search } from 'lucide-react';

interface CartierCollectionGridProps {
  projects: ApartmentProject[];
  currentProjectId: string;
  onSelectProject: (p: ApartmentProject) => void;
  onOpenQuickConsult: (p: ApartmentProject) => void;
}

export const CartierCollectionGrid: React.FC<CartierCollectionGridProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  onOpenQuickConsult,
}) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedPyeong, setSelectedPyeong] = useState<PyeongRange>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = projects.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.complexName.toLowerCase().includes(q);
      const matchRef = (p.refCode || '').toLowerCase().includes(q);
      const matchStyle = p.style.toLowerCase().includes(q);
      const matchCol = (p.cartierCollection || '').toLowerCase().includes(q);
      if (!matchName && !matchRef && !matchStyle && !matchCol) return false;
    }

    if (selectedCollection !== 'all') {
      if (!p.cartierCollection?.includes(selectedCollection)) return false;
    }

    if (selectedPyeong === '20s' && (p.pyeong < 20 || p.pyeong >= 30)) return false;
    if (selectedPyeong === '30s' && (p.pyeong < 30 || p.pyeong >= 40)) return false;
    if (selectedPyeong === '40s_plus' && p.pyeong < 40) return false;

    return true;
  });

  return (
    <section id="cartier-collection-showcase" className="w-full bg-[#FAF8F5] py-16 border-b border-[#E8E4DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#7A0016]">
            DISCOVER OTHER CREATIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#141414] tracking-tight">
            까르띠에 메종 아키텍처 컬렉션
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6E6E] font-serif-luxury italic">
            "시계의 정밀함과 주거의 안락함이 만나는 곳, 엄선된 하이엔드 아파트 리모델링 마스터피스"
          </p>
        </div>

        {/* Minimalist Cartier Filter & Search Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8E4DF]">
          
          {/* Collection family tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedCollection('all')}
              className={`px-3.5 py-1.5 uppercase tracking-wider font-semibold transition-all whitespace-nowrap ${
                selectedCollection === 'all'
                  ? 'bg-[#141414] text-white'
                  : 'bg-white text-[#6E6E6E] hover:text-[#141414] border border-[#E8E4DF]'
              }`}
            >
              전체 컬렉션 ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCollection('산토스')}
              className={`px-3.5 py-1.5 uppercase tracking-wider font-semibold transition-all whitespace-nowrap ${
                selectedCollection === '산토스'
                  ? 'bg-[#7A0016] text-white'
                  : 'bg-white text-[#6E6E6E] hover:text-[#141414] border border-[#E8E4DF]'
              }`}
            >
              산토스 에디션 (모던 미니멀)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCollection('탱크')}
              className={`px-3.5 py-1.5 uppercase tracking-wider font-semibold transition-all whitespace-nowrap ${
                selectedCollection === '탱크'
                  ? 'bg-[#141414] text-white'
                  : 'bg-white text-[#6E6E6E] hover:text-[#141414] border border-[#E8E4DF]'
              }`}
            >
              탱크 에디션 (오크 우드)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCollection('파샤')}
              className={`px-3.5 py-1.5 uppercase tracking-wider font-semibold transition-all whitespace-nowrap ${
                selectedCollection === '파샤'
                  ? 'bg-[#141414] text-white'
                  : 'bg-white text-[#6E6E6E] hover:text-[#141414] border border-[#E8E4DF]'
              }`}
            >
              파샤 에디션 (호텔식 럭셔리)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCollection('팬더')}
              className={`px-3.5 py-1.5 uppercase tracking-wider font-semibold transition-all whitespace-nowrap ${
                selectedCollection === '팬더'
                  ? 'bg-[#141414] text-white'
                  : 'bg-white text-[#6E6E6E] hover:text-[#141414] border border-[#E8E4DF]'
              }`}
            >
              팬더 에디션 (미니멀 화이트)
            </button>
          </div>

          {/* Size filter & Search */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPyeong}
              onChange={(e) => setSelectedPyeong(e.target.value as PyeongRange)}
              aria-label="평형대 선택"
              className="bg-white border border-[#E8E4DF] text-xs px-3 py-1.5 text-[#141414] font-medium tracking-wider uppercase focus:outline-none focus:border-[#7A0016]"
            >
              <option value="all">전체 평형 (All Sizes)</option>
              <option value="20s">20평형대 (스몰)</option>
              <option value="30s">30평형대 (라지)</option>
              <option value="40s_plus">40평형 이상 (엑스트라 라지)</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="단지명, 레퍼런스 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-[#E8E4DF] text-xs px-3 py-1.5 pr-7 text-[#141414] placeholder-[#8C8275] focus:outline-none focus:border-[#7A0016] w-36 sm:w-48"
              />
              <Search className="w-3.5 h-3.5 text-[#6E6E6E] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Cartier Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => {
            const isCurrent = item.id === currentProjectId;
            return (
              <div
                key={item.id}
                className={`group bg-white border transition-all duration-300 flex flex-col ${
                  isCurrent
                    ? 'border-[#7A0016] shadow-md ring-1 ring-[#7A0016]'
                    : 'border-[#E8E4DF] hover:border-[#141414] hover:shadow-lg'
                }`}
              >
                {/* Reference & Model tag */}
                <div className="p-4 pb-2 flex items-center justify-between text-[10px] tracking-widest uppercase text-[#6E6E6E]">
                  <span className="font-mono font-semibold text-[#141414]">
                    REF. {item.refCode || 'CRWSSA0029'}
                  </span>
                  <span className="text-[#7A0016] font-bold">
                    {item.modelEdition || `${item.pyeong}평형`}
                  </span>
                </div>

                {/* Photo container */}
                <div
                  className="relative w-full h-64 bg-[#F5F4F0] overflow-hidden cursor-pointer"
                  onClick={() => {
                    onSelectProject(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={item.complexName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Subtle Cartier Hover Vignette */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-white/95 text-[#141414] text-xs font-bold uppercase tracking-[0.2em] shadow-md">
                      쇼케이스 감상하기
                    </span>
                  </div>

                  {isCurrent && (
                    <div className="absolute top-2 left-2 bg-[#7A0016] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
                      CURRENTLY VIEWING
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A0016] font-bold block">
                      {item.cartierCollection || 'SANTOS DE CARTIER'}
                    </span>
                    <h3 className="text-lg font-serif-luxury font-bold text-[#141414] tracking-tight group-hover:text-[#7A0016] transition-colors">
                      {item.complexName}
                    </h3>
                    <p className="text-xs text-[#6E6E6E] line-clamp-1">
                      {item.subTitle}
                    </p>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-3 border-t border-[#E8E4DF] flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#8C8275]">
                        시공 견적 (VAT 포함)
                      </div>
                      <div className="text-base font-serif-luxury font-bold text-[#141414]">
                        ₩ {(item.costMillionWon * 10000).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProject(item);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3 py-1.5 bg-[#141414] hover:bg-[#7A0016] text-white text-[11px] font-semibold uppercase tracking-wider transition-colors"
                      >
                        상세보기
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenQuickConsult(item)}
                        className="px-3 py-1.5 border border-[#E8E4DF] hover:border-[#141414] text-[#141414] text-[11px] font-medium transition-colors"
                      >
                        견적
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
