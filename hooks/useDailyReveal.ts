"use client";

import { useEffect, useState } from "react";
import type { AnswerTrailItem } from "@/lib/dailyReveal";
import type { DailyAnswerRow, DailyQuestionRow } from "@/lib/supabase/types";

type DailyRevealState = {
  loading: boolean;
  error: string | null;
  currentDayNumber: number | null;
  currentQuestion: DailyQuestionRow | null;
  currentAnswer: DailyAnswerRow | null;
  answerTrail: AnswerTrailItem[];
};

const EMPTY: DailyRevealState = {
  loading: true,
  error: null,
  currentDayNumber: null,
  currentQuestion: null,
  currentAnswer: null,
  answerTrail: [],
};

export function useDailyReveal(profileId: string): DailyRevealState {
  const [state, setState] = useState<DailyRevealState>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const res = await fetch(`/api/daily?profile=${encodeURIComponent(profileId)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || data.hint || `Request failed (${res.status})`);
        }

        if (cancelled) return;

        setState({
          loading: false,
          error: null,
          currentDayNumber: data.currentDayNumber ?? null,
          currentQuestion: data.currentQuestion ?? null,
          currentAnswer: data.currentAnswer ?? null,
          answerTrail: data.answerTrail ?? [],
        });
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load daily reveal";
        setState({
          loading: false,
          error: message,
          currentDayNumber: null,
          currentQuestion: null,
          currentAnswer: null,
          answerTrail: [],
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [profileId]);

  return state;
}
