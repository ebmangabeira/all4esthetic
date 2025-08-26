// src/components/Preloader.tsx
"use client";
import React from "react";

type Props = {
  always?: boolean;
  minDurationMs?: number;
  timeoutMs?: number;
};

export default function Preloader({
  always = false,
  minDurationMs = 500,
  timeoutMs = 7000,
}: Props) {
  const [visible, setVisible] = React.useState(true);
  const [dots, setDots] = React.useState(0);
  const hideTimerRef = React.useRef<number | null>(null);
  const minTimerRef = React.useRef<number | null>(null);
  const dotsTimerRef = React.useRef<number | null>(null);
  const mountedAtRef = React.useRef<number>(Date.now());

  React.useEffect(() => {
    dotsTimerRef.current = window.setInterval(() => {
      setDots((d) => (d + 1) % 4);
    }, 400);
    return () => {
      if (dotsTimerRef.current) window.clearInterval(dotsTimerRef.current);
    };
  }, []);

  const doHideNow = React.useCallback(() => {
    const root = document.getElementById("a4e-preloader");
    // fade out do overlay
    root?.classList.add("is-hiding");

    // libera o scroll e marca a página como pronta (classe permanente)
    document.body.classList.remove("preloader-active");
    document.body.classList.add("page-ready");

    // desmonta após o fade
    window.setTimeout(() => setVisible(false), 500);

    try { sessionStorage.setItem("a4e_preloader_seen", "1"); } catch {}
  }, []);

  const hideRespectingMin = React.useCallback(() => {
    const elapsed = Date.now() - mountedAtRef.current;
    const wait = Math.max(0, minDurationMs - elapsed);
    if (wait === 0) doHideNow();
    else {
      if (minTimerRef.current) window.clearTimeout(minTimerRef.current);
      minTimerRef.current = window.setTimeout(doHideNow, wait);
    }
  }, [minDurationMs, doHideNow]);

  const hideImmediately = React.useCallback(() => {
    doHideNow(); // botão "Pular" ignora minDuration
  }, [doHideNow]);

  React.useEffect(() => {
    let forceAlways = false;
    try { forceAlways = localStorage.getItem("A4E_PRELOADER_ALWAYS") === "1"; } catch {}
    try {
      if (!always && !forceAlways && sessionStorage.getItem("a4e_preloader_seen") === "1") {
        setVisible(false);
        document.body.classList.add("page-ready");
        return;
      }
    } catch {}

    document.body.classList.add("preloader-active");
    mountedAtRef.current = Date.now();

    const onLoad = () => hideRespectingMin();

    if (document.readyState === "complete") hideRespectingMin();
    else window.addEventListener("load", onLoad, { once: true });

    hideTimerRef.current = window.setTimeout(hideRespectingMin, timeoutMs);

    return () => {
      window.removeEventListener("load", onLoad as any);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      if (minTimerRef.current) window.clearTimeout(minTimerRef.current);
    };
  }, [always, timeoutMs, hideRespectingMin]);

  if (!visible) return null;

  return (
    <div
      id="a4e-preloader"
      role="status"
      aria-live="polite"
      aria-label="A carregar conteúdo"
      className="preloader"
    >
      <div className="preloader__inner">
        <img
          className="preloader__logo"
          src="/assets/img/logo-header.png"
          alt="All4esthetic"
          decoding="async"
        />
        <p className="preloader__label">
          A carregar
          <span className="preloader__dots" aria-hidden="true">
            {".".repeat(dots)}
          </span>
        </p>
      </div>

      <button
        type="button"
        className="preloader__skip"
        onClick={hideImmediately}
        aria-label="Ocultar carregamento e ver a página"
      >
        Pular
      </button>
    </div>
  );
}
