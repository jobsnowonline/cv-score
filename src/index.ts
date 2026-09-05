import { scoreCv, type ScoreInput } from "./score";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const MAX_TEXT_LEN = 50_000;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    try {
      if (url.pathname === "/" || url.pathname === "/health") {
        return json({
          name: "cv-score",
          status: "ok",
          docs: "https://github.com/jobsnowonline/cv-score",
          usage: 'POST /score  {"cvText": "...", "jobText": "..."}',
        });
      }

      if (url.pathname === "/score") {
        if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

        let body: Partial<ScoreInput>;
        try {
          body = (await request.json()) as Partial<ScoreInput>;
        } catch {
          return json({ error: "Invalid JSON body" }, 400);
        }

        const cvText = String(body.cvText ?? "");
        const jobText = String(body.jobText ?? "");
        if (!cvText.trim() || !jobText.trim()) {
          return json({ error: "Both cvText and jobText are required." }, 400);
        }
        if (cvText.length > MAX_TEXT_LEN || jobText.length > MAX_TEXT_LEN) {
          return json({ error: `Text too long (max ${MAX_TEXT_LEN} chars each).` }, 413);
        }

        return json(scoreCv({ cvText, jobText }));
      }

      return json({ error: "Not found", hint: "POST /score" }, 404);
    } catch (err) {
      console.error(JSON.stringify({ event: "request_error", path: url.pathname, error: String(err) }));
      return json({ error: "Internal error" }, 500);
    }
  },
} satisfies ExportedHandler;
