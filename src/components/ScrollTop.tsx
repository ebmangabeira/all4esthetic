"use client";
import { useEffect, useState } from "react";

export default function ScrollTop() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onScroll = () => setActive(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pageshow", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pageshow", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a
      id="scroll-top"
      href="#header"
      aria-label="Voltar ao topo da página"
      className={`scroll-top d-flex align-items-center justify-content-center${active ? " active" : ""}`}
      data-owner="react"              
      onClick={handleClick}
    >
      <i className="bi bi-arrow-up-short" aria-hidden="true" />
    </a>
  );
}
