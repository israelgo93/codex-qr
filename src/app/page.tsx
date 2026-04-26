"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import CodeInput from "@/components/CodeInput";
import QRCard from "@/components/QRCard";
import { generatePDF } from "@/lib/pdf";
import { DEFAULT_LOGO_SRC, REDEEM_URL, displayURL } from "@/lib/qr";

type ThemeMode = "system" | "light" | "dark";

const THEME_LABELS: Record<ThemeMode, string> = {
  system: "Sistema",
  light: "Claro",
  dark: "Oscuro",
};

export default function Home() {
  const [codes, setCodes] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [footer, setFooter] = useState("");
  const [redeemUrl, setRedeemUrl] = useState(REDEEM_URL);
  const [logoSrc, setLogoSrc] = useState(DEFAULT_LOGO_SRC);
  const [logoName, setLogoName] = useState("Logo Codex por defecto");
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    const savedTheme = window.localStorage.getItem("codexqr-theme");
    return savedTheme === "light" || savedTheme === "dark" || savedTheme === "system"
      ? savedTheme
      : "system";
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    window.localStorage.setItem("codexqr-theme", theme);
  }, [theme]);

  const normalizedUrl = useMemo(() => {
    const trimmed = redeemUrl.trim();
    return trimmed.length ? trimmed : REDEEM_URL;
  }, [redeemUrl]);

  const handleCodes = (list: string[]) => {
    setCodes(list);
    window.setTimeout(() => {
      document
        .getElementById("preview")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const handleLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoSrc(reader.result);
        setLogoName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetDefaults = () => {
    setRedeemUrl(REDEEM_URL);
    setLogoSrc(DEFAULT_LOGO_SRC);
    setLogoName("Logo Codex por defecto");
  };

  const handleDownload = async () => {
    if (!codes.length || generating) return;
    setGenerating(true);
    setProgress(0);
    try {
      const blob = await generatePDF(codes, {
        footer,
        logoSrc,
        redeemUrl: normalizedUrl,
        onProgress: ({ current, total }) => {
          setProgress(Math.round((current / total) * 100));
        },
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `codex-qr-${codes.length}-codes.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  const pages = Math.ceil(codes.length / 9) || 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <BackgroundFX />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-12 sm:pt-18">
        <nav className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={DEFAULT_LOGO_SRC}
              alt="Codex"
              width={34}
              height={34}
              priority
              className="drop-shadow-[0_10px_28px_rgba(20,184,166,0.30)]"
            />
            <span className="text-sm font-semibold">Codex QR</span>
          </div>
          <ThemeSwitch value={theme} onChange={setTheme} />
        </nav>

        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-14 flex max-w-3xl flex-col items-center text-center"
        >
          <div className="glass-orb relative mb-6 flex h-20 w-20 items-center justify-center rounded-[28px]">
            <Image src={DEFAULT_LOGO_SRC} alt="Codex" width={58} height={58} priority />
          </div>
          <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
            Generador comunitario de QR para Codex
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-sm leading-6 text-[color:var(--muted)] sm:text-base">
            Pega códigos promocionales o sube un CSV y exporta un PDF A4 listo
            para imprimir. La URL y el logo ya vienen configurados para OpenAI,
            pero puedes cambiarlos cuando tu evento lo necesite.
          </p>
        </motion.header>

        <section className="mx-auto mt-10 grid max-w-5xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <CodeInput onCodes={handleCodes} disabled={generating} />

          <div className="glass-panel rounded-3xl p-5">
            <button
              type="button"
              onClick={() => setSettingsOpen((value) => !value)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <span>
                <span className="block text-sm font-semibold">Personalización opcional</span>
                <span className="mt-1 block text-xs text-[color:var(--muted)]">
                  Usa los valores por defecto o adapta la URL y el logo.
                </span>
              </span>
              <span className="rounded-full border border-[color:var(--line)] px-3 py-1 text-xs text-[color:var(--muted)]">
                {settingsOpen ? "Cerrar" : "Configurar"}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {settingsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 space-y-4">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
                        URL de canje
                      </span>
                      <input
                        type="url"
                        value={redeemUrl}
                        onChange={(e) => setRedeemUrl(e.target.value)}
                        className="field w-full rounded-2xl px-4 py-2 text-sm"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
                        Logo central
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        onChange={handleLogo}
                        className="field w-full rounded-2xl px-4 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[color:var(--button-background)] file:px-3 file:py-1 file:text-[color:var(--button-foreground)]"
                      />
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--control)] p-3">
                      <Image
                        src={logoSrc}
                        alt="Logo seleccionado"
                        width={36}
                        height={36}
                        unoptimized={logoSrc.startsWith("data:")}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm">{logoName}</p>
                        <p className="truncate text-xs text-[color:var(--muted)]">
                          {displayURL(normalizedUrl)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={resetDefaults}
                      className="text-xs font-medium text-[color:var(--accent)] hover:underline"
                    >
                      Restaurar valores por defecto
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <AnimatePresence>
          {codes.length > 0 && (
            <motion.section
              id="preview"
              key="preview"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.5 }}
              className="mt-14"
            >
              <div className="mb-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">Vista previa</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    {codes.length} código{codes.length !== 1 ? "s" : ""} ·{" "}
                    {pages} página{pages !== 1 ? "s" : ""} · 9 por página
                  </p>
                  <label className="mt-4 block">
                    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
                      Pie de página opcional
                    </span>
                    <input
                      type="text"
                      value={footer}
                      onChange={(e) => setFooter(e.target.value)}
                      placeholder="Ej: Créditos provistos por la Uleam"
                      maxLength={120}
                      className="field w-full max-w-md rounded-2xl px-4 py-2 text-sm"
                    />
                  </label>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={generating}
                  className="primary-button inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all disabled:opacity-60"
                >
                  {generating ? (
                    <>
                      <Spinner />
                      <span>Generando... {progress}%</span>
                    </>
                  ) : (
                    <>
                      <DownloadIcon />
                      <span>Descargar PDF</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {codes.map((code, i) => (
                  <QRCard
                    key={`${code}-${i}`}
                    code={code}
                    index={i}
                    logoSrc={logoSrc}
                    redeemUrl={normalizedUrl}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <footer className="relative pb-8 text-center text-xs text-[color:var(--muted)]">
        Creado por{" "}
        <a
          href="https://github.com/israelgo93"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[color:var(--foreground)] underline-offset-2 hover:underline"
        >
          Israel Julio Gomez
        </a>{" "}
        para la comunidad de OpenAI Developers.
      </footer>
    </main>
  );
}

function ThemeSwitch({
  value,
  onChange,
}: {
  value: ThemeMode;
  onChange: (theme: ThemeMode) => void;
}) {
  return (
    <div className="glass-panel flex items-center gap-1 rounded-full p-1">
      {(["system", "light", "dark"] as ThemeMode[]).map((theme) => (
        <button
          key={theme}
          type="button"
          onClick={() => onChange(theme)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            value === theme
              ? "bg-[color:var(--button-background)] text-[color:var(--button-foreground)]"
              : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
          }`}
        >
          {THEME_LABELS[theme]}
        </button>
      ))}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function BackgroundFX() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_-10%,var(--glow-a),transparent_62%),radial-gradient(700px_420px_at_100%_22%,var(--glow-b),transparent_60%),radial-gradient(620px_420px_at_0%_44%,var(--glow-c),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,var(--grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_74%)]"
      />
    </>
  );
}
