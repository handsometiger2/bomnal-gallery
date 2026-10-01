import React from 'react';
import { PyeongRange } from '../types';
import { Search, RotateCcw, Filter, Sparkles } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPyeong: PyeongRange;
  setSelectedPyeong: (p: PyeongRange) => void;
  selectedStyle: string;
  setSelectedStyle: (s: string) => void;
  selectedCostTier: 'all' | 'under50' | '50to70' | 'over70';
  setSelectedCostTier: (tier: 'all' | 'under50' | '50to70' | 'over70') => void;
  totalCount: number;
  filteredCount: number;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedPyeong,
  setSelectedPyeong,
  selectedStyle,
  setSelectedStyle,
  selectedCostTier,
  setSelectedCostTier,
  totalCount,
  filteredCount,
  onReset,
}) => {
  const pyeongOptions: { value: PyeongRange; label: string }[] = [
    { value: 'all', label: '평형 전체' },
    { value: '20s', label: '20평대 (59㎡)' },
    { value: '30s', label: '30평대 (84㎡)' },
    { value: '40s_plus', label: '40평대 이상' },
  ];

  const styleOptions: string[] = [
    '전체 스타일',
    '모던 미니멀',
    '내추럴 우드',
    '호텔식 럭셔리',
    '화이트&웜그레이',
  ];

  const costOptions: { value: 'all' | 'under50' | '50to70' | 'over70'; label: string }[] = [
    { value: 'all', label: '예산 전체' },
    { value: 'under50', label: '5천만원 미만' },
    { value: '50to70', label: '5천~7천만원' },
    { value: 'over70', label: '7천만원 이상' },
  ];

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedPyeong !== 'all' ||
    selectedStyle !== '전체 스타일' ||
    selectedCostTier !== 'all';

  return (
    <div id="filter-bar-container" className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Search & Reset Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="아파트 단지명, 지역, 키워드 검색 (예: 래미안, 대면형, 34평, 무몰딩)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 placeholder:text-neutral-400 bg-neutral-50/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Count & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-600">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <span>총 <strong className="text-neutral-950 font-bold">{filteredCount}</strong>건 매물 사례</span>
            {filteredCount !== totalCount && (
              <span className="text-neutral-400 text-[11px]">(전체 {totalCount}건)</span>
            )}
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>초기화</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs / Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-neutral-100">
        {/* Pyeong Filter */}
        <div>
          <label className="text-[11px] font-bold text-neutral-400 block mb-1.5 uppercase tracking-wider">
            평형대 구분
          </label>
          <div className="grid grid-cols-4 gap-1 bg-neutral-100 p-1 rounded-xl">
            {pyeongOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedPyeong(opt.value)}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-all truncate text-center ${
                  selectedPyeong === opt.value
                    ? 'bg-white text-neutral-950 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title={opt.label}
              >
                {opt.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Style Filter */}
        <div>
          <label className="text-[11px] font-bold text-neutral-400 block mb-1.5 uppercase tracking-wider">
            인테리어 스타일
          </label>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            {styleOptions.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Cost Budget Tier */}
        <div>
          <label className="text-[11px] font-bold text-neutral-400 block mb-1.5 uppercase tracking-wider">
            시공 예산 범위
          </label>
          <div className="grid grid-cols-4 gap-1 bg-neutral-100 p-1 rounded-xl">
            {costOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedCostTier(opt.value)}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-all truncate text-center ${
                  selectedCostTier === opt.value
                    ? 'bg-white text-neutral-950 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title={opt.label}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
