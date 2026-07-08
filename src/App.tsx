import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Home from "./pages/Home";
import Doctrine from "./pages/Doctrine";
import Foundations from "./pages/Foundations";
import Cases from "./pages/Cases";
import Methodology from "./pages/Methodology";
import Practice from "./pages/Practice";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ScrollToTop />
      <SiteHeader />
      <main className="flex-1" role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctrine" element={<Doctrine />} />
          <Route path="/foundations" element={<Foundations />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}
