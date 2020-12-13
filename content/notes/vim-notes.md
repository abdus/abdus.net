---
title: "Some Notes on Vim"
date: 2020-12-13T11:29:00+05:30
draft: false
tags: [vim, neovim, editor]
categories: [tools]
sources: []
---

<!--

::Annotation Guide::
~~~~~~~~~~~~~~~~~~~~

* `em` is the modifier

1. em (_text_) - blue underline
2. strong (**text**) - yelow highlight
3. del (~~text~~) - red strike-through

4. em > em (_*text*_) - blue circle
5. em > strong (_**text**_) - lawngreen box
6. em > del (_~~text~~_) - red cross-off
-->

Some notes on Vim window management, Tab Management and Other Stuffsa..

### Window Management

a window in Vim is the viewport for a buffer. following are a few useful window
management command:

|  Key Binding   | Action                                          | Command        |
| :------------: | :---------------------------------------------- | :------------- |
|   `<C-w> o`    | close all windows except the current one        | `:on`, `:only` |
|    `<C-w q`    | close focused window                            |                |
|      `ZZ`      | close focused window after saving changes       |                |
|      `ZQ`      | close focused window without saving changes     |                |
|    `<C-w v`    | split window vertically                         | `:vsplit`      |
|    `<C-w s`    | split window horizentally                       | `:split`       |
| `<C-w H/J/K/L` | move window to a direction                      |                |
| `<C-w h/j/k/l` | switch between windows                          |                |
|   `<C-W> f`    | split the window and edit filepath under cursor |                |

- `a/file/path.md 20`: when the cursor is on filepath, pressing `<C-W F` would
  open the filepath in a split window and jump to line number(`20` in this case)

### Tab Management

a Tab in Vim holds one or more windows. multiple Tabs can be open to holds
windows. In other words, windows can be grouped together by their relevance.

| Key Binding | Action                                        | Command                 |
| :---------: | :-------------------------------------------- | :---------------------- |
|             | open a Tab                                    | `:tabe[dit]`, `:tabnew` |
|             | close a Tab                                   | `:tabc[lose]`           |
|             | open a filepath in new tab                    | `:tabe FILEPATH`        |
|             | close all tabs except for the focused one     | `:tabo[nly]`            |
|    `gt`     | go to next tab page                           |                         |
|    `gT`     | go to previous tab page                       |                         |
| `<C-W> gf`  | open the filepath under cursor into a new tab |                         |
|             | go to previous tab                            | `:tabp`                 |
|             | go to next tab                                | `:tabN`                 |
| `[count]gT` | go to [count] tab                             |                         |
|             | go to first tab                               | `:tabfir[st]`           |
|             | go to last tab                                | `:tabl`                 |
|             | list open tabs                                | `:tabs`                 |

- `:tabnew` and `tabe` command can be prefixed with `+`, `-`, `0`, `$` to open
  Tabs at desired locations
- `a/file/path.md 20`: when the cursor is on filepath, pressing `<C-W gF` would
  open the filepath in a new tab window and jump to line number(`20` in this case)
