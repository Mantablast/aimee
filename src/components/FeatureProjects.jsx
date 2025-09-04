export default function FeatureProjects() {
  const projectMargins = [160, 120, 85, 50];
  const projectTitles = [
    "KronoDrop",
    "Best-Dressed",
    "DragonDrop",
    "Tailored Motivator",
  ];
  const projectDescriptions = [
    "A brief description of Project One. This project does amazing things and solves problems.",
    "A brief description of Project Two. Some info about best dressed.",
    "A brief description of Project Three. Will likely swap this out for something else.",
    "A simple chrome extension that provides tailored motivational quotes based on user preferences.",
  ];
  const projectLinks = ["#", "#", "#", "https://github.com/Mantablast/tailored-motivator"];
  const projectImages = [
    "https://placehold.co/100x100",
    "https://placehold.co/100x100",
    "https://placehold.co/100x100",
    "https://placehold.co/100x100",
  ];

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
      <div className="bg-transparent w-full flex justify-center">
        <div className="flex flex-col items-end gap-6">
          {projectTitles.map((title, idx) => (
            <div
              key={title}
              className="bg-white/5 dark:bg-white/5 rounded-lg shadow-lg overflow-hidden backdrop-blur max-w-md w-full h-30 flex flex-row"
              style={{ marginRight: `${projectMargins[idx]}px` }}
            >
              <div className="flex-1 flex flex-col justify-center p-3 text-white">
                <h3 className="text-sm font-semibold mb-2">{title}</h3>
                <p className="mb-1 text-xs">
                  {projectDescriptions[idx]}
                </p>
                <a
                  href={projectLinks[idx]}
                  className="text-blue-300 hover:underline text-xs"
                >
                  Repo
                </a>
              </div>
              <div className="flex-shrink-0 h-full w-32 flex items-center justify-center">
                <img
                  src={projectImages[idx]}
                  alt={title}
                  className="object-cover rounded-r-lg h-20 w-20"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}