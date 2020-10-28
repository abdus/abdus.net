---
title: 'String in Rust'
date: 2020-08-12T10:09:17+05:30
draft: false
tags: [string, string, collection]
categories: [rust]
sources:
  - https://doc.rust-lang.org/book/ch08-02-strings.html
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

in the core language, Rust provides _only one type of string_: `str`, which is
often seen in its borrowed form `&str`.

Rust's standard library provdes another type: `String`. this type is **growable**,
**owned** and **mutable**.

### creating new String

```rust
let s1 = "some string".to_string(); // create string from literals
let mut s = String::new(); // creates an empty string
let s2 = String::from("initial content"); // initialize with a value

// strings are utf-8 encoded. it can include any
// properly encoded data
let hello = String::from("नमस्ते");
```

### updating string

```rust
// using .push_str() method
let mut s = String::from("foo");
s.push_str("bar");


// push a char using .push() method
s.push('l');


// concate with + and format!() macro
let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2; 
// note s1 has been moved and can no longer be used

format!("{}{}", s1, s2);
```

- `push_str()` method **does not take** ownership.
- characters are enclosed in **single quotes** (`'`)
- indexing of string would not work as expected. when indexing, Rust **returns
  bytes** instead of character.

### Bytes, Scalar values and Grapheme Clusters

example string: "नमस्ते"

- bytes: `[224, 164, 168, 224, 164, 174, 224, 164, 184, 224, 165, 141, 224, 164, 164, 224, 165, 135]` (vector of `u8` values)
- scalar values: `['न', 'म', 'स', '्', 'त', 'े']` (six `char`)
- grapheme clusters: `["न", "म", "स्", "ते"]` (four "letters")

### accessing elements in a string

String values can be accessed with a `for` loop.

```rust
// print elements as char
for c in "नमस्ते".chars() {
  print!("{} ", c);
}
// prints: न म स ् त  े

// print elements as bytes
for b in "नमस्ते".bytes() {
  print!("{} ", b);
}
// prints: 224 164 ...... 165 135
```

Rust's standard library *__does not implement__* functionality for getting
grapheme clusters. external libraries does.
