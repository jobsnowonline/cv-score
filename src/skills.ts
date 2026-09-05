/**
 * Curated skills lexicon. Multi-word entries are matched as phrases;
 * single words are matched on word boundaries. Extend freely — coverage
 * beats cleverness for keyword matching.
 */
export const SKILLS: string[] = [
  // Engineering / tech
  "javascript", "typescript", "python", "java", "golang", "rust", "c++", "c#",
  "php", "ruby", "swift", "kotlin", "scala", "sql", "nosql", "html", "css",
  "react", "next.js", "vue", "angular", "svelte", "node.js", "express",
  "django", "flask", "fastapi", "spring", "laravel", "rails", ".net",
  "graphql", "rest", "rest api", "grpc", "microservices", "serverless",
  "aws", "azure", "gcp", "google cloud", "cloudflare", "docker", "kubernetes",
  "terraform", "ci/cd", "jenkins", "github actions", "gitlab", "linux",
  "postgres", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
  "supabase", "firebase", "kafka", "rabbitmq", "celery",
  "machine learning", "deep learning", "nlp", "llm", "openai", "pytorch",
  "tensorflow", "pandas", "numpy", "scikit-learn", "data analysis",
  "data engineering", "etl", "airflow", "spark", "hadoop", "dbt",
  "git", "agile", "scrum", "kanban", "jira", "tdd", "unit testing",
  "cybersecurity", "penetration testing", "oauth", "jwt", "sso",

  // Business / ops
  "project management", "product management", "stakeholder management",
  "budgeting", "forecasting", "risk management", "compliance", "auditing",
  "accounting", "bookkeeping", "quickbooks", "sap", "erp", "crm",
  "salesforce", "hubspot", "excel", "powerpoint", "google sheets",
  "supply chain", "logistics", "procurement", "inventory management",
  "quality assurance", "six sigma", "lean", "iso 9001",

  // Marketing / creative
  "seo", "sem", "ppc", "google ads", "google analytics", "content marketing",
  "copywriting", "social media", "email marketing", "brand management",
  "photoshop", "illustrator", "figma", "sketch", "video editing",
  "ui/ux", "ux research", "wireframing", "a/b testing",

  // People / service
  "customer service", "customer support", "sales", "business development",
  "negotiation", "public speaking", "leadership", "mentoring", "coaching",
  "team management", "recruiting", "onboarding", "hr", "payroll",
  "nursing", "patient care", "first aid", "cpr", "phlebotomy",
  "teaching", "curriculum development", "tutoring", "childcare",
  "welding", "plumbing", "electrical", "carpentry", "hvac", "painting",
  "driving", "cdl", "forklift", "food safety", "haccp", "barista",

  // Soft skills (lower signal but commonly required)
  "communication", "problem solving", "time management", "teamwork",
  "attention to detail", "adaptability", "critical thinking",
];

const STOPWORDS = new Set(
  "a an and are as at be by for from has have in is it its of on or that the to was we will with you your our their this they".split(" "),
);
export { STOPWORDS };
