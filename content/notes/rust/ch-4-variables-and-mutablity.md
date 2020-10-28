---
date: 2020-04-20T20:27:47+05:30
title: Variables and Mutablity
categories: [rust]
---

> In Rust, Variables **are Immutable** by default.

## Demo Program

### Immutable

```rs
// This program won't compile because
// the value of `x` has been changed after
// the first declaration(without using `mut`)

fn main() {
  let x = 5;
  println!("Value of X is {}", x);

  x = 15;
  println!("Value of X is {}", x);
}
```

### Output of `cargo run`:

```sh
$ cargo run
Compiling variables v0.1.0 (/home/crow/Dev/rust/sources/variables)
error[E0384]: cannot assign twice to immutable variable `x`
 --> src/main.rs:4:5
  |
2 |     let x = 5;
  |         -
  |         |
  |         first assignment to `x`
  |         help: make this binding mutable: `mut x`
3 |     println!("Value of X is {}", x);
4 |     x = 15;
  |     ^^^^^^ cannot assign twice to immutable variable

error: aborting due to previous error

For more information about this error, try `rustc --explain E0384`.
error: could not compile `variables`.

To learn more, run the command again with --verbose.
```

### Mutable

```rs
fn main() {
    let mut x = 5;
    println!("The value of x is: {}", x);
    x = 6;
    println!("The value of x is: {}", x);
}
```

### Output of `cargo run`

```sh
$ cargo run
Compiling variables v0.1.0 (/home/crow/Dev/rust/sources/variables)
    Finished dev [unoptimized + debuginfo] target(s) in 0.38s
     Running `target/debug/variables`
Value of X is 5
Value of X is 6
```

## Mutating a Value

In order to change the value of a variable after it's been declared, one needs to use `mut` keyword along with `let`. For example: `let mut foo = 'bar'`.

## Constants

```rs
const MAX_POINTS: u32 = 100_000;
```

In Rust, immutable variables may look like a constant, but in real, they are not. There is a little difference between variables and constants. They are:

1. Declared using `const` keywords, instead of `let`.
2. Data Type must be annotated while declaring
3. Constants are **always immutable**.
4. Unlike variables, constants can be declared in any scope.
5. Constants may only be set to a constant expression, not the result of a function call or any other value that could only be computed at runtime.

## Variable Shadowing

Shadowing is the process of redeclearing a already decleared variable. Shadowing does not assign a new value to the previous variable, but creates a new variable of the same name and assigns a value to it. So, **shadowed variable can have different data types**.

```rs
// Shadowing example
fn main() {
    let x = 5;
    let x = x + 1;
    let x = x * 2;

    println!("The value of x is: {}", x);
}
```

Shadoing is **different** from making a variable `mut`, as a mutated variable can be reassigned a new variable of same data-type. But shadowed variables can be assigned a new value of different data-type than original variable.

Following block is allowed in Rust, because the `spaces` variable is being shadowed. So, the first instance of `spaces` is dropped from memory as soon as the second instance is decleared.

```rs
let spaces = "   ";         // type: string
let spaces = spaces.len();  // type: unsigned 32bit integer
```

But this block is not allowed, as the variable is being mutated. Hence, the data-type of reassigned value must match the data-type of previous value.

```rs
let mut spaces = "   "; // mutated
spaces = spaces.len();  // error[E0308]: mismatched types
```
