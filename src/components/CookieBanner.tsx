"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type Consent = "accepted" | "rejected";

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const acceptBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);

    let consent: Consent | null = null;

    const legacyCookie = readCookie("cookie_consent");
    if (legacyCookie === "1") consent = "accepted";
    if (legacyCookie === "0") consent = "rejected";

    if (!consent) {
      const cookieVal = readCookie("cookieConsent");
      if (cookieVal === "accepted" || cookieVal === "rejected") consent = cookieVal as Consent;
    }

    if (!consent) {
      try {
        const stored = localStorage.getItem("cookieConsent");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.value === "accepted" || parsed?.value === "rejected") consent = parsed.value as Consent;
        }
      } catch {}
    }

    if (!consent) setVisible(true);
  }, []);

  useEffect(() => {
    if (visible) setTimeout(() => acceptBtnRef.current?.focus(), 0);
  }, [visible]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cookieConsent" || e.key === "cookie_consent") setVisible(false);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const applySideEffects = (value: Consent) => {
    try {
      localStorage.setItem("cookieConsent", JSON.stringify({ value, ts: Date.now() }));
      localStorage.setItem("cookie_consent", value === "accepted" ? "1" : "0");
    } catch {}
    setCookie("cookieConsent", value);
    setCookie("cookie_consent", value === "accepted" ? "1" : "0");
    document.body.classList.remove("cookies-accepted", "cookies-rejected", "cookie-banner-open");
    document.body.classList.add(value === "accepted" ? "cookies-accepted" : "cookies-rejected");
    (window as any).__cookieConsent = value;
    window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: { value } }));
  };

  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    applySideEffects("accepted");
    setVisible(false);
  };
  const handleReject = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    applySideEffects("rejected");
    setVisible(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      applySideEffects("rejected");
      setVisible(false);
    }
  };

  if (!mounted || !visible) return null;

  const forceVisibleStyle: React.CSSProperties = {
    display: "block",
    opacity: 1,
    visibility: "visible",
    transform: "translateY(0)",
    zIndex: 99999,
    pointerEvents: "auto",
  };

  return (
    <div
      id="cookie-consent-banner"
      className="cookie-banner shadow-lg is-open"
      style={forceVisibleStyle}
      role="dialog"
      aria-modal="true"
      aria-label="Aviso de Cookies"
      aria-live="polite"
      onKeyDown={onKeyDown}
    >
      <div className="cookie-banner-content" role="document">
        <div className="cookie-banner-header">
          <span className="cookie-banner-icon" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
              <path d="M26.9 17.18a3.46 3.46 0 0 1-4.17-4.16a1 1 0 0 0-1.28-1.27a3.47 3.47 0 0 1-4.17-4.18A1 1 0 0 0 15.9 6.5A1 1 0 0 0 15 5.48V5A1 1 0 0 0 14.1 4.07A12 12 0 1 0 28 18.36a1 1 0 0 0-1.08-1.18a1 1 0 0 0-.02 0Zm-7.47 9.49a2 2 0 1 1 2-2a2 2 0 0 1-2 2ZM10 14.5a2 2 0 1 1 2-2a2 2 0 0 1-2 2Zm-1 7a2 2 0 1 1 2-2a2 2 0 0 1-2 2Zm9-10a2 2 0 1 1 2-2a2 2 0 0 1-2 2Z" />
            </svg>
          </span>
          <span className="cookie-banner-title">Cookies</span>
        </div>
        <span className="cookie-banner-text">
          Utilizamos cookies para melhorar a sua experiência no site, personalizar conteúdo e analisar o nosso tráfego. Ao aceitar, autoriza a utilização de cookies conforme a nossa{" "}
          <Link className="cookie-link" href="/politica-privacidade">Política de Privacidade</Link>.
        </span>
        <div className="cookie-banner-actions">
          <button id="cookie-accept-btn" ref={acceptBtnRef} className="cookie-btn" type="button" onClick={handleAccept}>
            Aceitar
          </button>
          <button id="cookie-reject-btn" className="btn-outline-light cookie-btn" type="button" onClick={handleReject}>
            Rejeitar
          </button>
        </div>
      </div>
    </div>
  );
}
