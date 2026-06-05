"use client";

import { useEffect, useState } from "react";
import type { HomeNewsRow, HomeShowRow } from "@/lib/supabase/types";

type HomeContentState = {
  loading: boolean;
  error: string | null;
  news: HomeNewsRow[];
  shows: HomeShowRow[];
  wrapped: Record<string, unknown> | null;
};

const EMPTY: HomeContentState = {
  loading: true,
  error: null,
  news: [],
  shows: [],
  wrapped: null,
};

export function useHomeContent(profileId: string): HomeContentState {
  const [state, setState] = useState<HomeContentState>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const res = await fetch(`/api/home?profile=${encodeURIComponent(profileId)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || data.hint || `Request failed (${res.status})`);
        }

        if (cancelled) return;

        setState({
          loading: false,
          error: null,
          news: data.news ?? [],
          shows: data.shows ?? [],
          wrapped: data.wrapped ?? null,
        });
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load home content";
        setState({
          loading: false,
          error: message,
          news: [],
          shows: [],
          wrapped: null,
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
