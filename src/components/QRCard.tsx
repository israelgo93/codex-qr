"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { generateQRDataURL } from "@/lib/qr";

interface QRCardProps {
  code: string;
  index: number;
}

export default function QRCard({ code, index }: QRCardProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    generateQRDataURL()
      .then((url) => {
        if (mountedRef.current) setDataUrl(url);
      })
      .catch(() => {});
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.02, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(600px_circle_at_var(--x,50%)_var(--y,0%),rgba(120,130,255,0.08),transparent_40%)]"
      />

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-xs text-white/50">
          #{String(index + 1).padStart(2, "0")}
        </span>
        <Image
          src="/logos/Codex 256 x 256.png"
          alt="Codex"
          width={20}
          height={20}
          className="opacity-80"
        />
      </div>

      <div className="relative mt-3 flex aspect-square items-center justify-center rounded-xl bg-white p-3 shadow-[0_1px_0_rgba(255,255,255,0.1)_inset]">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={`QR ${code}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="h-full w-full animate-pulse rounded-lg bg-zinc-100" />
        )}
      </div>

      <div className="relative mt-3 text-center">
        <div className="truncate text-[10px] uppercase tracking-wider text-white/40">
          platform.openai.com/…/promotions
        </div>
        <div className="mt-1 select-all font-mono text-sm font-semibold tracking-wider text-white">
          {code}
        </div>
      </div>
    </motion.div>
  );
}
