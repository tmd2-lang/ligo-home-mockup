/* ============================================================
   Ligo primitives — ported 1:1 from the design folder's
   _shared/ligo-atoms.jsx. Same SVGs, same gradients, same sizes.
   ============================================================ */
import type { CSSProperties, ReactNode, SVGProps } from "react";

/* ── Logo mark ─────────────────────────────────────────────
   Yellow rounded square + orange wisps. From assets/logo-mark.svg. */
export function LigoMark({
  size = 32,
  reversed = false,
}: {
  size?: number;
  reversed?: boolean;
}) {
  const bgFill = reversed ? "rgba(255,255,255,0.25)" : "#F5D783";
  const wispFill = reversed ? "#fff" : "#F97316";
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden>
      <path
        d="M27 0H9C4.03 0 0 4.03 0 9v18C0 31.97 4.03 36 9 36h18c4.97 0 9-4.03 9-9V9C36 4.03 31.97 0 27 0z"
        fill={bgFill}
      />
      <path
        d="M14.59 3C14.85 2.99 15.17 3.01 15.42 3.05c1.15.18 2.17.82 2.84 1.76.62.86.87 1.94.69 2.99-.15.9-.66 1.83-1.41 2.34-.94.64-1.71 1.03-1.9 2.26-.27 1.77 1.39 2.94 3.03 2.49.9-.23 1.66-.78 2.45-1.25 2.38-1.42 5.21-4.03 8.15-3.57 1.3.2 2.46.92 3.22 1.99.81 1.12 1 2.34.79 3.69-.19.85-.46 1.46-1.04 2.13-2.22 2.55-5.92 2.11-8.88 1.48-3.33-.72-6.69-2.02-9.27-4.3-1.93-1.7-3.72-4.18-3.88-6.83-.09-1.38.37-2.73 1.28-3.77.84-.94 1.86-1.39 3.1-1.46z"
        fill={wispFill}
      />
      <path
        d="M8.22 16.13c.77-.04 2.03.09 2.79.22 4.65.76 9.97 2.82 12.81 6.77 1.21 1.68 2.15 3.82 1.81 5.91-.2 1.27-.9 2.4-1.95 3.14-1 .69-2.15.97-3.33.76-1.12-.2-2.12-.85-2.76-1.79-.69-1-.81-2.07-.6-3.24.25-.95.78-1.76 1.63-2.28.36-.22.75-.4 1.03-.72 1.72-1.96-.17-4.54-2.59-3.76-.89.28-1.44.7-2.2 1.15-1.78 1.06-3.58 2.57-5.51 3.3-.57.22-1.17.35-1.78.39-1.27.08-2.52-.35-3.48-1.2-.92-.84-1.47-2.01-1.52-3.25-.06-1.32.44-2.64 1.34-3.6C6.35 16.61 7.75 16.2 8.22 16.13z"
        fill={wispFill}
      />
    </svg>
  );
}

/* ── Inline SVG icon registry ──────────────────────────────
   2px round stroke, fill:none, currentColor — the Ligo discipline.
   `Games` is the one icon NOT in the original kit (the design has 3
   tabs; this prototype needs 4). Drawn to match the same stroke spec. */
type IconProps = SVGProps<SVGSVGElement>;
const svg = (children: ReactNode) => {
  const IconGlyph = (p: IconProps) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
  IconGlyph.displayName = "IconGlyph";
  return IconGlyph;
};

