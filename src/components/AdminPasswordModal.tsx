import React, { useState } from 'react';
import { Lock, X, Mail, KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signInAdmin, authErrorMessage } from '../lib/adminAuth';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setErrorMsg(null);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await signInAdmin(email, password);
      resetForm();
      onSuccess();
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      setErrorMsg(authErrorMessage(code));
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#161616] border border-[#2D2D2D] rounded-xl shadow-2xl p-6 text-white">

        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-4 right-4 p-1 text-[#8E877E] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 상단 아이콘 및 안내 */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#7A0016]/20 border border-[#7A0016]/40 flex items-center justify-center mb-3 text-[#E03B52]">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold tracking-wider text-white">
            관리자 로그인
          </h3>
          <p className="text-xs text-[#9E9890] mt-1 font-light tracking-wide">
            관리자 콘솔 접속을 위해 로그인해주세요.
          </p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E6E6E]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="관리자 이메일"
              autoFocus
              autoComplete="email"
              className="w-full pl-9 pr-3 py-2.5 bg-[#0D0D0D] border border-[#333333] focus:border-[#7A0016] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6E6E6E]">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="비밀번호"
              autoComplete="current-password"
              className="w-full pl-9 pr-10 py-2.5 bg-[#0D0D0D] border border-[#333333] focus:border-[#7A0016] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none transition-colors"
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
            <p className="text-xs text-[#FF5A6E] font-medium text-center animate-shake">
              {errorMsg}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#7A0016] hover:bg-[#94001B] active:bg-[#5C0011] disabled:opacity-60 text-white font-medium text-sm rounded-lg tracking-wider transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? '로그인 중...' : '로그인 및 접속'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
