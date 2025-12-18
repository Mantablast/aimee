import { useEffect, useMemo, useRef, useState } from "react";
import PageBackdrop from "../components/PageBackdrop";
import Turnstile from "../components/Turnstile";
import { getRuntimeConfig } from "../utils/runtimeConfig";

export default function Cv() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileSiteKey, setTurnstileSiteKey] = useState(
    import.meta.env.VITE_TURNSTILE_SITE_KEY ?? ""
  );
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_CV_REQUEST_API_URL ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const turnstileRef = useRef(null);

  const turnstileAction = useMemo(() => "cv_request", []);

  useEffect(() => {
    let alive = true;
    getRuntimeConfig().then((config) => {
      if (!alive) return;
      if (!config) return;
      if (typeof config.turnstileSiteKey === "string" && !turnstileSiteKey) {
        setTurnstileSiteKey(config.turnstileSiteKey);
      }
      if (typeof config.apiUrl === "string" && !apiUrl) {
        setApiUrl(config.apiUrl);
      }
    });
    return () => {
      alive = false;
    };
  }, [apiUrl, turnstileSiteKey]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!apiUrl) {
      setStatus("error");
      setError("Missing backend API URL. Please try again later.");
      return;
    }

    if (!turnstileToken) {
      setStatus("error");
      setError("Please complete the captcha before submitting.");
      return;
    }

    setIsSubmitting(true);
    setStatus("sending");
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          turnstileToken,
          turnstileAction,
        }),
      });

      if (!response.ok) {
        const message =
          (await response
            .json()
            .then((data) => data?.error)
            .catch(() => null)) ?? "Something went wrong. Please try again.";
        setStatus("error");
        setError(message);
        setTurnstileToken("");
        turnstileRef.current?.reset?.();
        return;
      }

      setStatus("submitted");
      setForm({ name: "", company: "", email: "", message: "" });
      setTurnstileToken("");
      turnstileRef.current?.reset?.();
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
      setTurnstileToken("");
      turnstileRef.current?.reset?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBackdrop />
      <main className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-24">
        <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/60 px-6 py-8 text-white shadow-2xl backdrop-blur">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl">
              Request My Full Resume
            </h1>
            <p className="mt-3 text-sm text-white/70">
              For security reasons, please allow me to send you my CV directly.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/70"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/70"
              >
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                value={form.company}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                placeholder="Company name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/70"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-xs font-medium uppercase tracking-wide text-white/70"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={form.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                placeholder="Hey!  We met at a convention, I'm reaching out to see your resume 👋"
              />
            </div>

            <div className="flex justify-center">
              {turnstileSiteKey ? (
                <Turnstile
                  ref={turnstileRef}
                  siteKey={turnstileSiteKey}
                  action={turnstileAction}
                  onToken={(token) => setTurnstileToken(token)}
                  onExpire={() => setTurnstileToken("")}
                  onError={() => {
                    setTurnstileToken("");
                    setStatus("error");
                    setError("Captcha failed to load. Please refresh and try again.");
                  }}
                />
              ) : (
                <p className="text-center text-xs text-white/60">
                  Captcha is not configured yet.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-lg bg-white/90 px-4 py-2.5 text-sm font-semibold text-black shadow-md transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {isSubmitting ? "Sending..." : "Send Request"}
            </button>
          </form>

          {status === "submitted" && (
            <p className="mt-4 text-center text-xs text-emerald-300/90">
              Thanks for your interest! I will get back to you shortly.
            </p>
          )}

          {status === "error" && error && (
            <p className="mt-4 text-center text-xs text-red-300/90">{error}</p>
          )}
        </section>
      </main>
    </>
  );
}
