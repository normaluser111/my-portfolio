import Link from "next/link";
import type { Project } from "@/lib/projects";

export default function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group flex flex-col justify-between border border-line bg-paper-raised p-6 transition-colors hover:border-ink ${
        featured ? "md:p-8" : ""
      }`}
    >
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              project.access === "public" ? "bg-signal" : "bg-alert"
            }`}
          />
          <span className="text-xs text-muted">
            {project.access === "public" ? "공개 저장소" : "비공개"}
          </span>
          {featured && (
            <span className="ml-auto text-xs text-muted">대표 프로젝트</span>
          )}
        </div>
        <h3
          className={`font-semibold tracking-tight ${
            featured ? "text-2xl" : "text-lg"
          }`}
        >
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{project.englishTitle}</p>
        <p className="mt-4 break-keep text-sm leading-relaxed text-ink/80">
          {project.summary}
        </p>
        <p className="mt-3 break-keep border-l-2 border-signal pl-3 text-sm font-medium text-ink">
          {project.keyAchievement}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {project.contribution.slice(0, featured ? 4 : 3).map((item) => (
            <span key={item.title}>· {item.title}</span>
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.techStack.slice(0, featured ? 8 : 4).map((tech) => (
          <span
            key={tech}
            className="border border-line px-2 py-0.5 text-xs text-muted"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-1 text-sm font-medium">
        자세히 보기
        <svg
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}
