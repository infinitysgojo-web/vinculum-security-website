import { describe, it, expect } from "bun:test";
import { bilateralGeodesic } from "@/components/desk/theatreGeodesy";
describe("geodesy input bounds", () => {
  it("out-of-range coordinates give the same result as their wrapped equivalents", () => {
    const a = bilateralGeodesic({ lat: 95, lng: 190 }, { lat: 0, lng: 0 });
    const b = bilateralGeodesic({ lat: 90, lng: -170 }, { lat: 0, lng: 0 });
    expect(a.distanceKm).toBeCloseTo(b.distanceKm, 6);
  });
  it("non-numeric coordinates never yield NaN", () => {
    const r = bilateralGeodesic({ lat: NaN, lng: Infinity }, { lat: 10, lng: 10 });
    expect(Number.isFinite(r.distanceKm)).toBe(true);
  });
});
