---
name: update-now
description: Update the /now page on abdus.net — what Abdus is building, reading, riding or doing away from the keyboard, the "Lately shipped" list, trip photos. Use for "update my now page", "add X to /now", "I shipped Y", "add photos from my trip", or when something on /now has gone stale.
---

# Update /now

`/now` is a [now page](https://nownownow.com/about): what Abdus is focused on at this point in his life. It must stay honest and current. A stale now page is worse than none.

## Where things live

| What | Where | Notes |
| --- | --- | --- |
| Sections, intro, date | `src/data/now.ts` (`NOW`) | The only file most updates touch |
| Page layout | `src/app/now/page.tsx` | Change only if a new kind of content needs it |
| "Lately shipped" | built automatically | From `shipped` on projects in `src/data/projects.ts`, plus every post and note dated in the 60 days before `NOW.updated`; newest 5 |
| Live: IPO signals | `src/components/ipo-signals.tsx` | Fetched in the browser from `abdus.github.io/ipo-analyser/api/*.json`; hides itself when nothing is open |
| Live: Spotify | `src/components/now-playing.tsx`, `/api/now-playing` | Only what is playing right now |
| Local time | `src/components/local-time.tsx` | Ticks in the eyebrow, Asia/Kolkata |
| Photos | `public/assets/now/` | WebP only |

The home page **Now card** (`src/components/now-card.tsx`) reads the project with `current: true` in `projects.ts`. It shows only what's being built and what's playing. Don't add other widgets to it; they belong on `/now`.

## A section (`NOW.items`)

```ts
{
  label: "Building",                 // one word or short phrase, shown small in the tint colour
  title: "Teaching a tiny model…",   // a sentence-case headline, no full stop
  body: "Two or three sentences in Abdus's voice, first person.",
  stats: [{ value: "98.5%", label: "fully right, vs 93.5% for my rules" }], // optional, 1 or 3 work best
  link: { href: "https://…", label: "spends.abdus.net" },                   // optional
  photos: [/* optional, see below */],
}
```

Current labels: Building, Reading, Away from the keyboard. Keep it to about four sections, and remove things that are no longer true rather than letting them pile up.

## "Lately shipped"

- **A project release:** set `shipped: { date: "YYYY-MM-DD", note: "…" }` on its entry in `src/data/projects.ts`. The note is one short line about what went out.
- **Date it by when it first went live.** Use the first deploy or launch, not a later re-hosting, open-sourcing or migration. Check git history (`git log --reverse`) and the host's deployment list (Vercel, Railway, GitHub Pages runs). If a project went live more than 60 days ago, it simply won't appear; that's correct.
- **Posts and notes** appear on their own; nothing to do.

## Facts

- **Only facts you've verified** from the code, git history, the live site or the user. If you can't verify something, leave it out or ask; never guess.
- **Numbers must match their source.** For the Spends SMS model, the blog post `content/_posts/from-regex-to-a-small-language-model.md` is the source of truth: 98.5% fully right vs 93.5% for rules, 1.5 s per SMS on a Pixel 7a, 352 MB. If you change a number on `/now`, change it everywhere it appears (`projects.ts` stats, Pocket Ledger, the home page) so the site agrees with itself.
- **Write in Abdus's voice:** first person, plain words, short sentences, no hype.

## Privacy: never put these on the site

- Listening history, top tracks or top artists. Only the live "Listening to" line.
- The `k.abdus.net` address. Kestrel is listed without a link.
- Bank or lender names presented as Abdus's own accounts, real SMS, amounts or account numbers.
- Work details from NeoSapien, or anything from memsys's fact list.
- Location data in photos.

## Photos

1. **Getting them.** Abdus's photos are usually on his Instagram (`instagram.com/azabdus`), and Chrome is signed in.
   - Open the post with the Chrome tools.
   - Step through the carousel and collect the largest `srcset` URL from each `main li img`. Skip images inside links to other posts.
   - Download them from the page as blobs. Signed CDN URLs can't be passed out of the page.
   - Alternatives: he AirDrops them to `~/Downloads`, or shares a Drive folder.
2. **Rejoin split panoramas.** Instagram carousels often split one wide photo into two halves. Compare the right edge of each image with the left edge of the next. A mean pixel difference under about 15 means they belong together, so join them side by side.
3. **Export.** Use `cwebp -q 80 -m 6 -metadata none`, which strips EXIF and GPS. Make heroes and panoramas 1800 px wide, and the rest 900 px. Name them `public/assets/now/<trip>-<what>.webp`. Then delete the downloaded copies from `~/Downloads`.
4. **Mosaic.** The first photo is the wide 16:10 hero, so make it a panorama or the strongest wide shot. The rest sit in a 3-column grid:
   - `shape: "tall"` spans two rows (portraits, a person with the bike).
   - `shape: "wide"` spans two columns (landscapes, panoramas).
   - A good set of five: hero, then tall, wide, and two single cells.
   - Write a real `alt` for every photo.
5. Add `link: { href: "https://www.instagram.com/azabdus/", label: "More photos on Instagram" }` to trip sections.

## Every time

1. Bump `NOW.updated` to today, in IST.
2. Build and check:
   ```sh
   lsof -ti tcp:3123 | xargs kill; rm -rf .next && pnpm build && pnpm start -H 0.0.0.0 -p 3123
   ```
   Open `http://localhost:3123/now` in Chrome:
   - Check desktop, and 390 px and 360 px wide (an iframe works). There must be no horizontal overflow: `document.documentElement.scrollWidth` should equal the width.
   - Every image must load.
   - Check light and dark.
3. Commit with a one-line imperative message and no Co-Authored-By trailer. Abdus's other sessions may have left blog posts uncommitted in `content/_posts` or `public/assets/posts`. Those are intentional, so ship them with the push rather than stripping them.
4. Push to `v8`. That deploys production in about a minute. The SSH key on this machine is a work account and is refused, so push over HTTPS as `abdus`:
   ```sh
   TOKEN=$(gh auth token -u abdus) && git -c credential.helper= -c "credential.helper=!f(){ echo username=abdus; echo password=$TOKEN; }; f" push https://github.com/abdus/abdus.net.git v8
   ```
   Never print the token. Once a change is asked for and verified, push without asking.
5. Confirm it's live: `curl -s https://abdus.net/now | grep -q "<new text>"`. You can also wait for `vercel ls abdus-net --prod --scope sysdown` to show the new deployment as Ready.
