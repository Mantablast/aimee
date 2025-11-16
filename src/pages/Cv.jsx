import { useState } from "react";
import PageBackdrop from "../components/PageBackdrop";

export default function Cv() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("submitted");
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

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-lg bg-white/90 px-4 py-2.5 text-sm font-semibold text-black shadow-md transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Send Request
            </button>
          </form>

          {status === "submitted" && (
            <p className="mt-4 text-center text-xs text-emerald-300/90">
              Thanks for your interest! I will get back to you shortly.
            </p>
          )}
        </section>
      </main>
    </>
  );
}
