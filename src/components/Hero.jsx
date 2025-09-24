import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // ← only Link is needed

// I will keep the older version for a while just in case
const ROLES = [
  "award-winning data quality analyst",
  "tech pipeline builder",
  "digital cloud dweller",
  "QA engineer",
  "test automator",
  "front-end web dev",
  "problem solver",
];

const HOW_I_WORK = [
  "express and demonstrate impacts of critical changes",
  "find silent errors and make them known",
  "retrieve what devs need to do their work",
];

function useCycleWords(words, intervalMs = 2200) {
  const list = useMemo(() => words.filter(Boolean), [words]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % list.length), intervalMs);
    return () => clearInterval(id);
  }, [list, intervalMs]);
  return list[index] ?? "";
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setIsDark((v) => !v)}
      className="group inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur transition hover:shadow-md border-zinc-300/60 bg-white/60 dark:bg-zinc-800/60 dark:border-zinc-700/60"
    >
      <span className="i-lucide-sun h-4 w-4 dark:hidden" />
      <span className="i-lucide-moon h-4 w-4 hidden dark:inline" />
      <span className="opacity-70 group-hover:opacity-100 transition">
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}

export default function Hero() {
  const word = useCycleWords(ROLES);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <GradientBackdrop />
      <GridOverlay />

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6 text-center">
        <div className="absolute left-6 top-6">
          <ThemeToggle />
        </div>

        <h1 className="mt-8 font-extrabold tracking-tight text-center">
          <span className="block text-4xl sm:text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 drop-shadow-[0_0_30px_rgba(56,189,248,0.35)]">
            Aimee builds beautiful, useful things
          </span>
        </h1>

        <div className="relative h-12 sm:h-14 md:h-16">
          <AnimatePresence mode="wait">
            <motion.p
              key={word}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mx-auto max-w-2xl text-balance text-lg sm:text-xl md:text-2xl text-zinc-700 dark:text-zinc-300"
            >
              <span className="opacity-70">currently: </span>
              <span className="font-semibold">{word}</span>
            </motion.p>
          </AnimatePresence>
        </div>

        <nav className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <HoverLink href="#projects">projects</HoverLink>
          <Dot />
          <HoverLink href="#about">About</HoverLink>
          <Dot />
          <HoverLink href="#contact">contact</HoverLink>
        </nav>

        <CTAButtons />
      </div>

      <ParallaxBits />
    </section>
  );
}

function CTAButtons() {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-4">
      <a
        href="#projects"
        className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-sky-500 to-emerald-500 px-5 py-3 text-base font-semibold text-white shadow-lg transition hover:scale-[1.02] active:scale-[.99]"
      >
        Explore my work
      </a>
      <a
        href="#contact"
        className="rounded-2xl border border-zinc-300/60 bg-white/70 px-5 py-3 text-base font-semibold text-zinc-800 backdrop-blur transition hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/70 dark:text-zinc-100"
      >
        Let’s collaborate
      </a>
    </div>
  );
}

function Dot() {
  return (
    <span className="mx-1 inline-block h-1 w-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
  );
}

function HoverLink({ href, children }) {
  return (
    <a href={href} className="relative px-1 transition hover:brightness-110">
      <span className="relative z-10">{children}</span>
      <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] origin-left scale-x-0 rounded bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 transition hover:scale-x-100" />
    </a>
  );
}

function GradientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-1/3 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(236,72,153,0.35),transparent_60%)] blur-3xl" />
      <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(56,189,248,0.18),rgba(16,185,129,0.18),rgba(217,70,239,0.18),rgba(56,189,248,0.18))] opacity-70" />
      <div className="absolute inset-0 bg-white/50 dark:bg-black/40 mix-blend-soft-light" />
    </div>
  );
}

function GridOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] dark:opacity-[0.18]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.6)_1px,transparent_1px)] bg-[size:56px_56px]" />
    </div>
  );
}

function ParallaxBits() {
  const bits = [
    { x: "10%", y: "20%" },
    { x: "80%", y: "30%" },
    { x: "20%", y: "70%" },
    { x: "65%", y: "75%" },
  ];
  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      {bits.map((b, i) => (
        <motion.div
          key={`${b.x}-${b.y}`} // ← stable key from coords
          className="absolute h-24 w-24 rounded-3xl bg-gradient-to-br from-fuchsia-400/40 via-sky-400/40 to-emerald-400/40 blur-xl"
          style={{ left: b.x, top: b.y }}
          animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
          transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
