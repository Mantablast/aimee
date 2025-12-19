import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let turnstileLoadPromise;

function ensureTurnstileLoaded() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Turnstile is only available in the browser"));
  }

  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileLoadPromise) return turnstileLoadPromise;

  turnstileLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-turnstile-script="true"]`);

    const script =
      existing ??
      Object.assign(document.createElement("script"), {
        src: TURNSTILE_SRC,
        async: true,
        defer: true,
      });

    if (!existing) {
      script.dataset.turnstileScript = "true";
      document.head.appendChild(script);
    }

    const cleanup = () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };

    const onLoad = () => {
      cleanup();
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("Turnstile loaded, but did not initialize"));
    };

    const onError = () => {
      cleanup();
      reject(new Error("Failed to load Turnstile"));
    };

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
  });

  return turnstileLoadPromise;
}

const Turnstile = forwardRef(function Turnstile(
  { siteKey, action, onToken, onExpire, onError, className },
  ref
) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onTokenRef = useRef(onToken);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        if (!window.turnstile) return;
        if (widgetIdRef.current == null) return;
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch {
          // ignore
        }
      },
    }),
    []
  );

  useEffect(() => {
    if (!siteKey) return;
    if (!containerRef.current) return;

    let cancelled = false;

    (async () => {
      const turnstile = await ensureTurnstileLoaded();
      if (cancelled) return;
      if (!containerRef.current) return;

      widgetIdRef.current = turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        callback: (token) => onTokenRef.current?.(token),
        "expired-callback": () => onExpireRef.current?.(),
        "error-callback": () => onErrorRef.current?.(),
      });
    })().catch(() => onErrorRef.current?.());

    return () => {
      cancelled = true;
      if (!window.turnstile) return;
      if (widgetIdRef.current == null) return;
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // ignore
      }
      widgetIdRef.current = null;
    };
  }, [action, siteKey]);

  return <div className={className} ref={containerRef} />;
});

export default Turnstile;
