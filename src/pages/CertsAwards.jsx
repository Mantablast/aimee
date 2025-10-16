import PageBackdrop from "../components/PageBackdrop";

export default function CertsAwards() {
  return (
    <>
      <PageBackdrop />
      <main className="relative z-10 flex min-h-screen w-full items-start justify-center px-6 py-24">
        <section
          id="certsawards"
          className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-white shadow-lg backdrop-blur"
        >
          <header className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white/90">
              Certifications &amp; Awards
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Highlighting recognitions that reflect impact, growth, and curiosity.
            </p>
          </header>

          <p className="text-sm text-white/70">
            Add your certifications and awards content here when you are ready. This card-style
            layout sits on the same animated backdrop used throughout the site.
          </p>
        </section>
      </main>
    </>
  );
}
