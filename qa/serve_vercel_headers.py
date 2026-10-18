#!/usr/bin/env python3
"""
Serve the production build (dist/) with the response headers and SPA rewrites
from vercel.json, so the CSP, isolation and caching policy can be exercised
locally exactly as the edge applies them. Every matching header rule applies in
file order; a later rule overrides an earlier one with the same key.

    bun x vite build && python3 qa/serve_vercel_headers.py --port 4173
"""

import argparse
import json
import mimetypes
import os
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def source_regex(source: str) -> "re.Pattern[str]":
    """vercel.json sources here are path-to-regexp literals with regex groups, e.g. /(.*) or /og/(.*)."""
    return re.compile("^" + source + "$")


def load_rules(config_path: str):
    with open(config_path, encoding="utf-8") as f:
        cfg = json.load(f)
    headers = [(source_regex(r["source"]), r["headers"]) for r in cfg.get("headers", [])]
    rewrites = [(source_regex(r["source"]), r["destination"]) for r in cfg.get("rewrites", [])]
    return headers, rewrites


def make_handler(dist: str, headers, rewrites):
    mimetypes.add_type("application/javascript", ".js")
    mimetypes.add_type("font/woff2", ".woff2")
    mimetypes.add_type("application/manifest+json", ".webmanifest")

    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=dist, **kw)

        def log_message(self, fmt, *args):  # quiet
            pass

        def _path(self) -> str:
            return unquote(urlparse(self.path).path)

        def send_head(self):
            path = self._path()
            fs = os.path.join(dist, path.lstrip("/"))
            if not (os.path.isfile(fs) or (os.path.isdir(fs) and os.path.isfile(os.path.join(fs, "index.html")))):
                # Filesystem first, then rewrites (as on Vercel).
                for rx, dest in rewrites:
                    if rx.match(path):
                        self.path = dest
                        break
            return super().send_head()

        def end_headers(self):
            path = self._path_original if hasattr(self, "_path_original") else self._path()
            merged = {}
            for rx, hs in headers:
                if rx.match(path):
                    for h in hs:
                        merged[h["key"]] = h["value"]
            for k, v in merged.items():
                self.send_header(k, v)
            super().end_headers()

        def do_GET(self):
            self._path_original = self._path()
            super().do_GET()

        def do_HEAD(self):
            self._path_original = self._path()
            super().do_HEAD()

    return Handler


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=4173)
    ap.add_argument("--dist", default=os.path.join(ROOT, "dist"))
    ap.add_argument("--config", default=os.path.join(ROOT, "vercel.json"))
    args = ap.parse_args()
    h, r = load_rules(args.config)
    httpd = ThreadingHTTPServer(("127.0.0.1", args.port), make_handler(args.dist, h, r))
    print(f"Serving {args.dist} with vercel.json headers on http://127.0.0.1:{args.port}")
    httpd.serve_forever()
