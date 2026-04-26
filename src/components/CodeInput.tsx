"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-40 w-[120%] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-fuchsia-400/10 to-sky-400/20 blur-3xl"
      />

      <div className="relative flex items-center gap-1 rounded-full border border-white/10 bg-black/30 p-1 w-fit">
        {(["paste", "csv"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              mode === m ? "text-black" : "text-white/60 hover:text-white"
            }`}
          >
            {mode === m && (
              <motion.span
                layoutId="modePill"
                className="absolute inset-0 rounded-full bg-white"
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
              placeholder="GG3LJ5LCWEWWQWER&#10;SLECDHH0YC6X&#10;EFN0PJ1AQ4R&#10;..."
              rows={7}
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-sm text-white placeholder:text-white/25 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-white/50">
                {pastedCount > 0
                  ? `${pastedCount} código${pastedCount !== 1 ? "s" : ""} detectado${pastedCount !== 1 ? "s" : ""}`
                  : "Separa por comas, espacios o saltos de línea"}
              </span>
              <button
                onClick={handlePasteSubmit}
                disabled={disabled || !pastedCount}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:shadow-[0_0_30px_rgba(255,255,255,0.35)]"
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
                  ? "border-white/40 bg-white/[0.08]"
                  : "border-white/15 bg-black/30 hover:border-white/25 hover:bg-white/[0.04]"
              }`}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/80"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="text-sm text-white">
                {fileName ?? "Arrastra un CSV o haz clic para seleccionar"}
              </p>
              <p className="mt-1 text-xs text-white/40">
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
          className="relative mt-3 text-xs text-rose-300"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
