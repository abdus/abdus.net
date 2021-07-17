---
date: 2020-06-03T12:48:31+05:30
title: "Concise Control Flow with if-let"
tags: ["control-flow", "match"]
categories: [rust]
---

`if let` syntax allows to write `if` and `let` togather in a less verbose way
to handle values that match one pattern while ignoring the rest.

Example:

```rust
let some_var = Some(0u8);
match some_var {
    Some(3) => println!("three"),
    _ => (),
}
```

can be written as:

```rust
if let Some(3) = some_var {
    println!("three");
}
```

> `if let` is a syntax sugar for `match` that runs code when the value matches
one pattern and then ignores all other values.

An `else` block could as well be attached into `if let`. This `else` block
would work like a wildcard, i.e.`_` in `match` can be replaced by `else` in
`if let`.

Example:

```rust
let mut count = 0;
if let Coin::Quarter(state) = coin {
    println!("State quarter from {:?}!", state);
} else {
    count += 1;
}
```
