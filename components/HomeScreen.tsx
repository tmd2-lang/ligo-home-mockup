/* ============================================================
   HomeScreen — LIGO v2 home interface
   States (from page.tsx): normal · reveal
   Daily pick + aurora reveal teaser + news + near you
   ============================================================ */
/* eslint-disable react/no-unescaped-entities, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useRef } from "react";
import type { SVGProps } from "react";
import { Icon as BaseIcon, LigoMark } from "@/components/Primitives";
import { BottomNav, type NavId } from "@/components/BottomNav";
import { usePersistentState } from "@/lib/usePersistentState";
import { searchJordanCatalog } from "@/lib/jordan-catalog";
import { searchCharlotteCatalog } from "@/lib/charlotte-catalog";
import { searchColeCatalog } from "@/lib/cole-catalog";
import { searchCarolineCatalog } from "@/lib/caroline-catalog";
import { searchBennettCatalog } from "@/lib/bennett-catalog";
import { searchMaddieCatalog } from "@/lib/maddie-catalog";
import { searchAlessiaCatalog } from "@/lib/alessia-catalog";
import { searchSofiaCatalog } from "@/lib/sofia-catalog";
import { searchMarcusCatalog } from "@/lib/marcus-catalog";
import { USERS, type UserProfile } from "@/lib/users";
import { useDailyReveal } from "@/hooks/useDailyReveal";
import { useHomeContent } from "@/hooks/useHomeContent";
import { RevealScreen } from "@/components/RevealScreen";
import { ChatScreen } from "@/components/ChatScreen";
import {
  DEMO_QUESTION,
  REVEAL_COUNTDOWN_SECONDS,
  REVEAL_DEMO_PROFILE_ID,
} from "@/lib/revealConstants";

export type HomeState = "normal" | "reveal";

type HomeScreenProps = {
  state: HomeState;
  setState: React.Dispatch<React.SetStateAction<HomeState>>;
  onNav: (id: NavId) => void;
  isCN?: boolean;
};

type HomeContentState = ReturnType<typeof useHomeContent>;

type CatalogSong = {
  artist: string;
  title: string;
  album: string;
  cover: string;
};

type IconProps = SVGProps<SVGSVGElement>;

const Icon = {
  ...BaseIcon,
  Eye: (p: IconProps) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

const REVEAL_HOUR = 20;
const REVEAL_MIN = 0;
const ET = "America/New_York";

function easternParts(now: Date) {
  const m: Record<string, number | string> = {};
  for (const p of new Intl.DateTimeFormat("en-US", {
    timeZone: ET,
    hour12: false,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(now)) {
    if (p.type === "weekday") m.weekday = p.value;
    else if (p.type !== "literal") m[p.type] = parseInt(p.value, 10);
  }
  const year = m.year as number;
  const month = m.month as number;
  const day = m.day as number;
  const hour = m.hour as number;
  const minute = m.minute as number;
  const second = m.second as number;
  m.offset = Date.UTC(year, month - 1, day, hour, minute, second) - now.getTime();
  return m as typeof m & { offset: number; weekday: string; year: number; month: number; day: number };
}

function easternTarget(m: ReturnType<typeof easternParts>, addDays: number, hour: number, minute: number) {
  return Date.UTC(m.year, m.month - 1, m.day + addDays, hour, minute, 0) - m.offset;
}

function nextDaily(hour: number, minute: number) {
  const now = new Date();
  const m = easternParts(now);
  let t = easternTarget(m, 0, hour, minute);
  if (t <= now.getTime()) t = easternTarget(m, 1, hour, minute);
  return t;
}

function useCountdown(makeTarget: () => number) {
  const [now, setNow] = useState<number | null>(null);
  const target = useRef(0);
  useEffect(() => {
    target.current = makeTarget();
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now == null ? null : Math.max(0, target.current - now);
}

function fmtHMS(ms: number | null) {
  if (ms == null) return "··";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${String(m).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`;
}

function useReveal() {
  return fmtHMS(useCountdown(() => nextDaily(REVEAL_HOUR, REVEAL_MIN)));
}

function searchCatalog(activeUserId: string, draft: string, limit = 8): CatalogSong[] {
  switch (activeUserId) {
    case "charlotte":
      return searchCharlotteCatalog(draft, limit);
    case "cole":
      return searchColeCatalog(draft, limit);
    case "caroline":
      return searchCarolineCatalog(draft, limit);
    case "bennett":
      return searchBennettCatalog(draft, limit);
    case "alessia":
      return searchAlessiaCatalog(draft, limit);
    case "maddie":
      return searchMaddieCatalog(draft, limit);
    case "marcus":
      return searchMarcusCatalog(draft, limit);
    case "sofia":
      return searchSofiaCatalog(draft, limit);
    default:
      return searchJordanCatalog(draft, limit);
  }
}

function NewsStrip({ home }: { home: HomeContentState }) {
  const { loading, error, news } = home;
  return (
    <div>
      <div style={{ padding: "24px 22px 12px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 600, fontSize: 18, letterSpacing: "-0.015em", color: "#14110D", margin: 0 }}>
          Your artists this week
        </h2>
        <span style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontSize: 12, fontWeight: 600, color: "#F97316" }}>See all</span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          padding: "0 22px 4px",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {loading ? (
          <p style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 500, fontSize: 14, color: "rgba(20,17,13,0.45)", margin: "8px 0 12px" }}>
            Loading your artists…
          </p>
        ) : error ? (
          <p style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 500, fontSize: 14, color: "rgba(200,50,50,0.85)", margin: "8px 0 12px" }}>
            {error}
          </p>
        ) : !news.length ? (
          <p style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 500, fontSize: 14, color: "rgba(20,17,13,0.45)", margin: "8px 0 12px" }}>
            Nothing here yet
          </p>
        ) : (
          news.map((n, i) => (
            <div
              key={n.id || i}
              style={{
                flex: "0 0 auto",
                width: 208,
                background: "#fff",
                borderRadius: 18,
                border: "1px solid rgba(20,17,13,0.05)",
                boxShadow: "0 1px 0 rgba(20,17,13,0.02), 0 6px 18px -12px rgba(20,17,13,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: 116,
                  backgroundImage: `url(${n.art_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    fontFamily: "Bricolage Grotesque, sans-serif",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#fff",
                    background: "rgba(10,9,7,0.55)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    padding: "4px 8px",
                    borderRadius: 99,
                  }}
                >
                  {n.source_label}
                </span>
              </div>
              <div style={{ padding: "12px 14px 14px" }}>
                <div
                  style={{
                    fontFamily: "Bricolage Grotesque, sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                    color: "#14110D",
                    textWrap: "pretty",
                  }}
                >
                  {n.headline}
                </div>
                <div style={{ fontSize: 11, color: "rgba(20,17,13,0.45)", marginTop: 8 }}>{n.time_label} ago</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AvatarStack() {
  const people = [
    { i: "A", bg: "#E0584B" },
    { i: "J", bg: "#6C5CE0" },
    { i: "S", bg: "#3FA76B" },
    { i: "K", bg: "#E0A53F" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {people.map((p, idx) => (
        <span
          key={idx}
          style={{
            width: 30,
            height: 30,
            borderRadius: 99,
            background: p.bg,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Bricolage Grotesque, sans-serif",
            fontWeight: 700,
            fontSize: 12,
            border: "2px solid #FBEFDC",
            marginLeft: idx === 0 ? 0 : -10,
            position: "relative",
            zIndex: idx,
          }}
        >
          {p.i}
        </span>
      ))}
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 99,
          background: "#14110D",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Bricolage Grotesque, sans-serif",
          fontWeight: 700,
          fontSize: 11,
          border: "2px solid #FBEFDC",
          marginLeft: -10,
          position: "relative",
          zIndex: 5,
        }}
      >
        +38
      </span>
    </div>
  );
}

function CountdownBar({ answered, time }: { answered: boolean; time: string }) {
  const t = answered
    ? {
        card: "cd-breathe-g",
        dot: "cd-dot-g",
        dotBg: "#71C07F",
        bg: "linear-gradient(160deg, rgba(113,192,127,0.18), rgba(245,215,131,0.10))",
        border: "rgba(113,192,127,0.30)",
        accent: "#2F7D3F",
        big: "#1E6B33",
        eyebrow: "You're in · everyone reveals in",
        sub: "41 friends already locked in",
      }
    : {
        card: "cd-breathe-o",
        dot: "cd-dot-o",
        dotBg: "#F97316",
        bg: "linear-gradient(160deg, rgba(249,115,22,0.16), rgba(245,215,131,0.12))",
        border: "rgba(249,115,22,0.28)",
        accent: "#C2410C",
        big: "#9A3412",
        eyebrow: "Everyone reveals in",
        sub: "847 answered · lock yours before 3pm",
      };
  return (
    <div style={{ margin: "14px 22px 0" }}>
      <div className={t.card} style={{ borderRadius: 22, padding: "18px 20px", background: t.bg, border: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "Bricolage Grotesque, sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: t.accent,
            }}
          >
            <span className={t.dot} style={{ width: 8, height: 8, borderRadius: 99, background: t.dotBg }} />
            {t.eyebrow}
          </span>
          {answered && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontWeight: 700,
                fontSize: 10.5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#2F7D3F",
              }}
            >
              <Icon.Check width="13" height="13" /> Locked
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: "Bricolage Grotesque, sans-serif",
            fontWeight: 600,
            fontSize: 42,
            letterSpacing: "-0.03em",
            color: t.big,
            lineHeight: 1,
            margin: "10px 0 12px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {time}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <AvatarStack />
          <span style={{ fontSize: 12.5, color: t.accent, fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 600 }}>{t.sub}</span>
        </div>
      </div>
    </div>
  );
}

function RevealTeaser({
  onOpen,
  hasLockedAnswer,
  revealUnlocked,
}: {
  onOpen: () => void;
  hasLockedAnswer: boolean;
  revealUnlocked: boolean;
}) {
  if (!hasLockedAnswer || !revealUnlocked) return null;

  return (
    <div style={{ padding: "12px 22px 0" }}>
      <button
        type="button"
        onClick={onOpen}
        style={{
          width: "100%",
          textAlign: "left",
          cursor: "pointer",
          border: "1px solid rgba(113,192,127,0.28)",
          borderRadius: 20,
          padding: 18,
          background: "linear-gradient(160deg, rgba(7,9,12,0.96), rgba(22,19,15,0.92))",
          boxShadow: "0 12px 32px -14px rgba(113,192,127,0.35)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          color: "#fff",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            alignSelf: "flex-start",
            fontFamily: "Bricolage Grotesque, sans-serif",
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#71C07F",
          }}
        >
          <Icon.Eye width="14" height="14" /> Tonight&apos;s reveal
        </span>
        <div
          style={{
            fontFamily: "Bricolage Grotesque, sans-serif",
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            textWrap: "balance",
          }}
        >
          Look up Georgetown
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span
            className="cd-tick"
            style={{
              width: 7,
              height: 7,
              borderRadius: 99,
              background: "#71C07F",
              animation: "ligo-pulse 1.8s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "Bricolage Grotesque, sans-serif",
              fontWeight: 600,
              fontSize: 12,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Open tonight&apos;s sky · swipe through five cards
          </span>
        </div>
      </button>
    </div>
  );
}

function RevealWait({ secondsLeft }: { secondsLeft: number }) {
  const padded = String(secondsLeft).padStart(2, "0");

  return (
    <div style={{ margin: "12px 22px 0" }}>
      <div
        style={{
          padding: "22px 20px",
          borderRadius: 18,
          border: "1.5px dashed rgba(249,115,22,0.35)",
          background: "linear-gradient(160deg, rgba(249,115,22,0.06), rgba(245,215,131,0.04))",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Bricolage Grotesque, sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#C2410C",
            marginBottom: 10,
          }}
        >
          Tonight&apos;s reveal · opening soon
        </div>
        <div
          style={{
            fontFamily: "Bricolage Grotesque, sans-serif",
            fontWeight: 700,
            fontSize: 42,
            letterSpacing: "-0.03em",
            color: "#9A3412",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          0:{padded}
        </div>
        <p
          style={{
            margin: "14px 0 0",
            fontFamily: "Bricolage Grotesque, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            lineHeight: 1.45,
            color: "rgba(20,17,13,0.55)",
            textWrap: "balance",
          }}
        >
          Your answer&apos;s in. Campus is still answering — the reveal opens when the countdown ends.
        </p>
      </div>
    </div>
  );
}

function Timeline({
  answered,
  revealWaiting,
  revealUnlocked,
}: {
  answered: boolean;
  revealWaiting: boolean;
  revealUnlocked: boolean;
}) {
  const node = (label: string, time: string, state: "done" | "next" | "pending") => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, flexShrink: 0, width: 64 }}>
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 99,
          background: state === "done" ? "#F97316" : "#fff",
          border: state === "done" ? "0" : `2px solid ${state === "next" ? "#F97316" : "rgba(20,17,13,0.2)"}`,
          boxShadow: state === "done" ? "0 0 0 4px rgba(249,115,22,0.16)" : "none",
        }}
      />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700, fontSize: 12.5, color: "#14110D", letterSpacing: "-0.01em" }}>
          {time}
        </div>
        <div style={{ fontSize: 11, color: "rgba(20,17,13,0.45)", marginTop: 1 }}>{label}</div>
      </div>
    </div>
  );
  const seg = (fill: boolean) => (
    <div style={{ flex: 1, height: 3, borderRadius: 99, background: "rgba(20,17,13,0.1)", margin: "8px -6px 0", overflow: "hidden" }}>
      <i style={{ display: "block", height: "100%", width: fill ? "100%" : "0%", background: "#F97316", borderRadius: 99 }} />
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "flex-start", padding: "22px 26px 0" }}>
      {node("Opens", "8:00a", "done")}
      {seg(true)}
      {node("Answered", "You", answered ? "done" : "next")}
      {seg(false)}
      {node("Reveal", "8:00p", revealUnlocked ? "done" : revealWaiting || answered ? "next" : "pending")}
    </div>
  );
}

function DailyPick({
  activeUserId,
  revealCountdown,
  revealUnlocked,
  onRevealAnswerLocked,
  onRevealAnswerCleared,
}: {
  activeUserId: string;
  revealCountdown: number | null;
  revealUnlocked: boolean;
  onRevealAnswerLocked: () => void;
  onRevealAnswerCleared: () => void;
}) {
  const [answered, setAnswered] = usePersistentState(`ligo:daily:${activeUserId}:answered`, false);
  const [answer, setAnswer] = usePersistentState(`ligo:daily:${activeUserId}:answer`, "");
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const reveal = useReveal();
  const { loading, error, currentQuestion } = useDailyReveal(activeUserId);
  const hasLockedAnswer = answered && answer.trim().length > 0;

  useEffect(() => {
    if (answered && !answer.trim()) setAnswered(false);
  }, [answered, answer, setAnswered]);

  const revealWaiting = hasLockedAnswer && !revealUnlocked && revealCountdown !== null && revealCountdown > 0;

  function lockIn() {
    if (!draft.trim()) return;
    setAnswer(draft.trim());
    setAnswered(true);
    setFocused(false);
    onRevealAnswerLocked();
  }

  function clearAnswer() {
    onRevealAnswerCleared();
    setAnswered(false);
    setAnswer("");
    setDraft("");
    setFocused(false);
  }

  function pickSynced(row: CatalogSong) {
    setDraft(`${row.title} — ${row.artist}`);
    setFocused(false);
  }

  const synced = searchCatalog(activeUserId, draft, 8);
  const showSynced = focused && !answered;

  return (
    <div>
      <CountdownBar answered={hasLockedAnswer} time={reveal} />

      <div style={{ margin: "14px 22px 0" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            padding: "20px 20px 22px",
            border: "1px solid rgba(20,17,13,0.05)",
            boxShadow: "0 1px 0 rgba(20,17,13,0.02), 0 8px 24px -12px rgba(20,17,13,0.10)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span
              style={{
                background: "#14110D",
                color: "#fff",
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "5px 10px",
                borderRadius: 8,
              }}
            >
              Today
            </span>
            <span
              style={{
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(20,17,13,0.4)",
              }}
            >
              Everyone answers
            </span>
          </div>
          {loading ? (
            <p style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 500, fontSize: 17, lineHeight: 1.4, color: "rgba(20,17,13,0.45)", margin: 0 }}>
              Loading today&apos;s question…
            </p>
          ) : error ? (
            <p style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 500, fontSize: 17, lineHeight: 1.4, color: "rgba(200,50,50,0.85)", margin: 0 }}>
              {error}
            </p>
          ) : (
            <h2
              style={{
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontWeight: 500,
                fontSize: 29,
                lineHeight: 1.12,
                letterSpacing: "-0.025em",
                color: "#14110D",
                textWrap: "balance",
              }}
            >
              {currentQuestion?.question_text ?? DEMO_QUESTION}
            </h2>
          )}

          {!answered && (
            <div style={{ marginTop: 18, position: "relative", zIndex: 40 }}>
              <div
                className="answer-pill"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: "rgba(20,17,13,0.04)",
                  border: "1px solid rgba(20,17,13,0.06)",
                }}
              >
                <Icon.Music width="18" height="18" style={{ color: "rgba(20,17,13,0.35)", flexShrink: 0 }} />
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 200)}
                  onKeyDown={(e) => e.key === "Enter" && lockIn()}
                  placeholder="Name the artist or song…"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: 0,
                    outline: 0,
                    background: "transparent",
                    fontFamily: "-apple-system, sans-serif",
                    fontSize: 15,
                    color: "#14110D",
                  }}
                />
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    flexShrink: 0,
                    padding: "4px 8px",
                    borderRadius: 99,
                    background: "rgba(113,192,127,0.14)",
                    color: "#2F7D3F",
                    fontFamily: "Bricolage Grotesque, sans-serif",
                    fontWeight: 700,
                    fontSize: 9.5,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: 99, background: "#44A96A" }} /> Synced
                </span>
              </div>

              {showSynced && (
                <div
                  role="listbox"
                  onMouseDown={(e) => e.preventDefault()}
                  style={{
                    marginTop: 10,
                    background: "#fff",
                    border: "1px solid rgba(20,17,13,0.07)",
                    borderRadius: 14,
                    boxShadow: "0 8px 24px -12px rgba(20,17,13,0.14)",
                    maxHeight: 280,
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <div style={{ padding: "9px 13px 7px", display: "flex", alignItems: "center", gap: 7 }}>
                    <Icon.Music width="12" height="12" style={{ color: "#C2410C" }} />
                    <span
                      style={{
                        fontFamily: "Bricolage Grotesque, sans-serif",
                        fontWeight: 700,
                        fontSize: 9.5,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(20,17,13,0.4)",
                      }}
                    >
                      From your synced music
                    </span>
                  </div>
                  {synced.length ? (
                    synced.map((row) => (
                      <button
                        key={`${row.artist}-${row.title}-${row.album}`}
                        type="button"
                        onMouseDown={() => pickSynced(row)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 11,
                          padding: "9px 13px",
                          cursor: "pointer",
                          border: 0,
                          borderTop: "1px solid rgba(20,17,13,0.04)",
                          background: "transparent",
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            flexShrink: 0,
                            backgroundImage: `url(${row.cover})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontFamily: "Bricolage Grotesque, sans-serif",
                              fontWeight: 600,
                              fontSize: 14,
                              color: "#14110D",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {row.title}
                          </div>
                          <div style={{ fontSize: 12, color: "rgba(20,17,13,0.5)", marginTop: 1 }}>{row.artist}</div>
                        </div>
                        <Icon.Plus width="16" height="16" style={{ color: "#F97316", flexShrink: 0 }} />
                      </button>
                    ))
                  ) : (
                    <div style={{ padding: "4px 13px 12px", fontSize: 12.5, color: "rgba(20,17,13,0.5)" }}>
                      Not in your library — &ldquo;{draft}&rdquo; works too.
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={lockIn}
                disabled={!draft.trim()}
                style={{
                  marginTop: 16,
                  width: "100%",
                  height: 50,
                  border: 0,
                  borderRadius: 14,
                  cursor: draft.trim() ? "pointer" : "not-allowed",
                  background: "#F97316",
                  color: "#fff",
                  opacity: draft.trim() ? 1 : 0.4,
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: "-0.005em",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: draft.trim() ? "0 10px 22px -10px rgba(249,115,22,0.6)" : "none",
                  transition: "opacity 0.2s ease",
                }}
              >
                Lock in your answer
              </button>
            </div>
          )}
        </div>
      </div>

      {hasLockedAnswer && (
        <div className="phase-fade">
          <Timeline answered={hasLockedAnswer} revealWaiting={revealWaiting} revealUnlocked={revealUnlocked} />

          <div style={{ margin: "12px 22px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: 16,
                borderRadius: 18,
                background: "#fff",
                border: "1px solid rgba(20,17,13,0.05)",
                boxShadow: "0 1px 0 rgba(20,17,13,0.02), 0 6px 18px -12px rgba(20,17,13,0.08)",
              }}
            >
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 99,
                  flexShrink: 0,
                  background: "rgba(113,192,127,0.16)",
                  color: "#2F7D3F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon.Check width="18" height="18" />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "Bricolage Grotesque, sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(20,17,13,0.4)",
                  }}
                >
                  Your answer is locked in
                </div>
                <div
                  style={{
                    fontFamily: "Bricolage Grotesque, sans-serif",
                    fontWeight: 600,
                    fontSize: 17,
                    letterSpacing: "-0.015em",
                    color: "#14110D",
                    marginTop: 3,
                    textWrap: "balance",
                  }}
                >
                  &ldquo;{answer}&rdquo;
                </div>
              </div>
              <button
                type="button"
                onClick={clearAnswer}
                style={{
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                  flexShrink: 0,
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(200,50,50,0.85)",
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {revealWaiting ? <RevealWait secondsLeft={revealCountdown} /> : null}
        </div>
      )}
    </div>
  );
}

const TAG_STYLE: Record<"green" | "orange", { background: string; color: string }> = {
  green: { background: "rgba(113,192,127,0.14)", color: "#2F7D3F" },
  orange: { background: "rgba(249,115,22,0.12)", color: "#C2410C" },
};

const MOCK_MATCH_PAIRS = [
  // Vibe Pairs
  [{ id: 'jordan', type: 'vibe', daysLeft: 6 }, { id: 'charlotte', type: 'vibe', daysLeft: 6 }],
  [{ id: 'cole', type: 'vibe', daysLeft: 5 }, { id: 'caroline', type: 'vibe', daysLeft: 5 }],
  [{ id: 'bennett', type: 'vibe', daysLeft: 1 }, { id: 'alessia', type: 'vibe', daysLeft: 1 }],
  [{ id: 'marcus', type: 'vibe', daysLeft: 4 }, { id: 'sofia', type: 'vibe', daysLeft: 4 }],
  [{ id: 'maddie', type: 'vibe', daysLeft: 3 }, { id: 'jordan', type: 'vibe', daysLeft: 3 }],

  // Spark Pairs
  [{ id: 'jordan', type: 'spark', daysLeft: 4 }, { id: 'maddie', type: 'spark', daysLeft: 4 }],
  [{ id: 'charlotte', type: 'spark', daysLeft: 2 }, { id: 'bennett', type: 'spark', daysLeft: 2 }],
  [{ id: 'cole', type: 'spark', daysLeft: 7 }, { id: 'sofia', type: 'spark', daysLeft: 7 }],
  [{ id: 'caroline', type: 'spark', daysLeft: 3 }, { id: 'marcus', type: 'spark', daysLeft: 3 }],
  [{ id: 'alessia', type: 'spark', daysLeft: 6 }, { id: 'maddie', type: 'spark', daysLeft: 6 }],
];

function getMatchesForUser(userId: string) {
  const result: any[] = [];
  for (const pair of MOCK_MATCH_PAIRS) {
    if (pair[0].id === userId) result.push(pair[1]);
    else if (pair[1].id === userId) result.push(pair[0]);
  }
  return result;
}

function AllMatchesOverlay({ activeUserId, onClose, onOpenChat }: { activeUserId: string, onClose: () => void, onOpenChat: (match: any) => void }) {
  const matches = getMatchesForUser(activeUserId);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 5000, background: '#FAFAF8', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', paddingTop: 'max(env(safe-area-inset-top, 20px), 20px)', position: 'relative', borderBottom: '1px solid rgba(20,17,13,0.05)' }}>
        <button onClick={onClose} style={{ position: 'absolute', left: 12, background: 'none', border: 'none', color: '#14110D', padding: 8, cursor: 'pointer' }}>
          <Icon.ChevronLeft width={28} height={28} />
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700, fontSize: 18, color: '#14110D' }}>
          Your Matches
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: "16px 22px 24px", display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Stats Header */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '12px 16px', border: '1px solid rgba(20,17,13,0.05)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "Bricolage Grotesque, sans-serif", color: '#F97316' }}>{matches.length}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(20,17,13,0.5)', marginTop: 2 }}>Active</div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '12px 16px', border: '1px solid rgba(20,17,13,0.05)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "Bricolage Grotesque, sans-serif", color: '#14110D' }}>14</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(20,17,13,0.5)', marginTop: 2 }}>All-Time</div>
          </div>
        </div>

        {/* Active Matches */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "Bricolage Grotesque, sans-serif", color: '#14110D', marginBottom: 12, paddingLeft: 4 }}>
            Active (7 days left)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {matches.map((m, i) => {
              const user = USERS[m.id];
              if (!user) return null;
              return (
                <div 
                  key={i}
                  onClick={() => onOpenChat({ ...user, matchType: m.type, daysLeft: m.daysLeft })}
                  style={{ 
                    background: "#fff", borderRadius: 20, padding: 16, 
                    border: "1px solid rgba(20,17,13,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    display: "flex", alignItems: "center", gap: 14, cursor: "pointer"
                  }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 99, backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: -4, width: 20, height: 20, borderRadius: 99, background: m.type === 'spark' ? '#EA8CE1' : '#F97316', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <span style={{ fontSize: 10, lineHeight: 1 }}>{m.type === 'spark' ? '✨' : '🍊'}</span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700, fontSize: 16, color: '#14110D' }}>{user.name}</div>
                    <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.5)', marginTop: 2, fontWeight: 500 }}>
                      <span style={{ color: m.type === 'spark' ? '#EA8CE1' : '#F97316', fontWeight: 600 }}>Mutual {m.type === 'spark' ? 'Spark' : 'Vibe'}</span> · {m.daysLeft}d left
                    </div>
                  </div>
                  <div style={{ background: m.type === 'spark' ? 'rgba(234, 140, 225, 0.1)' : 'rgba(249, 115, 22, 0.1)', color: m.type === 'spark' ? '#EA8CE1' : '#F97316', padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, fontFamily: "Bricolage Grotesque, sans-serif", flexShrink: 0 }}>
                    Message
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expired Matches */}
        <div style={{ opacity: 0.6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "Bricolage Grotesque, sans-serif", color: '#14110D', marginBottom: 12, paddingLeft: 4, marginTop: 8 }}>
            Past Connections
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Mock Expired Card 1 */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 16, border: "1px solid rgba(20,17,13,0.05)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 99, background: '#E5E5E5', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700, fontSize: 16, color: '#14110D' }}>Sarah</div>
                <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.5)', marginTop: 2, fontWeight: 500 }}>
                  Mutual Spark · Expired
                </div>
              </div>
            </div>
            {/* Mock Expired Card 2 */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 16, border: "1px solid rgba(20,17,13,0.05)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 99, background: '#E5E5E5', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700, fontSize: 16, color: '#14110D' }}>Emma</div>
                <div style={{ fontSize: 13, color: 'rgba(20,17,13,0.5)', marginTop: 2, fontWeight: 500 }}>
                  Mutual Vibe · Expired
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsDropdown({ activeUserId, onClose, onOpenChat }: { activeUserId: string, onClose: () => void, onOpenChat: (match: any) => void }) {
  const matches = getMatchesForUser(activeUserId);
  return (
    <>
      <style>{`
        @keyframes dropdownEnter {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 4999 }} onClick={onClose} />
      <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 12, width: 320, maxHeight: '60vh', zIndex: 5000, background: '#FAFAF8', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid rgba(20,17,13,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'dropdownEnter 0.15s ease-out forwards', textAlign: 'left' }}>
        <div style={{ padding: '16px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700, fontSize: 16, color: '#14110D' }}>
            Notifications
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: "0 12px 16px", display: 'flex', flexDirection: 'column', gap: 8 }}>
          
          {matches.map((m, i) => {
            const user = USERS[m.id];
            if (!user) return null;
            return (
              <div 
                key={i}
                onClick={() => { onClose(); onOpenChat({ ...user, matchType: m.type, daysLeft: m.daysLeft }); }}
                style={{ 
                  background: "#fff", borderRadius: 16, padding: 12, 
                  border: "1px solid rgba(20,17,13,0.05)",
                  display: "flex", gap: 12, cursor: "pointer"
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 99, backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: 99, background: m.type === 'spark' ? '#EA8CE1' : '#F97316', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <span style={{ fontSize: 10, lineHeight: 1 }}>{m.type === 'spark' ? '✨' : '🍊'}</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#14110D', lineHeight: 1.4, fontWeight: 500 }}>
                    <span style={{ fontWeight: 700 }}>It's mutual!</span> You and <span style={{ fontWeight: 700 }}>{user.name.split(' ')[0]}</span> both sent a {m.type === 'spark' ? 'Spark' : 'Vibe'}.
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(20,17,13,0.4)', marginTop: 4, fontWeight: 600 }}>
                    Tap to message them · {m.daysLeft}d left
                  </div>
                </div>
              </div>
            );
          })}

          {/* Mock Generic Notification */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 12, border: "1px solid rgba(20,17,13,0.05)", display: "flex", gap: 12, opacity: 0.8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 99, background: 'rgba(249, 115, 22, 0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316', fontSize: 20 }}>
              🍊
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 13, color: '#14110D', lineHeight: 1.4, fontWeight: 500 }}>
                Someone caught your vibe! Join tonight's Connection Night to see who it is.
              </div>
              <div style={{ fontSize: 11, color: 'rgba(20,17,13,0.4)', marginTop: 4, fontWeight: 600 }}>
                2 hours ago
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

function ActiveMatches({ activeUserId, onSeeAll, onOpenChat }: { activeUserId: string, onSeeAll: () => void, onOpenChat: (match: any) => void }) {
  const matches = getMatchesForUser(activeUserId);
  
  if (!matches.length) return null;
  
  return (
    <div style={{ padding: "0 0 24px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, padding: "0 22px" }}>
        <h2 style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 600, fontSize: 18, letterSpacing: "-0.015em", color: "#14110D", margin: 0 }}>
          Your Matches
        </h2>
        <span onClick={onSeeAll} style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontSize: 12, fontWeight: 600, color: "#F97316", cursor: 'pointer' }}>See all</span>
      </div>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: "0 22px", scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {matches.map((m, i) => {
          const user = USERS[m.id];
          if (!user) return null;
          return (
            <div 
              key={i}
              onClick={() => onOpenChat({ ...user, matchType: m.type, daysLeft: m.daysLeft })}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: "pointer", flexShrink: 0 }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{ width: 72, height: 72, borderRadius: 99, backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center', border: m.type === 'spark' ? '2px solid #EA8CE1' : '2px solid #F97316', padding: 2, backgroundClip: 'content-box' }} />
                <div style={{ position: 'absolute', bottom: -2, right: 0, width: 24, height: 24, borderRadius: 99, background: m.type === 'spark' ? '#EA8CE1' : '#F97316', border: '2px solid #FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <span style={{ fontSize: 12, lineHeight: 1 }}>{m.type === 'spark' ? '✨' : '🍊'}</span>
                </div>
              </div>
              <div style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 600, fontSize: 13, color: '#14110D' }}>
                {user.name.split(' ')[0]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NearYou({ home }: { home: HomeContentState }) {
  const { loading, error, shows } = home;
  return (
    <div>
      <div style={{ padding: "24px 22px 12px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 600, fontSize: 18, letterSpacing: "-0.015em", color: "#14110D", margin: 0 }}>
          Near you
        </h2>
        <span style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontSize: 12, fontWeight: 600, color: "#F97316" }}>All shows</span>
      </div>
      <div style={{ padding: "0 22px", display: "flex", flexDirection: "column", gap: 8 }}>
        {loading ? (
          <p style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 500, fontSize: 14, color: "rgba(20,17,13,0.45)", margin: "8px 0 12px" }}>
            Loading shows near you…
          </p>
        ) : error ? (
          <p style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 500, fontSize: 14, color: "rgba(200,50,50,0.85)", margin: "8px 0 12px" }}>
            {error}
          </p>
        ) : !shows.length ? (
          <p style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 500, fontSize: 14, color: "rgba(20,17,13,0.45)", margin: "8px 0 12px" }}>
            Nothing here yet
          </p>
        ) : (
          shows.map((s, i) => (
            <div
              key={s.id || i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 10,
                borderRadius: 18,
                background: "#fff",
                border: "1px solid rgba(20,17,13,0.05)",
                boxShadow: "0 1px 0 rgba(20,17,13,0.02), 0 6px 18px -12px rgba(20,17,13,0.08)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  flexShrink: 0,
                  backgroundImage: `url(${s.art_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "Bricolage Grotesque, sans-serif",
                    fontWeight: 600,
                    fontSize: 14.5,
                    letterSpacing: "-0.01em",
                    color: "#14110D",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {s.name}
                </div>
                <div style={{ fontSize: 12, color: "rgba(20,17,13,0.5)", marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon.Pin width="12" height="12" style={{ opacity: 0.6 }} /> {s.venue}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span
                  style={{
                    ...TAG_STYLE[s.tag_style],
                    fontFamily: "Bricolage Grotesque, sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "4px 8px",
                    borderRadius: 99,
                  }}
                >
                  {s.tag}
                </span>
                <div style={{ fontSize: 11, color: "rgba(20,17,13,0.5)", marginTop: 6, fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 600 }}>
                  {s.when_label}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TopBar({
  activeUser,
  activeUserId,
  setActiveUserId,
  onOpenChat,
}: {
  activeUser: UserProfile;
  activeUserId: string;
  setActiveUserId: (id: string) => void;
  onOpenChat: (match: any) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  return (
    <div style={{ padding: "56px 22px 4px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 9, height: 9, borderRadius: 99, background: "#F97316", boxShadow: "0 0 0 4px rgba(249,115,22,0.16)" }} />
        <span style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: "-0.03em", color: "#14110D", lineHeight: 1 }}>
          Ligo
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
            width: 38,
            height: 38,
            borderRadius: 99,
            background: "rgba(20,17,13,0.05)",
            border: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#14110D",
            position: "relative",
          }}
        >
          <Icon.Bell width="18" height="18" />
          <span style={{ position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: 99, background: "#F97316", boxShadow: "0 0 0 2px #FAFAF8" }} />
        </button>
        {showNotifications && (
          <NotificationsDropdown 
            activeUserId={activeUserId} 
            onClose={() => setShowNotifications(false)} 
            onOpenChat={onOpenChat} 
          />
        )}
        </div>
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setMenuOpen(!menuOpen);
            }}
            style={{
              width: 38,
              height: 38,
              borderRadius: 99,
              flexShrink: 0,
              backgroundImage: `url(${activeUser.avatar})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
            }}
          />
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 8,
                width: 180,
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                border: "1px solid rgba(20,17,13,0.05)",
                padding: "6px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                zIndex: 200,
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              <div style={{ padding: "6px 10px 4px", fontSize: 11, fontWeight: 700, color: "rgba(20,17,13,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Switch User
              </div>
              {Object.values(USERS).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setActiveUserId(u.id);
                    setMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    background: u.id === activeUserId ? "rgba(20,17,13,0.05)" : "transparent",
                    border: 0,
                    borderRadius: 10,
                    cursor: "pointer",
                    textAlign: "left",
                    color: "#14110D",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 99,
                      backgroundImage: `url(${u.avatar})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                  {u.id === activeUserId && <Icon.Check width={14} height={14} style={{ color: "#F97316" }} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HomeNormal({
  onOpenReveal,
  home,
  activeUserId,
  hasLockedAnswer,
  revealCountdown,
  revealUnlocked,
  onRevealAnswerLocked,
  onRevealAnswerCleared,
  onOpenChat,
  onSeeAll,
}: {
  onOpenReveal: () => void;
  home: HomeContentState;
  activeUserId: string;
  hasLockedAnswer: boolean;
  revealCountdown: number | null;
  revealUnlocked: boolean;
  onRevealAnswerLocked: () => void;
  onRevealAnswerCleared: () => void;
  onOpenChat: (match: any) => void;
  onSeeAll: () => void;
}) {
  return (
    <div style={{ paddingBottom: 124 }}>
      <DailyPick
        activeUserId={activeUserId}
        revealCountdown={revealCountdown}
        revealUnlocked={revealUnlocked}
        onRevealAnswerLocked={onRevealAnswerLocked}
        onRevealAnswerCleared={onRevealAnswerCleared}
      />
      <RevealTeaser onOpen={onOpenReveal} hasLockedAnswer={hasLockedAnswer} revealUnlocked={revealUnlocked} />
      <ActiveMatches activeUserId={activeUserId} onSeeAll={onSeeAll} onOpenChat={onOpenChat} />
      <NewsStrip home={home} />
      <NearYou home={home} />
    </div>
  );
}

function HomeProfileSession({
  activeUserId,
  setActiveUserId,
  state,
  setState,
  onNav,
  isCN,
}: {
  activeUserId: string;
  setActiveUserId: (id: string) => void;
  state: HomeState;
  setState: React.Dispatch<React.SetStateAction<HomeState>>;
  onNav: (id: NavId) => void;
  isCN?: boolean;
}) {
  const [answered] = usePersistentState(`ligo:daily:${activeUserId}:answered`, false);
  const [answer] = usePersistentState(`ligo:daily:${activeUserId}:answer`, "");
  const hasLockedAnswer = answered && answer.trim().length > 0;
  const [revealUnlocked, setRevealUnlocked] = usePersistentState(`ligo:reveal:${activeUserId}:unlocked`, false);
  const [revealCountdown, setRevealCountdown] = useState<number | null>(null);
  const [revealPlayIntro, setRevealPlayIntro] = useState(false);
  const activeUser = USERS[activeUserId] ?? USERS.jordan;
  const home = useHomeContent(activeUserId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showChat, setShowChat] = useState<any>(null);
  const [showAllMatches, setShowAllMatches] = useState(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [state]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activeUserId]);

  useEffect(() => {
    if (revealCountdown === null || revealCountdown <= 0) return;
    const id = setTimeout(() => {
      setRevealCountdown((current) => (current !== null && current > 0 ? current - 1 : current));
    }, 1000);
    return () => clearTimeout(id);
  }, [revealCountdown]);

  useEffect(() => {
    if (!hasLockedAnswer) {
      setRevealCountdown(null);
      setRevealUnlocked(false);
      setRevealPlayIntro(false);
      if (state === "reveal") setState("normal");
      return;
    }
    if (revealUnlocked || revealCountdown !== null) return;
    setRevealCountdown(REVEAL_COUNTDOWN_SECONDS);
  }, [activeUserId, hasLockedAnswer, revealUnlocked, revealCountdown, state, setRevealUnlocked, setState]);

  useEffect(() => {
    if (!hasLockedAnswer || revealCountdown !== 0 || revealUnlocked) return;
    setRevealPlayIntro(true);
    setRevealUnlocked(true);
    setRevealCountdown(null);
    setState("reveal");
  }, [hasLockedAnswer, revealCountdown, revealUnlocked, setRevealUnlocked, setState]);

  function handleRevealAnswerLocked() {
    if (!hasLockedAnswer || revealUnlocked) return;
    setRevealCountdown(REVEAL_COUNTDOWN_SECONDS);
  }

  function handleRevealAnswerCleared() {
    setRevealCountdown(null);
    setRevealUnlocked(false);
    setRevealPlayIntro(false);
    setState("normal");
    try {
      const answeredKey = `ligo:daily:${activeUserId}:answered`;
      const answerKey = `ligo:daily:${activeUserId}:answer`;
      const unlockKey = `ligo:reveal:${activeUserId}:unlocked`;
      window.localStorage.setItem(answeredKey, "false");
      window.localStorage.setItem(answerKey, '""');
      window.localStorage.setItem(unlockKey, "false");
      window.dispatchEvent(new CustomEvent("ligo:storage", { detail: { key: answeredKey, newValue: false } }));
      window.dispatchEvent(new CustomEvent("ligo:storage", { detail: { key: answerKey, newValue: "" } }));
      window.dispatchEvent(new CustomEvent("ligo:storage", { detail: { key: unlockKey, newValue: false } }));
    } catch {
      /* ignore */
    }
  }

  if (state === "reveal") {
    return (
      <>
        <RevealScreen isCN={isCN}
          key={`reveal-${activeUserId}-${revealPlayIntro ? "intro" : "replay"}`}
          activeUserId={activeUserId}
          playIntro={revealPlayIntro}
          onBack={() => {
            setRevealPlayIntro(false);
            setState("normal");
          }}
        />
        <BottomNav active="home" dark onChange={onNav} />
      </>
    );
  }

  return (
    <>
      {showAllMatches && <AllMatchesOverlay activeUserId={activeUserId} onClose={() => setShowAllMatches(false)} onOpenChat={(m) => setShowChat(m)} />}
      {showChat && <ChatScreen match={showChat} onClose={() => setShowChat(null)} />}
      <div ref={scrollRef} className="no-scrollbar" style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden", pointerEvents: (showChat || showAllMatches) ? 'none' : 'auto', opacity: (showChat || showAllMatches) ? 0 : 1 }}>
        <TopBar activeUser={activeUser} activeUserId={activeUserId} setActiveUserId={setActiveUserId} onOpenChat={(m) => setShowChat(m)} />
          <div key={`${state}-${activeUserId}`} className="phase-fade">
            <HomeNormal
              key={activeUserId}
              onOpenReveal={() => {
                if (!hasLockedAnswer) return;
                setRevealPlayIntro(false);
                setState("reveal");
              }}
              home={home}
              activeUserId={activeUserId}
              hasLockedAnswer={hasLockedAnswer}
              revealCountdown={revealCountdown}
              revealUnlocked={revealUnlocked}
              onRevealAnswerLocked={handleRevealAnswerLocked}
              onRevealAnswerCleared={handleRevealAnswerCleared}
              onOpenChat={(match) => setShowChat(match)}
              onSeeAll={() => setShowAllMatches(true)}
            />
          </div>
        </div>
      <BottomNav active="home" onChange={onNav} />
    </>
  );
}

export function HomeScreen({ state, setState, onNav, isCN }: HomeScreenProps) {
  const [activeUserId, setActiveUserId] = usePersistentState("ligo:active_user", REVEAL_DEMO_PROFILE_ID);

  useEffect(() => {
    setState("normal");
  }, [activeUserId, setState]);

  return (
    <HomeProfileSession
      key={activeUserId}
      activeUserId={activeUserId}
      setActiveUserId={setActiveUserId}
      state={state}
      setState={setState}
      onNav={onNav}
      isCN={isCN}
    />
  );
}