export const Icon = {
  Back: svg(<path d="M15 18l-6-6 6-6" />),
  Bell: svg(
    <>
      <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M14 21a2 2 0 01-4 0" />
    </>
  ),
  Home: svg(<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1v-9z" />),
  Calendar: svg(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 3v4M16 3v4M3 11h18" />
    </>
  ),
  User: svg(
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </>
  ),
  Clock: svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  Pin: svg(
    <>
      <path d="M12 22s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  Music: svg(
    <>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </>
  ),
  Plus: svg(<path d="M12 5v14M5 12h14" />),
  Check: svg(<path d="M20 6L9 17l-5-5" />),
  ChevronLeft: svg(<path d="M15 18l-6-6 6-6" />),
  MoreHorizontal: svg(
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </>
  ),
  ArrowUp: svg(<path d="M12 19V5M5 12l7-7 7 7" />),
  Eye: svg(
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  Chev: svg(<path d="M9 6l6 6-6 6" />),
  Close: svg(<path d="M18 6L6 18M6 6l12 12" />),
  Users: svg(
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21c0-4 3-6 7-6s7 2 7 6" />
      <circle cx="17" cy="9" r="3" />
      <path d="M22 21c0-3-2-5-5-5" />
    </>
  ),
  Share: svg(
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M9 11l6-4M9 13l6 4" />
    </>
  ),
  Sun: svg(
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
    </>
  ),
  Moon: svg(<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />),
  ArrowLeft: svg(<><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></>),
  ChevronRight: svg(<path d="m9 18 6-6-6-6"/>),

  Sparkles: svg(<><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></>),
  Settings: svg(
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </>
  ),
  // RECREATED (not in original kit): Games — a controller, same 2px stroke.
  Games: svg(
    <>
      <path d="M6 10h4M8 8v4" />
      <circle cx="15.5" cy="10" r="0.6" fill="currentColor" />
      <circle cx="17.5" cy="12.5" r="0.6" fill="currentColor" />
      <path d="M7 6h10a4 4 0 014 4l.6 5.2A2.8 2.8 0 0119.8 18c-1.2 0-1.8-.7-2.4-1.5l-.7-1a2 2 0 00-1.6-.8H8.9a2 2 0 00-1.6.8l-.7 1C6 17.3 5.4 18 4.2 18A2.8 2.8 0 011.4 15.2L2 10a4 4 0 014-4z" />
    </>
  ),
};

/* ── Context chip (tags, horoscope pills) ─────────────────── */
export function ChipTag({
  children,
  tone = "orange",
}: {
  children: ReactNode;
  tone?: "orange" | "yellow" | "pink" | "ink";
}) {
  const tones: Record<string, { bg: string; color: string }> = {
    orange: { bg: "rgba(249,115,22,0.12)", color: "#C2410C" },
    yellow: { bg: "rgba(245,215,131,0.22)", color: "#A07C00" },
    pink: { bg: "rgba(234,140,225,0.18)", color: "#A13D99" },
    ink: { bg: "#14110D", color: "#F5D783" },
  };
  const t = tones[tone] || tones.orange;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        fontFamily: "var(--font-display)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        background: t.bg,
        color: t.color,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/* ── Eyebrow (the canonical screen-header label) ──────────── */
export function Eyebrow({
  children,
  dark = false,
  dotColor,
}: {
  children: ReactNode;
  dark?: boolean;
  dotColor?: string;
}) {
  const c = dotColor || (dark ? "#F5D783" : "#F97316");
  return (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: c,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 99,
          background: c,
          boxShadow: `0 0 0 4px ${
            c === "#F5D783" ? "rgba(245,215,131,0.18)" : "rgba(249,115,22,0.18)"
          }`,
        }}
      />
      {children}
    </span>
  );
}

/* ── Avatar — deterministic gradient + initial ────────────── */
const AVATAR_GRADIENTS = [
  "linear-gradient(140deg, #F97316, #EA8CE1)",
  "linear-gradient(140deg, #2A5E40, #71C07F)",
  "linear-gradient(140deg, #5E3A1A, #F5D783)",
  "linear-gradient(140deg, #3A1A5E, #EA8CE1)",
  "linear-gradient(140deg, #C2410C, #F5D783)",
];
export function avBgFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
}
export function Avatar({
  name = "A",
  size = 36,
  bg,
  style = {},
}: {
  name?: string;
  size?: number;
  bg?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 99,
        background: bg || avBgFor(name),
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: Math.round(size * 0.38),
        flexShrink: 0,
        boxShadow: size <= 40 ? "0 2px 6px rgba(249,115,22,0.25)" : "none",
        ...style,
      }}
    >
      {name[0]?.toUpperCase()}
    </div>
  );
}

/* ── Pulsing "now playing" pip — the one decorative motion ── */
export function NowPip({ size = 5, color = "#F97316" }: { size?: number; color?: string }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 99,
        background: color,
        animation: "ligo-pulse 1.6s ease-in-out infinite",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

/* ── Wordmark ──────────────────────────────────────────────── */
export function Wordmark({ size = 22, color = "#F97316" }: { size?: number; color?: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        color,
        letterSpacing: "-0.04em",
        fontSize: size,
        lineHeight: 1,
      }}
    >
      ligo
    </span>
  );
}

/* ── Section header (eyebrow-weight title + optional action) ─ */
export function SectionHeader({
  label,
  action,
  onAction,
  dark = false,
}: {
  label: string;
  action?: string;
  onAction?: () => void;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        padding: "24px 22px 12px",
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 18,
          letterSpacing: "-0.015em",
          color: dark ? "#fff" : "#14110D",
          margin: 0,
        }}
      >
        {label}
      </h2>
      {action && (
        <button
          onClick={onAction}
          style={{
            border: 0,
            background: "transparent",
            cursor: onAction ? "pointer" : "default",
            fontFamily: "var(--font-display)",
            fontSize: 12,
            fontWeight: 600,
            color: "#F97316",
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}

/* ── Primary button — 4 variants, from the kit ────────────── */
type ButtonVariant = "primary" | "dark" | "cream" | "ghost";
export function Button({
  children,
  variant = "primary",
  onClick,
  style = {},
  size = "lg",
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  style?: CSSProperties;
  size?: "lg" | "sm";
}) {
  const base: CSSProperties = {
    height: size === "lg" ? 52 : 40,
    border: 0,
    cursor: "pointer",
    borderRadius: size === "lg" ? 16 : 999,
    padding: size === "lg" ? "0 22px" : "0 16px",
    fontFamily: "var(--font-display)",
    fontSize: size === "lg" ? 16 : 13,
    fontWeight: 600,
    letterSpacing: "-0.005em",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "transform 150ms cubic-bezier(.2,.7,.2,1)",
  };
  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: { background: "#F97316", color: "#fff" },
    dark: { background: "#14110D", color: "#fff" },
    cream: { background: "#F5D783", color: "#14110D" },
    ghost: {
      background: "transparent",
      color: "#14110D",
      boxShadow: "inset 0 0 0 1.5px rgba(20,17,13,0.12)",
    },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}
