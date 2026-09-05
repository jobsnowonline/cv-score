# cv-score

A free, serverless **CV ↔ job match scorer**. POST a resume and a job description, get back a 0–100 fit score with matched/missing skills, keyword gaps, and actionable suggestions. Zero external API calls — runs entirely on a Cloudflare Worker.

## API

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | API info + health check |
| `/score` | POST | Score a CV against a job description |

**Live instance:** <https://cv-score.wildaccount.workers.dev>

### Request

```bash
curl -X POST https://cv-score.wildaccount.workers.dev/score \
  -H "Content-Type: application/json" \
  -d '{"cvText": "Jane Doe, react developer, 5 years typescript...", "jobText": "We are hiring a React Developer..."}'
```

Both fields are required, max 50k chars each. CORS is open — call it straight from a browser.

### Response

```json
{
  "score": 82,
  "breakdown": { "skills": 85, "keywords": 71, "completeness": 100 },
  "matchedSkills": ["react", "typescript", "graphql"],
  "missingSkills": ["aws"],
  "matchedKeywords": ["react", "developer", "testing"],
  "missingKeywords": ["stakeholder", "deployment"],
  "suggestions": ["Add evidence of \"aws\" if you have it — the job asks for it."]
}
```

## How scoring works

| Component | Weight | What it measures |
|-----------|--------|------------------|
| Skills | 60% | Coverage of a curated skills lexicon found in the job post |
| Keywords | 25% | Overlap with the job's most frequent significant terms |
| Completeness | 15% | CV hygiene: contact info, experience/education/skills sections, length |

Deliberately heuristic and deterministic — no LLM calls, no keys, no cost. A job post listing no detectable skills gets a neutral 50 on that component.

## Develop & deploy

```bash
npm install
npm run dev       # local dev server
npm test          # vitest unit tests
npm run typecheck
npm run types     # regenerate worker-configuration.d.ts
npm run deploy    # publish to Cloudflare
```

## License

MIT — see [LICENSE](LICENSE).
