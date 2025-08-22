"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    bootstrap?: any;
  }
}

export default function HashModalOpener() {
  useEffect(() => {
    const isModalId = (id: string | null) => !!id && /^modal/i.test(id);
    const ensureBootstrap = async () => {
      if (window.bootstrap?.Modal) return;
      await new Promise<void>((resolve) => {
        const id = "bs-bundle-script";
        const existing = document.getElementById(id) as HTMLScriptElement | null;
        if (existing) {
          if (window.bootstrap?.Modal) resolve();
          else existing.addEventListener("load", () => resolve(), { once: true });
          return;
        }
        const s = document.createElement("script");
        s.id = id;
        s.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
        s.async = true;
        s.crossOrigin = "anonymous";
        s.addEventListener("load", () => resolve(), { once: true });
        document.head.appendChild(s);
      });
    };

    /** Limpa backdrops órfãos (quando houve navegação entre páginas) */
    const cleanBackdrops = () => {
      const anyOpen = document.querySelector(".modal.show");
      if (!anyOpen) {
        document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("paddingRight");
      }
    };
    const openModalById = (id: string) => {
      const el = document.getElementById(id) as HTMLElement | null;
      if (!el) return false;
      if (!(el.classList.contains("modal") || el.getAttribute("role") === "dialog")) return false;
      try {
        const Modal = window.bootstrap!.Modal;
        const inst = Modal.getOrCreateInstance(el);
        const onShown = () => {
          document.body.classList.add("modal-open");
          document.body.style.paddingRight = "0px";
        };
        const onHidden = () => {
          document.body.style.paddingRight = "";
          cleanBackdrops();
          el.removeEventListener("shown.bs.modal", onShown as any);
          el.removeEventListener("hidden.bs.modal", onHidden as any);
        };
        el.addEventListener("shown.bs.modal", onShown as any, { once: true });
        el.addEventListener("hidden.bs.modal", onHidden as any);
        inst.show();
        return true;
      } catch {
        return false;
      }
    };

    const tryOpen = async (id: string) => {
      await ensureBootstrap();
      cleanBackdrops();
      requestAnimationFrame(() => openModalById(id));
    };
    const openFromHash = () => {
      const h = window.location.hash;
      const id = h.startsWith("#") ? h.slice(1) : "";
      if (isModalId(id)) tryOpen(id);
    };
    openFromHash();
    const onHash = () => openFromHash();
    window.addEventListener("hashchange", onHash);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const dsToggle = a.getAttribute("data-bs-toggle") || "";
      const dsTarget = a.getAttribute("data-bs-target") || "";
      let id: string | null = null;
      const mt = dsTarget.match(/^#([A-Za-z0-9_-]+)/);
      if (dsToggle === "modal" && mt) id = mt[1];
      if (!id) {
        const mh = href.match(/#([A-Za-z0-9_-]+)/);
        if (mh) id = mh[1];
      }
      if (!isModalId(id)) return;
      let samePage = true;
      try {
        const u = new URL(href, window.location.href);
        samePage = u.pathname === window.location.pathname;
      } catch { }

      if (!samePage) return;

      e.preventDefault();
      if (id) {
        if (window.location.hash !== `#${id}`) {
          history.replaceState(null, "", `#${id}`);
        }
        tryOpen(id);
      }
    };
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
