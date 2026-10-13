import { MDXContent } from "@content-collections/mdx/react";
import { Architecture } from "@/components/mdx/architecture";
import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";
import { Gallery } from "@/components/mdx/gallery";
import { Todo } from "@/components/ui/todo";
import type { Project } from "@/lib/content";

/**
 * Plain Markdown images (`![alt](/path.webp)`). Dimensions aren't known at build time,
 * so prefer <Gallery /> or <Architecture /> for anything above the fold.
 */
function MarkdownImage({ alt = "", ...props }: React.ComponentProps<"img">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- intrinsic size unknown for inline Markdown images
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      className="my-8 h-auto w-full rounded-xl border border-border"
      {...props}
    />
  );
}

/** Renders a case study's MDX with the site's components. `<Gallery />` uses the project's frontmatter gallery. */
export function CaseStudyBody({ project }: { project: Project }) {
  return (
    <div className="prose-case">
      <MDXContent
        code={project.mdx}
        components={{
          Architecture,
          Callout,
          Todo,
          pre: CodeBlock,
          Gallery: () => <Gallery items={project.gallery} />,
          img: MarkdownImage,
        }}
      />
    </div>
  );
}
