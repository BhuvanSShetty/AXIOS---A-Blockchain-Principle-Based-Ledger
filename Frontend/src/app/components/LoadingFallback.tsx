import { Loader2 } from "lucide-react";

/**
 * Branded skeleton fallback shown while lazily-loaded route chunks are
 * being downloaded.  Used as the `Suspense` fallback in the router.
 */
export function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-surface-1 border border-surface-3">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        </div>
        <p className="text-sm text-text-muted">Loading…</p>
      </div>
    </div>
  );
}
