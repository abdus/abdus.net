#!/usr/bin/env node
/**
 * Re-authorise the "now playing" integration when Spotify revokes the refresh token.
 *
 *   vercel link --yes --project abdus-net --scope sysdown      # once
 *   vercel env pull .env.local --environment production        # gets client id/secret
 *   node scripts/spotify-token.mjs
 *
 * Opens Spotify's consent page, catches the redirect on http://127.0.0.1:8888/callback
 * (this URI must be listed in the Spotify app's Redirect URIs), swaps the code for a
 * refresh token, and stores it in Vercel for production, preview and development.
 * The token is never printed.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { spawnSync, execFile } from "node:child_process";
import { randomBytes } from "node:crypto";

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = "user-read-currently-playing user-read-playback-state";
const SCOPE_FLAG = ["--scope", "sysdown"];

function loadEnv(file) {
  if (!existsSync(file)) return {};
  return Object.fromEntries(
    readFileSync(file, "utf8")
      .split("\n")
      .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/))
      .filter(Boolean)
      .map((m) => [m[1], m[2]])
  );
}

const env = { ...loadEnv(".env.local"), ...process.env };
const clientId = env.SPOTIFY_CLIENT_ID;
const clientSecret = env.SPOTIFY_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET. Run: vercel env pull .env.local --environment production");
  process.exit(1);
}

const state = randomBytes(12).toString("hex");
const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({ response_type: "code", client_id: clientId, scope: SCOPES, redirect_uri: REDIRECT_URI, state });

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== "/callback") return res.writeHead(404).end();
  if (url.searchParams.get("state") !== state || !url.searchParams.get("code")) {
    res.writeHead(400).end("Authorisation failed or was cancelled. You can close this tab.");
    console.error("Spotify returned:", url.searchParams.get("error") || "no code");
    return finish(1);
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code: url.searchParams.get("code"), redirect_uri: REDIRECT_URI }),
  });
  const data = await tokenRes.json();
  if (!data.refresh_token) {
    res.writeHead(500).end("Could not get a refresh token. See the terminal.");
    console.error("Token exchange failed:", data.error, data.error_description);
    return finish(1);
  }
  res.writeHead(200, { "Content-Type": "text/plain" }).end("Done. You can close this tab and go back to the terminal.");

  for (const target of ["production", "preview", "development"]) {
    spawnSync("vercel", ["env", "rm", "SPOTIFY_REFRESH_TOKEN", target, "-y", ...SCOPE_FLAG], { stdio: "ignore" });
    const add = spawnSync("vercel", ["env", "add", "SPOTIFY_REFRESH_TOKEN", target, ...SCOPE_FLAG], {
      input: data.refresh_token,
      stdio: ["pipe", "ignore", "inherit"],
    });
    console.log(`${add.status === 0 ? "✓" : "✗"} SPOTIFY_REFRESH_TOKEN saved for ${target}`);
  }
  console.log("\nNew token stored in Vercel. Redeploy production for it to take effect.");
  finish(0);
});

function finish(code) {
  server.close();
  setTimeout(() => process.exit(code), 100);
}

server.listen(PORT, "127.0.0.1", () => {
  console.log("Opening Spotify to approve access…\nIf nothing opens, visit:\n" + authUrl + "\n");
  execFile("open", [authUrl]);
});
