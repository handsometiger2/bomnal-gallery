import React, { useState, useEffect } from 'react';
import { Lock, X, KeyRound, Eye, EyeOff } from 'lucide-react';
import {
  saveAdminPasswordToFirestore,
  subscribeAdminPasswordFromFirestore
} from '../lib/firestoreService';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PASSWORD_KEY = 'bomnal_admin_password';
const DEFAULT_PASSWORD = '2656'; // 요청된 기본 비밀번호

export function getStoredAdminPassword(): string {
  try {
    const val = localStorage.getItem(ADMIN_PASSWORD_KEY);
    // 만약 이전의 'admin'이 남아있다면 즉시 '2656'으로 갱신
    if (!val || val === 'admin') {
      localStorage.setItem(ADMIN_PASSWORD_KEY, DEFAULT_PASSWORD);
      return DEFAULT_PASSWORD;
    }
    return val;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

export function setStoredAdminPassword(newPassword: string): void {
  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
  } catch {
    // fallback
  }
  // Cloud Firestore에도 즉시 동기화
  saveAdminPasswordToFirestore(newPassword).catch((err) => {
    console.warn('Failed to sync admin password to Firestore:', err);
  });
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentAdminPassword, setCurrentAdminPassword] = useState<string>(() => getStoredAdminPassword());

  // Firestore 클라우드에서 최신 비밀번호 실시간 구독
  useEffect(() => {
    const unsub = subscribeAdminPasswordFromFirestore((cloudPassword) => {
      if (cloudPassword && cloudPassword !== 'admin') {
        setCurrentAdminPassword(cloudPassword);
        try {
          localStorage.setItem(ADMIN_PASSWORD_KEY, cloudPassword);
        } catch {
          // ignore
        }
      } else if (cloudPassword === 'admin') {
        // 기존 admin은 2656으로 덮어쓰기
        setCurrentAdminPassword('2656');
        setStoredAdminPassword('2656');
      }
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = currentAdminPassword || getStoredAdminPassword();

    if (password.trim() === correctPassword) {
      setErrorMsg(null);
      setPassword('');
      onSuccess();
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#161616] border border-[#2D2D2D] rounded-xl shadow-2xl p-6 text-white">
        
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={() => {
            setErrorMsg(null);
            setPassword('');
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
            관리자 인증
          </h3>
          <p className="text-xs text-[#9E9890] mt-1 font-light tracking-wide">
            관리자 콘솔 접속을 위해 비밀번호를 입력해주세요.
          </p>
        </div>

        {/* 비밀번호 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="비밀번호 입력"
              autoFocus
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
              className="w-full py-2.5 px-4 bg-[#7A0016] hover:bg-[#94001B] active:bg-[#5C0011] text-white font-medium text-sm rounded-lg tracking-wider transition-colors cursor-pointer shadow-lg"
            >
              확인 및 접속
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
