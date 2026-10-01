import React from 'react';
import { Compass, Sparkles, Layers, ShieldCheck, Gem, Hammer } from 'lucide-react';

export const CartierSavoirFaire: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: '기하학적 순수성 (Geometric Purity)',
      sub: '산토스 뒤몽의 직선과 대칭 미학',
      desc: '1904년 탄생한 산토스의 아이코닉 베젤처럼, 불필요한 몰딩과 문틀을 배제한 1mm 정밀 무몰딩·히든도어 시스템을 통해 극도의 시각적 평온함을 구현합니다.',
      icon: Compass,
      detail: '벽과 도어가 완벽한 단일 수평면을 이루는 플러시(Flush) 공법',
    },
    {
      num: '02',
      title: '고귀한 소재의 선별 (Noble Materials)',
      sub: '천연 세라믹과 이태리 포세린 타일',
      desc: '시계 케이스의 섬세한 브러시드 마감처럼, 600x1200 광폭 이태리 포세린 타일과 스크래치 걱정 없는 고밀도 칸스톤 세라믹 상판을 까다롭게 선별합니다.',
      icon: Gem,
      detail: '내구성 10년 보증의 친환경 E0 등급 하이엔드 자재',
    },
    {
      num: '03',
      title: '빛과 그림자의 조율 (Illumination)',
      sub: '3000K 웜톤 마그네틱 라인조명',
      desc: '시계 다이얼의 기요셰 문양처럼 공간에 깊이와 온기를 더하는 조명 설계. 눈부심 없는 다운라이트와 천장 코브 간접조명으로 호텔 스위트의 감성을 완성합니다.',
      icon: Sparkles,
      detail: '스마트폰 IoT 디밍 제어 및 시간대별 서카디언 조도 동기화',
    },
    {
      num: '04',
      title: '장인의 손길 (Artisanal Mastery)',
      sub: '45도 졸리컷과 1:1 실명제 감리',
      desc: '파인 워치메이킹의 무브먼트 조립과 동일한 장인정신. 타일 모서리를 손수 가공하는 45도 졸리컷과 3중 완벽 방수, 수석 소장의 매일 1:1 현장 감리를 고집합니다.',
      icon: Hammer,
      detail: '하자이행보증보험 100% 발급 및 완공 후 5년 무상 사후관리',
    },
  ];

  return (
    <section id="cartier-savoir-faire" className="w-full bg-[#141414] text-white py-20 border-b border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C5A880]">
            SAVOIR-FAIRE & CRAFTSMANSHIP
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold tracking-tight text-white">
            까르띠에의 탁월한 건축 노하우
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-serif-luxury leading-relaxed">
            한 세기를 이어온 워치메이킹의 정밀함과 마감 철학이 당신의 일상이 머무는 주거 공간 속으로 스며듭니다.
          </p>
          <div className="w-12 h-px bg-[#7A0016] mx-auto pt-1" />
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="p-6 bg-[#1C1C1C] border border-[#2E2E2E] hover:border-[#7A0016] transition-all duration-300 space-y-4 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-[#C5A880] tracking-widest font-bold">
                      {pillar.num}
                    </span>
                    <Icon className="w-5 h-5 text-neutral-500 group-hover:text-[#C5A880] transition-colors" />
                  </div>

                  <h3 className="text-base font-serif-luxury font-bold text-white tracking-tight leading-snug">
                    {pillar.title}
                  </h3>
                  
                  <div className="text-xs text-[#C5A880] font-medium tracking-wide">
                    {pillar.sub}
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2A2A2A] text-[11px] text-neutral-500 font-medium">
                  • {pillar.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner inside Savoir-Faire */}
        <div className="p-6 sm:p-8 bg-[#1A1A1A] border border-[#333333] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-serif-luxury font-bold text-white">
              까르띠에 메종 아틀리에 프라이빗 뷰잉 & 컨설팅
            </h4>
            <p className="text-xs text-neutral-400">
              고객님의 단지와 평형에 맞춘 실제 시공 자재 샘플북과 3D 도면을 부티크에서 직접 확인하세요.
            </p>
          </div>

          <a
            href="tel:02-540-8949"
            className="px-6 py-3.5 bg-[#7A0016] hover:bg-[#600011] text-white text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-md shrink-0 active:scale-95"
          >
            부티크 마스터 상담 예약 · 02-540-8949
          </a>
        </div>

      </div>
    </section>
  );
};
