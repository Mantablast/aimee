export const FEATURE_PROJECTS = [
  {
    title: "Oddly Specific",
    description:
      "An online websocket drawing game with stored prompts design to poke fun at human behavior.",
    image: "/oddly-specific-icon.png",
    demo: "https://www.oddlyspecific.com/",
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
    title: "Zero Commits Are Lava",
    description:
      "A lightweight web game that turns your contribution calendar into a lava-running puzzle.",
    image: "/burnedbutt.png",
    repo: "https://github.com/Mantablast/zero-commits-are-lava",
    demo: "https://zerocommitsarelava.com",
  },
];

export const EXTRA_PROJECTS = [
  {
    title: "Tailored Motivator",
    description:
      "A simple chrome extension that provides tailored motivational quotes based on user preferences.",
    image: "/icon48.png",
    repo: "https://github.com/Mantablast/tailored-motivator",
    demo: "https://chromewebstore.google.com/detail/tailored-motivator/ikbflbdegpbchkddkjplnbhikggjelca",
  },
];

export const PROJECTS = [...FEATURE_PROJECTS, ...EXTRA_PROJECTS];
