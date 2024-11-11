---
title: 'Get, Set ... Bash'
date: 2020-07-17T22:58:50+05:30
draft: true
meta:
  image: # url to image. Important for blog listing and seo
  description: # overrides .Summary
featured: false # feature a post in homepage
tableofcontents: true # whether to generate ToC
tags: ["bash", "cli"]
categories: ["linux"]
---

**Bruno Again Shell**, _aka_ BASH, is an interpreter developed by GNU Foundation.
This interpreter/shell is capable of running Linux system commands. It also
has features like loops, conditions etc which makes it quite capable of doing
scripting.

> This article is some sort of **Note to Self**. This will be an in-depth reference. I reference things from here when I am writing a BASH script.

## Running a Script

There are couple of ways to run a bash script(or any other scripts, in general).
The most popular way is, `./` followed by script path. For example, if I have a
script file inside `~/Desktop`. Assume that non-existant file name is
`set-time.sh`. Now to run that file, one may type something like
`./Desktop/set-time.sh`(again, assuming that they are inside home directory).
In response to this command, shell would execute codes available inside
`set-time.sh`.

Another way is: to actually write the script interpreter, followed by script path.
For example: `bash ~/Desktop/set-time.sh`.

## Hashbang (Shebang)

In [Running a Script](#running-a-script) section, did you think about how the
shell would know which interpreter to use? Well, that is done by a special line
of code. This line of code is known as Shebang(or Hashbang). An example of
hashbang is: `#!/bin/bash`. This is simply telling shell that: when running the
code, use `bash` program. `/bin/bash` is the path to bash interpreter.

A shebang must always be at the top of the script.

> Bash is a Shell. There are many other shells similar to Bash. A few of them are: C-Shell, Z-Shel, Fish Shell etc. Each shell have their own specifications for interpreter. They sometime may vary in features. This post is focused on Bash.

## Comments

In Bash, line with a preceeding '#' would be considered as comment(except for
shebang). Comments are for documenting a script internally, just like any
other languages.

## Variables

Variables in Bash are pretty much similar to any other languages, except for one
major difference. That is: there should be no space between variable name, `=`
and it value. An example would demonstrate it better.

```bash
#!/bin/bash

HELLO="world"    # notice that there's 
                 # no whitespace

WORLD = "hello"  # this would throw an
                 # error
```

A variablen name **does not have to be in uppercase**. It's just a convention.

### Storing Command outputs

Output of another command could as well be stored in a variable. To do so, one
has to spawn up a child-process using either `$()` or **``**. Following is an
example to illustrate the same.

```bash
#!/bin/bash

NOW=`date`
NOW_MD5=$(date | md5sum)
```

## Printing Variables/String Literals

There are two ways one could print someting to `stdout`. One is `printf` and the
other is `echo`. Both have their own features (as they co-exists).

### Echo

The familiar one. `echo` takes an input as argument and send it to `stdout`(which
is generally a terminal window). However, before sending it to `stdout`, it does
removes all newline characters from given content.

### Printf

`printf` works quite similar to `echo` except that it does not removes any newline
character.

So, in summary:

- Echo (`echo`)
  - removes newline (`\n`) character
- Printf (`printf`)
  - does not remove any newline characters

## Redirect and Pipe

### Redirect

Redirects is a way to send the **output of a command to any arbitary locations**.
For example: if I want to run date command, but don't want to print it's output
in `stdout`. I could "redirect" it to `/dev/null` using `>` operator.
Demonstration:

```bash
#!/bin/bash

date > /dev/null
```

Apart from `stdout`, `stdin` and `stderr`, redirect could send output to files
as well. Hint: It will create the file if it does not exists.

> `/dev/null`, _a.k.a._ "the blackhole", is a special device in GNU/Linux. Whatever you redirect to this location, would get vanished ... just like anything that goes inside a blackhole.

### Pipe

Pipe is used to send **output of one command to be used as input of another**.
`|` is knwon as the Pipe operator.

**Example**: I have a csv file containing names of all my classmates along with their
address. And I need to print address of a given name to `stdout`. But before that,
I need to replace `,` with `=`. How do I do that? Let's see.

```bash
#!/bin/bash

FILE=path/to/file.csv
REPLACE_CHAR=","
NAME_TO_FIND="Rickard"

cat $FILE \
| tr $REPLACE_CHAR "|" \
| grep --color="always" -i $NAME_TO_FIND
```

Nothing much is going on in this script. First, I read the content of file `$FILE`
using `cat` utility command, then I **pipe** the output to `tr`, which ***essientially***
replaces all comma characters with equal sign.

## Logical Operators

`&&`, `||`, `!` etc are known as **logical operators**. How these operators 
work, could be demonstrated by using circuit gates and truth-table.

`&&`(_a.k.a_ AND) **executes the right hand side expression only when the left
hand side expression evalutes to true**. Similarly, `||` (_a.k.a_ OR) would
execute left hand side. **If LHS evalutes to `false`, it would execute the
right  hand side expression**. `!` (_a.k.a_ NOT) would simply **invert a
given boolean value**.

## Control Flows

BASH provides conditionals out-of-the-box. Following are some example of `if`,
`if..elif` etc. There's nothing much to discuss about. If I find out any
interesting edge cases, I will update them later on. For now, look at following
codeblock to know about control-flows:

> Bash treats empty strings as falsy value, much like any other sane language.

### `if`, `if..else` and `if..elif`

```bash
#!/bin/bash

NAME="abdus"

# if statement
if [[ $NAME == "abdus" ]];
then
  echo "Hello, $NAME";
fi

# if..else
if [[ $NAME == "azad" ]];
then
  echo "Won't be printed"
else
  echo "Hello, $NAME"
fi

# if..elif
if [[ $NAME == "hey" ]];
then
  echo "Not a Name"
elif [[ $NAME == "azad" ]];
then
  echo "That's Last Name"
else
  echo "Hello, $NAME"
fi

# Note that one does not have to put
# double square bracket around the 
# condition all the time. TODO: write
# how both are different
```


## Loops

Loops are a language feature which enables programmer to do a task repeatedly.
Bash have four kind of loops, namely `for`, `while`, `until` and `select`.

### TODO: Write about `break`, `continue` etc

### `for` Loop

For a given list, a for loop would go through each item and execute the enclosed
code in loop's body. Example:

```bash
#!/bin/bash

# VARIATION: 1
# this script would list 
# output of ls command 
# separated by newline
for item in `ls`;
do
  echo "NAME :: $item"
done

# VARIATION: 2
# this would output given
# array-like input
for item in shell scripting is cool
do
  echo "$item"
done
```

### `while` Loop

### `until` Loop

### `select` Loop
