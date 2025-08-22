"use client";

import Link from "next/link";
import Container from "./Container";
import React from "react";
import { usePathname } from "next/navigation";

const onKeyActivate = (e: React.KeyboardEvent<HTMLElement>) => {
  if (e.key === "Enter" || e.key === " ") {
    (e.currentTarget as HTMLElement).click();
    e.preventDefault();
  }
};

const normalize = (p?: string) => {
  const base = (p || "/").split(/[?#]/)[0];
  return base === "/" ? "/" : base.replace(/\/+$/, "");
};

export default function Header() {
  const pathname = normalize(usePathname());
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string) => {
    const target = normalize(href);
    if (target === "/") return pathname === "/";
    return pathname === target || pathname.startsWith(target + "/");
  };

  React.useEffect(() => {
    const b = document.body;
    if (open) b.classList.add("mobile-nav-active");
    else b.classList.remove("mobile-nav-active");
    return () => b.classList.remove("mobile-nav-active");
  }, [open]);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1200) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="header position-fixed top-0 w-100" id="header" role="banner">
      <div className="main-header">
        <Container fluid xl className="header-container">
          <div className="d-flex align-items-center w-100">
            <Link className="logo d-inline-flex align-items-center" href="/" aria-label="Página inicial">
              <img alt="Logo" src="/assets/img/logo-header.png" />
            </Link>
            <nav
              className="navmenu ms-auto"
              id="navmenu"
              aria-label="Menu principal"
              role="navigation"
              aria-hidden={false}
            >
              <button
                className="navmenu-close d-xl-none"
                aria-label="Fechar menu"
                type="button"
                onClick={() => setOpen(false)}
              >
                <span className="mobile-nav-close" aria-hidden="true">×</span>
              </button>
              <ul
                onClick={(e) => {
                  const el = e.target as HTMLElement;
                  if (el.closest("a")) setOpen(false);
                }}
              >
                <li>
                  <Link
                    href="/"
                    className={isActive("/") ? "active" : ""}
                    aria-current={isActive("/") ? ("page" as const) : undefined}
                  >
                    Início
                  </Link>
                </li>
                <li>
                  <Link
                    href="/quem-somos"
                    className={isActive("/quem-somos") ? "active" : ""}
                    aria-current={isActive("/quem-somos") ? ("page" as const) : undefined}
                  >
                    Quem Somos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/equipamentos"
                    className={isActive("/equipamentos") ? "active" : ""}
                    aria-current={isActive("/equipamentos") ? ("page" as const) : undefined}
                  >
                    Equipamentos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contacto"
                    className={isActive("/contacto") ? "active" : ""}
                    aria-current={isActive("/contacto") ? ("page" as const) : undefined}
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </nav>
            <button
              className="mobile-nav-toggle d-xl-none ms-2"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-controls="navmenu"
              aria-expanded={open}
              type="button"
              onClick={() => setOpen((v) => !v)}
              onKeyDown={onKeyActivate}
            >
              <i className={`bi ${open ? "bi-x" : "bi-list"} me-0`} aria-hidden="true" />
            </button>
          </div>
        </Container>
      </div>
    </header>
  );
}
