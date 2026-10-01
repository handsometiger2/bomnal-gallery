import React from 'react';
import { Maximize2, Building2 } from 'lucide-react';

interface PureCartierHeaderProps {
  activeTab?: 'showcase' | 'spaces';
  setActiveTab?: (tab: 'showcase' | 'spaces') => void;
  onOpenFullscreenPresentation: () => void;
}

export const PureCartierHeader: React.FC<PureCartierHeaderProps> = ({
  onOpenFullscreenPresentation,
}) => {
  return (
    <header className="bg-white border-b border-[#E8E4DF] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Cartier Logo */}
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-serif-luxury font-bold tracking-[0.25em] text-[#141414] leading-none">
              Cartier
            </span>
            <span className="text-neutral-300">|</span>
            <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A0016] font-semibold">
              GALLERY
            </span>
          </div>

          {/* Right: Fullscreen Presentation Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenFullscreenPresentation}
              className="px-4 py-2 bg-[#141414] hover:bg-[#7A0016] text-white text-xs font-semibold tracking-wider transition-colors flex items-center gap-2"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>대화면 전체 갤러리</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
