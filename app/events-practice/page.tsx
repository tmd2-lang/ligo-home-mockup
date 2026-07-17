"use client";
import { useState } from "react";
import { IOSDevice } from "@/components/IOSDevice";
import { PracticeEventsScreen } from "@/components/PracticeEventsScreen";
import { PracticeEventsScreenV2 } from "@/components/PracticeEventsScreenV2";
import { PracticeGuestEventScreen } from "@/components/PracticeGuestEventScreen";
import { PoshDesktopHome } from "@/components/PoshDesktopHome";
import { PoshEventDetail } from "@/components/PoshEventDetail";
import { PoshMobileHome } from "@/components/PoshMobileHome";
import { PoshMobileEventDetail } from "@/components/PoshMobileEventDetail";
import { PoshEventEditor } from "@/components/PoshEventEditor";
import { PoshMobileEventEditor } from "@/components/PoshMobileEventEditor";

export default function EventsPracticePage() {
  const [version, setVersion] = useState<"v1" | "v2" | "received" | "home" | "home-desktop" | "event-desktop" | "event-mobile">("v1");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedMobileEventId, setSelectedMobileEventId] = useState<number | null>(null);

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
        Events Practice
      </div>

      {/* The Toggle Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => setVersion("v1")}
          style={{
            padding: '8px 16px',
            borderRadius: '100px',
            background: version === "v1" ? "#fff" : "rgba(255,255,255,0.1)",
            color: version === "v1" ? "#000" : "#fff",
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Partiful UI
        </button>
        <button
          onClick={() => setVersion("v2")}
          style={{
            padding: '8px 16px',
            borderRadius: '100px',
            background: version === "v2" ? "#fff" : "rgba(255,255,255,0.1)",
            color: version === "v2" ? "#000" : "#fff",
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Brand New UI
        </button>
        <button
          onClick={() => setVersion("received")}
          style={{
            padding: '8px 16px',
            borderRadius: '100px',
            background: version === "received" ? "#fff" : "rgba(255,255,255,0.1)",
            color: version === "received" ? "#000" : "#fff",
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Event Received
        </button>
        <button
          onClick={() => { setVersion("home"); setSelectedMobileEventId(null); }}
          style={{
            padding: '8px 16px',
            borderRadius: '100px',
            background: version === "home" ? "#fff" : "rgba(255,255,255,0.1)",
            color: version === "home" ? "#000" : "#fff",
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Home
        </button>
        <button
          onClick={() => setVersion("home-desktop")}
          style={{
            padding: '8px 16px',
            borderRadius: '100px',
            background: version === "home-desktop" ? "#fff" : "rgba(255,255,255,0.1)",
            color: version === "home-desktop" ? "#000" : "#fff",
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Home DESKTOP
        </button>
        <button
          onClick={() => setVersion("event-desktop")}
          style={{
            padding: '8px 16px',
            borderRadius: '100px',
            background: version === "event-desktop" ? "#fff" : "rgba(255,255,255,0.1)",
            color: version === "event-desktop" ? "#000" : "#fff",
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Event Desktop
        </button>
        <button
          onClick={() => setVersion("event-mobile")}
          style={{
            padding: '8px 16px',
            borderRadius: '100px',
            background: version === "event-mobile" ? "#fff" : "rgba(255,255,255,0.1)",
            color: version === "event-mobile" ? "#000" : "#fff",
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Event Mobile
        </button>
      </div>

      {version === "home-desktop" || version === "event-desktop" ? (
        <div style={{ width: '100%', maxWidth: '1400px', height: '85vh', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
          {version === "event-desktop" ? (
            <PoshEventEditor />
          ) : version === "home-desktop" && selectedEventId === null ? (
            <PoshDesktopHome onEventClick={(id) => setSelectedEventId(id)} />
          ) : (
            <PoshEventDetail eventId={selectedEventId || 1} onBack={() => {
              setSelectedEventId(null);
            }} />
          )}
        </div>
      ) : (
        <IOSDevice width={402} height={874} dark={version === "home"}>
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              background: version === "home" ? "#000000" : "#FAFAF8",
              color: version === "home" ? "#FFFFFF" : "#14110D",
              overflow: "hidden",
            }}
          >
            <div className="ligo-events" style={{ position: "absolute", inset: 0 }}>
              {version === "v1" ? (
                <PracticeEventsScreen onTab={() => {}} />
              ) : version === "v2" ? (
                <PracticeEventsScreenV2 onTab={() => {}} />
              ) : version === "received" ? (
                <PracticeGuestEventScreen />
              ) : version === "event-mobile" ? (
                <PoshMobileEventEditor />
              ) : selectedMobileEventId !== null ? (
                <PoshMobileEventDetail 
                  eventId={selectedMobileEventId} 
                  onBack={() => setSelectedMobileEventId(null)} 
                />
              ) : (
                <PoshMobileHome onEventClick={(id) => setSelectedMobileEventId(id)} />
              )}
            </div>
          </div>
        </IOSDevice>
      )}

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
        Use the buttons above the phone to toggle between UIs.
      </div>
    </main>
  );
}
