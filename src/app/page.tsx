"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import CodeInput from "@/components/CodeInput";
import IconButton from "@/components/IconButton";
import {
  DownloadIcon,
  GitHubIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  SystemIcon,
} from "@/components/Icons";
import QRCard from "@/components/QRCard";
import SettingsModal from "@/components/SettingsModal";
import {
  LANGUAGE_STORAGE_KEY,
  Dictionary,
  Language,
  formatMessage,
  isLanguage,
  translations,
} from "@/lib/i18n";
import { generatePDF } from "@/lib/pdf";
import {
  DEFAULT_REDEEM_URLS,
  buildQREntries,
  type QRType,
} from "@/lib/qr";
import {
  ResolvedTheme,
  THEME_STORAGE_KEY,
  ThemeMode,
  getNextTheme,
  isThemeMode,
  logoForResolvedTheme,
} from "@/lib/theme";

const QR_TYPES: QRType[] = ["api_credits", "custom_link"];

export default function Home() {
  const [qrType, setQrType] = useState<QRType>("api_credits");
  const [rawValues, setRawValues] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [footer, setFooter] = useState("");
  const [redeemUrls, setRedeemUrls] =
    useState<Record<QRType, string>>(DEFAULT_REDEEM_URLS);
  const [customLogoSrc, setCustomLogoSrc] = useState<string | null>(null);
  const [customLogoName, setCustomLogoName] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [language, setLanguage] = useState<Language>("es");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const copy = translations[language];
  const defaultLogoSrc = logoForResolvedTheme(resolvedTheme);
  const logoSrc = customLogoSrc ?? defaultLogoSrc;
  const logoName = customLogoName ?? copy.defaultLogoName;
  const activeRedeemUrl = redeemUrls[qrType];
  const normalizedUrl = useMemo(
    () => activeRedeemUrl.trim() || DEFAULT_REDEEM_URLS[qrType],
    [activeRedeemUrl, qrType]
  );
  const entries = useMemo(
    () => buildQREntries(rawValues, qrType, normalizedUrl),
    [normalizedUrl, qrType, rawValues]
  );
  const heroCopy = getHeroCopy(copy, qrType);
  const previewMeta = getPreviewMeta(copy, qrType);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    const timeoutId = window.setTimeout(() => {
      if (isThemeMode(savedTheme)) setTheme(savedTheme);
      if (isLanguage(savedLanguage)) setLanguage(savedLanguage);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const syncTheme = () => {
      const nextResolvedTheme = theme === "system" ? (media.matches ? "dark" : "light") : theme;
      setResolvedTheme(nextResolvedTheme);
      document.documentElement.dataset.theme = nextResolvedTheme;
      document.documentElement.dataset.themeMode = theme;
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    };

    syncTheme();
    media.addEventListener("change", syncTheme);
    return () => media.removeEventListener("change", syncTheme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const handleQrTypeChange = (nextType: QRType) => {
    setQrType(nextType);
    setRawValues([]);
  };

  const handleValues = (list: string[]) => {
    setRawValues(list);
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
        setCustomLogoSrc(reader.result);
        setCustomLogoName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetDefaults = () => {
    setRedeemUrls((value) => ({
      ...value,
      [qrType]: DEFAULT_REDEEM_URLS[qrType],
    }));
    setCustomLogoSrc(null);
    setCustomLogoName(null);
  };

  const handleRedeemUrlChange = (value: string) => {
    setRedeemUrls((current) => ({
      ...current,
      [qrType]: value,
    }));
  };

  const handleDownload = async () => {
    if (!entries.length || generating) return;
    setGenerating(true);
    setProgress(0);

    try {
      const blob = await generatePDF(entries, {
        footer,
        logoSrc,
        onProgress: ({ current, total }) => {
          setProgress(Math.round((current / total) * 100));
        },
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `codex-qr-${qrType}-${entries.length}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  const pages = Math.ceil(entries.length / 9) || 0;
  const themeLabel = getThemeLabel(copy, theme);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[color:var(--background)] text-[color:var(--foreground)]">
      <BackgroundGrid />

      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={defaultLogoSrc}
              alt={copy.navLogoAlt}
              width={34}
              height={34}
              priority
              unoptimized={defaultLogoSrc.endsWith("codex.png")}
              className="h-8 w-8 object-contain"
            />
            <span className="text-sm font-semibold tracking-tight">{copy.appName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage((value) => (value === "es" ? "en" : "es"))}
              aria-label={copy.changeLanguage}
              title={copy.changeLanguage}
              className="icon-button inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-xs font-semibold uppercase tracking-normal transition"
            >
              {language === "es" ? "EN" : "ES"}
            </button>
            <IconButton
              label={`${copy.changeTheme}: ${themeLabel}`}
              onClick={() => setTheme((value) => getNextTheme(value))}
            >
              <ThemeIcon theme={theme} />
            </IconButton>
            <IconButton label={copy.openSettings} onClick={() => setSettingsOpen(true)}>
              <SettingsIcon />
            </IconButton>
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 max-w-4xl text-center"
        >
          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center">
            <Image
              src={defaultLogoSrc}
              alt={copy.navLogoAlt}
              width={72}
              height={72}
              priority
              unoptimized={defaultLogoSrc.endsWith("codex.png")}
              className="h-[72px] w-[72px] object-contain"
            />
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
            {heroCopy.headline}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-sm leading-6 text-[color:var(--muted)] sm:text-base">
            {heroCopy.description}
          </p>
        </motion.section>

        <section className="mx-auto mt-10 max-w-2xl space-y-4">
          <QRTypeSelector copy={copy} qrType={qrType} onChange={handleQrTypeChange} />
          <CodeInput
            key={qrType}
            copy={copy}
            qrType={qrType}
            onValues={handleValues}
            disabled={generating}
          />
        </section>

        <AnimatePresence>
          {entries.length > 0 && (
            <motion.section
              id="preview"
              key="preview"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.35 }}
              className="mt-14"
            >
              <div className="mb-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{copy.preview}</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    {formatMessage(previewMeta, {
                      items: entries.length,
                      itemsPlural: entries.length === 1 ? "" : "s",
                      pages,
                      pagesPlural: pages === 1 ? "" : "s",
                    })}
                  </p>
                  <label className="mt-4 block">
                    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
                      {copy.footerLabel}
                    </span>
                    <input
                      type="text"
                      value={footer}
                      onChange={(event) => setFooter(event.target.value)}
                      placeholder={copy.footerPlaceholder}
                      maxLength={120}
                      className="field w-full max-w-md rounded-2xl px-4 py-2.5 text-sm"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={generating}
                  className="primary-button inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all disabled:opacity-60"
                >
                  {generating ? (
                    <>
                      <Spinner />
                      <span>{formatMessage(copy.generating, { progress })}</span>
                    </>
                  ) : (
                    <>
                      <DownloadIcon />
                      <span>{copy.downloadPdf}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {entries.map((entry, index) => (
                  <QRCard
                    key={`${entry.targetUrl}-${index}`}
                    entry={entry}
                    index={index}
                    logoSrc={logoSrc}
                    logoAlt={copy.centerLogo}
                    altText={formatMessage(copy.qrAlt, { code: entry.codeLabel })}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <footer className="relative flex flex-wrap items-center justify-center gap-2 px-5 pb-8 text-center text-xs text-[color:var(--muted)]">
        <span>{copy.creditsPrefix}</span>
        <span className="font-medium text-[color:var(--foreground)]">
          {copy.creatorName}
        </span>
        <a
          href="https://github.com/israelgo93/codex-qr"
          target="_blank"
          rel="noreferrer"
          aria-label={copy.githubProfile}
          className="inline-flex items-center text-[color:var(--foreground)] underline-offset-2 hover:underline"
        >
          <GitHubIcon />
        </a>
        <span aria-hidden="true">·</span>
        <span>{copy.creditsSuffix}</span>
      </footer>

      <AnimatePresence>
        {settingsOpen && (
          <SettingsModal
            copy={copy}
            isOpen={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            qrType={qrType}
            redeemUrl={activeRedeemUrl}
            logoSrc={logoSrc}
            logoName={logoName}
            onRedeemUrlChange={handleRedeemUrlChange}
            onLogoChange={handleLogo}
            onReset={resetDefaults}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function QRTypeSelector({
  copy,
  qrType,
  onChange,
}: {
  copy: Dictionary;
  qrType: QRType;
  onChange: (type: QRType) => void;
}) {
  return (
    <div className="glass-panel rounded-3xl p-4">
      <span className="mb-3 block text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
        {copy.qrTypeLabel}
      </span>
      <div className="grid gap-2 rounded-2xl border border-[color:var(--line)] bg-[color:var(--control)] p-1 sm:grid-cols-2">
        {QR_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`relative rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              qrType === type
                ? "text-[color:var(--button-foreground)]"
                : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            }`}
          >
            {qrType === type && (
              <motion.span
                layoutId="qrTypePill"
                className="absolute inset-0 rounded-xl bg-[color:var(--button-background)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{getQRTypeLabel(copy, type)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function getHeroCopy(copy: Dictionary, qrType: QRType) {
  switch (qrType) {
    case "api_credits":
      return {
        headline: copy.headlineApiCredits,
        description: copy.descriptionApiCredits,
      };
    case "custom_link":
      return {
        headline: copy.headlineChatGpt,
        description: copy.descriptionChatGpt,
      };
    default: {
      const exhaustiveType: never = qrType;
      return exhaustiveType;
    }
  }
}

function getPreviewMeta(copy: Dictionary, qrType: QRType) {
  switch (qrType) {
    case "api_credits":
      return copy.previewMetaApiCredits;
    case "custom_link":
      return copy.previewMetaChatGpt;
    default: {
      const exhaustiveType: never = qrType;
      return exhaustiveType;
    }
  }
}

function getQRTypeLabel(copy: Dictionary, qrType: QRType) {
  switch (qrType) {
    case "api_credits":
      return copy.qrTypeApiCredits;
    case "custom_link":
      return copy.qrTypeChatGpt;
    default: {
      const exhaustiveType: never = qrType;
      return exhaustiveType;
    }
  }
}

function ThemeIcon({ theme }: { theme: ThemeMode }) {
  if (theme === "light") return <SunIcon />;
  if (theme === "dark") return <MoonIcon />;
  return <SystemIcon />;
}

function getThemeLabel(copy: Dictionary, theme: ThemeMode) {
  if (theme === "light") return copy.themeLight;
  if (theme === "dark") return copy.themeDark;
  return copy.themeSystem;
}

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function BackgroundGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,var(--grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid)_1px,transparent_1px)] [background-size:44px_44px]"
    />
  );
}
