---
title: "Fixing PIP Issue in Arch Linux"
date: 2020-04-01T22:43:30+05:30
draft: false
categories: ['linux',]
tags: ['pip', 'arch-linux', 'pacman', 'python']
---


Recently, I was upgrading Arch Linux on my laptop. And I encountered something
unusual with `pip` and its libraries. Everything related to pip(and pip itself)
can not be upgraded in anyways!

The problem wasn't new to me. I knew what I am doing wrong. I was using pip to
install package on system-level. So, obviously, pacman was not owning it.
So, the easiest solution for me was to delete files that are not owned by
pacman and blocking the upgrade process. And I did! I was quite sure about this,
because a while ago, I faced a similar issue for installing npm packages
on system level using sudo.

Phew! Successfully installed upgrades!!

But, the issue was not completely gone! The other day, I needed python for
running some scripts(with external dependency libraries).
So, I needed to use pip to install package.

Now, because I deleted some files(or probably all of them) from
`/usr/lib/python3.8/site-packages` directory during the upgrade process,
I was getting an error saying that, package `six` not found.

I tried reinstalling pip, did not work. Removed pip and installed again,
did not work either. I was little bit worried by now .. lol.
Because, I don't really know much about python world. Neither searching google
was quite helpful. I mean, I literally knew what was wrong,
and yet I couldn't do anything.

## Reinstalling Everything Worked!

Yeah! It. Just. Worked!! Now, finally I can use `pip` instead of `pip2` .. haha

To do a full system reinstall, one do it like this on Arch Linux:
`pacman -Qnq | sudo pacman -S -`. It is safe! No worries about that.

## Points to Remember

1. Don't use `sudo` to install packages with anything other than pacman.
2. Store pip packages in user's directory instead of any system-level
locations(like `/usr/lib` etc)
3. Always use `pip` with the `--user` flag.
Example: `pip install <package_name> --user`
4. `lostfiles` in AUR is an useful application for filtering packages not owned
by pacman.

Good Day!!
