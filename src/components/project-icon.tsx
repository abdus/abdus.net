import {
  Anchor,
  Bird,
  Brain,
  ChartCandlestick,
  FileText,
  FolderTree,
  Gauge,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "@/data/projects";

/** Placeholder marks for projects that have no icon of their own yet. */
const marks: Record<string, { Icon: LucideIcon; bg: string }> = {
  "Pocket Ledger": { Icon: MessageSquareText, bg: "#1f7a5c" },
  Redline: { Icon: Gauge, bg: "#c8382e" },
  "IPO Analyser": { Icon: ChartCandlestick, bg: "#3457b8" },
  memsys: { Icon: Brain, bg: "#7a4fb0" },
  folio: { Icon: FileText, bg: "#a8601f" },
  Kestrel: { Icon: Bird, bg: "#8a5a3c" },
  Harbor: { Icon: Anchor, bg: "#1f6f8b" },
  "Nginx Pretty Index": { Icon: FolderTree, bg: "#2f7d3b" },
};

export function ProjectIcon({ project }: { project: Project }) {
  const shape =
    "size-12 shrink-0 rounded-[13px] transition-transform duration-300 ease-out group-hover/item:-rotate-3 motion-reduce:transform-none sm:size-14 sm:rounded-[15px]";
  if (project.icon) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={project.icon} alt="" width={56} height={56} className={shape} />;
  }
  const mark = marks[project.title];
  return (
    <span
      aria-hidden
      className={`${shape} flex items-center justify-center text-white`}
      style={{ background: mark?.bg ?? "#55555a" }}
    >
      {mark ? (
        <mark.Icon className="size-6 sm:size-7" strokeWidth={1.6} />
      ) : (
        <span className="text-[22px]">{project.title[0]}</span>
      )}
    </span>
  );
}
