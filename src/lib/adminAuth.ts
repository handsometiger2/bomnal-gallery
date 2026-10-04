import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * 관리자 이메일/비밀번호 로그인
 */
export function signInAdmin(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

/**
 * 관리자 로그아웃
 */
export function signOutAdmin() {
  return signOut(auth);
}

/**
 * 로그인 상태 구독 (세션 유지 시 자동 로그인 상태 반영)
 */
export function subscribeAdminAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * 로그인한 관리자의 비밀번호 변경
 */
export async function changeAdminPassword(newPassword: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('로그인 상태가 아닙니다. 다시 로그인해주세요.');
  }
  await updatePassword(user, newPassword);
}

/**
 * Firebase Auth 에러 코드를 한국어 메시지로 변환
 */
export function authErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return '이메일 또는 비밀번호가 일치하지 않습니다.';
    case 'auth/invalid-email':
      return '이메일 형식이 올바르지 않습니다.';
    case 'auth/too-many-requests':
      return '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.';
    case 'auth/network-request-failed':
      return '네트워크 연결을 확인해주세요.';
    case 'auth/weak-password':
      return '비밀번호는 6자 이상이어야 합니다.';
    case 'auth/requires-recent-login':
      return '보안을 위해 다시 로그인한 후 변경해주세요.';
    default:
      return '인증 중 오류가 발생했습니다. 다시 시도해주세요.';
  }
}
