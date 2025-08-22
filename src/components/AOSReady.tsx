"use client";
import { useEffect } from "react";

export default function AOSReady() {
  useEffect(() => {
    try {
      (window as any).AOS?.init?.({ duration: 700, once: true, offset: 100 });
    } catch {}
    const t = setTimeout(() => {
      document.querySelectorAll<HTMLElement>("[data-aos]").forEach((el) => {
        if (!el.classList.contains("aos-animate")) el.style.opacity = "1";
      });
    }, 800);
    return () => clearTimeout(t);
  }, []);
  return null;
}
