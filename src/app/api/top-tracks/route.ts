import { getTopTracks } from "@/lib/spotify";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** "On repeat": changes slowly, so let the CDN keep it for an hour. */
export async function GET() {
  const tracks = await getTopTracks(5);
  return NextResponse.json(
    { tracks },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
