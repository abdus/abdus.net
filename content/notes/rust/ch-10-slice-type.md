---
date: 2020-05-20T08:47:30+05:30
title: Slice Type
tags: ['slice']
categories:
  - rust
---

> Another data type that **does not have ownership** is the slice. Slices let you reference a contiguous sequence of elements in a collection rather than the whole collection.

## Slicing an `String`

```rs
let s = String::from("Hello, world");

let hello = &s[0..5];
```

1. If the initial range index is 0(i.e. first index), it could be omitted.

2. If the last range index is 0(i.e. last index), it could be omitted as well.

For example: `&s[..]` would reference the whole string(`"Hello, world"`), instead of referencing a part of it.

> In Rust, `..` is called as range syntax.

#### A program to return first word from given string:

```rs
fn main() {
  let s = String::from("Hello, world");

  let word = get_first_word(&s);

  s.clear();  // this line would throw error as it
              // was borrowed as immutable before
}


fn get_first_word(s: &str) -> &str {
  let str_bytes = s.as_bytes();

  for (i, &item) in str_bytes.iter().enumerate() {
    if item == b' ' {
      return &s[0..i];
    }
  }

  return &s[..];
}
```

Note: When a parameter is declared as type `slice`, it would be able to accept type `String` as well as type `Slice`. But type `String` can't accept type `Slice`.
