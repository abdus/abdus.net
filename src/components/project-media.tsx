import type { Media } from "@/data/projects";
import { Reveal } from "./reveal";

/** Three quiet dots: the universal sign for "a window". */
function WindowDots() {
  return (
    <span className="flex gap-1.5" aria-hidden>
      <span className="size-2.5 rounded-full bg-[#ff5f57]" />
      <span className="size-2.5 rounded-full bg-[#febc2e]" />
      <span className="size-2.5 rounded-full bg-[#28c840]" />
    </span>
  );
}

export function ProjectMedia({ media }: { media: Media }) {
  if (media.kind === "image") {
    return (
      <figure className="overflow-hidden rounded-2xl bg-surface shadow-[0_0_0_0.5px_rgb(var(--line)/0.12),0_12px_40px_-16px_rgb(0_0_0/0.25)]">
        <div className="flex items-center gap-3 border-b border-line/[0.07] px-4 py-2.5">
          <WindowDots />
          <span className="mx-auto -translate-x-6 truncate rounded-md bg-bg/70 px-3 py-0.5 text-[11px] text-fg-3">
            {media.label}
          </span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.src}
          alt={media.alt}
          loading="lazy"
          className={`${media.aspect === "16/9" ? "aspect-[16/9]" : "aspect-[16/10]"} w-full object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-[1.015]`}
        />
      </figure>
    );
  }

  return (
    <figure>
      <Reveal className="overflow-hidden rounded-2xl bg-[#161618] font-mono text-[12.5px] leading-[1.75] text-[#e5e5ea] shadow-[0_0_0_0.5px_rgb(255_255_255/0.08),0_12px_40px_-16px_rgb(0_0_0/0.35)] sm:text-[13px]">
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5">
          <WindowDots />
          <span className="mx-auto -translate-x-6 text-[11px] text-white/40">{media.title}</span>
        </div>
        <div className="overflow-x-auto px-5 py-4">
          {media.lines.map((line, i) => (
            <div
              key={i}
              className="term-line whitespace-pre"
              style={{ "--i": i } as React.CSSProperties}
            >
              {line.prompt && <span className="select-none text-[#30d158]">$ </span>}
              <span className={line.dim ? "text-white/45" : undefined}>{line.text}</span>
            </div>
          ))}
          <div
            className="term-line mt-0.5 h-4 w-2 animate-pulse bg-white/60"
            style={{ "--i": media.lines.length } as React.CSSProperties}
            aria-hidden
          />
        </div>
      </Reveal>
      {media.caption && (
        <figcaption className="mt-3 text-[13px] text-fg-3">{media.caption}</figcaption>
      )}
    </figure>
  );
}
