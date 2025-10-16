import GitHubCalendar from "react-github-calendar";
import { Tooltip as ReactTooltip } from "react-tooltip";
import PageBackdrop from "../components/PageBackdrop";

export function AboutContent() {
  const currentYear = new Date().getFullYear();
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-12">
      <div className="mt-8 rounded-2xl border border-white/10 p-4 bg-white/5 shadow-lg backdrop-blur">
        <h3 className="mb-3 text-sm uppercase tracking-wide text-white/60">
          Recent GitHub activity
        </h3>

        {/* two-up layout */}
        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* calendar column */}
          <div className="overflow-auto md:overflow-visible md:pr-2 shrink-0">
            <GitHubCalendar
              username="Mantablast"
              year={currentYear}
              blockSize={12}
              blockMargin={4}
              colorScheme="dark"
              fontSize={12}
            />
          </div>

          {/* languages image column */}
          <div className="flex items-center justify-center">
            <img
              src="https://github-readme-stats.vercel.app/api/top-langs/?username=Mantablast&layout=compact&theme=transparent"
              alt="Top languages"
              className="max-w-full h-auto"
            />
          </div>
        </div>

        <ReactTooltip html />
      </div>
    </section>
  );
}

export default function About() {
  return (
    <>
      <PageBackdrop />
      <main className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-24">
        <AboutContent />
      </main>
    </>
  );
}
