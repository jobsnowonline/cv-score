import { SKILLS, STOPWORDS } from "./skills";

export interface ScoreInput {
  cvText: string;
  jobText: string;
}

export interface ScoreResult {
  /** 0–100 overall fit. */
  score: number;
  breakdown: {
    skills: number;      // 0–100, weight 60%
    keywords: number;    // 0–100, weight 25%
    completeness: number; // 0–100, weight 15%
  };
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

function norm(text: string): string {
  return ` ${text.toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ")} `;
}

/** Does `term` appear in `haystack` (already-normalized, space-padded)? */
function contains(haystack: string, term: string): boolean {
  const t = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Multi-word phrases: plain substring on normalized text.
  if (t.includes(" ")) return haystack.includes(` ${t} `) || haystack.includes(t);
  return new RegExp(`\\b${t}\\b`).test(haystack);
}

/** Significant terms from the job description: top frequent 2–4 char+ words. */
function extractKeywords(text: string, cap = 25): string[] {
  const freq = new Map<string, number>();
  for (const w of text.toLowerCase().match(/[a-z][a-z0-9+#.]{2,}/g) ?? []) {
    if (STOPWORDS.has(w) || w.length < 3) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, cap)
    .map(([w]) => w);
}

/** Basic CV completeness signals. */
function completeness(cv: string, raw: string): { score: number; missing: string[] } {
  const checks: [RegExp, string][] = [
    [/[\w.+-]+@[\w-]+\.[\w.]+/, "contact email"],
    [/\b(\+?\d[\d\s().-]{7,}\d)\b/, "phone number"],
    [/\b(experience|employment|work history)\b/, "experience section"],
    [/\b(education|qualification|degree|diploma|certificate)\b/, "education section"],
    [/\b(skills|competenc|proficienc)/, "skills section"],
  ];
  const missing = checks.filter(([re]) => !re.test(cv)).map(([, label]) => label);
  let score = (checks.length - missing.length) * (80 / checks.length);
  if (raw.trim().split(/\s+/).length >= 120) score += 20; // enough substance
  else if (raw.trim().split(/\s+/).length >= 60) score += 10;
  return { score: Math.round(Math.min(score, 100)), missing };
}

export function scoreCv({ cvText, jobText }: ScoreInput): ScoreResult {
  if (!cvText?.trim() || !jobText?.trim()) {
    throw new Error("cvText and jobText are required.");
  }
  const cv = norm(cvText);
  const job = norm(jobText);

  // 1. Skills coverage (weight 60%)
  const jobSkills = SKILLS.filter((s) => contains(job, s));
  const matchedSkills = jobSkills.filter((s) => contains(cv, s));
  const missingSkills = jobSkills.filter((s) => !contains(cv, s));
  const skillsScore = jobSkills.length
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : 50; // no detectable skills required → neutral

  // 2. Keyword overlap (weight 25%)
  const keywords = extractKeywords(jobText);
  const matchedKeywords = keywords.filter((k) => contains(cv, k));
  const missingKeywords = keywords.filter((k) => !contains(cv, k)).slice(0, 10);
  const keywordsScore = keywords.length
    ? Math.round((matchedKeywords.length / keywords.length) * 100)
    : 50;

  // 3. CV completeness (weight 15%)
  const comp = completeness(cv, cvText);

  const score = Math.round(skillsScore * 0.6 + keywordsScore * 0.25 + comp.score * 0.15);

  const suggestions: string[] = [];
  for (const s of missingSkills.slice(0, 5)) {
    suggestions.push(`Add evidence of "${s}" if you have it — the job asks for it.`);
  }
  for (const label of comp.missing) {
    suggestions.push(`Your CV is missing a ${label}.`);
  }
  if (missingKeywords.length > 5) {
    suggestions.push("Mirror more of the job's own wording — ATS filters rank exact terms higher.");
  }
  if (score >= 80) suggestions.push("Strong match — tailor your summary to this role and apply.");

  return {
    score,
    breakdown: { skills: skillsScore, keywords: keywordsScore, completeness: comp.score },
    matchedSkills,
    missingSkills,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords,
    suggestions,
  };
}
