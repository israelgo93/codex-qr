"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { parseCSV } from "@/lib/csv";
import { parseCodesFromText } from "@/lib/qr";

interface CodeInputProps {
  onCodes: (codes: string[]) => void;
  disabled?: boolean;
}

type Mode = "paste" | "csv";

export default function CodeInput({ onCodes, disabled }: CodeInputProps) {
  const [mode, setMode] = useState<Mode>("paste");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const pastedCount = parseCodesFromText(text).length;

  const handlePasteSubmit = () => {
    setError(null);
    const codes = parseCodesFromText(text);
    if (!codes.length) {
      setError("Pega al menos un código promocional.");
      return;
    }
    onCodes(codes);
  };

  const handleFile = async (file: File) => {
    setError(null);
    setFileName(file.name);
    try {
      const codes = await parseCSV(file);
      if (!codes.length) {
        setError("No se encontraron códigos en el CSV.");
        return;
      }
      onCodes(codes);
    } catch {
      setError("No se pudo leer el CSV.");
    }
  };

  return (
    <div className="glass-panel relative overflow-hidden rounded-3xl p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-40 w-[120%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.20),transparent_60%)] blur-3xl"
      />

      <div className="relative flex w-fit items-center gap-1 rounded-full border border-[color:var(--line)] bg-[color:var(--control)] p-1">
        {(["paste", "csv"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              mode === m
                ? "text-[color:var(--button-foreground)]"
                : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            }`}
          >
            {mode === m && (
              <motion.span
                layoutId="modePill"
                className="absolute inset-0 rounded-full bg-[color:var(--button-background)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">
              {m === "paste" ? "Pegar códigos" : "Subir CSV"}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === "paste" ? (
          <motion.div
            key="paste"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="relative mt-5"
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"GG3LJ5LCWEWWQWER\nSLECDHH0YC6X\nEFN0PJ1AQ4R\n..."}
              rows={7}
              className="field w-full resize-none rounded-2xl p-4 font-mono text-sm"
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-[color:var(--muted)]">
                {pastedCount > 0
                  ? `${pastedCount} código${pastedCount !== 1 ? "s" : ""} detectado${pastedCount !== 1 ? "s" : ""}`
                  : "Separa por comas, espacios o saltos de línea"}
              </span>
              <button
                onClick={handlePasteSubmit}
                disabled={disabled || !pastedCount}
                className="primary-button group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>Generar QR</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="csv"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="relative mt-5"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center transition-all ${
                dragging
                  ? "border-[color:var(--accent)] bg-[color:var(--control-strong)]"
                  : "border-[color:var(--line)] bg-[color:var(--control)] hover:bg-[color:var(--control-strong)]"
              }`}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--glass)]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[color:var(--foreground)]"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="text-sm text-[color:var(--foreground)]">
                {fileName ?? "Arrastra un CSV o haz clic para seleccionar"}
              </p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">
                Se detectará automáticamente una columna tipo{" "}
                <span className="font-mono">codes_promotional</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mt-3 text-xs text-rose-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
