import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              project.access === "public" ? "bg-signal" : "bg-alert"
            }`}
          />
          <span className="text-xs text-muted">
            {project.access === "public" ? "공개 저장소" : "비공개"} · {project.type}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{project.title}</h1>
        <p className="mt-2 text-base text-muted">{project.englishTitle}</p>
        {project.period && <p className="mt-1 text-sm text-muted">{project.period}</p>}
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/85">{project.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="border border-line px-2.5 py-1 text-sm text-muted">
              {tech}
            </span>
          ))}
        </div>

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block border border-ink px-5 py-2.5 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
          >
            GitHub에서 코드 보기
          </a>
        )}

        {project.access === "private" && (
          <p className="mt-8 border border-line bg-paper-raised px-4 py-3 text-sm text-muted">
            일부 데이터 및 소스코드는 보안 정책상 공개하지 않습니다.
          </p>
        )}

        <div className="mt-16 space-y-14">
          <div>
            <h2 className="flex items-baseline gap-3 text-lg font-semibold tracking-tight">
              <span className="text-sm text-muted">01</span>
              Problem
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/85">{project.problem}</p>
          </div>

          <div>
            <h2 className="flex items-baseline gap-3 text-lg font-semibold tracking-tight">
              <span className="text-sm text-muted">02</span>
              Architecture
            </h2>
            <pre className="mt-4 overflow-x-auto border border-line bg-paper-raised p-4 font-mono text-xs leading-relaxed text-ink/90">
{project.architectureDiagram}
            </pre>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/85">
              {project.architectureNote}
            </p>
          </div>

          <div>
            <h2 className="flex items-baseline gap-3 text-lg font-semibold tracking-tight">
              <span className="text-sm text-muted">03</span>
              My Contribution
            </h2>
            <div className="mt-4 space-y-6">
              {project.contribution.map((item) => (
                <div key={item.title}>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="flex items-baseline gap-3 text-lg font-semibold tracking-tight">
              <span className="text-sm text-muted">04</span>
              Technical Challenge
            </h2>
            <div className="mt-4 space-y-6">
              {project.challenges.map((c) => (
                <div key={c.title} className="border-l-2 border-alert pl-4">
                  <h3 className="font-medium">{c.title}</h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="flex items-baseline gap-3 text-lg font-semibold tracking-tight">
              <span className="text-sm text-muted">05</span>
              Result
            </h2>
            <ul className="mt-4 space-y-2">
              {project.result.map((r) => (
                <li key={r} className="flex gap-3 text-sm leading-relaxed">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-line pt-8">
          <a href="/#projects" className="text-sm font-medium text-muted transition-colors hover:text-ink">
            ← 다른 프로젝트 보기
          </a>
        </div>
      </main>
    </>
  );
}
