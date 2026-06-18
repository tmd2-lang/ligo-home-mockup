"use client";

import { useEffect, useState } from "react";
import {
  mapRosterToPeople,
  songFromAnswer,
  type ConnectionNightPerson,
  type ConnectionNightSong,
} from "@/lib/connectionNight";
import { getConnectionNightDemoResponse } from "@/lib/connectionNightDemo";
import { isConnectionNightPreview } from "@/lib/revealConstants";
import type { DailyAnswerRow } from "@/lib/supabase/types";
import { USERS } from "@/lib/users";

type ConnectionNightState = {
  loading: boolean;
  error: string | null;
  people: ConnectionNightPerson[];
  song: ConnectionNightSong | null;
  isDemo: boolean;
};

const EMPTY: ConnectionNightState = {
  loading: true,
  error: null,
  people: [],
  song: null,
  isDemo: false,
};

function mapPayload(
  viewerId: string,
  data: {
    currentAnswer?: DailyAnswerRow | null;
    connectionRoster?: unknown[];
    dailyAnswers?: DailyAnswerRow[];
    matchAnswersById?: Record<string, DailyAnswerRow[]>;
    dailyQuestions?: { day_number: number; weekday: string }[];
    currentDayNumber?: number | null;
  },
  isDemo: boolean
): Omit<ConnectionNightState, "loading"> {
  const pick: DailyAnswerRow | null = data.currentAnswer ?? null;
  const song = songFromAnswer(pick, "/artists/frank-blond.png");
  const people = mapRosterToPeople(
    (data.connectionRoster ?? []) as Parameters<typeof mapRosterToPeople>[0],
    USERS,
    viewerId,
    data.dailyAnswers ?? [],
    data.matchAnswersById ?? {},
    (data.dailyQuestions ?? []) as Parameters<typeof mapRosterToPeople>[5],
    data.currentDayNumber ?? 28
  );

  return {
    error: people.length ? null : "No matches surfaced for this profile yet.",
    people,
    song,
    isDemo,
  };
}

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

        const roster = data.connectionRoster ?? [];
        const useDemo =
          isConnectionNightPreview() ||
          roster.length === 0 ||
          data.meta?.empty === true;

        if (useDemo) {
          const demo = getConnectionNightDemoResponse(viewerId);
          if (demo && demo.connectionRoster.length) {
            setState({ loading: false, ...mapPayload(viewerId, demo, true) });
            return;
          }
        }

        setState({
          loading: false,
          ...mapPayload(viewerId, data, false),
        });
      } catch (err) {
        if (cancelled) return;

        const demo = getConnectionNightDemoResponse(viewerId);
        if (demo && demo.connectionRoster.length) {
          setState({ loading: false, ...mapPayload(viewerId, demo, true) });
          return;
        }

        const message = err instanceof Error ? err.message : "Failed to load Connection Night";
        setState({
          loading: false,
          error: message,
          people: [],
          song: null,
          isDemo: false,
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
