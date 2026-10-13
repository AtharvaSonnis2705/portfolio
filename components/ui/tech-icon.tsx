import "server-only";
import {
  siAngular,
  siAnthropic,
  siCloudinary,
  siDocker,
  siExpress,
  siGit,
  siGooglegemini,
  siHuggingface,
  siJavascript,
  siJsonwebtokens,
  siKeras,
  siLangchain,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPostman,
  siPython,
  siReact,
  siScikitlearn,
  siTailwindcss,
  siTensorflow,
  siTurborepo,
  siTypescript,
  siVite,
  siYoutube,
  type SimpleIcon,
} from "simple-icons";
import { Svg } from "@/components/ui/brand-icons";
import { normalizeSkill } from "@/lib/utils";

const TECH: Record<string, SimpleIcon> = {
  angular: siAngular,
  "claude api": siAnthropic,
  cloudinary: siCloudinary,
  docker: siDocker,
  express: siExpress,
  git: siGit,
  "gemini api": siGooglegemini,
  "hugging face transformers": siHuggingface,
  javascript: siJavascript,
  jwt: siJsonwebtokens,
  keras: siKeras,
  langchain: siLangchain,
  mongodb: siMongodb,
  nextjs: siNextdotjs,
  nodejs: siNodedotjs,
  postman: siPostman,
  python: siPython,
  react: siReact,
  "scikit learn": siScikitlearn,
  "tailwind css": siTailwindcss,
  tensorflow: siTensorflow,
  turborepo: siTurborepo,
  typescript: siTypescript,
  vite: siVite,
  "youtube data api": siYoutube,
};

/** Monochrome tech logo for a stack name, or null when simple-icons has none. */
export function TechIcon({ name, className }: { name: string; className?: string }) {
  const icon = TECH[normalizeSkill(name)];
  return icon ? <Svg path={icon.path} className={className} /> : null;
}
