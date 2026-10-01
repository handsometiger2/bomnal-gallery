import React, { useState } from 'react';
import { ApartmentProject } from '../types';
import {
  X,
  Calculator,
  Printer,
  Copy,
  CheckCircle,
  FileCheck,
  Building,
  Calendar,
  Sparkles,
  ArrowRight,
  PhoneCall
} from 'lucide-react';

interface ConsultationDrawerProps {
  initialProject?: ApartmentProject | null;
  onClose: () => void;
  availableProjects: ApartmentProject[];
  onSelectProject: (project: ApartmentProject) => void;
}

export const ConsultationDrawer: React.FC<ConsultationDrawerProps> = ({
  initialProject,
  onClose,
  availableProjects,
  onSelectProject,
}) => {
  const [clientName, setClientName] = useState<string>('김고객');
  const [contactNumber, setContactNumber] = useState<string>('010-1234-5678');
  const [apartmentName, setApartmentName] = useState<string>(
    initialProject ? initialProject.complexName : '잠실 래미안 아이파크'
  );
  const [pyeong, setPyeong] = useState<number>(initialProject ? initialProject.pyeong : 34);
  const [scopeOptions, setScopeOptions] = useState<{
    fullRemodel: boolean;
    windowReplacement: boolean;
    islandKitchen: boolean;
    luxuryBath: boolean;
    hiddenDoor: boolean;
    systemAircon: boolean;
  }>({
    fullRemodel: true,
    windowReplacement: true,
    islandKitchen: true,
    luxuryBath: true,
    hiddenDoor: false,
    systemAircon: true,
  });

  const [consultationNotes, setConsultationNotes] = useState<string>(
    '화이트&우드 톤 희망, 신혼부부 입주 예정으로 주방 대면형 아일랜드 및 수납 극대화 원함. 3월 말 잔금 및 입주 전 4주 공사 기간 확보 필요.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Dynamic estimate calculation based on pyeong and scope
  const calculateEstimatedCost = () => {
    // Base per pyeong cost (approx 130 ~ 150만원/평 for basic remodel)
    let base = pyeong * 130;
    if (scopeOptions.windowReplacement) base += pyeong * 30; // 샷시 전면 교체
    if (scopeOptions.islandKitchen) base += 500; // 대면형 아일랜드 및 세라믹
    if (scopeOptions.luxuryBath) base += 400; // 600각 졸리컷 욕실
    if (scopeOptions.hiddenDoor) base += 350; // 무몰딩 히든도어 목공
    if (scopeOptions.systemAircon) base += 550; // 시스템 에어컨 3~4대
    const minCost = Math.round(base * 0.95);
    const maxCost = Math.round(base * 1.1);
    return { minCost, maxCost };
  };

  const { minCost, maxCost } = calculateEstimatedCost();

  const handleCopySummary = () => {
    const text = `[한빛부동산] 아파트 리모델링 상담 & 예상 견적서
------------------------------------
■ 상담 고객: ${clientName} 님 (${contactNumber})
■ 대상 아파트: ${apartmentName} (${pyeong}평형)
■ 예상 견적 범위: 약 ${minCost.toLocaleString()}만원 ~ ${maxCost.toLocaleString()}만원
■ 선택 시공 범위:
  - 전체 올수리 (목공/도배/바닥/조명): ${scopeOptions.fullRemodel ? '포함' : '미포함'}
  - 샷시 전면 교체 (이중 단열창): ${scopeOptions.windowReplacement ? '포함' : '미포함'}
  - 대면형 아일랜드 주방: ${scopeOptions.islandKitchen ? '포함' : '미포함'}
  - 호텔식 600각 타일 욕실: ${scopeOptions.luxuryBath ? '포함' : '미포함'}
  - 무몰딩·히든도어: ${scopeOptions.hiddenDoor ? '포함' : '미포함'}
  - 시스템 에어컨 설치: ${scopeOptions.systemAircon ? '포함' : '미포함'}
■ 상담 메모:
  ${consultationNotes}
------------------------------------
※ 본 견적은 자재 등급 및 현장 실측에 따라 변동될 수 있습니다.
한빛공인중개사사무소 (02-540-8949)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find matching portfolios
  const matchingPortfolios = availableProjects.filter(
    (p) => Math.abs(p.pyeong - pyeong) <= 5
  );

  return (
    <div
      id="consultation-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="consultation-modal-content"
        className="bg-white rounded-2xl w-full max-w-3xl my-auto shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-neutral-950 font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                고객 맞춤 리모델링 견적 산출 & 상담 카드
              </h3>
              <p className="text-xs text-neutral-400">
                실시간 평형 및 옵션별 예상 시공비 계산과 상담 내용을 바로 저장·공유합니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Client & Apartment Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                고객 성함
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="예: 홍길동 고객님"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                연락처
              </label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="010-0000-0000"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                상담 대상 단지 / 평형
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={apartmentName}
                  onChange={(e) => setApartmentName(e.target.value)}
                  className="flex-1 text-xs sm:text-sm px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="단지명"
                />
                <select
                  value={pyeong}
                  onChange={(e) => setPyeong(Number(e.target.value))}
                  className="w-20 text-xs sm:text-sm px-2 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
                >
                  <option value={20}>20평</option>
                  <option value={24}>24평</option>
                  <option value={30}>30평</option>
                  <option value={34}>34평</option>
                  <option value={38}>38평</option>
                  <option value={45}>45평</option>
                  <option value={50}>50평</option>
                </select>
              </div>
            </div>
          </div>

          {/* Scope Options Selector */}
          <div>
            <label className="text-xs font-bold text-neutral-900 block mb-2">
              주요 시공 항목 선택 (체크 시 실시간 견적 반영)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { key: 'fullRemodel', label: '전체 올수리 (철거·도배·바닥)', costTag: '기본' },
                { key: 'windowReplacement', label: '샷시 전면 교체 (이중단열)', costTag: `+${Math.round(pyeong * 30)}만` },
                { key: 'islandKitchen', label: '대면형 아일랜드 주방', costTag: '+500만' },
                { key: 'luxuryBath', label: '호텔식 600각 타일 욕실', costTag: '+400만' },
                { key: 'hiddenDoor', label: '무몰딩 & 히든도어 목공', costTag: '+350만' },
                { key: 'systemAircon', label: '시스템 에어컨 3~4대', costTag: '+550만' },
              ].map((item) => (
                <label
                  key={item.key}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                    scopeOptions[item.key as keyof typeof scopeOptions]
                      ? 'border-neutral-900 bg-neutral-900 text-white font-semibold'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={scopeOptions[item.key as keyof typeof scopeOptions]}
                      onChange={(e) =>
                        setScopeOptions((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }))
                      }
                      className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      scopeOptions[item.key as keyof typeof scopeOptions]
                        ? 'bg-neutral-800 text-amber-300'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {item.costTag}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Calculated Output Banner */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                예상 시공 견적 (VAT 포함 기준)
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-neutral-950">
                  약 {minCost.toLocaleString()}만 ~ {maxCost.toLocaleString()}만원
                </span>
                <span className="text-xs text-neutral-600">({pyeong}평형 기준 예상치)</span>
              </div>
              <p className="text-[11px] text-amber-800 mt-1">
                ※ 자재(원목/강마루, 세라믹/인조대리석) 선택에 따라 ±10% 내외 변동 가능합니다.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopySummary}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>문자/카톡 양식 복사완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>견적서 내용 복사</span>
                </>
              )}
            </button>
          </div>

          {/* Matching Reference Portfolios */}
          {matchingPortfolios.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  고객님께 함께 보여드릴 {pyeong}평형대 추천 포트폴리오
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingPortfolios.slice(0, 2).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onClose();
                      onSelectProject(p);
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-900 cursor-pointer transition-colors group"
                  >
                    <img
                      src={p.thumbnailUrl}
                      alt={p.complexName}
                      className="w-14 h-14 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 group-hover:text-amber-700 truncate">
                        {p.complexName}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">{p.subTitle}</p>
                      <span className="text-[10px] text-amber-800 font-medium">
                        실제 시공비 {p.costMillionWon.toLocaleString()}만원
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consultation Notes Textarea */}
          <div>
            <label className="text-xs font-bold text-neutral-900 block mb-1">
              상담 메모 및 고객 특이 요청사항
            </label>
            <textarea
              rows={3}
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 leading-relaxed"
              placeholder="상담 중 고객이 요청한 입주 일정, 추가 질문사항 등을 기록하세요."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="text-[11px] text-neutral-500">
            상담 내용 복사 후 고객님께 카카오톡/문자로 즉시 전송할 수 있습니다.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
