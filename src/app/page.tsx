"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import CodeInput from "@/components/CodeInput";
import QRCard from "@/components/QRCard";
import { generatePDF } from "@/lib/pdf";

export default function Home() {
  const [codes, setCodes] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [footer, setFooter] = useState("");

  const handleCodes = (list: string[]) => {
    setCodes(list);
    if (typeof window !== "undefined") {
      setTimeout(() => {
        document
          .getElementById("preview")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  };

  const handleDownload = async () => {
    if (!codes.length || generating) return;
    setGenerating(true);
    setProgress(0);
    try {
      const blob = await generatePDF(codes, {
        footer,
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
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <BackgroundFX />

      <div className="relative mx-auto max-w-6xl px-6 pb-32 pt-16 sm:pt-24">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mb-6 h-20 w-20"
          >
            <div className="absolute inset-0 rounded-[22%] bg-gradient-to-br from-indigo-500/40 via-violet-400/30 to-sky-400/40 blur-2xl" />
            <Image
              src="/logos/Codex 256 x 256.png"
              alt="Codex"
              fill
              priority
              className="relative drop-shadow-[0_10px_40px_rgba(120,120,255,0.4)]"
            />
          </motion.div>
          <h1 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
            Codex QR
          </h1>
          <p className="mt-3 max-w-xl text-balance text-sm text-white/60 sm:text-base">
            Genera códigos QR imprimibles para canjear créditos promocionales
            de OpenAI. Carga un CSV o pega tus códigos y exporta un PDF listo
            para recortar.
          </p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-12 max-w-2xl"
        >
          <CodeInput onCodes={handleCodes} disabled={generating} />
        </motion.section>

        <AnimatePresence>
          {codes.length > 0 && (
            <motion.section
              id="preview"
              key="preview"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.5 }}
              className="mt-16"
            >
              <div className="mb-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">Vista previa</h2>
                  <p className="mt-1 text-sm text-white/50">
                    {codes.length} código{codes.length !== 1 ? "s" : ""} ·{" "}
                    {pages} página{pages !== 1 ? "s" : ""} · 9 por página
                  </p>
                  <label className="mt-4 block">
                    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
                      Pie de página (opcional)
                    </span>
                    <input
                      type="text"
                      value={footer}
                      onChange={(e) => setFooter(e.target.value)}
                      placeholder="Ej: Créditos provistos por Acme Corp · Evento DevDay 2026"
                      maxLength={120}
                      className="w-full max-w-md rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white placeholder:text-white/25 backdrop-blur-xl focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10"
                    />
                  </label>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={generating}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white/[0.06] px-6 py-2.5 text-sm font-medium text-white backdrop-blur-xl transition-all hover:bg-white/[0.12] disabled:opacity-60"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100 [background:linear-gradient(120deg,rgba(99,102,241,0.35),rgba(236,72,153,0.25),rgba(56,189,248,0.35))]"
                  />
                  {generating ? (
                    <>
                      <Spinner />
                      <span>Generando… {progress}%</span>
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <span>Descargar PDF</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {codes.map((code, i) => (
                  <QRCard key={`${code}-${i}`} code={code} index={i} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <footer className="relative pb-8 text-center text-xs text-white/30">
        Codex QR · Canjea en{" "}
        <a
          href="https://platform.openai.com/settings/organization/billing/promotions"
          target="_blank"
          rel="noreferrer"
          className="underline-offset-2 hover:text-white/60 hover:underline"
        >
          platform.openai.com
        </a>
      </footer>
    </main>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackgroundFX() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(900px_500px_at_100%_20%,rgba(236,72,153,0.08),transparent_60%),radial-gradient(800px_500px_at_0%_40%,rgba(56,189,248,0.1),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
      />
    </>
  );
}
