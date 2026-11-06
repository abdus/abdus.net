import Link from "next/link";
import { PAST_JOBS, WORK } from "@/data/work";

/*
 * The one idea: show what happens to a conversation, and which part of that is mine.
 * The intro above tells the story; this shows it. A small live diagram of the journey, three moments I'm proud of
 * (soft tiles on desktop, plain rows on phones), and the jobs before as a single sentence.
 */

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

function Company({ name, href }: { name: string; href?: string }) {
  return href ? (
    <Link href={href} {...external} className="link">
      {name}
    </Link>
  ) : (
    <span className="text-fg">{name}</span>
  );
}

type FlowIcon = (typeof WORK.flow)[number]["icon"];

/** Hand-drawn 24px line icons, one per stop. */
function Icon({ name }: { name: FlowIcon }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "neo":
      return (
        <svg {...common}>
          <path d="M10.5 5V3.5h3V5" />
          <rect x="7.5" y="5" width="9" height="15" rx="2.5" />
          <path d="M10.5 14.5v-2a1.5 1.5 0 0 1 3 0v2" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
          <path d="M10.5 18.5h3" />
        </svg>
      );
    case "servers":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="6.5" rx="1.75" />
          <rect x="4" y="13.5" width="16" height="6.5" rx="1.75" />
          <path d="M7.5 7.25h.01M7.5 16.75h.01" strokeWidth={2.25} />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6" />
          <path d="m15 15 5 5" />
        </svg>
      );
  }
}

/**
 * One conversation's journey, left to right, with a live dot travelling the line.
 * Stops sit at the centres of four equal columns (12.5%, 37.5%, 62.5%, 87.5%);
 * the bracket under my part runs from the phone's outer edge to the last stop's, 22px (half a stop) past each centre.
 */
function Flow() {
  return (
    <figure aria-label="Neo 1 hears a conversation, your phone relays it, our servers make sense of it, and you search it later. I look after everything from the Bluetooth link onwards.">
      <div className="relative">
        {/* The line, behind the stops, and the dot that travels it. */}
        <div className="absolute inset-x-[12.5%] top-[22px] h-px bg-line/15" aria-hidden>
          <span className="work-dot absolute -top-[3px] left-0 size-[7px] rounded-full bg-tint shadow-[0_0_0_4px_rgb(var(--tint)/0.15)]" />
        </div>

        <ol className="relative grid grid-cols-4">
          {WORK.flow.map((s) => (
            <li key={s.icon} className="flex flex-col items-center text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-bg text-fg ring-1 ring-line/15">
                <Icon name={s.icon} />
              </span>
              <span className="mt-3 max-w-[8.5rem] px-1 text-[13px] leading-snug text-fg-2">{s.label}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* A bracket under my stretch of the line. */}
      <div className="relative mt-5 h-8" aria-hidden>
        <div className="absolute left-[calc(37.5%-22px)] right-[calc(12.5%-22px)] top-0 h-2 rounded-b-md border-x border-b border-fg/25" />
        <p className="absolute left-[calc(37.5%-22px)] right-[calc(12.5%-22px)] top-3.5 text-center text-[13px] font-medium text-fg">
          {WORK.mine}
        </p>
      </div>
    </figure>
  );
}

export function Work() {
  const { moments } = WORK;

  return (
    <div className="pt-4">
      <Flow />

      {/* Three moments: soft tiles from 640px, plain rows below it. */}
      <ul className="mt-10 divide-y divide-line/[0.07] sm:grid sm:grid-cols-3 sm:gap-3 sm:divide-y-0">
        {moments.map((m) => (
          <li
            key={m.title}
            className="grid grid-cols-[5.5rem_1fr] items-baseline gap-x-4 py-4 sm:block sm:rounded-[20px] sm:bg-surface sm:p-5"
          >
            <p className="display whitespace-nowrap text-[34px] leading-none tabular-nums sm:mt-0 sm:text-[40px]">
              {m.value}
              <span className="text-[0.55em] text-fg-3">%</span>
            </p>
            <div className="sm:mt-4">
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-fg">{m.title}</p>
              <p className="mt-1 text-[14px] leading-snug text-fg-2">{m.label}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-[17px] leading-[1.7] text-fg-2">
        Before that, I{" "}
        {PAST_JOBS.map((j, i) => (
          <span key={j.company}>
            {j.did} <Company name={j.company} href={j.href} />
            {i < PAST_JOBS.length - 2 ? ", " : i === PAST_JOBS.length - 2 ? ", and " : "."}
          </span>
        ))}
      </p>
    </div>
  );
}
