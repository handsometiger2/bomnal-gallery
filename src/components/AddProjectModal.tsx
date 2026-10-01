import React, { useState } from 'react';
import { ApartmentProject, RemodelStyle } from '../types';
import { X, Upload, Plus, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';

interface AddProjectModalProps {
  onClose: () => void;
  onAdd: (newProject: ApartmentProject) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose, onAdd }) => {
  const [complexName, setComplexName] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const [address, setAddress] = useState<string>('서울시 강남구');
  const [pyeong, setPyeong] = useState<number>(34);
  const [squareMeters, setSquareMeters] = useState<number>(84);
  const [style, setStyle] = useState<RemodelStyle>('모던 미니멀');
  const [costMillionWon, setCostMillionWon] = useState<number>(5500);
  const [durationWeeks, setDurationWeeks] = useState<number>(4);
  const [featuresText, setFeaturesText] = useState<string>('무몰딩 도배, 600각 포세린 타일, 대면형 아일랜드, 시스템 에어컨');
  const [agentNote, setAgentNote] = useState<string>('신축급 인테리어로 즉시 입주 가능하며 실거주 선호도가 매우 높은 매물입니다.');
  const [availableListingNotice, setAvailableListingNotice] = useState<string>('동일 평형 고층 추천 세대 보유');

  // Before / After images
  const [beforeImg, setBeforeImg] = useState<string>(
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
  );
  const [afterImg, setAfterImg] = useState<string>(
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  );
  const [beforeDesc, setBeforeDesc] = useState<string>('어두운 체리색 몰딩과 답답한 분리형 주방');
  const [afterDesc, setAfterDesc] = useState<string>('벽체 철거 후 대면형 아일랜드 및 무몰딩 라인조명 시공');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (target === 'before') setBeforeImg(result);
      else setAfterImg(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complexName.trim()) {
      alert('아파트 단지명을 입력해주세요.');
      return;
    }

    const newProject: ApartmentProject = {
      id: `custom-${Date.now()}`,
      complexName,
      subTitle: subTitle || '프리미엄 올수리 리모델링',
      address,
      pyeong,
      squareMeters,
      style,
      costMillionWon,
      durationWeeks,
      completionDate: new Date().toISOString().slice(0, 7).replace('-', '.'),
      thumbnailUrl: afterImg,
      beforeAfter: {
        title: `${complexName} 주요 공간 리모델링`,
        roomType: 'living',
        beforeImageUrl: beforeImg,
        beforeDescription: beforeDesc,
        afterImageUrl: afterImg,
        afterDescription: afterDesc,
      },
      roomPhotos: [
        {
          id: `cr-${Date.now()}-1`,
          roomType: 'living',
          roomNameKo: '거실',
          title: `${complexName} 거실 시공`,
          description: afterDesc,
          imageUrl: afterImg,
          highlights: ['친환경 도배', '시스템 에어컨', '간접 조명'],
        },
      ],
      features: featuresText.split(',').map((s) => s.trim()).filter(Boolean),
      materials: {
        floor: '친환경 광폭 강마루',
        wall: '친환경 프리미엄 실크벽지',
        lighting: '3인치 다운라이트 & 간접 라인조명',
        kitchen: '맞춤형 대면 아일랜드 싱크',
        bathroom: '600각 포세린 타일 & 고급 도기',
      },
      agentNote,
      availableListingNotice,
    };

    onAdd(newProject);
    onClose();
  };

  return (
    <div
      id="add-project-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="add-project-modal-content"
        className="bg-white rounded-2xl w-full max-w-2xl my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold">
              새 리모델링 아파트 포트폴리오 등록
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                아파트 단지명 *
              </label>
              <input
                type="text"
                required
                value={complexName}
                onChange={(e) => setComplexName(e.target.value)}
                placeholder="예: 압구정 현대 3차"
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                요약 수식어
              </label>
              <input
                type="text"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                placeholder="예: 30년 구축의 화려한 변신, 모던 화이트"
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                공급 평형 (평)
              </label>
              <input
                type="number"
                value={pyeong}
                onChange={(e) => setPyeong(Number(e.target.value))}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                공사비 (만원)
              </label>
              <input
                type="number"
                value={costMillionWon}
                onChange={(e) => setCostMillionWon(Number(e.target.value))}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                스타일
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as RemodelStyle)}
                className="w-full text-xs sm:text-sm px-2 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
              >
                <option value="모던 미니멀">모던 미니멀</option>
                <option value="내추럴 우드">내추럴 우드</option>
                <option value="호텔식 럭셔리">호텔식 럭셔리</option>
                <option value="화이트&웜그레이">화이트&웜그레이</option>
                <option value="클래식 프렌치">클래식 프렌치</option>
              </select>
            </div>
          </div>

          {/* Before and After Image Upload / URLs */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-4">
            <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-600" />
              Before & After 비교 사진 등록
            </h4>

            {/* Before */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-800">1. 시공 전 (Before) 사진</span>
                <label className="cursor-pointer text-[11px] text-blue-600 hover:underline flex items-center gap-1">
                  <Upload className="w-3 h-3" /> 컴퓨터에서 사진 업로드
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'before')}
                  />
                </label>
              </div>
              <input
                type="text"
                value={beforeImg}
                onChange={(e) => setBeforeImg(e.target.value)}
                placeholder="이미지 URL 입력"
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-neutral-300"
              />
              <input
                type="text"
                value={beforeDesc}
                onChange={(e) => setBeforeDesc(e.target.value)}
                placeholder="시공 전 상태 설명 (예: 낡은 체리색 몰딩, 비좁은 주방)"
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-neutral-300"
              />
            </div>

            {/* After */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-800">2. 시공 후 (After) 사진</span>
                <label className="cursor-pointer text-[11px] text-blue-600 hover:underline flex items-center gap-1">
                  <Upload className="w-3 h-3" /> 컴퓨터에서 사진 업로드
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'after')}
                  />
                </label>
              </div>
              <input
                type="text"
                value={afterImg}
                onChange={(e) => setAfterImg(e.target.value)}
                placeholder="이미지 URL 입력"
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-neutral-300"
              />
              <input
                type="text"
                value={afterDesc}
                onChange={(e) => setAfterDesc(e.target.value)}
                placeholder="시공 후 개선 포인트 설명 (예: 대면형 아일랜드 및 무몰딩 라인조명)"
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-neutral-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1">
              핵심 시공 포인트 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-neutral-300"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1">
              공인중개사 코멘트
            </label>
            <textarea
              rows={2}
              value={agentNote}
              onChange={(e) => setAgentNote(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-md"
            >
              포트폴리오 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
