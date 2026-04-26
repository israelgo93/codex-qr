"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  REDEEM_URL,
  compactDisplayURL,
  displayURL,
  generateQRDataURL,
} from "@/lib/qr";
import { DARK_LOGO_SRC } from "@/lib/theme";

interface QRCardProps {
  code: string;
  index: number;
  logoSrc?: string;
  redeemUrl?: string;
  altText: string;
}

export default function QRCard({
  code,
  index,
  logoSrc = DARK_LOGO_SRC,
  redeemUrl = REDEEM_URL,
  altText,
}: QRCardProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    generateQRDataURL(redeemUrl, { logoSrc })
      .then((url) => {
        if (mountedRef.current) setDataUrl(url);
      })
      .catch(() => {});

    return () => {
      mountedRef.current = false;
    };
  }, [logoSrc, redeemUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.02, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="glass-card group relative overflow-hidden rounded-2xl p-4 transition-all"
    >
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-xs text-[color:var(--muted)]">
          #{String(index + 1).padStart(2, "0")}
        </span>
        <Image
          src={logoSrc}
          alt="Logo del QR"
          width={20}
          height={20}
          className="opacity-80"
          unoptimized={logoSrc.startsWith("data:")}
        />
      </div>

      <div className="relative mt-3 flex aspect-square items-center justify-center rounded-xl bg-white p-3 shadow-[0_1px_0_rgba(255,255,255,0.1)_inset]">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt={altText}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="h-full w-full animate-pulse rounded-lg bg-zinc-100" />
        )}
      </div>

      <div className="relative mt-3 text-center">
        <div
          className="mx-auto max-w-full truncate px-1 text-[9px] leading-tight tracking-normal text-[color:var(--muted)]"
          title={displayURL(redeemUrl)}
        >
          {compactDisplayURL(redeemUrl)}
        </div>
        <div className="mt-1 select-all font-mono text-sm font-semibold tracking-wider text-[color:var(--foreground)]">
          {code}
        </div>
      </div>
    </motion.div>
  );
}
