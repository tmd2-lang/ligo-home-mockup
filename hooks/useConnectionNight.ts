"use client";

import { useEffect, useState } from "react";
import {
  mapRosterToPeople,
  songFromAnswer,
  type ConnectionNightPerson,
  type ConnectionNightSong,
} from "@/lib/connectionNight";
import type { DailyAnswerRow } from "@/lib/supabase/types";
import { USERS } from "@/lib/users";

type ConnectionNightState = {
  loading: boolean;
  error: string | null;
  people: ConnectionNightPerson[];
  song: ConnectionNightSong | null;
};

const EMPTY: ConnectionNightState = {
  loading: true,
  error: null,
  people: [],
  song: null,
};

export function useConnectionNight(viewerId: string): ConnectionNightState {
  const [state, setState] = useState<ConnectionNightState>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const res = await fetch(`/api/connection-night?profile=${encodeURIComponent(viewerId)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || data.hint || `Request failed (${res.status})`);
        }

        if (cancelled) return;

        const pick: DailyAnswerRow | null = data.currentAnswer ?? null;
        const song = songFromAnswer(pick, "/artists/frank-blond.png");
        const people = mapRosterToPeople(data.connectionRoster ?? [], USERS);

        setState({
          loading: false,
          error: null,
          people,
          song,
        });
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load Connection Night";
        setState({
          loading: false,
          error: message,
          people: [],
          song: null,
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [viewerId]);

  return state;
}
