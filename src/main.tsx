import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./assets/fonts/web/fonts.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);

// Offline field PWA: cache the dashboard and every desk so it works with no connection.
// Production only, so the dev server never serves a stale cached build.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline caching is unavailable in this browser or context; the site still works online.
    });
  });
}
