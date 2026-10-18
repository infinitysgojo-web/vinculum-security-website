#!/usr/bin/env python3
"""
Vinculum Security - offline archive seal verifier.

Independently checks the SHA-256 seal on an exported .vinculum mission archive,
with no browser and no network. The seal is computed exactly as
src/components/desk/MissionVault.tsx writes and re-checks it:

    sha256Seal = SHA-256( JSON.stringify(archive without "sha256Seal") )

that is, the archive body in the file's own key order (format, schema, version,
savedAt, profile, binder, signals, ledger as exported), serialised the way
ECMAScript JSON.stringify does it: no whitespace, non-ASCII left as UTF-8, only
quote, backslash and control characters escaped, and numbers in ECMAScript
form (3.0 is "3", 1e21 is "1e+21", 1e-7 is "1e-7"). json.dumps differs on
numbers, so the serialiser below is written out rather than borrowed.

Exit status: 0 seal valid, 1 seal mismatch or unreadable file, 2 no seal.
"""

import hashlib
import json
import hmac
import math
import sys
from collections import OrderedDict
from decimal import Decimal

SEAL_FIELD = "sha256Seal"
ARCHIVE_FORMAT = "vinculum-mission-archive"

_ESCAPES = {'"': '\\"', "\\": "\\\\", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "\t": "\\t"}


def _js_string(s: str) -> str:
    out = ['"']
    for ch in s:
        if ch in _ESCAPES:
            out.append(_ESCAPES[ch])
        elif ord(ch) < 0x20:
            out.append("\\u%04x" % ord(ch))
        elif 0xD800 <= ord(ch) <= 0xDFFF:
            # A lone surrogate (only reachable from a hand-edited file): well-formed JSON.stringify escapes it.
            out.append("\\u%04x" % ord(ch))
        else:
            out.append(ch)
    out.append('"')
    return "".join(out)


def _js_number(n) -> str:
    """ECMAScript Number::toString for a JSON number (every JSON number is a double in JS)."""
    x = float(n)
    if math.isnan(x) or math.isinf(x):
        return "null"
    if x == 0:
        return "0"
    sign, digits, exp = Decimal(repr(abs(x))).as_tuple()
    ds = "".join(map(str, digits)).rstrip("0") or "0"
    # repr gives the shortest round-trip digits; recompute the exponent after stripping zeros.
    k = len(ds)
    point = exp + len(digits)  # decimal point position relative to the digit string
    out = ""
    if k <= point <= 21:
        out = ds + "0" * (point - k)
    elif 0 < point <= 21:
        out = ds[:point] + "." + ds[point:]
    elif -6 < point <= 0:
        out = "0." + "0" * (-point) + ds
    else:
        e = point - 1
        mant = ds if k == 1 else ds[0] + "." + ds[1:]
        out = f"{mant}e{'+' if e >= 0 else '-'}{abs(e)}"
    return ("-" if x < 0 else "") + out


def js_stringify(v) -> str:
    """ECMAScript JSON.stringify(v) with no indentation."""
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):  # bool is handled above
        return _js_number(v)
    if isinstance(v, str):
        return _js_string(v)
    if isinstance(v, list):
        return "[" + ",".join(js_stringify(x) for x in v) + "]"
    if isinstance(v, dict):
        return "{" + ",".join(_js_string(k) + ":" + js_stringify(x) for k, x in v.items()) + "}"
    raise TypeError(f"unsupported JSON value: {type(v)!r}")


def compute_seal(archive: "OrderedDict") -> str:
    body = OrderedDict((k, v) for k, v in archive.items() if k != SEAL_FIELD)
    return hashlib.sha256(js_stringify(body).encode("utf-8")).hexdigest()


def verify_vault_file(path: str) -> int:
    try:
        with open(path, "r", encoding="utf-8") as f:
            archive = json.load(f, object_pairs_hook=OrderedDict)
    except Exception as e:  # noqa: BLE001 - report any unreadable file plainly
        print(f"[!] Error opening file: {e}")
        return 1
    if not isinstance(archive, dict) or archive.get("format") != ARCHIVE_FORMAT:
        print("[!] Not a Vinculum mission archive.")
        return 1
    claimed = archive.get(SEAL_FIELD)
    if not isinstance(claimed, str) or not claimed:
        print(f"[!] Archive carries no {SEAL_FIELD} (saved before sealing). Nothing to verify.")
        return 2
    computed = compute_seal(archive)
    if hmac.compare_digest(computed, claimed.lower()):
        profile = archive.get("profile") or {}
        ledger = archive.get("ledger") or {}
        print(f"[+] CRYPTOGRAPHIC SEAL VALIDATED: {computed}")
        print(f"    Schema / version: {archive.get('schema', '-')} v{archive.get('version', 1)}")
        print(f"    Mission theatre:  {(profile.get('theatre') or '').strip() or 'Unnamed'}")
        print(f"    Saved (UTC):      {archive.get('savedAt')}")
        print(f"    Binder documents: {len(archive.get('binder') or [])}")
        print(f"    Ledger events:    {len(ledger.get('events') or [])}")
        if ledger.get("merkleRoot"):
            print(f"    Merkle root:      {ledger['merkleRoot']}")
        return 0
    print("[!] INTEGRITY ERROR: the archive was altered after sealing, or is damaged.")
    print(f"    Claimed seal:  {claimed}")
    print(f"    Computed seal: {computed}")
    return 1


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 qa/verify_vault_seal.py <mission.vinculum> [more.vinculum ...]")
        sys.exit(1)
    codes = [verify_vault_file(p) for p in sys.argv[1:]]
    sys.exit(max(codes))
