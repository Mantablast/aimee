export default function FeatureProjects() {
  const projectTitles = [
    "Best-Dressed - New Shopping Filter",
    "KronoDrop",
    "DragonDrop",
    "Tailored Motivator",
  ];
  const projectDescriptions = [
    "Sort shopping filter items that are most important to you and the app will keep score, showing the top matches for your needs.",
    "Pick a date range and drop a halo on the map.  See events, save events.  Time is precious, plot your course.",
    "A brief description of Project Three. Will likely swap this out for something else.",
    "A simple chrome extension that provides tailored motivational quotes based on user preferences.",
  ];
  const projectLinks = ["https://github.com/Mantablast/best-dressed", "Coming soon", "#", "https://github.com/Mantablast/tailored-motivator"];
  const projectDemoLinks = ["https://best-dressed.vercel.app/", "Coming soon", "#", "#"];
  const projectImages = [
    "../../public/bestdressedicon.jpg",
    "../../public/kronodrop.png",
    "https://placehold.co/100x100",
    "../../public/icon48.png",
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
        {projectTitles.map((title, idx) => (
          <article
            key={title}
            className={`w-full ${INDENT[idx]} group`}
          >
            <div className="relative w-full overflow-hidden rounded-xl bg-white/5 dark:bg-white/5 ring-1 ring-white/10 backdrop-blur
                            transition-transform duration-300 group-hover:-translate-y-0.5">
              <div className="flex items-center gap-3 p-3">
                <img
                  src={projectImages[idx]}
                  alt={title}
                  className="h-16 w-16 flex-none rounded-md object-cover"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
                  <p className="mt-1 text-xs text-white/80">
                    {projectDescriptions[idx]}
                  </p>
                  <div className="mt-1 flex gap-2">
                  <a
                    href={projectLinks[idx]} target="_blank"
                    className="mt-2 inline-block text-xs text-blue-300 hover:underline"
                  >
                    Repo
                  </a>
                  <p> </p>
                  <a
                    href={projectDemoLinks[idx]} target="_blank"
                    className="mt-2 inline-block text-xs text-blue-300 hover:underline"
                  >
                    Demo
                  </a>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
