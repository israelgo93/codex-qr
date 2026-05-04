"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { parseCSV } from "@/lib/csv";
import type { Dictionary } from "@/lib/i18n";
import { formatMessage } from "@/lib/i18n";
import { parseCodesFromText, type QRType } from "@/lib/qr";

interface CodeInputProps {
  copy: Dictionary;
  qrType: QRType;
  onValues: (values: string[]) => void;
  disabled?: boolean;
}

type Mode = "paste" | "csv";

export default function CodeInput({
  copy,
  qrType,
  onValues,
  disabled,
}: CodeInputProps) {
  const [mode, setMode] = useState<Mode>("paste");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const inputCopy = getInputCopy(copy, qrType);

  const pastedCount = parseCodesFromText(text).length;
  const detectedLabel =
    pastedCount === 1
      ? inputCopy.detectedOne
      : formatMessage(inputCopy.detectedOther, { count: pastedCount });

  const handlePasteSubmit = () => {
    setError(null);
    const values = parseCodesFromText(text);
    if (!values.length) {
      setError(inputCopy.pasteError);
      return;
    }
    onValues(values);
  };

  const handleFile = async (file: File) => {
    setError(null);
    setFileName(file.name);
    try {
      const values = await parseCSV(file, qrType);
      if (!values.length) {
        setError(inputCopy.csvEmptyError);
        return;
      }
      onValues(values);
    } catch {
      setError(copy.csvReadError);
    }
  };

  return (
    <div className="glass-panel relative overflow-hidden rounded-3xl p-6">
      <div className="relative flex w-fit items-center gap-1 rounded-full border border-[color:var(--line)] bg-[color:var(--control)] p-1">
        {(["paste", "csv"] as Mode[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              mode === item
                ? "text-[color:var(--button-foreground)]"
                : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            }`}
          >
            {mode === item && (
              <motion.span
                layoutId="modePill"
                className="absolute inset-0 rounded-full bg-[color:var(--button-background)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">
              {item === "paste" ? copy.pasteCodes : copy.uploadCsv}
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
              onChange={(event) => setText(event.target.value)}
              placeholder={inputCopy.pastePlaceholder}
              rows={7}
              className="field w-full resize-none rounded-2xl p-4 font-mono text-sm"
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-[color:var(--muted)]">
                {pastedCount > 0 ? detectedLabel : inputCopy.separatorHint}
              </span>
              <button
                type="button"
                onClick={handlePasteSubmit}
                disabled={disabled || !pastedCount}
                className="primary-button inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>{copy.generateQr}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
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
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                const file = event.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center transition-all ${
                dragging
                  ? "border-[color:var(--foreground)] bg-[color:var(--control-strong)]"
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
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="text-sm text-[color:var(--foreground)]">
                {fileName ?? copy.dropCsv}
              </p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">
                {inputCopy.csvColumnHint}{" "}
                <span className="font-mono">{inputCopy.csvColumnExample}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mt-3 text-xs text-[color:var(--danger)]"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

function getInputCopy(copy: Dictionary, qrType: QRType) {
  switch (qrType) {
    case "api_credits":
      return {
        detectedOne: copy.detectedApiCredits_one,
        detectedOther: copy.detectedApiCredits_other,
        pastePlaceholder: copy.pastePlaceholderApiCredits,
        separatorHint: copy.separatorHintApiCredits,
        pasteError: copy.pasteErrorApiCredits,
        csvEmptyError: copy.csvEmptyErrorApiCredits,
        csvColumnHint: copy.csvColumnHintApiCredits,
        csvColumnExample: "codes_promotional",
      };
    case "custom_link":
      return {
        detectedOne: copy.detectedChatGpt_one,
        detectedOther: copy.detectedChatGpt_other,
        pastePlaceholder: copy.pastePlaceholderChatGpt,
        separatorHint: copy.separatorHintChatGpt,
        pasteError: copy.pasteErrorChatGpt,
        csvEmptyError: copy.csvEmptyErrorChatGpt,
        csvColumnHint: copy.csvColumnHintChatGpt,
        csvColumnExample: "url",
      };
    default: {
      const exhaustiveType: never = qrType;
      return exhaustiveType;
    }
  }
}
