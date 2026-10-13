import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { ViewTransition } from "react";
import { CommandMenu } from "@/components/command-menu";
import { Footer } from "@/components/footer";
import { Grain } from "@/components/grain";
import { Nav } from "@/components/nav";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { Toaster } from "@/components/ui/toast";
import { site } from "@/content/site";
import { getPaletteData } from "@/lib/content";
import { jsonLdScript, personJsonLd } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.jobTitle}, AI & Full-stack`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Atharva Sonnis",
    "Software Engineer",
    "AI Engineer",
    "LLM",
    "RAG",
    "Next.js",
    "React",
    "Mumbai",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07090B",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      // the inline script below adds `js` before hydration
      suppressHydrationWarning
    >
      <head>
        <script
          // Marks JS-capable browsers so reveal animations never hide content for no-JS users
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(personJsonLd())} />
      </head>
      <body>
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-accent px-4 py-2 text-sm font-medium text-bg transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Nav initials={site.initials} resume={site.resume} />
        <ViewTransition>
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
        </ViewTransition>
        <Footer />
        <Grain />
        <Toaster />
        <RevealObserver />
        <CommandMenu
          data={getPaletteData()}
          email={site.email}
          resume={site.resume}
          github={site.socials.github}
          linkedin={site.socials.linkedin}
          source={site.sourceUrl}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
