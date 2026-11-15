import { describe, expect, it } from "bun:test";
import { readFileSync } from "fs";
import { resolve } from "path";
import { isSafeOutboundUrl, sanitizePathUrl } from "../src/lib/sanitizeFields";

describe("Security Hardening Batch 1: Measures 1 to 25", () => {
  it("enforces perimeter permissions policy and defensive meta tags in index.html", () => {
    const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

    // Permissions-Policy disables sensitive sensors & commercial ad topics
    expect(html).toContain('http-equiv="Permissions-Policy"');
    expect(html).toContain("accelerometer=()");
    expect(html).toContain("camera=()");
    expect(html).toContain("geolocation=()");
    expect(html).toContain("microphone=()");
    expect(html).toContain("browsing-topics=()");
    expect(html).toContain("run-ad-auction=()");

    // Anti-leak DNS and Content-Type sniffing locks
    expect(html).toContain('http-equiv="x-dns-prefetch-control" content="off"');
    expect(html).toContain('http-equiv="X-Content-Type-Options" content="nosniff"');

    // Anti-ad and anti-overlay CSS shield
    expect(html).toContain('id="anti-ad-shield"');
    expect(html).toContain("doubleclick.net");
    expect(html).toContain("taboola.com");
    expect(html).toContain("outbrain.com");
  });

  it("neutralizes backslash-based traversal and open-redirect bypasses", () => {
    expect(sanitizePathUrl("/cases")).toBe("/cases");
    expect(sanitizePathUrl("\\dashboard")).toBe("/dashboard");
    expect(sanitizePathUrl("\\\\attacker.com\\evil")).toBe("/attacker.com/evil");
    expect(sanitizePathUrl("//attacker.com")).toBe("/attacker.com");
    expect(sanitizePathUrl("javascript:alert(1)")).toBe("/");
    expect(sanitizePathUrl("data:text/html,bad")).toBe("/");
  });

  it("validates outbound URLs strictly against permitted schemes", () => {
    expect(isSafeOutboundUrl("https://orcid.org/0009-0005-9861-8849")).toBe(true);
    expect(isSafeOutboundUrl("http://localhost:8080")).toBe(true);
    expect(isSafeOutboundUrl("mailto:office@vinculumsecurity.kidnexus.or.ke")).toBe(true);
    expect(isSafeOutboundUrl("javascript:evil()")).toBe(false);
    expect(isSafeOutboundUrl("data:text/plain;base64,bad")).toBe(false);
  });
});
