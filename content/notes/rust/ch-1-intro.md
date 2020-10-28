---
title: Intro to Rust
date: 2020-04-19T13:56:28+05:30
categories: [rust]
---

> Rust is a statically typed language backed by Mozilla. Rust have no built-in garbage-collection mechanism, yet it gives the maximum possible security to memory leaks.

## 1. The `fn` Keyword

`fn` is a reserved keyword in Rust. It's used for declaring a function.

## 2. The `main()` function

```rs
fn main() {

}
```

`main()` function is the entry point of any Rust program. Execution of codes start from here. `main()` function nerither accepts parameter, nor returns anything.

## 3. The `println!` macro

```rs
fn main() {
  println!("string");
}
```

`println!()` macro is used to print a line to the console. Note the exclamation mark(!) at the end. This is what separates macros from regular functions.

## _Ahead of Time_ Compilation

Rust is an _ahead-of-time_ compiled language. This means, any user having a binary of Rust source-code, could run it even without having the Rust envirnment installed.

## `rustfmt`

`rustfmt` is a standardized Rust formatter. This formatter uses a predefined sets of rules to format source in order to maintain code consistency.

## Example Codes

1. `sources/hello-world.rs`
