---
title: 'Recording Shell Output the Right Way'
date: 2020-07-10T21:27:30+05:30
draft: false
meta:
  image: # url to image. Important for blog listing and seo
  description: # overrides .Summary
featured: false # feature a post in homepage
tableofcontents: true # whether to generate ToC
tags: ['tools', 'shell-recording', 'asciinema']
categories: ['linux']
---

> TL,DR; go and install `asciinema` from [asciinema.org](https://asciinema.org) and start recording your terminal sessions.

We, the terminal geeks often need to record our shell in-order to explain
something to our geek friends; or even just to showcase a new CLI tool we built
yesterday night.

## Recording Screen ...

Sucks! Yes, it sucks. Why? couple of good reasons:

- if you have a device with low screen resolution, record output would often get
pixelated
- there might be other distractions on screen. for example: notifications
- no way you would be able to copy-paste command from that screen-recording into
your shell.
- no easy way to share recorded output

... and many other things.

## ... the Right Way!

`asciinema` is here to rescue. ASCIINema is a command-line tool to record a shell
session. It is not just another recorder. It records ASCII characters from `stdin`,
`stdout` and `stderr` devices. And presents the output in a way that is playable
right inside the terminal.

### Features

Here, I am listing the most popular and commonly used features from `asciinema`.
For a detailed list, visit [asciinema official website](https://asciinema.org).

- record quite easily. All you need is download and install `asciinema` binary.
- easy to distribute. when you are done recording the session, you'll be asked
if you want to publish your recording to ASCIINema website. If not, save it locally.
- Embeddable. Following is a asciicast of my NeoVim config :)
{{< asciinema id="dCji7muVN6wBBcmqIAQtdLN4H" >}}
- copy and paste texts from an asciicast to terminal. this especially helps when
you don't want to type a goddamn config file from a video.
- remote ASCIINema upload server can be self-hosted.

Guess that much of features are enough to convince you :)

### Installation

Loads of ways. Using:

- **Pacman** - `pacman -Syu asciinema`
- **Debian** - `apt-get install asciinema`
- **PyPi** - `pip3 install asciinema`

more ways on [installation page](https://asciinema.org/docs/installation).

### How to use

To start recording, type `asciinema rec` and hit enter. This will spwan a new
shell window(which will obviously be recorded).

On recording finish, asciinema would ask whether you want to upload it to ASCIINema
website. If not, it will be saved locally.

`asciinema play` is capable of playing a local asciicast as well as a remote
asciicast from a URL.

`asciinema cat` spits out text available from a cast. output can be copied to
system clipboard.

## Conclusion

Far better than old-school screen-recording tools when it comes to terminal
session recording.
