/* ============================================================
   LIGO — clickable prototype.
   A phone frame with the home interface (Home tab) and the Events
   tab, switched via the bottom bar (Events · Home · Profile).
   The home manages its own normal / connection / wrapped states
   internally — no top toggle. All client-side useState.
   ============================================================ */
"use client";

import { useState, useEffect, useCallback } from "react";
import { IOSDevice } from "@/components/IOSDevice";
import { BottomNav, type NavId } from "@/components/BottomNav";
import { HomeScreen } from "@/components/HomeScreen";
import { EventsScreen } from "@/components/EventsScreen";
import { ProfileV2Provider, ProfileV2Shell } from "@/components/profile/ProfileScreen";
import { ProfileGateProvider } from "@/lib/profileGate";
import { CONNECTION_NIGHT_PREVIEW_KEY } from "@/lib/revealConstants";

type HomeState = "normal" | "connection" | "wrapped" | "games" | "reveal";

const FF = "Bricolage Grotesque, var(--font-display), sans-serif";

const NIGHT_LABELS = [
  "N1", "N2", "N3", "N4", "N5",
  "N6", "N7", "N8", "N9", "N10",
];

const NIGHT_INTENSITY = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

type NightPreviewSelection = number | "cn" | null;

function readNightPreview(): NightPreviewSelection {
  const ov = localStorage.getItem("ligo:demo:night");
  if (ov === CONNECTION_NIGHT_PREVIEW_KEY) return "cn";
  if (ov !== null) {
    const n = parseInt(ov, 10);
    if (!Number.isNaN(n)) return Math.max(0, Math.min(9, n));
  }
  return null;
}

function NightPicker() {
  const [selection, setSelection] = useState<NightPreviewSelection>(null);

  useEffect(() => {
    setSelection(readNightPreview());
  }, []);

  const applySelection = useCallback((next: NightPreviewSelection) => {
    if (next === null) {
      localStorage.removeItem("ligo:demo:night");
    } else if (next === "cn") {
      localStorage.setItem("ligo:demo:night", CONNECTION_NIGHT_PREVIEW_KEY);
    } else {
      localStorage.setItem("ligo:demo:night", String(next));
    }
    setSelection(next);
    window.location.reload();
  }, []);

  const pickAurora = useCallback(
    (n: number) => applySelection(selection === n ? null : n),
    [applySelection, selection],
  );

  const pickConnection = useCallback(
    () => applySelection(selection === "cn" ? null : "cn"),
    [applySelection, selection],
  );

  return (
    <div
      className="app-chrome"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          fontFamily: FF,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        Night Preview
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 5,
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 420,
        }}
      >
        {NIGHT_LABELS.map((label, i) => {
          const active = selection === i;
          const intensity = NIGHT_INTENSITY[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => pickAurora(i)}
              title={`Night ${i + 1} — ${Math.round(intensity * 100)}% aurora intensity`}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: active
                  ? `rgba(249,115,22,${0.3 + intensity * 0.5})`
                  : `rgba(255,255,255,${0.04 + intensity * 0.06})`,
                color: active ? "#fff" : `rgba(255,255,255,${0.3 + intensity * 0.4})`,
                fontFamily: FF,
                fontSize: 10,
                fontWeight: active ? 800 : 600,
                boxShadow: active
                  ? `0 0 0 1.5px rgba(249,115,22,0.6), 0 4px 12px rgba(249,115,22,${intensity * 0.4})`
                  : "0 0 0 1px rgba(255,255,255,0.08)",
                transition: "all 0.15s ease",
                position: "relative",
              }}
            >
              {label}
              <div
                style={{
                  position: "absolute",
                  bottom: 3,
                  left: 4,
                  right: 4,
                  height: 2,
                  borderRadius: 99,
                  background: "linear-gradient(90deg, #71C07F, #EA8CE1, #F97316)",
                  opacity: intensity * 0.8,
                }}
              />
            </button>
          );
        })}

        <span
          aria-hidden
          style={{
            width: 1,
            height: 22,
            margin: "0 2px",
            background: "rgba(255,255,255,0.12)",
            flexShrink: 0,
          }}
        />

        <button
          type="button"
          onClick={pickConnection}
          title="Connection Night — matches inside the reveal (coming soon)"
          style={{
            width: 38,
            height: 34,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background:
              selection === "cn"
                ? "rgba(234,140,225,0.42)"
                : "rgba(234,140,225,0.1)",
            color: selection === "cn" ? "#fff" : "rgba(234,140,225,0.85)",
            fontFamily: FF,
            fontSize: 10,
            fontWeight: selection === "cn" ? 800 : 700,
            letterSpacing: "0.06em",
            boxShadow:
              selection === "cn"
                ? "0 0 0 1.5px rgba(234,140,225,0.65), 0 4px 14px rgba(234,140,225,0.35)"
                : "0 0 0 1px rgba(234,140,225,0.28)",
            transition: "all 0.15s ease",
            position: "relative",
            flexShrink: 0,
          }}
        >
          CN
          <div
            style={{
              position: "absolute",
              bottom: 3,
              left: 4,
              right: 4,
              height: 2,
              borderRadius: 99,
              background: "linear-gradient(90deg, #EA8CE1, #F97316)",
              opacity: selection === "cn" ? 1 : 0.55,
            }}
          />
        </button>

        {selection !== null && (
          <button
            type="button"
            onClick={() => applySelection(null)}
            title="Reset to live night"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.45)",
              fontFamily: FF,
              fontSize: 9,
              fontWeight: 700,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
              letterSpacing: "0.04em",
            }}
          >
            LIVE
          </button>
        )}
      </div>
      <div
        style={{
          fontFamily: FF,
          fontSize: 10,
          color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.06em",
        }}
      >
        {selection === "cn"
          ? "Previewing Connection Night — matches inside the reveal · LIVE resets"
          : selection !== null
          ? `Previewing Night ${selection + 1} — click again to deselect · LIVE resets`
          : "N1–N10 = aurora nights · CN = Connection Night slot (TBD)"}
      </div>
    </div>
  );
}

