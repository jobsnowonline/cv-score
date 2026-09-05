import { describe, it, expect } from "vitest";
import { scoreCv } from "../src/score";

const JOB = `We are hiring a React Developer. Requirements: typescript, react,
node.js, graphql, unit testing, agile. Strong communication and
problem solving skills required. Experience with aws is a plus.`;

const GOOD_CV = `Jane Doe — jane@example.com — +27 82 555 0100

Experience: 5 years building react and typescript applications with node.js
and graphql. Practiced unit testing and agile delivery, deployed to aws.
Education: BSc Computer Science. Skills: react, typescript, node.js, graphql,
communication, problem solving, teamwork and mentoring. I have led teams and
delivered production systems used by thousands of customers across web
platforms with strong attention to quality, performance and reliability in
every release cycle and ongoing maintenance work.`;

const WEAK_CV = `John. Looking for work.`;

describe("scoreCv", () => {
  it("scores a matching CV high", () => {
    const r = scoreCv({ cvText: GOOD_CV, jobText: JOB });
    expect(r.score).toBeGreaterThanOrEqual(70);
    expect(r.matchedSkills).toContain("react");
    expect(r.matchedSkills).toContain("typescript");
  });

  it("scores a weak CV low", () => {
    const r = scoreCv({ cvText: WEAK_CV, jobText: JOB });
    expect(r.score).toBeLessThan(40);
    expect(r.missingSkills.length).toBeGreaterThan(0);
  });

  it("flags missing CV sections", () => {
    const r = scoreCv({ cvText: WEAK_CV, jobText: JOB });
    expect(r.suggestions.some((s) => s.includes("email"))).toBe(true);
  });

  it("handles jobs with no lexicon skills", () => {
    const r = scoreCv({ cvText: GOOD_CV, jobText: "We need a person." });
    expect(r.breakdown.skills).toBe(50); // neutral
  });

  it("throws on empty input", () => {
    expect(() => scoreCv({ cvText: "", jobText: JOB })).toThrow();
  });
});
