export type RoomType = 'living' | 'kitchen' | 'bathroom' | 'bedroom' | 'entrance' | 'balcony';

export type RemodelStyle = '모던 미니멀' | '내추럴 우드' | '호텔식 럭셔리' | '화이트&웜그레이' | '클래식 프렌치';

export type PyeongRange = 'all' | '20s' | '30s' | '40s_plus';

export interface RoomPhoto {
  id: string;
  roomType: RoomType;
  roomNameKo: string;
  title: string;
  description: string;
  imageUrl: string;
  highlights: string[];
}

export interface BeforeAfterPair {
  title: string;
  roomType: RoomType;
  beforeImageUrl: string;
  beforeDescription: string;
  afterImageUrl: string;
  afterDescription: string;
}

export interface ApartmentProject {
  id: string;
  refCode?: string; // 까르띠에 공식 레퍼런스 번호 (예: CRWSSA0029)
  cartierCollection?: string; // 까르띠에 컬렉션 라인 (예: 산토스 드 까르띠에, 탱크, 팬더)
  modelEdition?: string; // 에디션 모델 (예: 라지 모델, 미디엄 모델)
  maisonStory?: string; // 까르띠에 아틀리에 건축 철학 스토리
  complexName: string; // 단지명 (예: 반포 래미안 원베일리)
  subTitle: string; // 요약 타이틀 (예: 무몰딩 히든도어 & 대면형 주방)
  address: string; // 위치 (예: 서울시 서초구 반포동)
  pyeong: number; // 공급평수 (예: 34)
  squareMeters: number; // 전용면적 (예: 84)
  style: RemodelStyle;
  costMillionWon: number; // 공사비용 (단위: 만원, 예: 6800)
  durationWeeks: number; // 공사기간 (주 단위, 예: 4)
  completionDate: string; // 시공 완료일 (예: 2024.11)
  thumbnailUrl: string;
  beforeAfter: BeforeAfterPair;
  roomPhotos: RoomPhoto[];
  features: string[]; // 주요 시공 포인트 (예: 무몰딩, 600각 포세린 타일, 라인조명, 히든도어)
  materials: {
    floor: string; // 바닥재 (예: 구정마루 그랜드 텍스쳐 원목마루)
    wall: string; // 벽체 (예: 벤자민무어 도장 / 친환경 실크벽지)
    lighting: string; // 조명 (예: 주백색 매립등 & 마그네틱 라인조명)
    kitchen: string; // 주방 (예: 대면형 아일랜드 칸스톤 상판)
    bathroom: string; // 욕실 (예: 600각 졸리컷 조적욕조)
  };
  agentNote: string; // 공인중개사 코멘트 (예: 동일 라인 로열층 입주 가능한 매물 확보중, 실거주 만족도 최상)
  availableListingNotice?: string; // 매물 연계 정보 (예: "동일 평형 15층 급매물 진행 가능")
}

export interface FilterOptions {
  searchQuery: string;
  pyeongRange: PyeongRange;
  style: string;
  selectedRoom: 'all' | RoomType;
  maxCostMillionWon: number;
}
