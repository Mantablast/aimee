import PageBackdrop from "../components/PageBackdrop";
import { FEATURE_PROJECTS } from "../components/FeatureProjects";
import { toSafeHttpUrl } from "../utils/safeUrl";

const EXTRA_PROJECTS = [
  {
    title: "Tailored Motivator",
    description:
      "A simple chrome extension that provides tailored motivational quotes based on user preferences.",
    image: "/icon48.png",
    repo: "https://github.com/Mantablast/tailored-motivator",
    demo: "https://chromewebstore.google.com/detail/tailored-motivator/ikbflbdegpbchkddkjplnbhikggjelca",
  },
];

export default function Projects() {
  const projects = [...FEATURE_PROJECTS, ...EXTRA_PROJECTS];

  return (
    <>
      <PageBackdrop />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-24 text-white">
        <header className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Projects
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Featured builds
          </h1>
          <p className="mt-3 text-sm text-white/70">
            A curated list of experiments, products, and collaborations.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => {
            const repoHref = toSafeHttpUrl(project.repo);
            const demoHref = toSafeHttpUrl(project.demo);
            if (!repoHref && !demoHref) return null;

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
                  {repoHref && (
                    <a
                      href={repoHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/20 px-3 py-1 text-white/80 transition hover:border-white/50 hover:text-white"
                    >
                      Repo
                    </a>
                  )}
                  {demoHref && (
                    <a
                      href={demoHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white/90 px-3 py-1 font-semibold text-black transition hover:bg-white"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </>
  );
}
