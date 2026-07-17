import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from 'next/font/google';
import "./globals.css";
import "./home.css";
import "./events.css";
import "./profile.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: "LIGO — Home",
  description:
    "Interactive home-screen prototype for LIGO, a music-first social app for college students.",
  // app/manifest.ts is auto-linked by Next; no need to set `manifest` here.
  applicationName: "LIGO",
  // iOS install support → <meta name="apple-mobile-web-app-capable/title/status-bar-style">
  appleWebApp: {
    capable: true,
    title: "LIGO",
    statusBarStyle: "default",
  },
  // home-screen + tab icons
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // lets the app draw under the notch + use safe-area insets
  themeColor: "#FAFAF8", // → <meta name="theme-color">
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
