---
title: "Registers in Vim"
date: 2020-07-26T08:55:22+05:30
draft: false
tags: [vim, neovim, editor]
categories: [tools]
sources:
  - https://www.tutorialspoint.com/vim/vim_registers.htm
  - https://www.brianstorti.com/vim-registers/
---

- Registers in Vim are simply **different locations** where Vim could store texts.
- a register can be accessed by using `"` as prefix. For example: key `"r` can 
access register `r`.

What content a register is currently holding, can be revealed by using command
`:reg <name of register>`. Without the name, `reg` command would list all
registers filled with certain data.


### Register Operations

- **yank** to register `x`: `"xyw`
- **delete** to register `d`: `"ddw`
- **put** from register `a`: `"ap`

### Types of Registers

There are ten types of register vim comes with. Here are some of the most
important ones.

- **unnamed register**
- **named register**
- **numbered registers**
- **blackhole register** (`"_`)
- **read-only registers**
- **expression register**(`"=`)
- **search register**

#### Unnamed Regist

vim have a default registers, which is used if the commands are not prefixed
with a register name. This register is known by the name **unnamed register**.
This register can be accessed with `""`. This register would always contain the
latest yanked/deleted texts.

#### Named Registers

There are **26** named registers. By default, they are not being used by Vim.
To use, say `a` register, one should **prepend command with `"a`**. For example:
`"adw` (delete a word and store in `a` register).

There are two ways to use named register. If one uses small caps alphabet, the
content which was **previously stored in it, would be overriden**. In case of
**capital letter**, the **content would be appended**.

#### Numbered Register

Denoted by numbers _0_ to _9_. These registers stores previously yanked and
deleted content. Register **0 would store the latest yank**. And register **1 to 9
would store the last 9 deleted texts**(even after shutdown and reboot). 1 being
the latest and 9 the oldest delete.

> One does not loose yanked/deleted texts in vim. They just don't know where to
look for it!

#### Blackhole Register

Black Hole Register is a register which does not stores anything. Whatever
is directed to this register, would get vanished. This register is denoted by
**`_`**(`"_d` would completely delete a word. obviously, can be brought back
using `u`).

#### Read-only Registers

As the name suggests, they can't be used by user for the purpose of storing
arbitary texts. There are 4 read-only registers: 

- `".`: Stores the last inserted texts.
- `"%`: Stores the current(relative) file path
- `":`: Stores most recently executed command. Goes quite handy with _@_(command
runner. example, _@:_)
- `"#`: stores the (relative) location of [alternate file](#TODO) for current
window.

#### Expression Register

This register stores the value of an expression. When **`<C-r>=` is pressed in
insert mode**, a `=` sign would show up in command line. **Any expression run in
command line would be stored in expression register** (`"=`).

Example: `<C-r>=system('ls')` would write down the result of `ls` under
cursor-line, and store the command in `=` register.

#### Search Register

Stores the latest search term searched with `/`, `?`, `*` or `#`. Useful when one
needs to re-type a complex term or RegEx. Can be accessed using `<C-r>X`(where *X*
is `/`, `?`, `*` or `#`).


---

Source: 
1. [Vim registers: The basics and beyond](https://www.brianstorti.com/vim-registers/)
2. [Vim - Registers](https://www.tutorialspoint.com/vim/vim_registers.htm)
