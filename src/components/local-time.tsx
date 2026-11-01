"use client";

import { useEffect, useState } from "react";

const fmt = () =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date())
    .toLowerCase();

/** My local time, ticking. Rendered only on the client so it is never a stale build-time value. */
export default function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 15_000);
    return () => clearInterval(id);
  }, []);
  if (!time) return null;
  return (
    <>
      {" · "}
      <span className="tabular-nums">It&apos;s {time} for me in India</span>
    </>
  );
}
