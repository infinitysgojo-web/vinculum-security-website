import { describe, it, expect } from "vitest";
import { governingLaws } from "./TelemetryStrip";

const find = (s: Parameters<typeof governingLaws>[0], name: string) =>
  governingLaws(s).flatMap((p) => p.laws).find((l) => l.name === name)!;

describe("governing relational laws console", () => {
  it("a bond at 3.0 breaches the viable floor", () => {
    expect(find({ weakestScore: 3.0 }, "Viable Floor").status).toBe("breach");
    expect(find({ weakestScore: 3.1 }, "Viable Floor").status).toBe("hold");
  });
  it("track gap above tolerance is structural shear", () => {
    expect(find({ trackGap: 3, trackTolerance: 2 }, "Track Divergence and Structural Shear").status).toBe("breach");
    expect(find({ trackGap: 2, trackTolerance: 2 }, "Track Divergence and Structural Shear").status).toBe("hold");
  });
  it("laws without their desk reading are awaiting, never invented", () => {
    expect(governingLaws({}).flatMap((p) => p.laws).every((l) => l.status === "pending")).toBe(true);
  });
});
