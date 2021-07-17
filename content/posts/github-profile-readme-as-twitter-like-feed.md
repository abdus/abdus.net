---
title: "Using Github Profile Readme as 'Twitter-like' Feed"
date: 2020-08-20T06:46:55+05:30
draft: false
meta:
  image: https://dev-to-uploads.s3.amazonaws.com/i/lk63wznpuwhi5mzcgtkh.png # url to image. Important for blog listing and seo
  description: # overrides .Summary
featured: false # feature a post in homepage
tableofcontents: true # whether to generate ToC
tags: [github, mastodon]
categories: [misc]
---

![github profile readme](https://dev-to-uploads.s3.amazonaws.com/i/lk63wznpuwhi5mzcgtkh.png)

I had this weird idea of using GitHub profile README as Twitter-like(well,
Mastodon TBH) feed! There was no specific reason for doing so. I roughly
thought it would boost my Mastodon profile(which is quite new at the moment)
reach.

Another reason was to see how far I could go with limited tools (as Github
ReadMe does not support JavaScript yet).

## Generating those Cards

There was only one thing to figure out. How to create beautiful status cards
with limited CSS! I knew I could use SVG and make whatever I want. But not
all browser supports every feature of SVG yet. So, generating and
storing SVG codes as images may not always work.

Since GitHub has introduced workflows(better be late than never), I chose to
render SVG on a webpage and convert them to PNG, all in Server-side.

This way, I am assured that SVG would be rendered in the latest browser and
converted PNG. But how do I do it?

There is a package called [Puppeteer](https://github.com/puppeteer/puppeteer) in the NPM registry. This library gives
the user a way to control Chromium/Firefox browser programmatically. This,
by default, runs browser in headless mode. So, the user would be able to run it
without a Desktop Environment.

## Getting 'Toots' from Mastodon

If you don't know about Mastodon, you can think of it as Open-Source Twitter!
[Read more about Mastodon](https://joinmastodon.org/).

Mastodon have an API to fetch public toots of any profile without using an
API key. The response is in JSON, so parsing it was quite simple.

> Biggest surprise: If I add a Middot (·) somewhere inside SVG, loading image
> won't work! It throws an encoding error.

## Installing Font

After pushing the initial version to GitHub, I noticed that the font I was
using locally was not available in Github Workflows environment. So, I had to
install them manually. Although I could simply add a font CDN using `style`
tag within SVG, why not do it the Linux' way? :P

Installing font through command-line as just three simple steps.

- download font as a zip archive
- extract font files to `~/.fonts` using `unzip`
- run `fc-cache -f -v` to manually update the font cache

## Writing Workflow Steps

I set-up the workflow to run in two events. First is, when I push something to
the repository. And second is, on every hour (using a Cronjob). This way, I won't
have to worry about updating ReadMe manually when I post a new toot.

- Setting up Node and NPM was done by an action called [`setup-node`](https://github.com/actions/setup-node).
- Installing required font was done by a custom bash [script I wrote](https://github.com/abdus/abdus/blob/57372e8c9321a3c0d1141098483a0c2a648315a6/.github/workflows/publish.yml#L21-L26).
- Finally, the [image creation script](https://github.com/abdus/abdus/blob/master/index.mjs) was run using Node, commit the changes, and push them back to GitHub.

And the work is done here!

## Conslusion

Sure, this thing was just for fun. But I learnt quite a few new things.

- I can't use Middot(or similar characters) within an SVG tag. Now I know
  what to look for when there's an encoding issue.
- I understand how `action/checkout` works. This will help me write better
  workflows in future.
- I learnt about some SVG tags. For example, `switch` and `foreignObject`.

If you liked this, I would be happy if you **star 🌟 [this repository](https://github.com/abdus/abdus)**.
You can follow me on Mastodon. My handle is **@abdus@linuxrocks.online**.

_Also published in [dev.to](https://dev.to/abdus/using-github-profile-readme-as-twitter-like-feed-25k4)_
