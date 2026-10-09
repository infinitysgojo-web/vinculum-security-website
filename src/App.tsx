import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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

const SCROLL_KEY = "vs:scroll";

function readMap(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_KEY) || "{}");
  } catch {
    return {};
  }
}

function ScrollMemory() {
  const { pathname, hash } = useLocation();
  const prevPath = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);

  // Save on scroll for the current path
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const map = readMap();
        map[pathname] = window.scrollY;
        try {
          sessionStorage.setItem(SCROLL_KEY, JSON.stringify(map));
        } catch {
          // ignore quota
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [pathname]);

  // Restore on path change
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    if (hash) {
      // Let the target page handle its own hash scrolling
      return;
    }

    const map = readMap();
    const y = map[pathname];
    // Defer to next frame so route content is mounted
    requestAnimationFrame(() => {
      window.scrollTo(0, typeof y === "number" ? y : 0);
    });
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
      <ScrollMemory />
      {!portal && <SiteHeader />}
      <main className="flex-1" role="main">
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
      </main>
      {!portal && <SiteFooter />}
      <Toaster position="bottom-right" />
    </div>
  );
}
