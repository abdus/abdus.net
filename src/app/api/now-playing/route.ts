import { getNowPlaying } from '@/lib/spotify';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const response = await getNowPlaying();

  if (response.status === 204 || response.status > 400) {
    const song = await response.text();
    console.log(`song ========> `, song)
    return NextResponse.json({ isPlaying: false });
  }

  const song = await response.json();

  if (song.item === null) {
    return NextResponse.json({ isPlaying: false });
  }

  const isPlaying = song.is_playing;
  const title = song.item.name;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ');
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0].url;
  const songUrl = song.item.external_urls.spotify;

  // Additional data
  const duration = song.item.duration_ms;
  const progress = song.progress_ms;
  const previewUrl = song.item.preview_url;
  const explicit = song.item.explicit;
  const trackNumber = song.item.track_number;
  const releaseDate = song.item.album.release_date;

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
