import React, { useState } from 'react';
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
  Images
} from 'lucide-react';
import { INITIAL_PORTFOLIOS } from '../data/mockPortfolios';
import {
  saveApartmentToFirestore,
  deleteApartmentFromFirestore,
  syncAllApartmentsToFirestore
} from '../lib/firestoreService';
import { getStoredAdminPassword, setStoredAdminPassword } from './AdminPasswordModal';

// Helper to compress images so Firestore and memory stay fast and reliable
const compressImageFile = (file: File, maxDim = 1920, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

interface AdminConsoleModalProps {
  projects: ApartmentProject[];
  onClose: () => void;
  onUpdateProjects: (updated: ApartmentProject[]) => void;
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({
  projects,
  onClose,
  onUpdateProjects,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'edit' | 'add'>('edit');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Admin Password Management
  const [adminPwdInput, setAdminPwdInput] = useState<string>(() => getStoredAdminPassword());
  const [adminPwdSaved, setAdminPwdSaved] = useState<boolean>(false);

  // Currently editing project
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Edit form state
  const [complexName, setComplexName] = useState<string>(currentProject?.complexName || '');
  const [pyeong, setPyeong] = useState<number>(currentProject?.pyeong || 34);
  const [address, setAddress] = useState<string>(currentProject?.address || '');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(currentProject?.thumbnailUrl || '');
  const [roomPhotos, setRoomPhotos] = useState<RoomPhoto[]>(currentProject?.roomPhotos || []);

  // Sync edit form when selected project changes
  const handleSelectProjectToEdit = (proj: ApartmentProject) => {
    setSelectedProjectId(proj.id);
    setActiveTab('edit');
    setComplexName(proj.complexName);
    setPyeong(proj.pyeong);
    setAddress(proj.address);
    setThumbnailUrl(proj.thumbnailUrl);
    setRoomPhotos(proj.roomPhotos || []);
  };

  // New Apartment state - 완전히 빈(blank) 상태로 초기화
  const [newName, setNewName] = useState('');
  const [newPyeong, setNewPyeong] = useState<number | ''>('');
  const [newAddress, setNewAddress] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('');
  const [newRoomPhotos, setNewRoomPhotos] = useState<{ name: string; url: string }[]>([]);

  // 신규 아파트 폼 초기화 함수
  const resetNewProjectForm = () => {
    setNewName('');
    setNewPyeong('');
    setNewAddress('');
    setNewThumbnail('');
    setNewRoomPhotos([]);
  };

  // '추가' 탭 전환 시 신규 폼을 완전히 깨끗한 블랭크 상태로 리셋
  const handleSwitchToAddTab = () => {
    resetNewProjectForm();
    setActiveTab('add');
  };

  // 편집 중인 아파트의 모든 추가 사진 일괄 삭제
  const handleClearAllRoomPhotos = () => {
    if (roomPhotos.length === 0) return;
    if (confirm(`등록된 추가 사진 ${roomPhotos.length}장을 모두 삭제하시겠습니까?`)) {
      setRoomPhotos([]);
      setSaveMessage('추가 사진이 모두 삭제되었습니다. [저장]을 눌러 클라우드에 반영하세요.');
      setTimeout(() => setSaveMessage(null), 3500);
    }
  };

  // 신규 아파트 등록 시 추가 사진 일괄 삭제
  const handleClearAllNewRoomPhotos = () => {
    if (newRoomPhotos.length === 0) return;
    if (confirm(`등록된 사진 ${newRoomPhotos.length}장을 모두 삭제하시겠습니까?`)) {
      setNewRoomPhotos([]);
    }
  };

  // Save changes to current project (Both State & Cloud Firestore)
  const handleSaveEdit = async () => {
    if (!complexName.trim()) return;
    setIsSaving(true);
    setSaveMessage(null);

    const target = {
      ...currentProject,
      complexName,
      pyeong,
      address,
      thumbnailUrl,
      roomPhotos,
    };

    const updated = projects.map((p) => (p.id === selectedProjectId ? target : p));
    onUpdateProjects(updated);

    try {
      await saveApartmentToFirestore(target);
      setSaveMessage('클라우드 영구 저장소에 안전하게 저장되었습니다.');
    } catch (err) {
      console.error(err);
      setSaveMessage('로컬에는 저장되었으나 클라우드 동기화 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Delete project (Both State & Cloud Firestore)
  const handleDeleteProject = async (id: string) => {
    if (projects.length <= 1) {
      alert('최소 1개 이상의 아파트가 유지되어야 합니다.');
      return;
    }
    if (confirm('이 아파트 갤러리를 삭제하시겠습니까? 클라우드에서도 함께 삭제됩니다.')) {
      setIsSaving(true);
      const updated = projects.filter((p) => p.id !== id);
      onUpdateProjects(updated);
      setSelectedProjectId(updated[0].id);

      try {
        await deleteApartmentFromFirestore(id);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
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
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
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
      const result = await compressImageFile(file, 1920, 0.85);
      if (isNew) setNewThumbnail(result);
      else setThumbnailUrl(result);
    } catch {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (isNew) setNewThumbnail(result);
        else setThumbnailUrl(result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleFileUploadForPhoto = async (e: React.ChangeEvent<HTMLInputElement>, photoId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await compressImageFile(file, 1920, 0.85);
      handleUpdatePhoto(photoId, 'url', result);
    } catch {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        handleUpdatePhoto(photoId, 'url', result);
      };
      reader.readAsDataURL(file);
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
        const compressedUrl = await compressImageFile(file, 1920, 0.82);
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
      setSaveMessage(`${newAddedPhotos.length}장의 사진이 추가되었습니다. [저장]을 눌러 클라우드에 반영하세요.`);
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
        const compressedUrl = await compressImageFile(file, 1920, 0.82);
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
      setSaveMessage(`${newItems.length}장의 사진이 신규 아파트에 추가되었습니다.`);
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

  // Create new apartment (Both State & Cloud Firestore)
  const handleCreateNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('아파트 명칭을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    const validPyeong = Number(newPyeong) || 34;
    const finalThumb = newThumbnail.trim() || (newRoomPhotos[0]?.url) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';

    const newProject: ApartmentProject = {
      id: `bomnal-${Date.now()}`,
      complexName: newName,
      subTitle: `${newName} 프리미엄 리모델링`,
      address: newAddress || '대구광역시',
      pyeong: validPyeong,
      squareMeters: Math.round(validPyeong * 2.5),
      style: '모던 미니멀',
      costMillionWon: 6000,
      durationWeeks: 4,
      completionDate: '2026.03',
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
      agentNote: '신축급 하이엔드 인테리어',
    };

    const updated = [...projects, newProject];
    onUpdateProjects(updated);
    setSelectedProjectId(newProject.id);
    setActiveTab('edit');
    handleSelectProjectToEdit(newProject);

    try {
      await saveApartmentToFirestore(newProject);
      setSaveMessage('새 아파트가 클라우드에 성공적으로 등록되었습니다.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
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
              className="p-2 hover:bg-[#F5F2EC] text-[#141414] transition-colors"
            >
              <X className="w-5 h-5" />
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
                        {p.pyeong}평형 · 사진 {1 + (p.roomPhotos?.length || 0)}장
                      </div>
                    </div>
                    {isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(p.id);
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

            {/* 관리자 비밀번호 변경 영역 */}
            <div className="p-3 border-t border-[#E8E4DF] bg-white">
              <div className="text-[11px] font-bold text-[#141414] mb-1.5 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-[#7A0016]" />
                <span>관리자 비밀번호 설정</span>
              </div>
              <div className="flex gap-1.5">
                <input
                  type="password"
                  value={adminPwdInput}
                  onChange={(e) => {
                    setAdminPwdInput(e.target.value);
                    setAdminPwdSaved(false);
                  }}
                  placeholder="새 비밀번호 입력"
                  className="w-full px-2 py-1 text-xs border border-[#E8E4DF] rounded outline-none focus:border-[#7A0016]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!adminPwdInput.trim()) {
                      alert('비밀번호를 입력해주세요.');
                      return;
                    }
                    setStoredAdminPassword(adminPwdInput.trim());
                    setAdminPwdSaved(true);
                    setTimeout(() => setAdminPwdSaved(false), 2500);
                  }}
                  className="px-2.5 py-1 bg-[#141414] hover:bg-[#7A0016] text-white text-xs rounded transition-colors shrink-0"
                >
                  {adminPwdSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : '저장'}
                </button>
              </div>
              {adminPwdSaved && (
                <p className="text-[10px] text-emerald-600 font-medium mt-1">
                  비밀번호가 안전하게 변경되었습니다.
                </p>
              )}
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

                {/* Info Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F5] p-4 rounded border border-[#EFEAE2]">
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

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6E6E] mb-1.5">
                      평형 (공급평수)
                    </label>
                    <input
                      type="number"
                      value={pyeong}
                      onChange={(e) => setPyeong(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D8D2C7] focus:border-[#141414] text-sm outline-none shadow-2xs transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6E6E] mb-1.5">
                      위치 (주소)
                    </label>
                    <input
                      type="text"
                      value={address}
                      placeholder="예: 대구광역시 달서구 월성동"
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D8D2C7] focus:border-[#141414] text-sm outline-none shadow-2xs transition-all"
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
                        <button
                          type="button"
                          onClick={handleClearAllRoomPhotos}
                          className="text-xs px-2.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 font-semibold rounded-xs"
                          title="추가 사진 전체 일괄 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>전체 삭제</span>
                        </button>
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

              </div>
            ) : (
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6E6E] mb-1">
                      아파트 단지명 *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="예: 압구정 현대, 아크로리버파크"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E8E4DF] focus:border-[#141414] text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6E6E] mb-1">
                      평형 *
                    </label>
                    <input
                      type="number"
                      required
                      value={newPyeong}
                      onChange={(e) => setNewPyeong(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-[#E8E4DF] focus:border-[#141414] text-sm outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6E6E] mb-1">
                      위치
                    </label>
                    <input
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E8E4DF] focus:border-[#141414] text-sm outline-none"
                    />
                  </div>
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
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
