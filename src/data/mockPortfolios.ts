import { ApartmentProject } from '../types';

export const INITIAL_PORTFOLIOS: ApartmentProject[] = [
  {
    id: 'apt-01',
    refCode: 'CRWSSA0029',
    cartierCollection: '산토스 드 까르띠에 (Santos de Cartier)',
    modelEdition: '라지 모델 (34평형)',
    maisonStory: '1904년 루이 까르띠에가 비행사 산토스 뒤몽을 위해 설계한 최초의 현대식 손목시계처럼, 반포 래미안 원베일리는 기하학적 순수함과 완벽한 비례를 바탕으로 재탄생했습니다. 불필요한 몰딩을 과감히 걷어낸 무문선·히든도어와 84㎡를 가로지르는 2.8m 세라믹 아일랜드는 산토스 베젤의 절제된 볼트 라인을 닮은 건축학적 마스터피스입니다.',
    complexName: 'e편한세상월배',
    subTitle: '무몰딩 히든도어 & 대면형 하이엔드 아일랜드 키친',
    address: '대구광역시 달서구 월성동',
    pyeong: 34,
    squareMeters: 84,
    style: '모던 미니멀',
    costMillionWon: 6800,
    durationWeeks: 4,
    completionDate: '2024.11',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    beforeAfter: {
      title: '거실 & 주방 구조 변경',
      roomType: 'living',
      beforeImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      beforeDescription: '체리색 걸레받이 몰딩, 답답한 상부장과 분리형 주방 벽체로 채광 차단 및 좁아보이는 구조',
      afterImageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      afterDescription: '벽체 철거 후 11자 대면형 아일랜드 신설, 천장 무몰딩 평탄화 및 마그네틱 라인조명 시공으로 시각적 개방감 극대화'
    },
    roomPhotos: [
      {
        id: 'r-01-1',
        roomType: 'living',
        roomNameKo: '거실',
        title: '무몰딩 히든도어 일체형 거실',
        description: '벽과 도어가 수평면을 이루는 히든도어 시스템과 바닥 600x1200 대형 포세린 타일로 갤러리 같은 무드 연출',
        imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        highlights: ['무몰딩 마감', '대형 포세린 타일', '우물천장 간접등', '시스템 에어컨 단내림']
      },
      {
        id: 'r-01-2',
        roomType: 'kitchen',
        roomNameKo: '주방',
        title: '대면형 세라믹 아일랜드 & 빌트인 수납',
        description: '가족을 바라보며 요리할 수 있는 2.8m 광폭 세라믹 아일랜드와 히든 인덕션, 후드 일체형 구조',
        imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        highlights: ['천연 세라믹 상판', '히든 팬트리 도어', '인덕션 일체형 후드', '비스포크 냉장고핏']
      },
      {
        id: 'r-01-3',
        roomType: 'bathroom',
        roomNameKo: '욕실 (공용)',
        title: '호텔식 조적 욕조 & 졸리컷 마감',
        description: '타일 모서리를 45도 가공한 졸리컷 기법과 매립 수전, 물때 걱정 없는 젠다이 연장 시공',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
        highlights: ['졸리컷 조적벽', '무광 매립수전', 'LED 거울 수납장', '아메리칸 스탠다드 일체형 비데']
      },
      {
        id: 'r-01-4',
        roomType: 'bedroom',
        roomNameKo: '침실 (안방)',
        title: '아늑한 웜톤 간접조명 마스터베드룸',
        description: '헤드보드 일체형 벽체 템바보드와 은은한 독서등, 시스템 드레스룸으로 이어지는 동선 최적화',
        imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
        highlights: ['템바보드 침대월', '마그네틱 스팟조명', '붙박이 에어드레서장', '암막 커튼박스 간접등']
      },
      {
        id: 'r-01-5',
        roomType: 'entrance',
        roomNameKo: '현관',
        title: '통유리 슬라이딩 중문 & 하부 띄움 신발장',
        description: '투명 브론즈 강화유리 원슬라이딩 중문과 신발장 하부 T5 간접조명으로 첫인상에 품격을 부여',
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        highlights: ['원슬라이딩 초슬림 중문', '하부 띄움 조명', '디딤석 톤앤매너', '전신 은경 거울']
      }
    ],
    features: ['무몰딩·히든도어 올수리', '600x1200 포세린 타일 바닥', '대면형 아일랜드 주방', '졸리컷 조적욕조 2개소', '전실 시스템 에어컨 4대'],
    materials: {
      floor: '이태리 600x1200 대형 포세린 타일 (비앙코 카라라 웜톤)',
      wall: '삼화 제로페인트 안심도장 & 에코실크 벽지',
      lighting: '주백색(3000K) 2인치 다운라이트 & T5 간접 라인조명',
      kitchen: '한샘 키친바흐 오크 세라믹 아일랜드 & 블룸(Blum) 하드웨어',
      bathroom: '그레이 샌드스톤 600각 타일, 더존테크 무광 니켈 매립수전'
    },
    agentNote: '본 단지 내 동일 평형대 매매/전세 진행 시 가장 선호도가 높은 하이엔드 리모델링 레퍼런스입니다. 현재 같은 라인 16층 매물도 리모델링 협의 가능합니다.',
    availableListingNotice: '동일 타입 104동 16층 남향 매물 보유 (상담 시 바로 비교 가능)'
  },
  {
    id: 'apt-02',
    refCode: 'CRWSTA0040',
    cartierCollection: '탱크 머스트 (Tank Must)',
    modelEdition: '미디엄 모델 (25평형)',
    maisonStory: '까르띠에 탱크의 순수한 직선 실루엣과 평행한 샤프트처럼, 마래푸 25평형은 발코니를 일체형으로 확장하여 직사각형의 완벽한 개방감을 이끌어냈습니다. 따스한 오크 원목마루와 순백의 디아망 실크 벽지가 조화를 이루며 세월이 흘러도 변치 않는 영원한 클래식을 선사합니다.',
    complexName: '월성삼정그린코아에듀파크',
    subTitle: '화이트 & 내추럴 오크우드 톤온톤 확장형 리모델링',
    address: '대구광역시 달서구 월성동',
    pyeong: 25,
    squareMeters: 59,
    style: '내추럴 우드',
    costMillionWon: 4300,
    durationWeeks: 3.5,
    completionDate: '2024.10',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    beforeAfter: {
      title: '거실 발코니 확장 & 단열 시공',
      roomType: 'living',
      beforeImageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      beforeDescription: '기존 거실 분합창과 외부 발코니로 인해 20평대 거실이 좁고 겨울철 우풍이 심했던 상태',
      afterImageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      afterDescription: 'LG 지인 수퍼세이브 이중창으로 발코니 전면 확장 및 로이유리 시공, 실사용 면적 약 3.8평 증가'
    },
    roomPhotos: [
      {
        id: 'r-02-1',
        roomType: 'living',
        roomNameKo: '거실',
        title: '원목마루와 화이트의 따뜻한 조화',
        description: '광폭 오크 원목마루와 미니멀 아트월로 25평형임에도 30평대 느낌을 주는 개방적인 거실',
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        highlights: ['광폭 브러쉬 원목마루', '무문선 방문 도어', '발코니 확장부 터닝도어 숨김', '실링팬 시공']
      },
      {
        id: 'r-02-2',
        roomType: 'kitchen',
        roomNameKo: '주방',
        title: 'ㄷ자형 컴팩트 동선 & 우드 오픈 선반',
        description: '20평형대 주방의 단점인 조리 공간 부족을 보완한 ㄷ자 카운터형 아일랜드 및 우드 템바보드 식탁월',
        imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
        highlights: ['ㄷ자 대면 수납', '오크 무늬목 오픈선반', '사각 싱크볼 & 거위목 수전', '상부장 하부 조명']
      },
      {
        id: 'r-02-3',
        roomType: 'bathroom',
        roomNameKo: '욕실',
        title: '베이지 테라조 타일 & 따스한 우드 수납장',
        description: '포근한 크림베이지 톤 300x600 타일과 방수 무늬목 수납장으로 따스한 카페 같은 욕실 분위기',
        imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
        highlights: ['테라조 바닥 타일', '욕조 파티션 분리', '우드 방수 플랩장', '환풍 겸용 온풍기 휴젠뜨']
      },
      {
        id: 'r-02-4',
        roomType: 'bedroom',
        roomNameKo: '침실',
        title: '공간 활용도를 높인 슬라이딩 붙박이장 침실',
        description: '붙박이장과 화장대를 일체형으로 맞춤 제작하여 낭비되는 데드스페이스를 완전히 제거',
        imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
        highlights: ['화장대 일체형 붙박이장', '단열 샷시 교체', '조도 조절 디밍스위치', '무소음 마그네틱 도어']
      }
    ],
    features: ['발코니 전면 확장 & 최고급 단열', '구정 광폭 원목마루 시공', 'ㄷ자 대면형 주방 레이아웃', '천장 실링팬 & 3인치 매립등', '욕실 휴젠뜨 3대 복합환풍기'],
    materials: {
      floor: '구정마루 마뷸러스 딥오크 프리미엄 강마루',
      wall: 'LG 디아망 친환경 프리미엄 실크벽지 (퓨어화이트)',
      lighting: '오스람 3인치 COB 집중형 다운라이트 & 필립스 스마트 조명',
      kitchen: 'LX Z:IN 셀렉션 3 주방 & 현대 L&C 하이막스 인조대리석',
      bathroom: '스페인산 웜베이지 타일 & 로얄앤컴퍼니 무광 니켈 수전'
    },
    agentNote: '신혼부부 및 1~2인 가구 고객님께 반응이 매우 뜨거운 매물 스타일입니다. 공사비 4천만원 초반대로 가성비와 감성을 모두 잡은 성공 사례입니다.',
    availableListingNotice: '마래푸 201동 로열층 동일 평수 전세/매매 실물 안내 가능'
  },
  {
    id: 'apt-03',
    refCode: 'CRWSPA0013',
    cartierCollection: '파샤 드 까르띠에 (Pasha de Cartier)',
    modelEdition: '엑스트라 라지 모델 (48평형)',
    maisonStory: '웅장하고 당당한 파샤 드 까르띠에의 원형 베젤과 독창적인 힘을 48평 대형 평수에 투영했습니다. 탄천 파노라마 조망과 1200x2600 이태리 라미남 박판 세라믹, 8인용 프라이빗 다이닝 바와 독립형 마스터 스위트룸은 하이엔드 럭셔리 라이프스타일의 정점을 완성합니다.',
    complexName: '월성푸르지오',
    subTitle: '호텔식 마스터베드룸 & 럭셔리 다이닝 프라이빗 하우스',
    address: '대구광역시 달서구 월성동',
    pyeong: 48,
    squareMeters: 134,
    style: '호텔식 럭셔리',
    costMillionWon: 9200,
    durationWeeks: 5.5,
    completionDate: '2024.12',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    beforeAfter: {
      title: '주방 & 다이닝 공간 전면 재배치',
      roomType: 'kitchen',
      beforeImageUrl: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1200&q=80',
      beforeDescription: '2004년 준공 당시의 짙은 월넛톤 장식장과 미로 같은 주방 가벽으로 폐쇄적이었던 조리공간',
      afterImageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      afterDescription: '불필요한 내력벽 주변을 와인바 및 홈카페로 흡수하고, 8인용 대형 다이닝 테이블과 연결된 오픈 럭셔리 주방 구축'
    },
    roomPhotos: [
      {
        id: 'r-03-1',
        roomType: 'living',
        roomNameKo: '거실',
        title: '대형 통창 뷰와 대리석 아트월',
        description: '탄천 파노라마 조망을 극대화한 통유리 뷰와 박판 세라믹 아트월, 마그네틱 트랙 조명 시스템',
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        highlights: ['박판 세라믹 1200x2600 대형 아트월', '전동 커튼 시스템', '천장 평탄화 & 라인조명', '스마트폰 홈 IoT 연동']
      },
      {
        id: 'r-03-2',
        roomType: 'kitchen',
        roomNameKo: '주방/다이닝',
        title: '빌트인 와인셀러 & 3.2m 초대형 아일랜드',
        description: '밀레(Miele) 오븐 및 인덕션 풀세트, 프리미엄 와인셀러와 일체형으로 짜맞춘 이태리 수입 가구 주방',
        imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        highlights: ['밀레 풀 빌트인 가전', '대형 아일랜드 바', '수입 수전 그로헤(Grohe)', '프리미엄 와인셀러 빌트인']
      },
      {
        id: 'r-03-3',
        roomType: 'bathroom',
        roomNameKo: '욕실 (안방 마스터)',
        title: '독립형 이동식 욕조 & 건식 파우더룸',
        description: '5성급 호텔 스위트룸을 모티브로 한 600각 무광 타일, 독립형 프리미엄 욕조와 더블 세면대',
        imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
        highlights: ['독립형 프리미엄 아크릴 욕조', '더블 볼 세면대', '매립 샤워 헤드', '바닥 난방 완비 건식 시공']
      },
      {
        id: 'r-03-4',
        roomType: 'bedroom',
        roomNameKo: '침실 (안방)',
        title: '호텔 스위트 무드의 안방 & 워크인 클로젯',
        description: '패브릭 아트월과 간접 조명, 유리 슬라이딩 도어로 구분된 대형 워크인 드레스룸',
        imageUrl: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1200&q=80',
        highlights: ['유리 슬라이딩 드레스룸', '스마트 조도 제어', '패브릭 흡음 헤드보드', '헤링본 원목마루']
      }
    ],
    features: ['40평대 대형 평수 프리미엄 리모델링', '이태리 수입 가구 및 세라믹', '마스터 베드룸 호텔식 스위트화', '전체 바닥 헤링본 원목마루', '전실 홈 IoT 자동화 제어'],
    materials: {
      floor: '노바마루 원목 W시리즈 헤링본 패턴 (내추럴 오크)',
      wall: '이태리 라미남(Laminam) 초대형 박판 세라믹 패널',
      lighting: '루체플랜 펜던트 & 다이코(DAIKO) 마그네틱 트랙 조명',
      kitchen: '유로모빌 수입 주방 & 블랑코 실그라니트 블랙 싱크볼',
      bathroom: '콜러(Kohler) 매립 수전 및 비데일체형 도기, 바닥 난방선 연장'
    },
    agentNote: '대형 평수 실수요자 및 품격 있는 인테리어를 원하시는 VIP 고객분들께 우선적으로 보여드리는 대표 리모델링 포트폴리오입니다.',
    availableListingNotice: '파크뷰 고층 탄천 영구조망 세대 매매 물건 연계 가능'
  },
  {
    id: 'apt-04',
    refCode: 'CRW2PN0007',
    cartierCollection: '팬더 드 까르띠에 (Panthère de Cartier)',
    modelEdition: '라지 모델 (32평형)',
    maisonStory: '팬더의 유연하고 우아한 링크 브레이슬릿처럼, 25년 차 구축 아파트의 낡은 골조를 부드러운 라운드 아치와 유려한 미니멀 화이트 라인으로 탈바꿈시켰습니다. 한강 조망을 액자처럼 담아낸 시스템 단열창과 11자 대면형 주방은 매혹적인 변신의 전형입니다.',
    complexName: '월성월드메르디앙',
    subTitle: '구축 30평대 환골탈태, 한강 조망 극대화 미니멀 화이트',
    address: '대구광역시 달서구 월성동',
    pyeong: 32,
    squareMeters: 84,
    style: '화이트&웜그레이',
    costMillionWon: 5600,
    durationWeeks: 4,
    completionDate: '2024.09',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    beforeAfter: {
      title: '거실 통창 샤시 교체 & 한강 파노라마 뷰',
      roomType: 'living',
      beforeImageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      beforeDescription: '알루미늄 낡은 이중 샤시로 창살이 시야를 가리고 결로와 곰팡이가 심했던 25년 차 구축 상태',
      afterImageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      afterDescription: 'KCC 로이유리 슬림 시스템 단열창으로 교체하여 탁 트인 한강 조망 확보 및 겨울철 단열 완벽 개선'
    },
    roomPhotos: [
      {
        id: 'r-04-1',
        roomType: 'living',
        roomNameKo: '거실',
        title: '탁 트인 개방감의 미니멀 거실',
        description: '걸레받이와 문틀을 최소화한 무문선 시공과 연그레이 포세린 타일 느낌의 광폭 강마루',
        imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        highlights: ['시스템 뷰 샤시', '무문선 방문 도어', '크림그레이 광폭 강마루', '슬림 라인조명']
      },
      {
        id: 'r-04-2',
        roomType: 'kitchen',
        roomNameKo: '주방',
        title: '11자형 미니멀 주방 & 히든 수납장',
        description: '냉장고장과 팬트리를 벽체처럼 평평하게 마감한 푸시도어 시스템과 콤팩트 아일랜드',
        imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80',
        highlights: ['푸시도어 일체형 냉장고장', '사각 싱크볼', '상부장 없는 오픈 선반', '아일랜드 바 의자존']
      },
      {
        id: 'r-04-3',
        roomType: 'bathroom',
        roomNameKo: '욕실',
        title: '모던 그레이 톤의 건식 감성 욕실',
        description: '유리 파티션으로 샤워 부스를 완벽히 분리하고, 은은한 조명 거울로 아늑함을 더한 공간',
        imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80',
        highlights: ['투명 유리 샤워파티션', 'LED 터치 거울', '물빠짐 트렌치 유가', '매립 젠다이 선반']
      },
      {
        id: 'r-04-4',
        roomType: 'entrance',
        roomNameKo: '현관/중문',
        title: '라운드 아치 게이트와 벤치형 신발장',
        description: '외출 시 신발을 편히 신을 수 있는 벤치 수납장과 부드러운 곡선 아치로 맞이하는 입구',
        imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
        highlights: ['라운드 아치형 통로', '신발장 하부 벤치', '지문인식 푸시풀 도어락', '테라조 타일 바닥']
      }
    ],
    features: ['25년 차 구축 아파트 전면 배관·샤시 올교체', '발코니 전면 확장 및 단열 3중 보강', '11자 대면형 주방 및 히든 수납', '라운드 곡선 게이트 포인트'],
    materials: {
      floor: '동화자연마루 나투스진 그란데 (사하라 라이트)',
      wall: '신한벽지 스케치 무광 친환경 화이트',
      lighting: '전구색/주백색 전환 가능한 스마트 IoT 다운라이트',
      kitchen: 'PET 무광 매트화이트 도어 & 칸스톤 루체른 상판',
      bathroom: '모던 샌드그레이 300x600 타일 & 대림바스 일체형 세면대'
    },
    agentNote: '구축 아파트 매매 후 인테리어를 고민하시는 매수 고객님들께 "구축도 신축보다 예뻐질 수 있다"는 확신을 드리는 대표 사례입니다.',
    availableListingNotice: '옥수하이츠 한강뷰 8층 매물 급매 진행중'
  },
  {
    id: 'apt-05',
    refCode: 'CRWSSA0030',
    cartierCollection: '산토스 뒤몽 (Santos-Dumont)',
    modelEdition: '라지 모델 (39평형)',
    maisonStory: '도심 속 센트럴파크 호수 조망을 감상할 수 있는 창가 원목 단올림 평상과 차콜 그레이의 절제미. 산토스 뒤몽의 슬림하고 정제된 케이스 프로파일처럼 현대적인 도시 감성과 홈카페의 여유로움을 조화시켰습니다.',
    complexName: '월성협성휴포레',
    subTitle: '어반 모던 그레이 & 시티뷰 홈카페 라운지 인테리어',
    address: '대구광역시 달서구 월성동',
    pyeong: 39,
    squareMeters: 101,
    style: '모던 미니멀',
    costMillionWon: 6100,
    durationWeeks: 4,
    completionDate: '2024.10',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    beforeAfter: {
      title: '거실 창가 홈카페 & 서재 공간 구성',
      roomType: 'living',
      beforeImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      beforeDescription: '밋밋했던 광폭 거실 공간이 단순히 TV와 소파만 놓여 효율적으로 활용되지 못했던 상태',
      afterImageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      afterDescription: '창가 단올림 평상을 제작하여 센트럴파크 호수 뷰를 감상하는 티테이블 및 힐링 공간으로 재구성'
    },
    roomPhotos: [
      {
        id: 'r-05-1',
        roomType: 'living',
        roomNameKo: '거실',
        title: '단올림 평상과 센트럴파크 시티뷰',
        description: '차분한 다크 그레이와 우드의 믹스매치, 창가에 원목 단올림 평상을 시공하여 도심 속 티룸 완성',
        imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
        highlights: ['원목 단올림 힐링 평상', '마그네틱 트랙조명', '통창 블라인드 전동제어', '포세린 타일 바닥']
      },
      {
        id: 'r-05-2',
        roomType: 'kitchen',
        roomNameKo: '주방',
        title: '차콜 그레이 아일랜드 & 빌트인 홈바',
        description: '고급스러운 차콜 톤 수납장과 에스프레소 머신 전용 홈카페 선반을 갖춘 다이닝 공간',
        imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        highlights: ['홈바 카페장 내장 조명', '차콜 매트 도어', '인덕션 빌트인', '보조 주방 슬라이딩 도어']
      },
      {
        id: 'r-05-3',
        roomType: 'bedroom',
        roomNameKo: '침실',
        title: '시티 야경을 품은 미니멀 마스터룸',
        description: '불필요한 요소를 배제하고 편안한 숙면에 집중할 수 있는 간접 간이 조명과 차분한 모노톤 배색',
        imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
        highlights: ['호텔식 침대 헤드보드', '스마트폰 무선충전 콘센트 매립', '암막 커튼박스 간접등']
      }
    ],
    features: ['창가 원목 평상 시공으로 뷰포인트 특화', '홈카페 전용 수납장 및 빌트인 전기 배선', '다크 그레이 & 월넛 우드 믹스매치', '스마트홈 디밍 조명 제어'],
    materials: {
      floor: 'LG 하우시스 엑스컴포트 5.0T 프리미엄 텐더그레이',
      wall: '벤자민무어 스커프-X 무광 페인트 도장벽',
      lighting: '라인조명 & 3인치 다운라이트 듀얼 서킷',
      kitchen: '에넥스 키친 팔레트 시리즈 & 오로라 세라믹 상판',
      bathroom: '다크그레이 포세린 타일 & 블랙 무광 수전'
    },
    agentNote: '트렌디한 30~40대 전문직 고객님들이 가장 선호하시는 도심형 모던 스타일입니다. 공간 활용도가 탁월합니다.',
    availableListingNotice: '센트럴파크 2차 102동 고층 호수뷰 세대 추천 가능'
  },
  {
    id: 'apt-06',
    refCode: 'CRWSBB0040',
    cartierCollection: '발롱 블루 드 까르띠에 (Ballon Bleu de Cartier)',
    modelEdition: '미디엄 모델 (33평형)',
    maisonStory: '부드러운 조약돌 같은 유려한 곡선과 푸른 카보숑 크라운을 품은 발롱 블루의 로맨티시즘. 우물천장의 부드러운 곡선 코브 간접조명과 웜 크림베이지 톤온톤 배색으로 신혼부부의 안락한 쉼터를 구현했습니다.',
    complexName: '월배아이파크2차',
    subTitle: '신혼부부를 위한 소프트 크림베이지 & 라운드 코브 조명',
    address: '대구광역시 달서구 유천동',
    pyeong: 33,
    squareMeters: 84,
    style: '화이트&웜그레이',
    costMillionWon: 4900,
    durationWeeks: 3.5,
    completionDate: '2024.11',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    beforeAfter: {
      title: '복도 및 거실 라운드 우물천장 시공',
      roomType: 'living',
      beforeImageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      beforeDescription: '직사각형의 투박한 거실 등박스와 각진 모서리로 공간이 다소 경직되어 보였던 기존 인테리어',
      afterImageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      afterDescription: '부드러운 곡선 라운드 코브 천장과 무몰딩 시공으로 층고가 10cm 이상 높아보이는 시각적 효과 부여'
    },
    roomPhotos: [
      {
        id: 'r-06-1',
        roomType: 'living',
        roomNameKo: '거실',
        title: '소프트 크림베이지 톤의 포근한 거실',
        description: '따뜻한 햇살이 머무는 크림톤 패브릭 소파와 웜그레이 원목마루, 라운드 코브 조명이 어우러진 공간',
        imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
        highlights: ['라운드 코브 조명', '광폭 친환경 강마루', '무선 월패드 매립', '미니멀 아트월']
      },
      {
        id: 'r-06-2',
        roomType: 'kitchen',
        roomNameKo: '주방',
        title: '대면형 라운드 아일랜드 식탁',
        description: '모서리를 둥글게 가공한 맞춤형 아일랜드와 따뜻한 주백색 팬던트 조명으로 완성한 다이닝',
        imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
        highlights: ['라운드 가공 상판', '비스포크 냉장고 매립핏', '사각 싱크볼', '인덕션 다운드래프트 후드']
      },
      {
        id: 'r-06-3',
        roomType: 'bathroom',
        roomNameKo: '욕실',
        title: '조적 젠다이와 템바보드 무늬 타일',
        description: '세면대 벽면 템바보드 질감 포인트 타일과 따스한 간접등 거울로 편안한 휴식 공간 연출',
        imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
        highlights: ['템바보드 포인트 타일', '졸리컷 젠다이 선반', '일체형 세면기', '절수형 수전']
      }
    ],
    features: ['신혼부부 맞춤 소프트 웜베이지 톤앤매너', '라운드 코브 우물천장 & 간접 라인조명', '모서리 라운드 가공 아일랜드 식탁', '단열 샷시 필름 래핑 및 손잡이 교체'],
    materials: {
      floor: '이건마루 세라 플렉스 (소프트 바닐라)',
      wall: '개나리벽지 에비뉴 무광 웜크림 친환경 실크',
      lighting: '루미수 스마트 LED 3인치 다운라이트 & T5 웜화이트',
      kitchen: 'LX Z:IN 셀렉션 5 클린오픈 & 오로라 블랑 상판',
      bathroom: '국산 600x600 포세린 타일 & 대림 도기'
    },
    agentNote: '잠실 엘스/리센츠 단지 내에서 신혼부부 입주 시 가장 호응이 좋은 스타일입니다. 5천만원 미만 예산으로 전체 분위기를 드라마틱하게 전환했습니다.',
    availableListingNotice: '잠실엘스 33평 중층 역세권 추천 동 매물 상담 가능'
  }
];
