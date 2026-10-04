import React, { useState, useEffect } from 'react';
import { ApartmentProject, RoomPhoto } from '../types';
import {
  X,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Upload,
  Cloud,
  CheckCircle2,
  Loader2,
  KeyRound,
  Check,
  Images,
  Wallpaper,
  LogOut
} from 'lucide-react';
import { INITIAL_PORTFOLIOS } from '../data/mockPortfolios';
import {
  saveApartmentToFirestore,
  deleteApartmentFromFirestore,
  syncAllApartmentsToFirestore,
  saveMainImageToFirestore,
  subscribeMainImageFromFirestore,
  saveSitePasswordToFirestore
} from '../lib/firestoreService';
import { changeAdminPassword, signOutAdmin, authErrorMessage } from '../lib/adminAuth';
import { compressImageFile } from '../utils/imageCompressor';

interface AdminConsoleModalProps {
  projects: ApartmentProject[];
  onClose: () => void;
  onUpdateProjects: (updated: ApartmentProject[]) => void;
  /** 콘솔을 열 때 갤러리에서 보고 있던 아파트를 미리 선택 */
  initialProjectId?: string;
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({
  projects,
  onClose,
  onUpdateProjects,
  initialProjectId,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    if (initialProjectId && projects.some((p) => p.id === initialProjectId)) {
      return initialProjectId;
    }
    return projects[0]?.id || '';
  });
  const [activeTab, setActiveTab] = useState<'edit' | 'add' | 'mainBg'>('edit');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Main Page Background Image state
  const [currentMainImageUrl, setCurrentMainImageUrl] = useState<string>('');
  const [isSavingMainImage, setIsSavingMainImage] = useState<boolean>(false);
  const [customMainUrlInput, setCustomMainUrlInput] = useState<string>('');

  useEffect(() => {
    const unsub = subscribeMainImageFromFirestore((cloudUrl) => {
      if (cloudUrl) {
        setCurrentMainImageUrl(cloudUrl);
      }
    });
    return () => unsub();
  }, []);

  // Firebase Auth 관리자 비밀번호 변경
  const [adminPwdInput, setAdminPwdInput] = useState<string>('');
  const [adminPwdSaved, setAdminPwdSaved] = useState<boolean>(false);
  const [adminPwdSaving, setAdminPwdSaving] = useState<boolean>(false);
  const [adminPwdError, setAdminPwdError] = useState<string | null>(null);

  // 사이트 공개 비밀번호 변경
  const [sitePwdInput, setSitePwdInput] = useState<string>('');
  const [sitePwdSaved, setSitePwdSaved] = useState<boolean>(false);
  const [sitePwdSaving, setSitePwdSaving] = useState<boolean>(false);

  // Currently editing project
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Edit form state
  const [complexName, setComplexName] = useState<string>(currentProject?.complexName || '');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(currentProject?.thumbnailUrl || '');
  const [roomPhotos, setRoomPhotos] = useState<RoomPhoto[]>(currentProject?.roomPhotos || []);

  // Sync edit form when selected project changes
  const handleSelectProjectToEdit = (proj: ApartmentProject) => {
    setSelectedProjectId(proj.id);
    setActiveTab('edit');
    setComplexName(proj.complexName);
    setThumbnailUrl(proj.thumbnailUrl);
    setRoomPhotos(proj.roomPhotos || []);
  };

  // 외부(Firestore)에서 projects가 실시간 갱신될 때 단지명/대표이미지만 최신화 (사진 목록은 현재 편집 상태 존중)
  useEffect(() => {
    if (activeTab === 'edit') {
      const match = projects.find((p) => p.id === selectedProjectId);
      if (match) {
        if (!complexName) setComplexName(match.complexName);
      }
    }
  }, [projects, selectedProjectId, activeTab]);

  // New Apartment state - 완전히 빈(blank) 상태로 초기화 (평형/주소 입력 필드 제거)
  const [newName, setNewName] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('');
  const [newRoomPhotos, setNewRoomPhotos] = useState<{ name: string; url: string }[]>([]);

  // 신규 아파트 폼 초기화 함수
  const resetNewProjectForm = () => {
    setNewName('');
    setNewThumbnail('');
    setNewRoomPhotos([]);
  };

  // '추가' 탭 전환 시 신규 폼을 완전히 깨끗한 블랭크 상태로 리셋
  const handleSwitchToAddTab = () => {
    resetNewProjectForm();
    setActiveTab('add');
  };

  // 아파트 삭제 확인용 상태 (iframe 내 window.confirm 차단 문제 해결)
  const [projectToDelete, setProjectToDelete] = useState<ApartmentProject | null>(null);

