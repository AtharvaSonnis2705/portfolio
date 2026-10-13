import { execSync } from "node:child_process";
import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

/** Last-updated date shown in the footer: last git commit, falling back to build time. */
function lastUpdated(): string {
  try {
    return execSync("git log -1 --format=%cI", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return new Date().toISOString();
  }
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_LAST_UPDATED: lastUpdated(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/resume",
        destination: "/Atharva_Sonnis_Resume.pdf",
        permanent: false,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
