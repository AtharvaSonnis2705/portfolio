/**
 * Strings that start with "TODO(Atharva)" are highlighted in `pnpm dev` and
 * automatically hidden in production builds, so nothing unfinished ever ships.
 *
 * Site-wide facts. Edit this file to change your headline, availability, socials,
 * education, skills or the "now" block — every page reads from here.
 */

export const site = {
  name: "Atharva Sonnis",
  initials: "AS",
  jobTitle: "Software Engineer",
  headline: "I build AI-powered products, end to end.",
  subline:
    "Software Engineer working across LLM apps, agents & RAG, and the React/Node/AWS systems that ship them.",
  description:
    "Atharva Sonnis is a Software Engineer in Mumbai building AI-powered products end to end — LLM apps, agents and RAG on top of React, Node.js and AWS.",
  location: "Mumbai, India",
  availability: {
    open: true,
    // TODO(Atharva): confirm "Open to remote/relocation" before launch
    label: "Available for SDE / AI Engineer roles · Mumbai · Open to remote/relocation",
  },
  email: "sonnisatharva2705@gmail.com",
  resume: "/Atharva_Sonnis_Resume.pdf",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://atharvasonnisportfolio.vercel.app").replace(
    /\/$/,
    "",
  ),
  sourceUrl: "https://github.com/AtharvaSonnis2705/portfolio",
  socials: {
    github: "https://github.com/AtharvaSonnis2705",
    // TODO(Atharva): confirm — taken from your previous portfolio's navbar
    linkedin: "https://www.linkedin.com/in/atharva-sonnis-968483188/",
  },
  headshot: {
    src: "/images/about/headshot.webp",
    alt: "Portrait of Atharva Sonnis",
  },
  proof: [
    "Ex-Frontend Intern @ Applied Cloud Computing (client: Tata Mutual Fund)",
    "B.E. Computer Engineering · CGPA 8.58",
    "Hackathon builder: Auraflix Tech-AI",
  ],
  /** Short story used on the home teaser (3–4 sentences). */
  story: [
    "I'm a Computer Engineering graduate from Mumbai who likes owning a product from the first prompt to the production deploy.",
    "I started on the web — React, Node and Angular, including an internship building banking UI on a Tata Mutual Fund project — and moved deeper into applied AI: intent classifiers, LLM pipelines, and the plumbing that makes them reliable.",
    "Today I build the whole loop: model calls and retrieval on one side, typed APIs, serverless infra and a calm interface on the other.",
  ],
  /** Longer story for /about. Each string is a paragraph. */
  about: [
    "I'm Atharva, a Software Engineer who builds AI-powered products end to end. I graduated in 2026 with a B.E. in Computer Engineering from Vidyalankar Institute of Technology, Mumbai.",
    "As a frontend intern at Applied Cloud Computing I worked on a Tata Mutual Fund project — rebuilding a legacy modal into a responsive full-page view for complex banking data, and building a reusable nominee-entry component wired to REST APIs with validation. It taught me that the unglamorous parts — validation, edge cases, readable data — are where users actually feel quality.",
    "Since then I've been working toward the AI-engineer half of my toolkit: CircularIQ, a hybrid-RAG assistant that answers SEBI compliance questions with paragraph-level citations; a TensorFlow/NLTK intent classifier for a mental-health support chatbot; an OpenAI-powered transcription and summarization app; and an analytics dashboard built at the Auraflix Tech-AI hackathon. I care about AI features that are grounded, honest about uncertainty, and wrapped in software that's pleasant to use.",
    "TODO(Atharva): add a personal line — what you do outside code.",
  ],
  now: {
    building: ["CircularIQ — an evaluation suite in CI: golden Q&A set, recall@k, faithfulness"],
    learning: ["TODO(Atharva): what you're learning right now (e.g. LLM evals, agent tooling)"],
  },
  education: [
    {
      school: "Vidyalankar Institute of Technology (Mumbai University)",
      degree: "B.E. Computer Engineering",
      start: "2022",
      end: "2026",
      // TODO(Atharva): replace with your final CGPA
      grade: "CGPA 8.58",
      showOnHome: true,
    },
    {
      school: "Model College, Dombivli",
      degree: "HSC · XII (PCM + Computer Science)",
      start: "2020",
      end: "2022",
      grade: "71.33%",
      showOnHome: false,
    },
    {
      school: "Holy Angel's School & Jr College, Dombivli",
      degree: "CBSE · X",
      start: "2019",
      end: "2020",
      grade: "89.20%",
      showOnHome: false,
    },
  ],
  /**
   * Skill groups. A chip links to every project whose `stack` contains a matching
   * name (case/punctuation-insensitive), so keep names consistent with project files.
   */
  skills: [
    {
      group: "Generative AI & Agents",
      blurb: "LLM features that are grounded, observable and safe to ship.",
      items: [
        "LLM APIs (Claude, OpenAI, Gemini)",
        "Prompt Engineering",
        "RAG",
        "LangChain",
        "LangGraph",
        "FAISS",
        "pgvector",
        "ChromaDB",
        "AI Agents",
        "MCP",
      ],
    },
    {
      group: "ML / NLP",
      blurb: "Classic ML and NLP pipelines, from preprocessing to trained model.",
      items: ["TensorFlow", "Keras", "scikit-learn", "Hugging Face Transformers", "NLTK"],
    },
    {
      group: "Full-stack",
      blurb: "Typed, tested product surfaces and the APIs behind them.",
      items: [
        "TypeScript",
        "JavaScript",
        "Python",
        "React",
        "Next.js",
        "Node.js",
        "Express",
        "FastAPI",
        "PostgreSQL",
        "Angular",
        "MongoDB",
        "Tailwind CSS",
      ],
    },
    {
      group: "Cloud & Infra",
      blurb: "Serverless backends and the glue to run them.",
      items: ["AWS Lambda", "S3", "SES", "API Gateway", "Docker", "Turborepo"],
    },
    {
      group: "Tooling",
      blurb: "How I work day to day.",
      items: ["Git/GitHub", "Postman", "Claude Code", "Cursor", "Copilot"],
    },
  ],
  /** Aliases so project stack names map onto skill chips (normalized, lowercase). */
  skillAliases: {
    "openai api": "llm apis (claude, openai, gemini)",
    "claude api": "llm apis (claude, openai, gemini)",
    "gemini api": "llm apis (claude, openai, gemini)",
    tailwind: "tailwind css",
    mongoose: "mongodb",
    "aws s3": "s3",
    "aws ses": "ses",
  } as Record<string, string>,
} as const;

export type Site = typeof site;
