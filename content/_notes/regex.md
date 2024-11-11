---
title: "Regular Expression"
date: 2020-08-28T00:53:22+05:30
draft: false
tags: []
categories: [misc]
sources:
  - https://github.com/ziishaned/learn-regex
---

A regular expression is a **group of characters or symbols** which is used
to find a **specific pattern in a text**.

![regex](https://raw.githubusercontent.com/ziishaned/learn-regex/master/img/regexp-en.png)

- a string literal is the simplest possible regular expression. `"str"` would
  match _**str(`s` followed by `t`, followed by `r`)**_.
- regular expression are generally **case sensitive**

## Meta Characters

- special characters. does not mean anything on their own.
- some meta character have different meaning when written inside square bracket

| meta char     | desc                                                                               |     |
| :------------ | :--------------------------------------------------------------------------------- | --- |
| **.** _(dot)_ | match any single character except for linebreak                                    |     |
| **[]**        | char class. matches any char contained between the brackets                        |     |
| **[^ ]**      | negated char class. matches any character **_NOT_** contained between the brackets |     |
| **\***        | matches 0 or more repetitions of the preceeding symbol                             |     |
| **+**         | match one or more repetitions of preceeding symbol                                 |     |
| **?**         | makes the preceeding symbol optional                                               |     |
| **{n,m}**     | match at least `n` but not more than `m` repetitions of preceeding symbol          |     |
| **(abc)**     | char group                                                                         |     |
| **\|**        | alteration. matches either the chars before or the chars after the symbol          |     |
| **\\**        | escapes character                                                                  |     |
| **^**         | beginning of the input                                                             |     |
| **$**         | end of the input                                                                   |     |

### Things to Remember

set **character range** by using **hyphen** inside character class.
Example: `/[a-z0-9]/`.

a **period inside a char set** means a literal period

**the `*` (star) with a `.` (dot)** can be used to **match any string of
characters**. Example: `.*`

braces(also called **quantifiers**) are used to specify the **number of times**
a character or a group of character **can be repeated**.
Examples:

- `[0-9]{3}` - matches _**exactly 3 digits**_.
- `[a-z]{2,}` - matches _**between 2 and unlimited**_ times
- `[A-Z]{2, 5}` - matches between _**3 and 5 times**_
