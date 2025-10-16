import PageBackdrop from "../components/PageBackdrop";

export default function Resume() {
  return (
    <>
      <PageBackdrop />
      <main className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-24 text-white">
        <section className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 px-6 py-8 shadow-xl backdrop-blur">
          <header className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-white/90">Resume</h1>
            <p className="mt-2 text-sm text-white/60">
              Embed or link your resume here so visitors can explore your experience.
            </p>
          </header>
          <p className="text-sm leading-relaxed text-white/70">
            Drop in a PDF viewer, an interactive timeline, or quick download links. This page now
            shares the same animated backdrop as the rest of the site, giving the experience a
            cohesive feel.
          </p>
        </section>
      </main>
    </>
  );
}
