import type { ReactNode } from "react";

function formatInline(text: string): ReactNode[] {
  // Split on **bold** or *italic* patterns
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.flatMap((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return [
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>,
      ];
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return [
        <em key={i}>
          {part.slice(1, -1)}
        </em>,
      ];
    }
    return part.split("\n").flatMap((line, lineIndex, lines) => {
      const nodes: ReactNode[] = [line];
      if (lineIndex < lines.length - 1) {
        nodes.push(<br key={`${i}-br-${lineIndex}`} />);
      }
      return nodes;
    });
  });
}

type BuddyMessageTextProps = {
  text: string;
  className?: string;
};

/** Renders Buddy replies with basic markdown (bold, italic, line breaks). */
export function BuddyMessageText({ text, className }: BuddyMessageTextProps) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  if (paragraphs.length <= 1) {
    return <p className={className}>{formatInline(text)}</p>;
  }
  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={index > 0 ? "mt-2" : undefined}>
          {formatInline(paragraph)}
        </p>
      ))}
    </div>
  );
}