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
    title: "자율주행 이동 객체 충돌 위험 판단",
    englishTitle: "Autonomous Collision Risk Prediction",
    period: "",
    type: "연구 프로젝트",
    access: "private",
    summary:
      "객체 탐지와 이동 경로 예측을 기반으로 미래 충돌 위험을 판단하는 알고리즘 연구",
    techStack: ["Python", "YOLO", "OpenCV", "PyTorch", "Kalman Filter"],
    problem:
      "단순 객체 탐지만으로는 눈앞의 장애물은 알 수 있어도, 그 객체가 앞으로 어떻게 움직여 충돌로 이어질지는 판단하기 어려웠습니다. 탐지 결과를 시간에 따라 연결해 미래 위치를 예측하고, 그 결과로 위험도를 판단하는 것이 문제였습니다.",
    architectureDiagram: `Camera
  │
  ▼
Object Detection (YOLO)
  │
  ▼
Object Tracking
  │
  ▼
Position Analysis
  │
  ▼
Trajectory Prediction
  │
  ▼
Collision Risk 판단`,
    architectureNote:
      "탐지된 객체를 프레임 간에 추적하며 위치 변화를 분석하고, 이동 경로를 예측해 충돌 가능성을 판단하는 파이프라인을 구성했습니다.",
    contribution: [
      {
        title: "데이터셋 구축과 Fine-tuning",
        description:
          "YOLO 기반 객체 탐지 모델을 위한 데이터셋을 구축하고 Fine-tuning을 진행했습니다.",
      },
      {
        title: "위치·경로 분석",
        description:
          "Bounding Box 기반으로 객체 위치를 분석하고, 이동 경로를 예측하는 로직을 설계했습니다.",
      },
      {
        title: "위험 판단 알고리즘",
        description: "예측된 경로를 기반으로 충돌 위험을 판단하는 알고리즘을 설계했습니다.",
      },
    ],
    challenges: [
      {
        title: "탐지에서 예측으로",
        description:
          "단일 프레임 탐지만으로는 미래를 알 수 없었습니다. 프레임 간 객체를 추적하고 위치 변화를 누적해 이동 경로를 예측하는 방식으로 접근했습니다.",
      },
    ],
    result: [
      "YOLO 기반 객체 탐지 및 추적 파이프라인 구축",
      "이동 경로 예측 기반 충돌 위험 판단 로직 구현",
    ],
  },
  {
    slug: "tensile-strength-prediction",
    title: "금속 마스크 인장강도 예측",
    englishTitle: "Tensile Strength Prediction",
    period: "",
    type: "산학협력 프로젝트",
    access: "private",
    summary:
      "제한된 실험 데이터를 기반으로 금속 마스크의 인장강도를 예측하기 위한 AI 모델 개발",
    techStack: ["Python", "Data Augmentation", "GAN", "Scikit-learn"],
    problem:
      "실험을 통해 얻을 수 있는 인장강도 데이터가 제한적이어서, 적은 데이터로도 신뢰할 수 있는 예측 모델을 만드는 것이 문제였습니다.",
    architectureDiagram: `Experimental Data
      │
      ▼
Data Analysis
      │
      ▼
Data Augmentation
      │
      ▼
GAN
      │
      ▼
Prediction Model
      │
      ▼
Simulator`,
    architectureNote:
      "제한된 실험 데이터를 분석해 특성을 파악하고, 증강과 GAN을 통해 학습 데이터를 보강한 뒤 예측 모델을 학습했습니다.",
    contribution: [
      {
        title: "데이터 분석",
        description: "제한된 실험 데이터를 분석해 인장강도에 영향을 주는 주요 특성을 파악했습니다.",
      },
      {
        title: "데이터 증강",
        description: "GAN을 활용해 부족한 학습 데이터를 보강했습니다.",
      },
      {
        title: "예측 모델 개발",
        description: "보강된 데이터로 인장강도를 예측하는 모델을 개발하고 시뮬레이터로 검증했습니다.",
      },
    ],
    challenges: [
      {
        title: "제한된 데이터",
        description:
          "실험 데이터가 적어 일반적인 학습 방식으로는 모델이 과적합되기 쉬웠습니다. 데이터 증강과 GAN을 활용해 학습 데이터의 양과 다양성을 늘리는 방식으로 접근했습니다.",
      },
    ],
    result: [
      "제한된 데이터에서도 동작하는 예측 모델 개발",
      "시뮬레이터를 통한 예측 결과 검증",
    ],
  },
  {
    slug: "new-normal",
    title: "New Normal",
    englishTitle: "산학협력 웹 프로젝트",
    period: "",
    type: "산학협력 프로젝트 · 팀장",
    access: "private",
    summary: "기존 시스템의 구조를 분석하고 요구사항에 맞게 개선한 산학협력 웹 프로젝트",
    techStack: ["JSP", "MySQL", "DataGrip"],
    problem:
      "새로 만드는 것이 아니라, 이미 운영되고 있는 시스템을 분석해 요구사항에 맞게 수정하고 개선해야 하는 프로젝트였습니다. 기존 JSP 코드와 DB 스키마를 먼저 이해하는 것이 우선이었습니다.",
    architectureDiagram: `기존 JSP 시스템 분석
      │
      ▼
DB Schema 분석 (DataGrip)
      │
      ▼
요구사항 정의
      │
      ▼
기능 수정 및 개선
      │
      ▼
팀 협업 및 검증`,
    architectureNote:
      "팀장으로서 기존 시스템 분석부터 개선 방향 설정, 팀원 협업까지 프로젝트 전체 흐름을 이끌었습니다.",
    contribution: [
      {
        title: "팀장 역할",
        description: "프로젝트 진행을 총괄하며 팀원 간 역할 분배와 일정을 관리했습니다.",
      },
      {
        title: "기존 시스템 분석",
        description: "기존 JSP 코드를 분석해 구조를 파악하고, DataGrip으로 DB 스키마를 분석했습니다.",
      },
      {
        title: "시스템 개선",
        description: "분석 결과를 바탕으로 요구사항에 맞게 기존 시스템을 수정하고 개선했습니다.",
      },
    ],
    challenges: [
      {
        title: "기존 코드 이해",
        description:
          "처음부터 설계하는 것이 아니라 이미 존재하는 코드와 DB 구조를 이해해야 했습니다. 코드를 직접 분석하고 DataGrip으로 스키마를 확인하며 구조를 파악한 뒤 수정 범위를 정했습니다.",
      },
    ],
    result: ["기존 시스템 구조 분석 및 문서화", "요구사항에 맞춘 기능 개선 완료"],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
