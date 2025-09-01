import { useEffect, useMemo, useRef, useState } from "react";
import FeatureProjects from "./FeatureProjects";
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
  "⚙️ tools that save companies mega stacks of money"
];

const NAV = [
  { href: "#projects", label: "All Projects" },
  { href: "#about",    label: "About" },
  { href: "#contact",  label: "Contact" },
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
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
      } else {
        setText(current.slice(0, text.length - 1));
      }
    };

    clearTimeout(timer.current);
    if (!deleting && !doneTyping) {
      timer.current = setTimeout(tick, speed);
    } else if (!deleting && doneTyping) {
      timer.current = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && !doneDeleting) {
      timer.current = setTimeout(tick, speed * 0.6);
    } else if (doneDeleting) {
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
    <section className="relative min-h-screen w-full overflow-hidden text-white">
      <DarkBackdrop />
      <header className="pointer-events-auto absolute inset-x-0 top-0 z-20">
        <nav className="mx-auto flex h-16 items-center justify-center gap-8 px-6">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-white/80 hover:text-white transition"
            >
              {n.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="pointer-events-auto fixed top-1/2 right-0 z-30 transform -translate-y-1/2 w-full max-w-md pr-4 hidden lg:block">
        <FeatureProjects />
      </div>

      {/* typing up tasks */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full items-center">
        <div className="w-full px-6 md:px-12">
          <div className="max-w-3xl">
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-white/60">
            has been busy building
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white/90">
              <span className="align-middle whitespace-nowrap">{typed}</span>
              <span className="ml-1 inline-block h-[1em] w-[2px] translate-y-[-2px] animate-caret bg-white/80" />
            </h2>
          </div>
        </div>
      </div>


        {/* name */}

      <div className="pointer-events-none absolute bottom-8 left-6 z-10 px-2 sm:left-10 sm:bottom-10">
        <h1 className="select-none text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 drop-shadow-[0_0_24px_rgba(56,189,248,0.35)]">
          Aimee&nbsp;J
        </h1>
      </div>
    </section>
  );
}

function DarkBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_20%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(900px_500px_at_80%_30%,rgba(217,70,239,0.2),transparent_55%),linear-gradient(180deg,rgba(2,6,23,1)_0%,rgba(2,6,23,1)_60%,rgba(10,10,26,1)_100%)]" />

      {/* grids  */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ filter: "url(#grid-warp)" }}
      >
        {/* layer 1 */}
        <div className="absolute inset-0 bg-grid opacity-[0.14] mix-blend-screen" />
        {/* layer 2 */}
        <div className="absolute inset-0 bg-grid-2 opacity-[0.10] mix-blend-screen" />
      </div>

      {/* vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25" />
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="grid-warp" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.004"
              numOctaves="2"
              seed="2"
              result="noise"
            >
              {/* ripple */}
              <animate
                attributeName="baseFrequency"
                values="0.003 0.004; 0.004 0.003; 0.003 0.004"
                dur="70s"
                repeatCount="indefinite"
              />
            </feTurbulence>


            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            >
                {/* pulse */}
              <animate
                attributeName="scale"
                values="6; 10; 7; 12; 6"
                dur="85s"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