  // 전체 삭제 확인 팝업 대체 (브라우저 iframe confirm 차단 이슈 해결을 위한 인라인 확인 상태)
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  // 편집 중인 아파트의 모든 추가 사진 일괄 삭제
  const handleClearAllRoomPhotos = async () => {
    if (roomPhotos.length === 0) return;
    setShowClearConfirm(false);

    // 1. 화면의 사진 목록 즉각 삭제 (동기식)
    setRoomPhotos([]);

    // 2. 전체 projects 상태 즉시 업데이트
    const target: ApartmentProject = {
      ...currentProject,
      complexName,
      thumbnailUrl,
      roomPhotos: [],
    };

    const updated = projects.map((p) => (p.id === selectedProjectId ? target : p));
    onUpdateProjects(updated);

    // 3. 클라우드 Firestore에 즉시 영구 삭제 동기화
    setIsSaving(true);
    setSaveMessage('사진을 클라우드에서 삭제 중입니다...');

    try {
      await saveApartmentToFirestore(target);
      setSaveMessage('✓ 추가 사진이 모두 삭제되었습니다.');
    } catch (err: unknown) {
      console.error('Failed to clear photos from Firestore:', err);
      setSaveMessage('로컬에서 삭제되었습니다.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // 신규 아파트 등록 시 추가 사진 일괄 삭제
  const handleClearAllNewRoomPhotos = () => {
    if (newRoomPhotos.length === 0) return;
    setNewRoomPhotos([]);
  };

  // Save changes to current project (Both State & Cloud Firestore)
  const handleSaveEdit = async () => {
    if (!complexName.trim()) return;
    setIsSaving(true);
    setSaveMessage(null);

    const target = {
      ...currentProject,
      complexName,
      thumbnailUrl,
      roomPhotos,
    };

    const updated = projects.map((p) => (p.id === selectedProjectId ? target : p));
    onUpdateProjects(updated);

    try {
      await saveApartmentToFirestore(target);
      setSaveMessage('✓ 클라우드 DB에 실시간 저장 완료! (모든 기기에 즉시 동기화)');
    } catch (err: unknown) {
      console.error('Firestore save failed:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('Quota limit exceeded') || errMsg.includes('quota metric')) {
        setSaveMessage('✓ 로컬 브라우저에 즉시 저장되었습니다. (클라우드 일일 무료 사용량 초과로 쿼터 리셋 후 동기화됩니다)');
      } else {
        setSaveMessage(`클라우드 전송 실패: ${errMsg}`);
      }
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  // Delete project (Both State & Cloud Firestore)
  const executeDeleteProject = async (targetProj: ApartmentProject) => {
    if (projects.length <= 1) {
      alert('최소 1개 이상의 아파트가 유지되어야 합니다.');
      setProjectToDelete(null);
      return;
    }

    setIsSaving(true);
    const id = targetProj.id;
    const updated = projects.filter((p) => p.id !== id);
    onUpdateProjects(updated);
    
    // 삭제 후 다른 프로젝트 선택 및 편집 폼 갱신
    if (selectedProjectId === id) {
      const nextSelected = updated[0];
      setSelectedProjectId(nextSelected.id);
      setComplexName(nextSelected.complexName);
      setThumbnailUrl(nextSelected.thumbnailUrl);
      setRoomPhotos(nextSelected.roomPhotos || []);
    }
    setProjectToDelete(null);

    try {
      await deleteApartmentFromFirestore(id);
      setSaveMessage(`'${targetProj.complexName}' 삭제가 완료되었습니다.`);
    } catch (err: unknown) {
      console.error('Firestore delete failed:', err);
      setSaveMessage(`삭제 완료 (로컬 반영 완료)`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  // Add new photo to currently editing project
  const handleAddPhotoToCurrent = () => {
    const newP: RoomPhoto = {
      id: `photo-${Date.now()}`,
      roomType: 'living',
      roomNameKo: '',
      title: `${complexName} 사진`,
      description: '',
      imageUrl: '',
      highlights: [],
    };
    setRoomPhotos([...roomPhotos, newP]);
  };

  // Remove photo from current project
  const handleRemovePhoto = (photoId: string) => {
    setRoomPhotos(roomPhotos.filter((p) => p.id !== photoId));
  };

  // Update specific photo url or name
  const handleUpdatePhoto = (photoId: string, field: 'name' | 'url', val: string) => {
    setRoomPhotos(
      roomPhotos.map((p) => {
        if (p.id === photoId) {
          return field === 'name' ? { ...p, roomNameKo: val, title: val } : { ...p, imageUrl: val };
        }
        return p;
      })
    );
  };

  // Handle image upload from computer (single thumbnail)
  const handleFileUploadForThumbnail = async (e: React.ChangeEvent<HTMLInputElement>, isNew = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await compressImageFile(file, true);
      if (isNew) setNewThumbnail(result);
      else setThumbnailUrl(result);
    } catch (err) {
      console.error('Error compressing thumbnail:', err);
      alert('대표 사진 처리 중 오류가 발생했습니다.');
    }
    e.target.value = '';
  };

  const handleFileUploadForPhoto = async (e: React.ChangeEvent<HTMLInputElement>, photoId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await compressImageFile(file, false);
      handleUpdatePhoto(photoId, 'url', result);
    } catch (err) {
      console.error('Error compressing photo:', err);
      alert('사진 처리 중 오류가 발생했습니다.');
    }
    e.target.value = '';
  };

  // Handle multiple files upload at once for current editing project
  const [isBulkUploading, setIsBulkUploading] = useState<boolean>(false);
  const handleBulkPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsBulkUploading(true);
    const newAddedPhotos: RoomPhoto[] = [];
    const baseTime = Date.now();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressedUrl = await compressImageFile(file, false);
        newAddedPhotos.push({
          id: `photo-${baseTime}-${i}`,
          roomType: 'living',
          roomNameKo: '', // 파일명을 넣지 않고 빈 상태로 생성
          title: `${complexName} 사진`,
          description: '',
          imageUrl: compressedUrl,
          highlights: [],
        });
      } catch (err) {
        console.error('Error reading file:', file.name, err);
      }
    }

    if (newAddedPhotos.length > 0) {
      setRoomPhotos((prev) => [...prev, ...newAddedPhotos]);
      setSaveMessage(`${newAddedPhotos.length}장의 사진이 최적화되어 추가되었습니다. [저장]을 눌러 클라우드에 반영하세요.`);
      setTimeout(() => setSaveMessage(null), 4000);
    }
    setIsBulkUploading(false);
    e.target.value = '';
  };

  // Handle multiple files upload for new project registration
  const handleBulkPhotosUploadForNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsBulkUploading(true);
    const newItems: { name: string; url: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressedUrl = await compressImageFile(file, false);
        newItems.push({
          name: '', // 파일명을 넣지 않고 빈 상태로 생성
          url: compressedUrl,
        });
      } catch (err) {
        console.error('Error reading file:', file.name, err);
      }
    }

    if (newItems.length > 0) {
      setNewRoomPhotos((prev) => [...prev, ...newItems]);
      setSaveMessage(`${newItems.length}장의 사진이 최적화되어 신규 아파트에 추가되었습니다.`);
      setTimeout(() => setSaveMessage(null), 4000);
    }
    setIsBulkUploading(false);
    e.target.value = '';
  };

  // Reset to initial mock data (and sync to Cloud)
  const handleResetDefaults = async () => {
    if (confirm('모든 데이터를 초기 기본 아파트 목록으로 초기화하고 클라우드에 동기화하시겠습니까?')) {
      setIsSaving(true);
      onUpdateProjects(INITIAL_PORTFOLIOS);
      setSelectedProjectId(INITIAL_PORTFOLIOS[0].id);
      try {
        await syncAllApartmentsToFirestore(INITIAL_PORTFOLIOS);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
        onClose();
      }
    }
  };

  // Main background image handlers
  const handleUploadMainBackground = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSavingMainImage(true);
    try {
      const compressedUrl = await compressImageFile(file, 'hero');
      setCurrentMainImageUrl(compressedUrl);
      await saveMainImageToFirestore(compressedUrl);
      setSaveMessage('✓ 초고화질 메인 배경화면이 클라우드에 실시간 저장되었습니다!');
    } catch (err) {
      console.error('Failed to upload main image:', err);
      alert('메인 배경 이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSavingMainImage(false);
      setTimeout(() => setSaveMessage(null), 4000);
      e.target.value = '';
    }
  };

  const handleApplyCustomMainUrl = async () => {
    if (!customMainUrlInput.trim()) return;
    setIsSavingMainImage(true);
    try {
      const url = customMainUrlInput.trim();
      setCurrentMainImageUrl(url);
      await saveMainImageToFirestore(url);
      setSaveMessage('✓ 메인 배경화면이 성공적으로 적용되었습니다!');
      setCustomMainUrlInput('');
    } catch (err) {
      console.error('Failed to set main image:', err);
      alert('메인 배경 이미지 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSavingMainImage(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  const handleResetMainBackground = async () => {
    if (confirm('메인 배경화면을 기본 이미지로 복원하시겠습니까?')) {
      setIsSavingMainImage(true);
      try {
        const defaultUrl = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=85';
        setCurrentMainImageUrl(defaultUrl);
        await saveMainImageToFirestore(defaultUrl);
        setSaveMessage('✓ 기본 배경화면으로 복원되었습니다.');
      } catch (err) {
        console.error(err);
      } finally {
        setIsSavingMainImage(false);
        setTimeout(() => setSaveMessage(null), 4000);
      }
    }
  };

  // Create new apartment (Both State & Cloud Firestore) - 평형, 주소 입력 없이 단지명과 사진으로만 등록
  const handleCreateNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('아파트 명칭을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    const finalThumb = newThumbnail.trim() || (newRoomPhotos[0]?.url) || '';

    const newProject: ApartmentProject = {
      id: `bomnal-${Date.now()}`,
      complexName: newName,
      subTitle: `${newName} 인테리어 포트폴리오`,
      address: '',
      pyeong: 0,
      squareMeters: 0,
      style: '모던 미니멀',
      costMillionWon: 0,
      durationWeeks: 4,
      completionDate: '2026',
      thumbnailUrl: finalThumb,
      beforeAfter: {
        title: `${newName} 시공 전·후`,
        roomType: 'living',
        beforeImageUrl: finalThumb,
        beforeDescription: '시공 전',
        afterImageUrl: finalThumb,
        afterDescription: '시공 후',
      },
      roomPhotos: newRoomPhotos.map((item, idx) => ({
        id: `rm-${Date.now()}-${idx}`,
        roomType: 'living',
        roomNameKo: item.name,
        title: `${newName} ${item.name}`,
        description: '',
        imageUrl: item.url,
        highlights: [],
      })),
      features: ['무몰딩', '포세린 타일', '대면형 주방'],
      materials: {
        floor: '원목 마루',
        wall: '도장 마감',
        lighting: '라인 조명',
        kitchen: '대면형 아일랜드',
        bathroom: '졸리컷 포세린 타일',
      },
      agentNote: '',
    };

    const updated = [...projects, newProject];
    onUpdateProjects(updated);
    setSelectedProjectId(newProject.id);
    setActiveTab('edit');
    handleSelectProjectToEdit(newProject);

    try {
      await saveApartmentToFirestore(newProject);
      setSaveMessage('✓ 새 아파트 및 사진이 클라우드 DB에 안전하게 등록되었습니다.');
    } catch (err: unknown) {
      console.error('Firestore save failed:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      alert(`클라우드 등록 실패: ${errMsg}\n(사진 용량 또는 네트워크 연결을 확인해주세요)`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 select-none font-sans">
      <div className="bg-white text-[#141414] w-full max-w-5xl h-[90vh] rounded-lg shadow-2xl border border-[#E8E4DF] flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="h-16 px-6 border-b border-[#E8E4DF] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-serif-luxury font-bold text-2xl tracking-[0.15em] text-[#141414]">
              Bomnal
            </span>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#7A0016]">
                ADMIN CONSOLE
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Cloud className="w-3 h-3 text-emerald-600" />
                <span>클라우드 동기화 활성</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveMessage && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{saveMessage}</span>
              </span>
            )}
            <button
              type="button"
              disabled={isSaving}
              onClick={handleResetDefaults}
              className="text-xs text-[#8C8275] hover:text-[#7A0016] flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E4DF] hover:border-[#7A0016] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>초기화</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-[#141414] hover:bg-[#7A0016] text-white text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="관리자 모드 닫기 및 갤러리로 돌아가기"
            >
              <X className="w-4 h-4" />
              <span>관리자 닫기</span>
            </button>
          </div>
        </div>

        {/* Modal Body: Left Project List / Right Editor */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Sidebar: Apartment Projects List */}
          <div className="w-full md:w-64 border-r border-[#E8E4DF] bg-[#FBFBFB] flex flex-col shrink-0">
            <div className="p-3 border-b border-[#E8E4DF] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6E6E6E]">
                아파트 목록 ({projects.length})
              </span>
              <button
                type="button"
                onClick={handleSwitchToAddTab}
                className={`text-xs px-2.5 py-1 flex items-center gap-1 font-semibold transition-colors ${
                  activeTab === 'add'
                    ? 'bg-[#7A0016] text-white'
                    : 'bg-[#141414] text-white hover:bg-[#7A0016]'
                }`}
              >
                <Plus className="w-3 h-3" />
                <span>추가</span>
              </button>
            </div>

            {/* 메인 페이지 배경화면 관리 바로가기 버튼 */}
            <div className="p-2 border-b border-[#E8E4DF] bg-white">
              <button
                type="button"
                onClick={() => setActiveTab('mainBg')}
                className={`w-full text-xs px-3 py-2 flex items-center justify-between rounded font-semibold transition-all border cursor-pointer ${
                  activeTab === 'mainBg'
                    ? 'bg-[#7A0016] text-white border-[#7A0016] shadow-xs'
                    : 'bg-neutral-50 text-[#141414] border-[#E8E4DF] hover:bg-neutral-100 hover:border-[#8C8275]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Wallpaper className={`w-3.5 h-3.5 ${activeTab === 'mainBg' ? 'text-white' : 'text-[#7A0016]'}`} />
                  <span>메인 배경화면 설정</span>
                </div>
                <span className="text-[10px] opacity-75">설정 &gt;</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {projects.map((p) => {
                const isSelected = p.id === selectedProjectId && activeTab === 'edit';
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProjectToEdit(p)}
                    className={`p-2.5 rounded cursor-pointer transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-white border-[#141414] shadow-xs'
                        : 'border-transparent hover:bg-white hover:border-[#E8E4DF]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-serif-luxury font-bold text-sm text-[#141414] truncate">
                        {p.complexName}
                      </div>
                      <div className="text-[11px] text-[#8C8275]">
                        사진 {1 + (p.roomPhotos?.length || 0)}장
                      </div>
                    </div>
                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(p);
                        }}
                        className="p-1 hover:text-red-600 text-neutral-400"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 관리자 비밀번호 변경 (Firebase Auth) */}
            <div className="p-3 border-t border-[#E8E4DF] bg-white space-y-3">
              <div>
                <div className="text-[11px] font-bold text-[#141414] mb-1.5 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#7A0016]" />
                  <span>관리자 비밀번호 변경</span>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="password"
                    value={adminPwdInput}
                    onChange={(e) => {
                      setAdminPwdInput(e.target.value);
                      setAdminPwdSaved(false);
                      setAdminPwdError(null);
                    }}
                    placeholder="새 비밀번호 입력 (6자 이상)"
                    className="w-full px-2 py-1 text-xs border border-[#E8E4DF] rounded outline-none focus:border-[#7A0016]"
                  />
                  <button
                    type="button"
                    disabled={adminPwdSaving}
                    onClick={async () => {
                      const trimmed = adminPwdInput.trim();
                      if (trimmed.length < 6) {
                        setAdminPwdError('비밀번호는 6자 이상이어야 합니다.');
                        return;
                      }
                      setAdminPwdSaving(true);
                      setAdminPwdSaved(false);
                      setAdminPwdError(null);
                      try {
                        await changeAdminPassword(trimmed);
                        setAdminPwdInput('');
                        setAdminPwdSaved(true);
                        setTimeout(() => setAdminPwdSaved(false), 3000);
                      } catch (err) {
                        console.error('Failed to change password:', err);
                        setAdminPwdError(authErrorMessage(err));
                      } finally {
                        setAdminPwdSaving(false);
                      }
                    }}
                    className="px-2.5 py-1 bg-[#141414] hover:bg-[#7A0016] text-white text-xs rounded transition-colors shrink-0 flex items-center gap-1 font-medium"
                  >
                    {adminPwdSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : adminPwdSaved ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      '변경'
                    )}
                  </button>
                </div>
                {adminPwdSaved && (
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                    ✓ 관리자 비밀번호가 변경되었습니다.
                  </p>
                )}
                {adminPwdError && (
                  <p className="text-[10px] text-red-600 font-semibold mt-1">
                    {adminPwdError}
                  </p>
                )}
              </div>

              {/* 사이트 공개 비밀번호 (갤러리 입장 잠금) */}
              <div>
                <div className="text-[11px] font-bold text-[#141414] mb-1.5 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#7A0016]" />
                  <span>사이트 공개 비밀번호</span>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={sitePwdInput}
                    onChange={(e) => {
                      setSitePwdInput(e.target.value);
                      setSitePwdSaved(false);
                    }}
                    placeholder="사이트 입장 비밀번호"
                    className="w-full px-2 py-1 text-xs border border-[#E8E4DF] rounded outline-none focus:border-[#7A0016]"
                  />
                  <button
                    type="button"
                    disabled={sitePwdSaving}
                    onClick={async () => {
                      const trimmed = sitePwdInput.trim();
                      if (!trimmed) {
                        alert('새 비밀번호를 입력해주세요.');
                        return;
                      }
                      setSitePwdSaving(true);
                      setSitePwdSaved(false);
                      try {
                        await saveSitePasswordToFirestore(trimmed);
                        setSitePwdSaved(true);
                        setTimeout(() => setSitePwdSaved(false), 3000);
                      } catch (err) {
                        console.error('Failed to save site password:', err);
                        alert('저장에 실패했습니다. 다시 시도해주세요.');
                      } finally {
                        setSitePwdSaving(false);
                      }
                    }}
                    className="px-2.5 py-1 bg-[#141414] hover:bg-[#7A0016] text-white text-xs rounded transition-colors shrink-0 flex items-center gap-1 font-medium"
                  >
                    {sitePwdSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : sitePwdSaved ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      '저장'
                    )}
                  </button>
                </div>
                {sitePwdSaved && (
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                    ✓ 사이트 공개 비밀번호가 저장되었습니다.
                  </p>
                )}
              </div>

              {/* 로그아웃 */}
              <button
                type="button"
                onClick={async () => {
                  if (confirm('관리자 로그아웃 하시겠습니까?')) {
                    await signOutAdmin();
                    onClose();
                  }
                }}
                className="w-full py-1.5 px-2 bg-[#F5F2EB] hover:bg-[#EAE4D9] text-[#7A0016] text-[11px] font-semibold rounded border border-[#D8D2C7] transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3 h-3" />
                <span>관리자 로그아웃</span>
              </button>

              {/* 기본 포트폴리오 데이터 전체 복원 버튼 */}
              <div className="pt-2 border-t border-[#F0ECE6]">
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm('모든 기본 아파트(e편한세상월배 등)와 고화질 시공 사진들을 원본 상태로 복원하시겠습니까?')) {
                      setIsSaving(true);
                      try {
                        await syncAllApartmentsToFirestore(INITIAL_PORTFOLIOS);
                        onUpdateProjects(INITIAL_PORTFOLIOS);
                        setSelectedProjectId(INITIAL_PORTFOLIOS[0].id);
                        handleSelectProjectToEdit(INITIAL_PORTFOLIOS[0]);
                        alert('기본 포트폴리오 및 시공 사진들이 완벽하게 복원되었습니다.');
                      } catch (e) {
                        console.error(e);
                        onUpdateProjects(INITIAL_PORTFOLIOS);
                        alert('로컬에 포트폴리오가 복원되었습니다.');
                      } finally {
                        setIsSaving(false);
                      }
                    }
                  }}
                  className="w-full py-1.5 px-2 bg-[#F5F2EB] hover:bg-[#EAE4D9] text-[#7A0016] hover:text-[#5A0010] text-[11px] font-semibold rounded border border-[#D8D2C7] transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>기본 포트폴리오 사진 전체 복원</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Editor Stage */}
          <div className="flex-1 bg-white overflow-y-auto p-6">
            
            {activeTab === 'edit' ? (
              /* Edit Existing Apartment */
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between border-b border-[#E8E4DF] pb-3">
                  <div>
                    <h3 className="font-serif-luxury text-xl font-bold text-[#141414]">
                      {complexName} 갤러리 편집
                    </h3>
                    <p className="text-xs text-[#8C8275]">
                      클라우드에 영구 보관되며 다른 기기에서도 동일하게 공유됩니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-[#141414] hover:bg-[#7A0016] text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{isSaving ? '클라우드 저장 중...' : '클라우드에 저장'}</span>
                  </button>
                </div>

                {saveMessage && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded font-medium flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-[#7A0016] shrink-0" />
                    <span>{saveMessage}</span>
                  </div>
                )}

                {/* Info Fields */}
                <div className="bg-[#FAF8F5] p-4 rounded border border-[#EFEAE2]">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#7A0016] mb-1.5 flex items-center justify-between">
                      <span>아파트 단지명 (이름 변경)</span>
                      <span className="text-[10px] font-normal text-[#8C8275]">상단 메뉴에 즉시 반영</span>
                    </label>
                    <input
                      type="text"
                      value={complexName}
                      placeholder="예: e편한세상월배, 월배아이파크..."
                      onChange={(e) => setComplexName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D8D2C7] focus:border-[#7A0016] focus:ring-1 focus:ring-[#7A0016] text-sm font-semibold text-[#141414] outline-none shadow-2xs transition-all"
                    />
                  </div>
                </div>

                {/* Main Thumbnail Photo */}
                <div className="border-t border-[#E8E4DF] pt-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6E6E] mb-2">
                    대표 사진 (첫 번째 사진)
                  </label>
                  <div className="flex gap-4 items-start">
                    <img
                      src={thumbnailUrl}
                      alt="대표"
                      className="w-32 h-20 object-cover border border-[#E8E4DF] shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        placeholder="이미지 URL을 입력하세요"
                        className="w-full px-3 py-1.5 border border-[#E8E4DF] text-xs outline-none"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F8] hover:bg-[#E8E4DF] border border-[#E8E4DF] text-xs cursor-pointer transition-colors">
                        <Upload className="w-3 h-3 text-[#7A0016]" />
                        <span>컴퓨터에서 사진 선택</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUploadForThumbnail(e, false)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Room Photos List */}
                <div className="border-t border-[#E8E4DF] pt-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#6E6E6E]">
                        공간별 추가 사진 목록 ({roomPhotos.length}장)
                      </label>
                      <p className="text-[11px] text-[#8C8275] mt-0.5">
                        컴퓨터에서 여러 장을 한 번에 선택하여 일괄 등록할 수 있습니다.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* 여러 장 일괄 업로드 버튼 */}
                      <label className="text-xs px-3 py-1.5 bg-[#7A0016] hover:bg-[#600011] text-white transition-colors flex items-center gap-1.5 font-semibold cursor-pointer rounded-xs shadow-xs">
                        {isBulkUploading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Images className="w-3.5 h-3.5" />
                        )}
                        <span>{isBulkUploading ? '사진 처리 중...' : '여러 장 한번에 올리기'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={isBulkUploading}
                          onChange={handleBulkPhotosUpload}
                          className="hidden"
                        />
                      </label>

                      {/* 단일 추가 버튼 */}
                      <button
                        type="button"
                        onClick={handleAddPhotoToCurrent}
                        className="text-xs px-2.5 py-1.5 border border-[#141414] hover:bg-[#141414] hover:text-white transition-colors flex items-center gap-1 font-semibold rounded-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>직접 추가</span>
                      </button>

                      {/* 사진 전체 삭제 버튼 */}
                      {roomPhotos.length > 0 && (
                        showClearConfirm ? (
                          <div className="flex items-center gap-1.5 animate-in fade-in">
                            <span className="text-[11px] text-red-600 font-medium">정말 모두 삭제할까요?</span>
                            <button
                              type="button"
                              onClick={handleClearAllRoomPhotos}
                              className="text-xs px-2.5 py-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors font-bold rounded-xs shadow-xs"
                            >
                              삭제 확인
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowClearConfirm(false)}
                              className="text-xs px-2 py-1.5 border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-colors rounded-xs"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowClearConfirm(true)}
                            className="text-xs px-2.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 font-semibold rounded-xs cursor-pointer"
                            title="추가 사진 전체 일괄 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>전체 삭제</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {roomPhotos.map((photo, idx) => (
                      <div
                        key={photo.id}
                        className="p-3 border border-[#E8E4DF] bg-[#FDFDFD] flex items-center gap-3"
                      >
                        <span className="font-mono text-xs font-bold text-[#7A0016] w-6">
                          {String(idx + 2).padStart(2, '0')}
                        </span>
                        <img
                          src={photo.imageUrl}
                          alt={photo.roomNameKo}
                          className="w-16 h-12 object-cover border border-[#E8E4DF] shrink-0"
                        />
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={photo.roomNameKo}
                            onChange={(e) => handleUpdatePhoto(photo.id, 'name', e.target.value)}
                            placeholder="공간명 (예: 거실, 주방)"
                            className="px-2 py-1 border border-[#E8E4DF] text-xs outline-none"
                          />
                          <input
                            type="text"
                            value={photo.imageUrl}
                            onChange={(e) => handleUpdatePhoto(photo.id, 'url', e.target.value)}
                            placeholder="이미지 URL"
                            className="sm:col-span-2 px-2 py-1 border border-[#E8E4DF] text-xs outline-none"
                          />
                        </div>
                        <label className="p-2 border border-[#E8E4DF] hover:bg-neutral-100 cursor-pointer" title="사진 파일 교체">
                          <Upload className="w-3.5 h-3.5 text-[#6E6E6E]" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUploadForPhoto(e, photo.id)}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Form Bottom Actions */}
                <div className="pt-6 border-t border-[#E8E4DF] flex items-center justify-between">
                  <span className="text-xs text-[#8C8275]">
                    변경사항을 저장하거나 관리자 모드를 종료할 수 있습니다.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-[#E8E4DF] hover:bg-neutral-100 text-xs font-semibold text-[#6E6E6E] transition-colors rounded-xs"
                    >
                      관리자 종료
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleSaveEdit}
                      className="px-5 py-2 bg-[#7A0016] hover:bg-[#600011] text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors rounded-xs shadow-xs disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>{isSaving ? '클라우드 저장 중...' : '클라우드에 저장'}</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : activeTab === 'add' ? (
              /* Add New Apartment Form */
              <form onSubmit={handleCreateNewProject} className="max-w-2xl mx-auto space-y-6">
                <div className="border-b border-[#E8E4DF] pb-3">
                  <h3 className="font-serif-luxury text-xl font-bold text-[#141414]">
                    새 아파트 갤러리 등록
                  </h3>
                  <p className="text-xs text-[#8C8275]">
                    신규 아파트와 사진을 클라우드 영구 저장소에 등록합니다.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7A0016] mb-1.5 flex items-center justify-between">
                    <span>아파트 단지명 *</span>
                    <span className="text-[10px] font-normal text-[#8C8275]">상단 갤러리 탭에 표시될 이름</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: e편한세상월배, 월배아이파크..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D8D2C7] focus:border-[#7A0016] focus:ring-1 focus:ring-[#7A0016] text-sm font-semibold text-[#141414] outline-none shadow-2xs transition-all"
                  />
                </div>

                {/* Main photo */}
                <div className="border-t border-[#E8E4DF] pt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6E6E] mb-2">
                    대표 사진
                  </label>
                  <div className="flex gap-4 items-start">
                    {newThumbnail ? (
                      <img
                        src={newThumbnail}
                        alt="대표"
                        className="w-32 h-20 object-cover border border-[#E8E4DF] shrink-0"
                      />
                    ) : (
                      <div className="w-32 h-20 bg-neutral-100 border border-dashed border-[#D8D2C7] flex flex-col items-center justify-center text-neutral-400 shrink-0">
                        <Upload className="w-4 h-4 mb-1" />
                        <span className="text-[10px]">사진 없음</span>
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="대표 이미지 URL (또는 아래 파일 선택)"
                        value={newThumbnail}
                        onChange={(e) => setNewThumbnail(e.target.value)}
                        className="w-full px-3 py-1.5 border border-[#E8E4DF] text-xs outline-none"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F9F8] hover:bg-[#E8E4DF] border border-[#E8E4DF] text-xs cursor-pointer transition-colors">
                        <Upload className="w-3 h-3 text-[#7A0016]" />
                        <span>컴퓨터에서 사진 선택</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUploadForThumbnail(e, true)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Additional Room Photos for New Apartment */}
                <div className="border-t border-[#E8E4DF] pt-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#6E6E6E]">
                        공간별 추가 사진 ({newRoomPhotos.length}장)
                      </label>
                      <p className="text-[11px] text-[#8C8275] mt-0.5">
                        여러 장의 사진을 선택하면 한 번에 갤러리에 추가됩니다.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs px-3 py-1.5 bg-[#7A0016] hover:bg-[#600011] text-white transition-colors flex items-center gap-1.5 font-semibold cursor-pointer rounded-xs shadow-xs">
                        {isBulkUploading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Images className="w-3.5 h-3.5" />
                        )}
                        <span>{isBulkUploading ? '사진 처리 중...' : '여러 장 한번에 올리기'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={isBulkUploading}
                          onChange={handleBulkPhotosUploadForNew}
                          className="hidden"
                        />
                      </label>

                      {newRoomPhotos.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAllNewRoomPhotos}
                          className="text-xs px-2.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 font-semibold rounded-xs"
                          title="신규 등록 사진 전체 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>전체 삭제</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-[#FBFBFB] border border-[#E8E4DF]">
                    {newRoomPhotos.map((item, idx) => (
                      <div key={idx} className="relative group border border-[#E8E4DF] bg-white p-1">
                        <img src={item.url} alt="" className="w-full h-20 object-cover" />
                        <div className="mt-1">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...newRoomPhotos];
                              updated[idx].name = e.target.value;
                              setNewRoomPhotos(updated);
                            }}
                            className="w-full text-[11px] px-1 py-0.5 border border-[#E8E4DF]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setNewRoomPhotos(newRoomPhotos.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full opacity-80 hover:opacity-100"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className="px-4 py-2 border border-[#E8E4DF] text-xs text-[#6E6E6E] hover:bg-neutral-100"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#7A0016] text-white text-xs font-semibold tracking-wider hover:bg-[#600011] transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                    <span>{isSaving ? '클라우드 등록 중...' : '클라우드에 등록 완료'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Main Page Background Management */
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="border-b border-[#E8E4DF] pb-3">
                  <div className="flex items-center gap-2">
                    <Wallpaper className="w-5 h-5 text-[#7A0016]" />
                    <h3 className="font-serif-luxury text-xl font-bold text-[#141414]">
                      메인 페이지 배경화면 설정
                    </h3>
                  </div>
                  <p className="text-xs text-[#8C8275] mt-1">
                    웹사이트 첫 화면(메인 홈) 전체화면에 나타나는 대표 배경 이미지를 설정합니다.
                  </p>
                </div>

                {/* 현재 배경화면 미리보기 */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#141414]">
                    현재 메인 배경화면 미리보기
                  </label>
                  <div className="relative w-full h-72 sm:h-80 bg-neutral-900 rounded border border-[#E8E4DF] overflow-hidden flex items-center justify-center group shadow-inner">
                    <img
                      src={currentMainImageUrl || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=85'}
                      alt="현재 메인 배경"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <span className="font-serif-luxury font-bold text-lg tracking-[0.2em] text-white/90 uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        BOMNAL
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex items-center justify-between">
                      <span className="text-white/80 text-xs font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        실제 메인 화면 적용 예시
                      </span>
                      <span className="bg-black/60 backdrop-blur-xs text-white/90 text-[11px] px-2 py-0.5 rounded border border-white/20">
                        {currentMainImageUrl ? '커스텀 배경 적용 중' : '기본 이미지 적용 중'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 사진 업로드 버튼 */}
                <div className="bg-[#FAF9F5] p-5 rounded-lg border border-[#E8E4DF] space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#141414] mb-1">
                      새로운 배경 이미지 업로드
                    </h4>
                    <p className="text-xs text-[#8C8275] mb-2">
                      컴퓨터에 보관된 사진을 선택하면 최대 2560px(QHD/FHD) 초고화질로 자동 최적화되어 클라우드에 영구 저장됩니다.
                    </p>
                    <div className="bg-white p-3 rounded border border-[#E8E4DF] text-[11px] text-[#4A4A4A] space-y-1">
                      <div className="font-semibold text-[#7A0016] flex items-center gap-1">
                        <span>💡 가장 선명하게 보이는 최적 규격 안내:</span>
                      </div>
                      <div>• <strong>권장 해상도:</strong> 가로 <strong>1920 × 1080 px</strong> (Full HD) ~ <strong>2560 × 1440 px</strong> (QHD)</div>
                      <div>• <strong>화면 비율:</strong> <strong>16:9</strong> (가로형 와이드 비율)</div>
                      <div>• <strong>참고:</strong> 가로가 1920px 미만인 작은 이미지를 전체화면에 띄우면 화면에 맞게 2~3배 확대되어 흐릿해질 수 있습니다.</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className={`px-5 py-3 bg-[#7A0016] hover:bg-[#5C0011] text-white text-xs font-semibold tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer shadow-xs ${isSavingMainImage ? 'opacity-50 pointer-events-none' : ''}`}>
                      {isSavingMainImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>{isSavingMainImage ? '클라우드 저장 중...' : '컴퓨터에서 사진 선택 및 메인 배경으로 적용'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isSavingMainImage}
                        onChange={handleUploadMainBackground}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      disabled={isSavingMainImage}
                      onClick={handleResetMainBackground}
                      className="px-3.5 py-3 border border-[#D8D2C7] bg-white hover:bg-neutral-50 text-xs text-[#8C8275] hover:text-[#141414] font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>기본 이미지로 복원</span>
                    </button>
                  </div>
                </div>

                {/* 또는 직접 이미지 URL 입력 */}
                <div className="p-4 border border-[#E8E4DF] rounded bg-white space-y-2">
                  <label className="block text-xs font-bold text-[#6E6E6E]">
                    또는 이미지 웹 주소(URL) 직접 입력
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... 또는 웹 이미지 주소"
                      value={customMainUrlInput}
                      onChange={(e) => setCustomMainUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-[#D8D2C7] rounded focus:border-[#7A0016] outline-none"
                    />
                    <button
                      type="button"
                      disabled={isSavingMainImage || !customMainUrlInput.trim()}
                      onClick={handleApplyCustomMainUrl}
                      className="px-4 py-2 bg-[#141414] hover:bg-[#7A0016] text-white text-xs font-semibold rounded transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      적용
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8E4DF] flex items-center justify-between">
                  <span className="text-xs text-[#8C8275]">
                    적용된 메인 배경화면은 모든 방문자에게 실시간으로 표시됩니다.
                  </span>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-neutral-900 text-white hover:bg-[#7A0016] text-xs font-semibold rounded transition-colors cursor-pointer"
                  >
                    관리자 닫고 메인화면 보기
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* 아파트 삭제 확인 커스텀 모달 (iframe confirm 차단 대응) */}
        {projectToDelete && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-2xl border border-[#E8E4DF] animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2.5 text-red-600 mb-2">
                <Trash2 className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-base text-[#141414]">아파트 삭제 확인</h4>
              </div>
              <p className="text-sm text-[#4A4A4A] leading-relaxed mb-4">
                <span className="font-bold text-[#141414]">'{projectToDelete.complexName}'</span> 아파트와 등록된 모든 사진을 정말로 삭제하시겠습니까?
              </p>
              <div className="text-xs text-[#8C8275] bg-[#F7F5F2] p-2.5 rounded mb-4">
                삭제 시 클라우드 및 갤러리 뷰어에서 즉시 제거됩니다.
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="px-3.5 py-1.5 border border-[#E8E4DF] text-xs font-medium text-[#4A4A4A] hover:bg-neutral-100 rounded"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => executeDeleteProject(projectToDelete)}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>삭제하기</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
