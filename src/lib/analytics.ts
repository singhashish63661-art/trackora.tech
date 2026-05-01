export type TrackPayload = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    trackEvent?: (name: string, payload?: TrackPayload) => void;
    __trackoraDemoReady?: boolean;
    openDemoWithFallback?: () => void;
  }
}

export function trackEvent(name: string, payload: TrackPayload = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: name,
    page: window.location.pathname,
    ts: Date.now(),
    ...payload,
  });
}

