export type ProjectAccess = "public" | "private";

export type Project = {
  slug: string;
  title: string;
  englishTitle: string;
  period: string;
  type: string;
  access: ProjectAccess;
  github?: string;
  summary: string;
  techStack: string[];
  problem: string;
  architectureDiagram: string;
  architectureNote: string;
  contribution: { title: string; description: string }[];
  challenges: { title: string; description: string }[];
  result: string[];
};

export const projects: Project[] = [
  {
    slug: "sensa",
    title: "SenSa",
    englishTitle: "실시간 유해가스·전력 위험 판정 통합 관제 플랫폼",
    period: "2026.04 — 2026.06",
    type: "팀 프로젝트",
    access: "public",
    github: "https://github.com/Diconai-2team/SenSa",
    summary:
      "가스·전력 센서와 작업자 위치를 1초 주기로 수집해 위험을 판정하고, 실시간 관제 화면과 Discord로 즉시 경보하며, 가스 누출 시 물리 모델 기반 동적 위험구역이 자동 생성·확산·승격·만료되는 산업안전 백엔드 플랫폼",
    techStack: [
      "Django",
      "Django REST Framework",
      "FastAPI",
      "Django Channels",
      "PostgreSQL",
      "Redis",
      "Celery",
      "WebSocket",
      "Docker",
      "Kubernetes",
      "Prometheus",
      "Grafana",
    ],
    problem:
      "산업 현장의 가스·전력 센서 데이터는 1초 주기로 끊임없이 유입되고, 이걸 수집·위험 판정·실시간 관제·알람·위험구역 관리까지 하나의 흐름으로 처리해야 했습니다. 모든 데이터를 동일하게 무겁게 저장하고 AI로 분석하면 시스템 부하가 감당이 안 되고, 반대로 임계값 근처에서 값이 흔들릴 때마다 경보를 그대로 내보내면 관제 화면이 알람으로 뒤덮여 정작 중요한 신호를 놓치게 됩니다. 실시간성을 지키면서도 불필요한 저장과 경보 폭주를 줄이는 것이 핵심 과제였습니다.",
    architectureDiagram: `FastAPI 생성기 (1초 주기)
        │
        ▼
Django 수신 API (SensorDataView)
        │
값 검증 → 임계 분류 → 상태 갱신
        │                    │
   매 건 처리             5초 게이트
   ─────────────          ──────────────
   WebSocket 방송         SensorData INSERT
   경보 평가              ARIMA 이상탐지 연동
   위험구역 평가          IsolationForest 연동
        │
        ▼
Discord 외부 알림 (Celery 비동기)`,
    architectureNote:
      "kind 단일 노드 Kubernetes(네임스페이스 sensa) 위에서 동작하며 ingress-nginx로 진입을 통합했습니다. 상태 판정·WebSocket 방송·경보 평가는 매 이벤트마다 즉시 처리하고, DB 저장과 AI 추론(팀원이 구현한 ARIMA 이상탐지·IsolationForest)은 5초 게이트로 솎아, 상태 전이가 일어난 순간만 즉시 저장하도록 분리했습니다.",
    contribution: [
      {
        title: "수집·판정·방송 파이프라인",
        description:
          "센서 데이터 수신(SensorDataView), 값 검증, 5초 저장/AI 게이트, WebSocket 방송으로 이어지는 파이프라인을 구현했습니다.",
      },
      {
        title: "동적 위험구역 도메인",
        description:
          "그레이엄 확산 법칙 계산, 위험구역 자동 발동(P-AZ), 잠정→확인→긴급 tier 승격·만료 라이프사이클, 이벤트 로깅을 구현했습니다.",
      },
      {
        title: "경보 신뢰성",
        description:
          "Redis 기반 상태머신, 상태별 독립 윈도우 카운터를 이용한 히스테리시스, 재알림·중복 억제, graceful degradation을 구현했습니다.",
      },
      {
        title: "실시간 인프라",
        description:
          "Django Channels Consumer, 발행 래퍼, 최신 상태 캐시 등 WebSocket 기반 실시간 인프라를 구현했습니다.",
      },
      {
        title: "배포·관측",
        description:
          "Kubernetes 매니페스트(01~11) 작성, HPA 구성, Prometheus 메트릭과 Grafana 대시보드(18개+ 패널)를 구성했습니다.",
      },
    ],
    challenges: [
      {
        title: "동적 위험구역 — 그레이엄 확산 법칙",
        description:
          "센서가 위험 상태로 전이되는 순간 위험구역이 자동으로 발동돼야 하는데, 모든 가스를 같은 속도로 확산시키면 실제 물리 현상과 맞지 않았습니다. 가스 분자량에 따라 확산 속도가 달라지는 그레이엄 확산 법칙(v ∝ 1/√M)을 적용하고, 이웃 센서의 교차 확인을 거쳐 잠정 → 확인 → 긴급 3단계 tier로 승격시키는 구조를 설계했습니다. 시간 만료와 회복 만료라는 이중 경로를 둬서, 위험이 해소됐는데도 계속 남아있는 '좀비 구역'을 방지했습니다.",
      },
      {
        title: "경보 떨림과 폭주 제어",
        description:
          "센서 값이 임계값 근처에서 오르내리면 WARNING과 NORMAL 상태를 반복하며 알람이 쏟아지는 문제가 있었습니다. 상태별로 독립된 윈도우 카운터(격상 5회 / 회복 7회)로 히스테리시스를 구현해 짧은 진동에는 반응하지 않게 했고, 동일 경보는 60초 간격으로만 재발행하도록 제한했습니다. 억제된 경보 건수 자체도 메트릭으로 노출해서, 알람이 조용히 묻힌 게 아니라 의도적으로 줄었다는 걸 수치로 증명할 수 있게 했습니다.",
      },
      {
        title: "복원력 (graceful degradation)",
        description:
          "Redis, 알림 채널, 외부 알림, 메트릭 같은 보조 기능에 장애가 나더라도 저장·판정·생애주기 관리 같은 핵심 경로는 절대 멈추면 안 됐습니다. 상태 저장소 계층에서는 연결 오류만 흡수하고, 코드 자체의 버그는 그대로 전파되게 만들어서 장애 흡수와 버그 은폐를 명확히 구분했습니다.",
      },
    ],
    result: [
      "저장 게이트 도입으로 유입 3,464건 → 저장 773건, 약 -78% 감소 (상태 전이는 즉시 저장 유지)",
      "경보 차단율 97~98% 달성 (신규 전이는 차단 0건, 반복 신호만 선별 억제 — 메트릭으로 검증)",
      "시나리오 분류 정합률 95.2% (n=1,040, 순수 오분류 0건)",
      "Kubernetes 3 replica 동시 운전 환경에서 위험구역 자동 발동 정확히 1회로 정합성 검증 (Redis 원자 게이트)",
    ],
  },
  {
    slug: "autonomous-collision-risk",
    title: "자율주행 모빌리티 보행자 경로예측 기반 충돌위험판단",
    englishTitle: "Pedestrian Trajectory Prediction & Collision Risk Algorithm",
    period: "2023.03 — 2023.12 (10개월)",
    type: "개인 연구 · 캡스톤 디자인 (학교장 우수상 수상)",
    access: "private",
    summary:
      "YOLOv5 파인튜닝 기반 객체 인식과 멀티모달 거리 추정을 결합해, 보행자·차량·노인·어린이·성인 등 유형별 충돌 위험도에 따라 모빌리티 행동을 차등 제어하는 경로예측 알고리즘. 논문 작성 및 캡스톤 디자인 경연대회 학교장 우수상 수상",
    techStack: ["Python", "YOLOv5", "Multimodal Distance Estimation", "Kalman Filter"],
    problem:
      "단순 객체 탐지만으로는 보행자, 차량, 노인, 어린이, 성인 등 다양한 유형의 대상이 앞으로 어떻게 움직여 충돌로 이어질지 판단하기 어려웠습니다. 유형에 따라 이동 속도와 예측 가능한 행동 패턴, 반응까지 필요한 여유 시간이 다르기 때문에, 이를 구분해서 판단하는 알고리즘이 필요했습니다.",
    architectureDiagram: `Camera + 거리 센서
      │
      ▼
YOLOv5 파인튜닝 객체 인식·분류
(보행자 · 차량 · 노인 · 어린이 · 성인)
      │
      ▼
Kalman Filter 기반 데이터 정제
      │
      ▼
인식 시각 + 객체 유형 + 속도 기반
충돌까지 남은 예측 시간 산출
      │
      ▼
통계 기반 회피 알고리즘 선택
(회피 · 정지 · 직진)`,
    architectureNote:
      "카메라와 거리 정보를 결합한 멀티모달 파이프라인으로 위치를 추정하고, Kalman Filter로 노이즈를 정제한 뒤, 인식 시각·객체 종류·속도 기반 예측 시간을 종합해 통계적으로 검증된 회피 알고리즘을 선택하도록 설계했습니다.",
    contribution: [
      {
        title: "객체 인식·분류 및 알고리즘 설계",
        description:
          "YOLOv5 파인튜닝으로 보행자·차량·노인·어린이·성인 등 객체를 실시간 인식·분류하고, 유형별 action 결정 시간을 산출하는 알고리즘을 설계부터 구현까지 단독으로 수행했습니다.",
      },
      {
        title: "멀티모달 거리 추정 및 데이터 수집",
        description:
          "카메라·길이 정보를 결합한 멀티모달 거리 추정 파이프라인을 직접 구축하고, 실제 주행 환경 데이터를 직접 수집해 모델 학습에 활용했습니다.",
      },
      {
        title: "센서 데이터 정제",
        description:
          "카메라와 거리 센서로 얻은 원시 데이터의 노이즈를 Kalman Filter로 정제해 위치·속도 추정의 신뢰도를 높였습니다.",
      },
      {
        title: "경로예측 로직 개발",
        description:
          "노인·어린이·성인 등 객체 유형 및 충돌 위험도에 따라 모빌리티 행동을 차등 제어하는 경로예측 로직(회피, 정지, 직진)을 개발했습니다.",
      },
    ],
    challenges: [
      {
        title: "노이즈가 많은 실시간 센서 데이터",
        description:
          "카메라와 거리 센서로 얻은 원시 데이터에는 노이즈가 많아 그대로 쓰면 판단이 흔들렸습니다. Kalman Filter로 데이터를 정제해 위치·속도 추정의 신뢰도를 높인 뒤 이후 판단 로직에 사용했습니다.",
      },
      {
        title: "연구 환경과 비용의 현실적 제약",
        description:
          "여러 자율주행 환경을 직접 조성해보고 다양한 회피 방식을 실험해보고 싶었지만, 실제 연구 환경과 비용을 고려하면 처음부터 새로운 실험적 회피 방식을 만드는 건 현실적이지 않았습니다. 대신 기존 통계 데이터를 활용해 객체 유형·속도별 충돌 위험도를 계산하고, 이를 기반으로 회피 알고리즘을 선택하는 실용적인 방향으로 전환했습니다.",
      },
    ],
    result: [
      "개발한 알고리즘을 바탕으로 논문 작성",
      "캡스톤 디자인 경연대회 학교장 우수상 수상",
      "실제 주행 환경 데이터 기반 모델 학습 및 검증 완료",
    ],
  },
  {
    slug: "tensile-strength-prediction",
    title: "세우 프로젝트 — 금속 마스크 인장강도 예측",
    englishTitle: "Tensile Strength Prediction via GAN-based Data Augmentation",
    period: "2023.05 — 2023.12 (8개월)",
    type: "산학협력 프로젝트 · 고려대학교 AI·IoT 연구실 학부연구생",
    access: "private",
    summary:
      "150개 남짓의 실험 데이터로는 학습이 불가능했던 인장강도 예측 문제를, GAN 기반 데이터 생성과 시뮬레이터 반복 검증으로 해결한 산학협력 프로젝트",
    techStack: ["Python", "GAN", "Deep Learning", "Simulator"],
    problem:
      "실험을 통해 얻을 수 있는 인장강도 데이터가 150개 정도로 극히 적었습니다. 사수님과 함께 약 2개월간 기존 방식의 예측 모델을 다양하게 시도했지만, 데이터 자체가 부족해 유의미한 결과가 나오지 않았습니다. 이 문제는 세우 기업이 4년 동안 사내에서도 해결하지 못한 과제였습니다.",
    architectureDiagram: `150개 실험 데이터 (부족)
      │
      ▼
2개월간 기존 방식 탐색 → 해결 안 됨
      │
      ▼
[제안] 데이터를 직접 복제(생성)하자
      │
      ▼
[제안] GAN으로 실제와 유사한 데이터 생성
      │
      ▼
[제안] 시뮬레이터로 반복 실험·검증
      │
      ▼
실제 데이터 입력 시 기대값 추측`,
    architectureNote:
      "핵심은 데이터를 더 모으는 대신, 있는 데이터의 패턴을 학습해 유사한 데이터를 직접 복제해내자는 방향 전환이었습니다. 이 데이터 복제 아이디어, GAN 모델 활용 제안, 시뮬레이터 기반 반복 실험으로 결과를 검증하자는 접근까지 전 과정을 제가 직접 제안하고 주도했습니다.",
    contribution: [
      {
        title: "모델 탐색",
        description:
          "사수님과 함께 약 2개월간 다양한 예측 모델을 시도했지만, 150개의 데이터만으로는 유의미한 결과를 얻지 못했습니다.",
      },
      {
        title: "데이터 복제 방향 제안 (주도)",
        description:
          "데이터를 더 모으는 대신, 부족한 데이터를 직접 복제(생성)해서 학습에 활용하자는 아이디어를 제가 제안했습니다. GAN(Generative Adversarial Networks)을 활용한 시뮬레이터 데이터 증강 연구로 이어졌습니다.",
      },
      {
        title: "도메인 갭 완화 방법론 실험·검증",
        description:
          "시뮬레이터 환경에서 추가 학습 데이터를 생성해 실제 환경과의 도메인 갭을 줄이는 방법론을 직접 설계해 실험하고 검증했습니다.",
      },
      {
        title: "재학습 및 정확도 검증",
        description:
          "생성 데이터로 모델을 재학습하여 인장강도(성능) 예측 정확도 향상을 확인하고, 실험 결과를 문서화했습니다.",
      },
    ],
    challenges: [
      {
        title: "150개 데이터로는 학습이 안 됨 — 방향 전환을 제안",
        description:
          "사수님과 함께 2개월간 다양한 예측 모델을 시도했지만 데이터 자체가 부족해 답이 나오지 않았습니다. 데이터를 더 모으는 게 현실적으로 어려운 상황에서, 부족한 데이터를 직접 복제(생성)해서 학습에 쓰자는 방향을 제가 제안했고, 이를 GAN 모델로 구현하는 접근을 주도했습니다.",
      },
      {
        title: "생성 데이터의 신뢰도 검증",
        description:
          "GAN이 만든 데이터가 실제와 얼마나 가까운지 확신할 수 없었습니다. 생성 데이터로 시뮬레이터를 반복 실행해 검증하자는 것도 제가 제안한 방식으로, 예측 정확도를 반복 점검하며 신뢰도를 쌓아갔습니다.",
      },
    ],
    result: [
      "150개의 제한된 데이터에서 GAN 기반 데이터 생성으로 학습 데이터 문제 해결",
      "시뮬레이터 반복 검증으로 예측 정확도 향상 확인",
      "4년간 해결하지 못한 인장강도 예측 과제 해결",
    ],
  },
  {
    slug: "new-normal",
    title: "New Normal",
    englishTitle: "산학협력 웹 서비스 (고려대학교 산학협력단)",
    period: "",
    type: "산학협력 프로젝트 · 팀장",
    access: "private",
    summary:
      "기업의 실무 요구와 산학협력단의 학습 평가 요구, 서로 다른 두 이해관계자의 요구사항을 동시에 조율하며 이끈 산학협력 웹 서비스 프로젝트",
    techStack: ["Java", "Spring", "JSP", "MyBatis", "Docker", "Git", "Notion", "DataGrip"],
    problem:
      "팀장으로서 성격이 다른 두 이해관계자의 요구사항을 동시에 충족시켜야 했습니다. 기업은 실제 서비스에 반영될 디자인 수정과 기능 개선을 원했고, 산학협력단은 학생 프로젝트로서 SWOT 분석, DB 스키마 분석, Notion을 통한 개발사항 공유 같은 프로세스와 학습 산출물을 요구했습니다. 이 두 요구를 하나의 일정 안에서 함께 만족시키는 것이 관건이었습니다.",
    architectureDiagram: `기업 요구사항 트랙          산학협력단 요구사항 트랙
디자인·기능 수정            SWOT 분석 · 스키마 분석
      │                            │
      └──────────┬─────────────────┘
                  ▼
     Notion 기반 개발사항 공유 체계
                  │
                  ▼
   Spring + JSP + MyBatis 백엔드 구현
                  │
                  ▼
      Docker 기반 개발 환경 표준화`,
    architectureNote:
      "기업 대응과 산학협력단 대응을 별도 트랙으로 나눠 관리하되, Notion을 매개로 두 트랙의 진행 상황을 한 곳에서 공유해 팀 전체가 항상 같은 그림을 보도록 했습니다.",
    contribution: [
      {
        title: "이중 이해관계자 조율",
        description:
          "기업이 원하는 디자인·기능 수정 요구와, 산학협력단이 요구하는 SWOT 분석·스키마 분석·Notion 공유 같은 학습 산출물 요구를 하나의 일정 안에서 병행 관리했습니다.",
      },
      {
        title: "협업 프로세스 수립",
        description:
          "Notion과 Git을 활용한 협업 프로세스를 수립하고, 프로젝트 현황·코드 공유 체계를 팀 전체에 정착시켰습니다.",
      },
      {
        title: "백엔드 설계·구현",
        description:
          "Spring + JSP + MyBatis 기반 웹 서비스 백엔드를 설계·구현하며 MVC 패턴 적용과 DB 연동을 담당했습니다.",
      },
      {
        title: "개발 환경 표준화 및 DB 관리",
        description:
          "Docker로 개발 환경을 컨테이너화해 팀원 간 환경 차이 이슈를 제거하고, DataGrip으로 데이터 모델을 관리하고 쿼리를 최적화했습니다.",
      },
    ],
    challenges: [
      {
        title: "서로 다른 두 이해관계자의 요구",
        description:
          "기업은 실제 서비스 품질(디자인, 기능)을 중시했고, 산학협력단은 학생의 학습 과정(분석, 문서화, 공유)을 중시했습니다. 두 요구를 경쟁시키지 않고, 기업 대응 트랙과 산학협력단 대응 트랙을 나눠 병행하면서 Notion을 통해 진행 상황을 투명하게 공유해, 팀원 모두가 지금 무엇을 왜 하고 있는지 알 수 있게 했습니다.",
      },
      {
        title: "개발 환경 차이",
        description:
          "팀원마다 로컬 개발 환경이 달라 발생하는 이슈가 잦았습니다. Docker로 개발 환경을 컨테이너화해 이 문제를 사전에 제거했습니다.",
      },
    ],
    result: [
      "기업 요구사항(디자인·기능 수정)과 산학협력단 요구사항(SWOT·스키마 분석·문서화)을 동시 충족",
      "Notion + Git 기반 협업 프로세스를 팀 전체에 정착",
      "Spring + JSP + MyBatis 기반 백엔드 설계·구현 완료",
      "Docker 기반 개발 환경 표준화로 환경 이슈 제거",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
