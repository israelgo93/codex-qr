import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codex QR · Canjea créditos de OpenAI",
  description:
    "Genera códigos QR imprimibles para canjear créditos promocionales de OpenAI. Sube un CSV o pega tus códigos y exporta un PDF listo para recortar.",
  icons: {
    icon: "/logos/Codex 256 x 256.png",
    apple: "/logos/Codex 256 x 256.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[color:var(--background)]">{children}</body>
    </html>
  );
}
