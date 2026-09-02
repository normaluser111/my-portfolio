"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          김재승
        </Link>
        {isHome ? (
          <nav className="flex gap-6 text-sm text-muted">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : (
          <Link
            href="/#projects"
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            프로젝트 목록으로
          </Link>
        )}
      </div>
    </header>
  );
}