export default function Home() {
  const [nav, setNav] = useState<NavId>("home");
  const [homeState, setHomeState] = useState<HomeState>("normal");

  const onNav = (id: NavId) => {
    if (id === "home") {
      setNav("home");
      setHomeState("normal");
    } else if (id === "events") {
      setNav("events");
    } else if (id === "profile") {
      setNav("profile");
    }
  };

  const isEvents = nav === "events";
  const isProfile = nav === "profile";
  const dark =
    !isEvents && !isProfile && homeState !== "normal" && homeState !== "games";

  return (
    <main
      className="app-stage"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "40px 24px",
      }}
    >
      <NightPicker />

      <div
        className="app-chrome"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "rgba(255,255,255,0.55)",
          fontFamily: "var(--font-display)",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <b style={{ color: "#F5D783", fontWeight: 600 }}>LIGO</b>
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: 99,
            background: "rgba(255,255,255,0.25)",
          }}
        />
        Home · music-first · college
      </div>

      <IOSDevice width={402} height={874} dark={dark}>
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: isEvents || isProfile ? "#FAFAF8" : dark ? "#07090C" : "#FAFAF8",
            color: dark ? "#fff" : "#14110D",
            overflow: "hidden",
          }}
        >
          {isEvents ? (
            <>
              <div
                className="ligo-events"
                style={{ position: "absolute", inset: 0 }}
              >
                <EventsScreen onTab={onNav} />
              </div>
              <BottomNav active="events" onChange={onNav} />
            </>
          ) : isProfile ? (
            <>
              <ProfileGateProvider>
                <ProfileV2Provider>
                  <ProfileV2Shell />
                </ProfileV2Provider>
              </ProfileGateProvider>
              <BottomNav active="profile" onChange={onNav} />
            </>
          ) : (
            <HomeScreen
              state={homeState}
              setState={setHomeState}
              onNav={onNav}
            />
          )}
        </div>
      </IOSDevice>

      <div
        className="app-chrome"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "rgba(255,255,255,0.35)",
          textAlign: "center",
          maxWidth: 440,
          lineHeight: 1.5,
        }}
      >
        {isEvents ? (
          <>
            The{" "}
            <b style={{ color: "rgba(255,255,255,0.6)" }}>Events</b> tab — tap{" "}
            <b style={{ color: "rgba(255,255,255,0.6)" }}>Home</b> to go back.
          </>
        ) : isProfile ? (
          <>
            Jordan&apos;s{" "}
            <b style={{ color: "rgba(255,255,255,0.6)" }}>Profile</b> — tap{" "}
            <b style={{ color: "rgba(255,255,255,0.6)" }}>Home</b> or{" "}
            <b style={{ color: "rgba(255,255,255,0.6)" }}>Events</b> to explore
            the rest of the mockup.
          </>
        ) : homeState !== "normal" ? (
          <>
            Tap the{" "}
            <b style={{ color: "rgba(255,255,255,0.6)" }}>Home</b> button to
            return to your daily home.
          </>
        ) : (
          <>
            Switch to{" "}
            <b style={{ color: "rgba(255,255,255,0.6)" }}>Marcus</b>, lock in,
            wait for the reveal — then replay from home. Use{" "}
            <b style={{ color: "rgba(255,255,255,0.6)" }}>Night Preview</b>{" "}
            above for N1–N10 aurora nights or <b style={{ color: "rgba(255,255,255,0.6)" }}>CN</b>{" "}
            (Connection Night — slot reserved).
          </>
        )}
      </div>
    </main>
  );
}
