"use client";

import { ChangeEvent, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import IconButton from "@/components/IconButton";
import { SettingsIcon } from "@/components/Icons";
import type { Dictionary } from "@/lib/i18n";
import { DEFAULT_REDEEM_URLS, displayURL, type QRType } from "@/lib/qr";

interface SettingsModalProps {
  copy: Dictionary;
  isOpen: boolean;
  onClose: () => void;
  qrType: QRType;
  redeemUrl: string;
  logoSrc: string;
  logoName: string;
  onRedeemUrlChange: (value: string) => void;
  onLogoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export default function SettingsModal({
  copy,
  isOpen,
  onClose,
  qrType,
  redeemUrl,
  logoSrc,
  logoName,
  onRedeemUrlChange,
  onLogoChange,
  onReset,
}: SettingsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const settingsCopy = getSettingsCopy(copy, qrType);
  const normalizedUrl = redeemUrl.trim() || DEFAULT_REDEEM_URLS[qrType];

  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement;
    const focusable = dialogRef.current?.querySelector<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    focusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <button
        type="button"
        aria-label={copy.close}
        className="absolute inset-0 bg-black/35 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="glass-panel relative w-full max-w-lg rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--control)]">
              <SettingsIcon />
            </div>
            <h2 id="settings-title" className="text-xl font-semibold">
              {copy.settingsTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              {settingsCopy.description}
            </p>
          </div>
          <IconButton label={copy.close} onClick={onClose}>
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </IconButton>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
              {settingsCopy.redeemUrlLabel}
            </span>
            <input
              type="text"
              value={redeemUrl}
              placeholder={settingsCopy.redeemUrlPlaceholder}
              onChange={(event) => onRedeemUrlChange(event.target.value)}
              className="field w-full rounded-2xl px-4 py-2.5 text-sm"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
              {copy.centerLogo}
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={onLogoChange}
              className="field w-full rounded-2xl px-4 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[color:var(--button-background)] file:px-3 file:py-1 file:text-[color:var(--button-foreground)]"
            />
          </label>

          <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--control)] p-3">
            <Image
              src={logoSrc}
              alt={copy.selectedLogo}
              width={38}
              height={38}
              unoptimized={logoSrc.startsWith("data:")}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{logoName}</p>
              <p className="truncate text-xs text-[color:var(--muted)]">
                {displayURL(normalizedUrl)}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onReset}
              className="secondary-button rounded-full px-4 py-2 text-sm font-medium"
            >
              {copy.restoreDefaults}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="primary-button rounded-full px-4 py-2 text-sm font-medium"
            >
              {copy.close}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function getSettingsCopy(copy: Dictionary, qrType: QRType) {
  switch (qrType) {
    case "api_credits":
      return {
        description: copy.settingsDescriptionApiCredits,
        redeemUrlLabel: copy.redeemUrlApiCredits,
        redeemUrlPlaceholder: copy.redeemUrlPlaceholderApiCredits,
      };
    case "custom_link":
      return {
        description: copy.settingsDescriptionChatGpt,
        redeemUrlLabel: copy.redeemUrlChatGpt,
        redeemUrlPlaceholder: copy.redeemUrlPlaceholderChatGpt,
      };
    default: {
      const exhaustiveType: never = qrType;
      return exhaustiveType;
    }
  }
}
