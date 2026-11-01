# abdus.net

My personal site and blog: [abdus.net](https://abdus.net).

Next.js 15 (App Router) with Tailwind. Posts are Markdown files; everything is
statically generated except the Spotify "now playing" endpoint.

## Run it

```sh
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build, no secrets needed
```

Node 26 (pinned in `package.json` → `engines`).

## Deploy

Hosted on Vercel (team `sysdown`, project `abdus-net`). **Pushing to `v8` deploys
to production**; other branches get preview deployments.

## Where things live

| What | Where |
| --- | --- |
| Blog posts | `content/_posts/*.md` |
| Notes | `content/_notes/*.md` |
| About page | `content/_pages/about.md` |
| Projects (incl. what I'm working on now) | `src/data/projects.ts` |
| Testimonials | `src/data/testimonials.json` |
| Site name, email, links | `src/lib/constants.ts` |
| Images (WebP only) | `public/assets/` |

### Changing what I'm working on

The home page "Now" card and the "Working on now" panel on `/projects` both read
from `src/data/projects.ts`. Move `current: true` (plus `status`, `icon` and
`nowLine`) to the new project. Clicking the card opens that project.

### Adding images

Use WebP, sized for how they're shown:

```sh
cwebp -q 80 -m 6 -metadata none input.png -o public/assets/…/name.webp
```

## Spotify "now playing" (renew every ~180 days)

The "Listening to …" line in the Now card comes from `/api/now-playing`, which
uses the Spotify app **Abdus** (Client ID `87021253020a4ad38ee6d4501020e5c8`).

Spotify expires refresh tokens after **180 days**. Last renewed **1 Nov 2026**,
so the next renewal is due around **late April 2027**. When it expires, the site
keeps working; the "Listening to" line just stops appearing.

To renew:

1. In the [Spotify dashboard](https://developer.spotify.com/dashboard), open the
   **Abdus** app → Settings, and make sure `http://127.0.0.1:8888/callback` is
   under **Redirect URIs**.
2. From this repo, run:

   ```sh
   vercel link --yes --project abdus-net --scope sysdown   # first time only
   node scripts/spotify-token.mjs --app=87021253020a4ad38ee6d4501020e5c8
   ```

3. When it says *Waiting…*, click **View client secret** in the dashboard and
   copy it. The script picks it up from the clipboard (then clears it).
4. Click **Agree** on Spotify. You should see nine ✓ lines: the client ID,
   secret and refresh token saved to Vercel for production, preview and
   development.
5. Redeploy production so the new token takes effect: push to `v8`, or
   `vercel redeploy <latest production URL> --scope sysdown`.

Check it: `curl https://abdus.net/api/now-playing` should show
`"isPlaying": true` while something is playing.
