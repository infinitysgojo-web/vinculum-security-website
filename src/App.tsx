import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import LoadingScreen from "./components/LoadingScreen";
import Home from "./pages/Home";
import Doctrine from "./pages/Doctrine";
import Foundations from "./pages/Foundations";
import Cases from "./pages/Cases";
import CaseDetail from "./pages/CaseDetail";
import Methodology from "./pages/Methodology";
import Practice from "./pages/Practice";
import About from "./pages/About";
import Glossary from "./pages/Glossary";
import Commentary from "./pages/Commentary";
import Dispatches from "./pages/Dispatches";
import TheVinculumDashboard from "./pages/TheVinculumDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "@/components/ui/sonner";
import RouteErrorBoundary from "./components/RouteErrorBoundary";

/**
 * Deterministic route scroll: every pathname change without a hash begins at
 * the top of the page. A hash link waits (a bounded number of frames) for its
 * anchor to mount, since lazy and filtered content can land after the route.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  // Back/forward must not reinstate an old mid-page offset either: take restoration from the browser.
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    if (hash) {
      const id = decodeURIComponent(hash.replace("#", ""));
      let tries = 0;
      const seek = () => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (tries++ < 30) raf = requestAnimationFrame(seek);
      };
      raf = requestAnimationFrame(seek);
      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
      };
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    raf = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const portal = pathname === "/login" || pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {loading && !portal && <LoadingScreen onDone={() => setLoading(false)} />}
      <ScrollToTop />
      {!portal && <SiteHeader />}
      <main
        className={portal ? "flex-1 pb-0" : "flex-1"}
        role="main"
        data-portal={portal ? "true" : undefined}
        data-dashboard={pathname.startsWith("/dashboard") ? "true" : undefined}
      >
        <RouteErrorBoundary resetKey={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctrine" element={<Doctrine />} />
          <Route path="/foundations" element={<Foundations />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:slug" element={<CaseDetail />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/about" element={<About />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/commentary" element={<Commentary />} />
          <Route path="/dispatches" element={<Dispatches />} />
          <Route path="/the-vinculum-dashboard" element={<TheVinculumDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </RouteErrorBoundary>
      </main>
      {!portal && <SiteFooter />}
      <Toaster position="bottom-right" />
    </div>
  );
}
