import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';

interface SiteLockScreenProps {
  /** Firestore에서 불러온 비밀번호 (null = 아직 로딩 중) */
  correctPassword: string | null;
  /** 비밀번호가 맞으면 호출 */
  onUnlock: () => void;
}

export const SiteLockScreen: React.FC<SiteLockScreenProps> = ({
  correctPassword,
  onUnlock,
}) => {
  const [input, setInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (correctPassword === null) return; // 아직 로딩 중
    if (input === correctPassword) {
      setErrorMsg(null);
      onUnlock();
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm text-center">
        {/* 로고 */}
        <div className="font-serif-luxury font-bold text-3xl tracking-[0.28em] uppercase text-white/95 mb-2">
          BOMNAL
        </div>
        <p className="text-xs text-white/40 tracking-widest mb-8 font-light">
          APARTMENT GALLERY
        </p>

        {/* 아이콘 */}
        <div className="w-14 h-14 rounded-full bg-[#7A0016]/20 border border-[#7A0016]/40 flex items-center justify-center mx-auto mb-5 text-[#E03B52]">
          <Lock className="w-6 h-6" />
        </div>

        <p className="text-sm text-white/60 font-light mb-6">
          이 갤러리는 비밀번호로 보호되어 있습니다.
        </p>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E6E6E]">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="비밀번호 입력"
              autoFocus
              autoComplete="off"
              className="w-full pl-9 pr-10 py-3 bg-[#161616] border border-[#333333] focus:border-[#7A0016] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none transition-colors text-center tracking-widest"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6E6E6E] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {errorMsg && (
            <p className="text-xs text-[#FF5A6E] font-medium animate-shake">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={correctPassword === null}
            className="w-full py-3 px-4 bg-[#7A0016] hover:bg-[#94001B] active:bg-[#5C0011] disabled:opacity-50 text-white font-medium text-sm rounded-lg tracking-[0.2em] transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            {correctPassword === null && <Loader2 className="w-4 h-4 animate-spin" />}
            {correctPassword === null ? '확인 중...' : '갤러리 입장'}
          </button>
        </form>

        <p className="text-[10px] text-white/25 mt-8 font-light">
          2026 © All rights reserved the Bomnal
        </p>
      </div>
    </div>
  );
};
