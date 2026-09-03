import Nav from "@/components/Nav";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

const skillGroups = [
  {
    title: "AI / ML",
    items: ["Python", "PyTorch", "TensorFlow", "YOLO", "OpenCV", "Scikit-learn", "LLM"],
  },
  {
    title: "Backend",
    items: ["Python", "Java", "C", "C++", "Django", "FastAPI", "Node.js", "REST API"],
  },
  { title: "Database", items: ["MySQL", "PostgreSQL", "SQLite", "SQL"] },
  { title: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS"] },
  { title: "DevOps / Tools", items: ["Docker", "Git", "GitHub", "Linux"] },
];

const facts = [
  { label: "Role", value: "AI / Backend Developer" },
  { label: "Focus", value: "AI, Machine Learning, Backend, Data" },
  { label: "Education", value: "컴퓨터공학 학사" },
];

const [featured, ...rest] = projects;

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <section className="mx-auto max-w-4xl px-6 pb-20 pt-16 md:pt-24">
          <svg viewBox="0 0 600 80" className="mb-10 h-16 w-full max-w-md text-signal" fill="none">
            <path
              className="signal-path"
              d="M0 40 H140 L160 12 L180 68 L200 40 H320 L340 20 L360 60 L380 40 H600"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="max-w-2xl break-keep text-4xl font-semibold leading-[1.3] tracking-tight md:text-5xl">
            AI 모델과 데이터를 활용해 실제 문제를 해결하는 AI {"&"} Backend Developer 김재승입니다.
          </h1>
          <p className="mt-6 max-w-xl break-keep text-base leading-relaxed text-muted md:text-lg">
            문제가 발생하면 기존 해결 방법을 먼저 탐색하고, 적합한 모델을 조사해 실험을 통해 답을
            찾아갑니다. 그 과정에서 얻은 데이터를 분석해 다시 개선합니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="border border-ink bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-transparent hover:text-ink"
            >
              프로젝트 보기
            </a>
            <a
              href="#contact"
              className="border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-ink"
            >
              연락하기
            </a>
          </div>
        </section>

        <section id="about" className="border-t border-line">
          <div className="mx-auto grid max-w-4xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_1fr] md:py-20">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">About</h2>
              <div className="mt-5 max-w-lg space-y-4">
                <p className="break-keep text-base leading-relaxed text-ink/85">
                  주어진 조건이 이상적이지 않아도, 해결할 방법을 찾는 AI·Backend 개발자입니다.
                  데이터가 부족하거나 요구사항이 복잡한 상황에서도 완벽한 환경을 기다리기보다,
                  현재 가진 데이터와 기술로 가능한 해결 방법부터 찾습니다. 문제를 해결할 때
                  하나의 기술에만 의존하지 않고, 다양한 모델과 접근 방법을 탐색한 뒤 직접
                  실험하고 결과를 비교하며 적합한 방법을 찾아갑니다.
                </p>
                <p className="break-keep text-base leading-relaxed text-ink/85">
                  서로 다른 요구사항을 조율하고 협업 과정을 정리해 팀이 같은 목표를 바라볼 수
                  있도록 만드는 과정도 중요하게 생각합니다. 혼자 문제를 해결하는 데서 그치지
                  않고, 기술과 협업을 연결해 더 나은 결과를 만들어내는 개발자를 지향합니다.
                </p>
              </div>
            </div>
            <dl className="divide-y divide-line self-start border border-line">
              {facts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[80px_1fr] gap-4 px-4 py-3 text-sm">
                  <dt className="text-muted">{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="skills" className="border-t border-line">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <h2 className="text-xl font-semibold tracking-tight">Skills</h2>
            <div className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
              {skillGroups.map((group) => (
                <div key={group.title} className="bg-paper p-5">
                  <h3 className="text-sm font-medium text-muted">{group.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className={
                          item === "Python"
                            ? "border border-signal bg-signal-soft px-2.5 py-1 text-sm font-medium text-ink transition-colors"
                            : "border border-line px-2.5 py-1 text-sm transition-colors hover:border-signal hover:bg-signal-soft"
                        }
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="border-t border-line">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
            <div className="mt-8">
              <ProjectCard project={featured} featured />
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {rest.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="border-t border-line">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
            <h2 className="text-xl font-semibold tracking-tight">Contact</h2>
            <p className="mt-4 max-w-md break-keep text-base leading-relaxed text-muted">
              새로운 문제나 협업 제안이 있다면 편하게 연락 주세요.
            </p>
            <div className="mt-8 flex flex-col gap-3 text-base sm:flex-row sm:gap-8">
              <a
                href="mailto:js6088@naver.com"
                className="font-medium underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
              >
                js6088@naver.com
              </a>
              <a
                href="https://github.com/normaluser111"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
              >
                github.com/normaluser111
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-4xl px-6 py-8 text-xs text-muted">
          © {new Date().getFullYear()} Kim Jae-seung
        </div>
      </footer>
    </>
  );
}
