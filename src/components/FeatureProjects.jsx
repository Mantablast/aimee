import { toSafeHttpUrl } from "../utils/safeUrl";

export default function FeatureProjects() {
  const projects = [
    {
      title: "Best-Dressed - New Shopping Filter",
      description:
        "Sort shopping filter items that are most important to you and the app will keep score, showing the top matches for your needs.",
      image: "/bestdressedicon.jpg",
      repo: "https://github.com/Mantablast/best-dressed",
      demo: "https://d1st7t41vjtwqp.cloudfront.net/",
    },
    {
      title: "KronoDrop",
      description:
        "Pick a date range and drop a halo on the map.  See events, save events.  Time is precious, plot your course.",
      image: "/kronodrop.png",
      // repo intentionally omitted (private)
      demo: "https://d243n2kondfjst.cloudfront.net/",
    },
    {
      title: "ScreenShareBear",
      description:
        "Retro prompt generator for remote meetings.  Built for remote teams and online gatherings, it transforms awkward silences into shared moments of interaction.",
      image: "/bearlounge3.png",
      demo: "https://screensharebear.com/",
    },
    {
      title: "Tailored Motivator",
      description:
        "A simple chrome extension that provides tailored motivational quotes based on user preferences.",
      image: "/icon48.png",
      repo: "https://github.com/Mantablast/tailored-motivator",
      demo: "https://chromewebstore.google.com/detail/tailored-motivator/ikbflbdegpbchkddkjplnbhikggjelca",
    },
  ];

  // Optional tiny left-indent per card (stays INSIDE the rail)
  const INDENT = ["pl-1", "pl-5", "pl-9", "pl-11"];

  return (
    <section id="projects" className="bg-transparent p-0 m-0">
      <div className="flex justify-start">
        <h2
          className="font-bold text-teal-500 dark:text-white mb-4"
          style={{ marginLeft: "1px" }}
        >
          Featured Projects
        </h2>
      </div>

      {/* Rail-safe stack: no items-end, no marginRight */}
      <div className="w-full flex flex-col gap-4">
        {projects.map((project, idx) => {
          const repoHref = toSafeHttpUrl(project.repo);
          const demoHref = toSafeHttpUrl(project.demo);
          if (!demoHref) return null;

          return (
            <article
              key={project.title}
              className={`w-full ${INDENT[idx]} group`}
            >
              <div className="relative w-full overflow-hidden rounded-xl bg-white/5 dark:bg-white/5 ring-1 ring-white/10 backdrop-blur
                              transition-transform duration-300 group-hover:-translate-y-0.5">
                <div className="flex items-center gap-3 p-3">
                  <div className="relative h-16 w-16 flex-none">
                    {project.title === "BatchPanda" && (
                      <div className="absolute inset-0.5 rounded-full bg-white/50 blur-lg" />
                    )}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="relative z-10 h-16 w-16 rounded-md object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/80">
                      {project.description}
                    </p>
                    <div className="mt-1 flex gap-2">
                      {repoHref && (
                        <a
                          href={repoHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-xs text-blue-300 hover:underline"
                        >
                          Repo
                        </a>
                      )}
                      <a
                        href={demoHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-blue-300 hover:underline"
                      >
                        Demo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
