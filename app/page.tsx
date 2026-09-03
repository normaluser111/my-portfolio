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
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.15] tracking-tight md:text-5xl">
            AI 모델과 데이터를 활용해 실제 문제를 해결하는 AI {"&"} Backend Developer 김재승입니다.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
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
              <p className="mt-5 max-w-md text-base leading-relaxed text-ink/85">
                객체 탐지와 시계열 데이터 분석부터 백엔드 시스템 설계까지, 실제 데이터를 다루며
                얻은 경험을 바탕으로 문제를 해결합니다. 새로운 프로젝트를 처음부터 만드는 것뿐
                아니라, 기존 시스템의 구조를 분석하고 요구사항에 맞게 개선하는 작업도 익숙합니다.
              </p>
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
                        className="border border-line px-2.5 py-1 text-sm transition-colors hover:border-signal hover:bg-signal-soft"
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
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
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
