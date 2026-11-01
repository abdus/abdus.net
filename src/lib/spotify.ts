'use server'

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  try {
    if (!client_id || !client_secret || !refresh_token) {
      throw new Error('Missing required Spotify credentials');
    }

    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }).toString(),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Spotify token error:', data);
      throw new Error(`Spotify token error: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw error;
  }
};

export const getNowPlaying = async () => {
  try {
    const { access_token } = await getAccessToken();
    
    if (!access_token) {
      throw new Error('No access token available');
    }

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!response.ok && response.status !== 204) {
      const error = await response.json();
      console.error('Spotify API error:', error);
      throw new Error(`Spotify API error: ${error.error?.message || 'Unknown error'}`);
    }

    return response;
  } catch (error) {
    console.error('Failed to get now playing:', error);
    throw error;
  }
};

export type TopTrack = { title: string; artist: string; url: string; image?: string };

/** Most-played tracks over the last four weeks. Empty if the token can't read them (needs user-top-read). */
export const getTopTracks = async (limit = 5): Promise<TopTrack[]> => {
  try {
    const { access_token } = await getAccessToken();
    const res = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=${limit}`,
      { headers: { Authorization: `Bearer ${access_token}` }, cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.items || []).map((t: any) => ({
      title: t.name,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      artist: t.artists.map((a: any) => a.name).join(', '),
      url: t.external_urls.spotify,
      image: t.album.images.at(-1)?.url,
    }));
  } catch {
    return [];
  }
};
