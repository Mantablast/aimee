// App.jsx
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import Landing from "./components/Landing";
import About from "./pages/About";
import CertsAwards from "./pages/CertsAwards";
import Contact from "./pages/Contact";

const NAV = [
  { href: "https://github.com/Mantablast", label: "All Projects" },
  { href: "#about",        label: "About" },
  { href: "/certsawards",  label: "Certs / Awards" },
  { href: "/contact",      label: "Contact" },
];

function Layout() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden text-white">
      <header className="pointer-events-auto absolute inset-x-0 top-0 z-50">
        <nav className="mx-auto flex h-16 items-center justify-center gap-8 px-6">
          {NAV.map((n) =>
            n.href.startsWith("http")
              ? (
                <a
                  key={n.href}
                  href={n.href}
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
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="/certsawards" element={<CertsAwards />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
