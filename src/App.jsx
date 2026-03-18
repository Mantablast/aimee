// App.jsx
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import Landing from "./components/Landing";
import Cv from "./pages/Cv";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import HouseCatLogo from "./components/HouseCatLogo";
import SiteFooter from "./components/SiteFooter";

const NAV = [
  { href: "https://github.com/Mantablast", label: "Github" },
  { href: "/projects", label: "Projects" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Socials" },
];

function Layout() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden text-white">
      <HouseCatLogo />
      <header className="pointer-events-auto absolute inset-x-0 top-0 z-50">
        <nav className="mx-auto flex h-16 items-center justify-center gap-8 px-6">
          {NAV.map((n) =>
            n.href.startsWith("http")
              ? (
                <a
                  key={n.href}
                  href={n.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white/80 hover:text-white transition"
                >
                  {n.label}
                </a>
              ) : (
                <Link
                  key={n.href}
                  to={n.href}
                  className="text-sm font-medium text-white/80 hover:text-white transition"
                >
                  {n.label}
                </Link>
              )
          )}
        </nav>
      </header>
      <Outlet />
      <SiteFooter />
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/cv" element={<Cv />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
