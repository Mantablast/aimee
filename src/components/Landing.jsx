import { useEffect, useMemo, useRef, useState } from "react";
import FeatureProjects from "./FeatureProjects";
import PageBackdrop from "./PageBackdrop";

// Keep your original phrases
const PHRASES = [
  "🍄 test pipelines",
  "📊 data quality tools",
  "🌐 web apps",
  "🤖 automation scripts",
  "➡️ ETL workflows",
  "🔗 API test collections",
  "📈 dashboards",
  "🔨 remediation tools for fixing training data",
  "🤝 sample sets for awesome co-workers",
  "🧪 regression tests and data validation suites",
  "✏️ solutions to tricky problems",
  "😎 cool stuff",
  "📁 projects driven by curiosity",
  "🚨 alerts for silent errors occurring in production",
  "⛏️ tools that support dev work",
  "⚙️ tools that save companies mega stacks of money",
];

function useTypewriter(words, speed = 60, pause = 1200) {
  const list = useMemo(() => words.filter(Boolean), [words]);
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const current = list[i % list.length] ?? "";
    const doneTyping = text === current;
    const doneDeleting = deleting && text === "";

    const tick = () => {
      if (!deleting) setText(current.slice(0, text.length + 1));
      else setText(current.slice(0, text.length - 1));
    };

    clearTimeout(timer.current);
    if (!deleting && !doneTyping) timer.current = setTimeout(tick, speed);
    else if (!deleting && doneTyping)
      timer.current = setTimeout(() => setDeleting(true), pause);
    else if (deleting && !doneDeleting)
      timer.current = setTimeout(tick, speed * 0.6);
    else if (doneDeleting) {
      setDeleting(false);
      setI((n) => (n + 1) % list.length);
    }

    return () => clearTimeout(timer.current);
  }, [deleting, i, list, pause, speed, text]);

  return text;
}

export default function Landing() {
  const typed = useTypewriter(PHRASES);

  return (
    <>
      {/* ONE background for the whole page (hero + about + projects) */}
      <PageBackdrop />

      {/* HERO — content only; background lives globally now */}
      <section
        id="hero"
        className="relative isolate min-h-[100svh] w-full overflow-hidden text-white"
      >
        {/* Right rail projects on large screens */}
        <div
          className="relative z-10 container mx-auto min-h-[100svh] px-6 md:px-12
                flex flex-col lg:flex-row items-center gap-8"
        >
          {/* Left: typed intro */}
          <div className="flex-1 min-w-0 flex flex-col justify-center items-start text-left">
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-white/60">
              has been busy building
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white/90">
              {/* keep this span narrow enough not to crash into the right column */}
              <span className="align-middle whitespace-wrap max-w-[48ch] overflow-hidden text-ellipsis block">
                {typed}
              </span>
              <span className="ml-1 inline-block h-[1em] w-[2px] translate-y-[-2px] animate-caret bg-white/80" />
            </h2>
          </div>

          {/* Right: projects rail — fixed width, no spillover */}
          <aside className="hidden lg:block w-[360px] xl:w-[380px] shrink-0 overflow-hidden">
            <div className="relative w-full overflow-hidden">
              <FeatureProjects />
            </div>
          </aside>
        </div>

        {/* Gradient title */}
        <div className="pointer-events-none absolute bottom-8 left-6 z-10 px-2 sm:left-10 sm:bottom-10">
          <h1 className="select-none text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 drop-shadow-[0_0_24px_rgba(56,189,248,0.35)]">
            Aimee&nbsp;J
          </h1>
        </div>
      </section>

      {/* PROJECTS — for small screens we render Featured Projects below the hero */}
      <section
        id="projects"
        className="relative z-0 scroll-mt-24 py-16 lg:hidden"
      >
        <aside className="hidden lg:block">
          <FeatureProjects />
        </aside>
      </section>
    </>
  );
}
