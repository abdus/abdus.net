---
date: 2020-04-22T16:51:40+05:30
title: Functions
tags: ['functions']
categories: [rust]
---

Functions are block of codes which are instructed to accomplish specific task(s).

To write a function, the `fn` keyword is used, followed by function name.

> By convention, `snake_case` is used while naming a function.

## Parameters

Functions can accepts parameters, which are special variables that are part of a function’s signature. Parameter names are followed by a type name.

```rs
fn main() {
  another_function(32);
}

fn another_function(x: i32) {
  println!("{}", x);
}
```

## Function Body

Whatever resides inside the curly braces after function name, called as function body. Function body is consists of expression and statement.

**Statement**: Statements are instructions that perform some action and do not return a value.

**Expression**: Expressions evaluate to a resulting value. Expressions **should not** end with a semicolon. Example:

```rs
fn main() {
  let x = 5;

  let y = {
    let x = 3;  // Ends with a semicolon
    x + 1       // no semicolon
  }

  // `y` evaluates to `4`, which is a return value
}
```

## Function Return

> In Rust, the return value of the function is synonymous with the value of the final expression in the block of the body of a function.

In order to return a value from a function, user need to write a type after an arrow (`->`).

User could return early from a program using the `return` keyword.

```rs
fn five() -> i32 {
  5
  // `5` would be returned as it's the final expression
  // putting a semicolon after `5` would throw an error:
  // error[E0308]: mismatched types
  // because semicolon made it a statement; and statement returns nothing
  // so the return type of function mismatched with what was actually returned,
  // which is basically nothing
}

fn main() {
  let x = five();

  println!("Value of x is {}", x);
}
```

## Returning multiple values with tuple

In Rust, tuples could be used to return multiple values.

```rust
fn main() {
  let string_a = String::from("Hello, world");
  let (string_b, len) = claculate_len(string_a);

  println!("{} {}", string_b, len);
}

fn claculate_len(s: String) -> (String, usize) {
  let length = s.len();
  (s, length)
}
```
