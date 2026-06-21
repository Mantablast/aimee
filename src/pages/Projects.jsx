import PageBackdrop from "../components/PageBackdrop";
import { COMING_SOON_PROJECTS, PROJECTS } from "../data/projects";
import { toSafeHttpUrl } from "../utils/safeUrl";

export default function Projects() {
  const projects = PROJECTS;

  return (
    <>
      <PageBackdrop motionLevel="lite" />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-24 text-white">
        <header className="mb-10 text-center">
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Featured builds
          </h1>
          <p className="mt-3 text-sm text-white/70">
            A curated list of experiments, products, and collaborations.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => {
            const demoHref = toSafeHttpUrl(project.demo);
            if (!demoHref) return null;

            return (
              <article
                key={project.title}
                className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur transition hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 flex-none overflow-hidden rounded-xl bg-white/10">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-white">
                      {project.title}
                    </h2>
                    <p className="mt-2 text-sm text-white/70">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex flex-wrap gap-3 text-sm">
                  <a
                    href={demoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white/90 px-3 py-1 font-semibold text-black transition hover:bg-white"
                  >
                    Live Demo
                  </a>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-14">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              Coming Soon
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Upcoming builds
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {COMING_SOON_PROJECTS.map((project) => (
              <article
                key={project.title}
                className="flex h-full flex-col gap-4 rounded-2xl border border-orange-300/20 bg-orange-400/10 p-5 shadow-2xl backdrop-blur"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 flex-none overflow-hidden rounded-xl bg-white/10">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-contain p-1"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/70">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex flex-wrap gap-3 text-sm">
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-full border border-orange-200/40 bg-orange-300/20 px-3 py-1 font-semibold text-orange-50"
                  >
                    Coming Soon
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
