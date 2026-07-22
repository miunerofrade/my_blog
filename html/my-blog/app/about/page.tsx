import "katex/dist/katex.min.css";
import AboutPageContent from "@/components/about-page-content";
import MarkdownRenderer from "@/components/markdown-renderer";
import { getAboutContent } from "@/lib/site-content";

export default function AboutPage() {
  const about = getAboutContent();

  return (
    <AboutPageContent title={about.title} subtitle={about.subtitle}>
      <MarkdownRenderer source={about.content} />
    </AboutPageContent>
  );
}
