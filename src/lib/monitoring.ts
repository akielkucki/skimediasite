/**
 * Server-side monitoring hook.
 *
 * A deliberate extension point rather than a vendored SDK: `reportError` is
 * called wherever the server swallows a failure it should not swallow silently
 * (CMS queries, form delivery, malformed content). Connect Sentry, Axiom, a
 * webhook, or OpenTelemetry here and every call site lights up at once.
 *
 * Privacy rule: `context` must never contain user-submitted content, email
 * addresses or form payloads — identifiers and counts only.
 */

type MonitoringContext = Record<string, string | number | boolean | undefined>;

export function reportError(scope: string, error: unknown, context: MonitoringContext = {}) {
  const message = error instanceof Error ? error.message : String(error);
  // Replace with a real sink (Sentry.captureException, webhook, …) when one
  // is configured. Console output is structured so log drains can parse it.
  console.error(
    JSON.stringify({
      level: "error",
      scope,
      message,
      ...context,
      at: new Date().toISOString(),
    }),
  );
}

export function reportWarning(scope: string, message: string, context: MonitoringContext = {}) {
  console.warn(
    JSON.stringify({ level: "warn", scope, message, ...context, at: new Date().toISOString() }),
  );
}
