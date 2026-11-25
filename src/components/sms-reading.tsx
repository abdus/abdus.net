"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** A demo message and the model's answer, copied from a recorded playground run. */
const PARTS: { text: string; field?: string }[] = [
  { text: "INR", field: "Currency" },
  { text: " " },
  { text: "318.40", field: "Amount" },
  { text: " is " },
  { text: "paid from", field: "Direction" },
  { text: " HSBC account XXXXXX2290 to " },
  { text: "Uber India", field: "Counterparty" },
  { text: " on 18-Oct-26 with ref 529133670845. If this is not done by you, call 18002673456 to report." },
];

const FIELDS = [
  { name: "Transaction", value: "Yes", sure: "98.0%" },
  { name: "Direction", value: "Money out", sure: "100%" },
  { name: "Amount", value: "318.40", sure: "100%" },
  { name: "Currency", value: "INR", sure: "100%" },
  { name: "Counterparty", value: "Uber India", sure: "99.6%" },
  { name: "Own-account transfer", value: "No", sure: "99.8%" },
];

export function SmsReading() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <figure>
      <p className="max-w-[30rem] rounded-[22px] bg-surface px-5 py-4 text-[17px] leading-[1.65] text-fg">
        {PARTS.map((p, i) => (
          <span
            key={i}
            className={cn(
              "rounded transition-colors duration-200",
              p.field && "text-fg",
              p.field && active === p.field && "bg-tint/25"
            )}
          >
            {p.text}
          </span>
        ))}
      </p>

      <table className="mt-8 w-full text-left text-[15px]">
        <thead className="text-[13px] text-fg-3">
          <tr>
            <th scope="col" className="pb-2 font-normal">Field</th>
            <th scope="col" className="pb-2 font-normal">Model&apos;s answer</th>
            <th scope="col" className="pb-2 text-right font-normal">How sure</th>
          </tr>
        </thead>
        <tbody>
          {FIELDS.map((f) => {
            const linked = PARTS.some((p) => p.field === f.name);
            return (
              <tr
                key={f.name}
                className="border-t border-line/[0.07]"
                onMouseEnter={() => setActive(f.name)}
                onMouseLeave={() => setActive(null)}
              >
                <th scope="row" className="font-normal text-fg-2">
                  {linked ? (
                    <button
                      type="button"
                      className="min-h-11 text-left"
                      aria-label={`Show where ${f.name} comes from`}
                      onClick={() => setActive(f.name)}
                      onFocus={() => setActive(f.name)}
                      onBlur={() => setActive(null)}
                    >
                      {f.name}
                    </button>
                  ) : (
                    <span className="flex min-h-11 items-center">{f.name}</span>
                  )}
                </th>
                <td className="text-fg">{f.value}</td>
                <td className="text-right tabular-nums text-fg-2">{f.sure}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <figcaption className="mt-4 text-[13px] leading-relaxed text-fg-3">
        A demo message, recorded from the playground with an earlier version of the 0.5B model. Hover
        or tap a field to see the words it comes from; the other two are read from the whole message.
      </figcaption>
    </figure>
  );
}
