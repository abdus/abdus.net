import { getNowPlaying } from '@/lib/spotify';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  // Spotify is a nicety: if it fails (e.g. a revoked token), say "not playing" rather than 500.
  let response: Response;
  try {
    response = await getNowPlaying();
  } catch (error) {
    console.error("now-playing: Spotify unavailable:", (error as Error).message);
    return NextResponse.json({ isPlaying: false });
  }

  if (response.status === 204 || response.status > 400) {
    return NextResponse.json({ isPlaying: false });
  }

  const song = await response.json();

  if (!song?.item) {
    return NextResponse.json({ isPlaying: false });
  }

  // Tracks, episodes and local files differ: read every field defensively.
  const item = song.item ?? {};
  const isPlaying = Boolean(song.is_playing);
  const title = item.name ?? "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const artist = (item.artists ?? []).map((a: any) => a.name).join(", ") || item.show?.name || "";
  const album = item.album?.name ?? item.show?.name ?? "";
  const albumImageUrl = item.album?.images?.[0]?.url ?? item.images?.[0]?.url ?? "";
  const songUrl = item.external_urls?.spotify ?? "";

  // Additional data
  const duration = item.duration_ms;
  const progress = song.progress_ms;
  const previewUrl = item.preview_url;
  const explicit = item.explicit;
  const trackNumber = item.track_number;
  const releaseDate = item.album?.release_date;

  return NextResponse.json({
    album,
    albumImageUrl,
    artist,
    isPlaying,
    songUrl,
    title,
    duration,
    progress,
    previewUrl,
    explicit,
    trackNumber,
    releaseDate,
  });
}
