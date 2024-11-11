---
title: "NeoMutt: the Command Line Email Client"
date: 2020-10-20T14:07:39+05:30
draft: false
meta:
  image: https://i.ibb.co/rFj4XY0/pipes.png # url to image. Important for blog listing and seo
  description: # overrides .Summary
featured: false # feature a post in homepage
tags: [mutt, email]
categories: [tools]
---

Mutt is a command-line email client which can connect to IMAP/POP3 and SMTP
protocols as well as read emails from local directories.

![https://i.ibb.co/rFj4XY0/pipes.png](https://i.ibb.co/rFj4XY0/pipes.png)

So, how do I stumbled upon it? I am trying to optimize my workflow. Having to
click around a GUI-based email client isn't my thing. So, I look for
alternatives.

Why Mutt? because Mutt features a keybinding which is similar to Vim. This
means, a single set of shortcuts would work pretty much everywhere.
Although I am using NeoMutt, things are pretty much the same in both.

> All mail clients suck. This one just sucks less.

Here I am going to document how I set-up Mutt from Scratch!

## Install

Mutt and NeoMutt are available in official repositories of most of the Linux
distribution. I am using Arch Linux, so I just needed to run
`sudo pacman -Syu neomutt`. You don't need to install additional packages to
get Mutt working.

One more thing, I am using NeoMutt to get access to some extra features Mutt
does not provide by default. There are not many differences in UI and
functionalities.

## Config files

Neomutt stores system-wide config inside `XDG_CONFIG_DIR`(which is essentially
`/etc/xdg/neomutt`). For per-user configs, Neomutt uses one of the following
locations:

- `~/.muttrc`
- `~/.mutt/muttrc`
- `~/.config/mutt/muttrc`
- `~/.neomuttrc`
- `~/.neomutt/neomuttrc`
- `~/.config/neomutt/muttrc`

A Mutt config file generally includes a couple of sections. Let's start with
the essential ones.

### The 'user' configs

```bash
set realname = 'YOUR NAME'
set from = 'YOUR EMAIL'
set use_from = yes
set signature = "~/.mutt/signature"
```

First three fields are pretty much self-explanatory. The `signature` is a text
file which contains my email signature and will be appended to emails I compose.

This `signature` field can store commands as well. For example: setting it to
`set signature = "fortune |"` would print a random\* message as my signature.
Notice that pipe character(`|`) at the end. This tells Mutt that the value is
a command, and not a file path.

---

\* for this to work, a package called `fortune-mod` is needed to be installed

---

### IMAP config

IMAP/POP3 protocol is used to read remote mailboxes. The primary difference
between IMAP and POP3 is: POP3 stores emails locally and delete them from
server. IMAP is just the opposite. Following is how to configure IMAP:

```bash
set imap_user = 'EMAIL ADDRESS'
set imap_authenticators="oauthbearer"
set imap_keepalive = 300
set mail_check = 120
unset imap_passive  # open a new IMAP connection automatically
set imap_oauth_refresh_command="OAUTH_HANDLER_COMMAND"
```

Again, there are not many things to explain in this section (except for that
`imap_oauth_refresh_command`). Since Gmail(GSuite) discourages creating **an app
passwords** and allowing **less secure apps**, I am using a method called
**OAuth2** to authenticate my address. More information on how to connect to
Gmail with OAuth2 is [available here](https://github.com/google/gmail-oauth2-tools/wiki/OAuth2DotPyRunThrough)

If you are using password-based authentication, you can mention a field called
`imap_password` and put your password as its value. Otherwise, leave it blank.
Mutt would as you for a password every time you try to log in.

FYI, IMAP stands for Internet Message Access Protocol and POP3 stands for
Post Office Protocol.

### SMTP config

Simple Mail Transfer Protocol, a.k.a SMTP, is the protocol used for sending
emails. (yes, we have two different protocols for sending and accessing email).

```bash
set smtp_url = "smtp://SMTP_URL:587"
set ssl_starttls = yes
set ssl_force_tls = yes
set smtp_authenticators="oauthbearer"
set smtp_oauth_refresh_command="OAUTH_HANDLER_COMMAND"
```

Here, `ssl_force_tls` and `ssl_force_tls` are responsible for enforceing a TLS
connection as it's more secure.

### Sidebar

I have a sidebar for accessing all my GMail folders easily. You don't have to
enable one if you don't want to. Just skip the following config block.

```bash
set sidebar_visible
set sidebar_format = "%B%?F? [%F]?%* %?N?%N/?%S"
set mail_check_stats
bind index,pager B sidebar-toggle-visible
```

Setting `sidebar_visible` would render the sidebar window(or whatever you call
it).

`mail_check_stats` basically fetches email stats (example: read/unread etc).

### Remote Folders

Note that `mail_check_stats`. This is extremely important if you are enabling
sidebar or want to access remote folders within Mutt. I wasted a couple of hours
to find out why Mutt was unable to find my remote folders :/
Remote mailboxes can be controlled using `mailboxes` as well.

And the last line is a keybinding responsible for toggling view of the sidebar.

## Signature

With Mutt, you can define a custom signature which would be appended to all new
emails. To add a new signature, open config and add a new line:
`set signature = "~/.mutt/signature"`. Here, `.mutt/signature` is the file I am
using to store my plaintext signature which looks something like this:

```txt
Regards,
Abdus

public key: https://abdus.xyz/keys
fingerprint: C8FF EB39 66E3 7BA3 DFD8
```

Of course, it could be any arbitrary text file(as long as the file is readable by
current user)

## Colors

Mutt comes with a dull colorscheme. That's not even a colorscheme, just white
text on a black background. Luckily, the user can modify it to their liking.

I would recommend choosing a pre-written colorscheme for your Mutt. Or if you
choose to write your own, feel free to read up documentations on Mutt website :)
[See this link](https://github.com/neomutt/neomutt/issues/340).

Sidenote: Colors could be directly added into `muttrc`, but it is a good
practice to keep colorscheme config in a separate file and then import them into
`muttrc`.

If you ask me for colorscheme suggestions, I would gladly suggest Dracula and
Gruvbox. They are two best colorscheme for Mutt(or for anything, in general) out
there.

- [Gruvbox](https://www.sthu.org/code/codesnippets/mutt-gruvbox.html)
- [Dracula](https://github.com/dracula/mutt)

## Keybindings

I think keybinding is what makes a command-line application great! Mutt, out of
the box, features a Vim-like keybinding which already gives us a reason to
like Mutt. `hjkl` is `<3`!

Apart from default keybindings, the user could add custom bindings as they like.
It's very simple to add a new key-binding. `bind` is the keyword used to define
a new binding.

```muttrc
# keybinding for toggling sidebar. honestly, this is the only
# custom binding I have right now.
bind index,pager B sidebar-toggle-visible
```

It's possible to define keybindings right inside `muttrc`. But you should move
them to a separate file when they grow bigger.

## Rendering HTML Emails

By default, mutt is not capable of showing HTML emails. It is a plaintext email
client. So, rendering HTML emails won't make much sense.

However, HTML emails can be rendered using third-party clients, for example:
`lynx`, `links` or any other software which renders HTML. A browser would also
work.

To configure mutt to show HTML emails, create a file called `.mailcap` in home
directory with following lines in it:

```mailcap
# brave is my default web-browser
text/html;                      brave %s; nametemplate=%s.html;
# links is a command-line web-browser
text/html;                      links -dump %s; nametemplate=%s.html; copiousoutput
```

Then, in `muttrc`, add this line: `auto_view text/html`. Now, Mutt will
use `.mailcap` file to render HTML attachments using appropriate programs.

## Composing an Email

To compose an email, press `m`. Fill-up `To:` address, `Subject:` line and other
necessary pieces of information. Once you do it, Mutt will drop you in the
editor you've chosen to write the email. If you have set a signature before,
you will see it here.

When done writing the mail, save and exit from the editor. Mut will allow you to
do final changes/adjustments. In this window, press `y` to send the email.

To change the default editor for composing an email, add/change this line in `muttrc`:
`set editor=whatever`.

## Encrypting/Signing Messages

Signing emails with a public key comes built into Mutt. There's not much set
up to be done, except for you need a pair of PGP keys
(I won't cover how to generate a PGP key-pair. Google it up).

Once you are done composing email, press `P`(essentially stands for PGP). You
will see available PGP actions at the bottom of the window. Just use whatever you
need.

That's it!
