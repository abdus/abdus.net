---
title: "Session Management in Vim"
date: 2020-10-26T16:22:18+05:30
draft: false
meta:
  image: https://i.ibb.co/HYtd6Bf/pipes.png
  description: # overrides .Summary
featured: false # feature a post in homepage
tableofcontents: true # whether to generate ToC
tags: [vim, neovim, editor]
categories: [tools]
---

If you ask me about the most underrated feature in Vim, my answer would be
'Session Management' straightaway! Just like any other "modern" editors, Vim
does support sessions.

![pipes](https://i.ibb.co/HYtd6Bf/pipes.png)

## What is a Session

Before I go in-depth, let me explain what exactly is a Session in Vim. Simply
put(from `:help session`): A Session keeps the Views for all windows, plus the global settings.

An example of session could be: If I have opened a project and worked for an
hour, and then closed it. My Vim session would be one hour long.

Sessions in Vim are not persistent by default. One has to make it persistent.
Most people do not know about it because they probably have never felt the
need for it.

I was one of those people who didn't feel the need for storing sessions, until
recently. And I am not ashamed of it. It just happens... mostly because, we
don't need it _yet_.

## Importance of Session

To answer the question 'How a persistent Session is Useful', let's find out what
we lack without it.

1. **Time**. Yes! Imagine, you are working on a project, and for some reason,
   you closed Vim. So when you open it again, you gotta recreate those perfectly
   sized windows, open files of reconfigure options etc.
2. **Context**. It's not easy to remember which file you were editing, the last
   time you have worked on a project.

Now, what if I say that you could boot into Vim without losing any of the
previous windows, tabs etc? not even the cursor location. That would be
great, is not it?

That's where persistent session comes into action. It enables Vim to load
the last session, much like what we see in editors like Visual Studio Code.

## Storing Sessions

There are multiple techniques one may use to handle Sessions. I will, however,
talk about the one I use.

First, I let Vim look for any existing session files. If one exists for the
current session, Vim would update it automatically when I close Vim. The Reason
I don't let Vim save Sessions for which no session file exists, because that
makes me counter-productive. For example, I needed to edit a config file, say,
`.vimrc` from my `$HOME` directory. Had I enabled auto-create session file, a
new session file for `$HOME` directory will be created, which I obviously don't
want. That session does not make any sense.

So, if a session file is not created automatically, how do I create it then? 
Well, it's really simple. I defined a command for creating new Sessions, called
`SessCreate` using [Vim Language](http://vimdoc.sourceforge.net/htmldoc/usr_41.html).
Now, I can simply call this command from inside Vim whenever I need it.

Let me show you how I did it.

### Snippet

```vim
fu! SessionCreate()
  if !isdirectory(expand("~/.vim/sessions"))
    execute "call mkdir(expand('~/.vim/sessions', 'p'))"
  endif
  execute 'mksession ~/.vim/sessions/' . split(getcwd(), '/')[-1] . '.vim'
endfunction

command SessCreate call SessionCreate()
```

### Explanation:

```vim
if !isdirectory(expand("~/.vim/sessions"))
  execute "call mkdir(expand('~/.vim/sessions', 'p'))"
endif
```

Check if a directory `$HOME/.vim.sessions` exist. If not, create it with
`execute "call mkdir(expand('~/.vim/sessions', 'p'))"`. This is the directory
where sessions are stored. An alternate location for storing session is the
project directory itself. But that is not something I want to use, as not
everyone uses Vim. So, this would be an added bloat for them.

`call` in Vim Script is uses to call a function. `mkdir()` is used to create a
new directory. `p` is a flag that can be passed to `mkdir()` so that it creates
parent directories as and when necessary. Lastly, `expand()` is used to expand
any Shell expandables. Here, it converts `~` to `/home/username`.

```vim
execute 'mksession ~/.vim/sessions/' . split(getcwd(), '/')[-1] . '.vim'
```

`mksession` is a built-in command for creating session from current Vim state.
It saves the created session in `~/.vim/sessions/DIR_NAME.vim`. Here, the
`DIR_NAME` is the working directory where Vim is opened. So, session for
`~/Projects/github/awesome-vim` would be saved into
`~/.vim/sessions/awesome-vim.vim`.

### Saving a Session in Existing Session File

Now, it's time for some automation. Check out the following code snippet:

```vim
fu! SessionSave()
  if filewritable(expand('~/.vim/sessions/' . split(getcwd(), '/')[-1] . '.vim'))
    execute 'mksession! ~/.vim/sessions/' . split(getcwd(), '/')[-1] . '.vim'
  endif
endfunction
```

This function checks whether the existing session file is writable. And save
latest session if true. That's it. The exclamation mark(`!`) is for overwriting
previous session.

### Restoring a Session

Finally, when I open Vim again, I want saved buffer(if any) to be restored.
Following function is responsible for this:

```vim
fu! SessionRestore()
  let l:session_file = '~/.vim/sessions/' . split(getcwd(), '/')[-1] . '.vim'
  if filereadable(expand(session_file))
    echo session_file
    execute 'source ~/.vim/sessions/' .  split(getcwd(), '/')[-1] . '.vim'

    if bufexists(1)
      for l in range(1, bufnr('$'))
        if bufwinnr(l) == -1
          exec 'sbuffer ' . l
        endif
      endfor
    endif
  endif
endfunction
```

Let me explain what it does exactly.

```vim
let l:session_file = '~/.vim/sessions/' . split(getcwd(), '/')[-1] . '.vim'
if filereadable(expand(session_file))
  echo session_file
  execute 'source ~/.vim/sessions/' .  split(getcwd(), '/')[-1] . '.vim'
endif
```

First, check if the file is readable. There's no point in sourcing it if Vim
can't access it. Then simply source it to Vim. That's it.

```vim
if bufexists(1)
  for l in range(1, bufnr('$'))
    if bufwinnr(l) == -1
      exec 'sbuffer ' . l
    endif
  endfor
endif
```

`bufexists()` function checks if any
[buffer](https://vim.fandom.com/wiki/Buffers) exists. `bufnr()` returns all
available buffers. ...and so on. Read more about them using `:help FUNC_NAME`
in Vim.

So, that's it. Persistent Sessions makes our life dramatically easier when using
Vim (or NeoVim, GVim whatever flavour you use).

P.S.: I am a new Vim user. I am open to suggesstions. Feel free to suggest
anything that would make use Vim in a more productive way!!
