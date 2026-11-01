/**
 * Star counts for public repos, fetched once a day at build/revalidate time.
 * One unauthenticated request for all repos; if GitHub is slow or rate-limits,
 * the page simply renders without stars.
 */
export async function getStars(): Promise<Record<string, number>> {
  try {
    const res = await fetch("https://api.github.com/users/abdus/repos?per_page=100&type=owner", {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return {};
    const repos: { html_url: string; stargazers_count: number }[] = await res.json();
    return Object.fromEntries(repos.map((r) => [r.html_url.toLowerCase(), r.stargazers_count]));
  } catch {
    return {};
  }
}
