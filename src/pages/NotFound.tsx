import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import GoldRule from "@/components/GoldRule";

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found" description="The page you requested could not be found." path="/404" />
      <div className="container py-32 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-serif text-primary">Page not found</h1>
        <GoldRule className="mt-6 mx-auto" />
        <p className="mt-6 text-muted-foreground">The page you requested does not exist.</p>
        <Link to="/" className="mt-8 inline-block link-gold text-sm uppercase tracking-widest" style={{ letterSpacing: "0.18em" }}>
          Return home
        </Link>
      </div>
    </>
  );
}
