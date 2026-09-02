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
    englishTitle: "Real-time Industrial Safety Monitoring Platform",
    period: "2026.04 — 2026.06",
    type: "팀 프로젝트",
    access: "public",
    github: "https://github.com/your-id/sensa",
    summary:
      "산업 현장의 유해가스·전력 데이터를 실시간으로 수집하고 위험 상황을 판정하여 관제 화면과 외부 알림으로 전달하는 통합 안전 모니터링 플랫폼",
    techStack: [
      "Django",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Celery",
      "WebSocket",
      "Docker",
      "Kubernetes",
      "Prometheus",
    ],
    problem:
      "산업 현장의 센서 데이터는 끊임없이 유입되지만, 수집부터 위험 판정, 실시간 관제, 알람, 위험구역 관리까지를 하나의 흐름으로 처리해야 했습니다. 모든 데이터를 동일한 방식으로 저장하고 처리하면 시스템 부하가 커지기 때문에, 실시간성은 유지하면서 불필요한 저장과 경보 폭주를 줄이는 것이 핵심 과제였습니다.",
    architectureDiagram: `Sensor Data Generator (FastAPI)
        │  1s interval
        ▼
Django REST API
        │
   ┌────┼────┐
   ▼    ▼    ▼
 검증  위험판정  상태갱신(Redis)
   │    │
   │    ├── WebSocket 방송 → 관제 화면
   │    └── Alarm Engine → Discord 알림
   ▼
저장 게이트 (주기적 배치)
        │
        ▼
   PostgreSQL`,
    architectureNote:
      "실시간 상태 처리와 무거운 저장 처리를 분리해, 매 이벤트마다 관제·알람은 즉시 처리하고 DB 저장은 일정 주기로 묶어 처리했습니다.",
    contribution: [
      {
        title: "백엔드 파이프라인",
        description:
          "센서 데이터를 수신하고 검증한 뒤 위험 상태를 판정하여 저장·방송·경보로 이어지는 백엔드 파이프라인을 구현했습니다.",
      },
      {
        title: "실시간 WebSocket 방송",
        description:
          "센서 상태와 위험 이벤트를 관제 화면에 실시간으로 전달하는 WebSocket 기반 방송 구조를 구현했습니다.",
      },
      {
        title: "경보 신뢰성",
        description:
          "임계값 근처에서 상태가 반복적으로 바뀔 때 발생하는 알람 폭주를 막기 위해, 상태 기반 히스테리시스와 중복 억제 로직을 구현했습니다.",
      },
      {
        title: "Kubernetes 배포",
        description:
          "다중 Pod 환경에서 서비스가 정상 동작하도록 배포 환경을 구성하고, Redis 원자 게이트로 이벤트 처리의 정합성을 검증했습니다.",
      },
    ],
    challenges: [
      {
        title: "실시간성과 시스템 부하",
        description:
          "모든 센서 이벤트를 동일하게 무겁게 처리하면 부하가 커집니다. 실시간 상태 처리·WebSocket 방송·위험 판단은 매 이벤트마다 즉시 수행하고, DB 저장 같은 무거운 처리는 주기적인 게이트로 분리해 부하를 줄였습니다.",
      },
      {
        title: "경보 폭주",
        description:
          "센서 값이 임계값 근처에서 WARNING과 NORMAL을 반복하면 알람이 계속 발생합니다. 상태 변화에 히스테리시스와 재알림 간격을 적용해 반복 경보를 억제했습니다.",
      },
    ],
    result: [
      "1초 단위 데이터 수집과 실시간 방송 구조 검증",
      "저장 게이트 도입으로 DB 저장량 감소",
      "경보 중복 억제 로직 검증",
      "Kubernetes 3 Pod 환경에서 이벤트 처리 정합성 검증",
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
