---
date: 2020-04-22T17:13:47+05:30
title: Control Flow
tags: ['control-flow', 'if', 'if-else']
categories: [rust]
---

## if, if else, else if

An `if` expression allows you to branch your code depending on conditions.

```rs
fn main() {
  let num: i8 = 2;

  if num < 5 {
    println!("Number is Samll");
  } else if num % 2 === 0 {
    println!("Divisible by 2");
  } else {
    println!("Number is Big");
  }
}
```

> In Rust, condition must resolve to a value of type `bool`, i.e. either `true` or `false`. Otherwise the program won't compile.

## let in if Statement

```rs
fn main() {
  let isTrue = true;
  let aNumber = if isTrue {
    5   // no semicolon
  } else {
    10  // no semicolon
  }
}
// also, data type should be same for each if-else
// block
```

Since `if` is an expression, it can be assigned to variable. But it is also worth mentioning that the data type of all the `if`, `else` blocks. Otherwise the following error would occur:

```sh
error[E0308]: if and else have incompatible types
```

## Loops

### loop

```rs
fn main() {
  let mut counter = 0;
  let value = loop {
    counter += 1;

    if counter == 10 {
      break counter * 2; // here, semicolon needed
    }
  }

  println!("Value is {}", value);
}
```

`loop` is a keyword used for running an infinite loop. This `loop` could be ended using `break` keyword.

> `loop` is capable of returning value. Any expression/value placed after `break` keyword would be returned.

### while

`while` is a conditional loop built-in to Rust.

```rs
fn main() {
  let mut number = 3;

  while number != 0 {
      println!("{}!", number);

      number -= 1;
  }
}
```

Using `while` loop as a replacement of `for` loop would result in slow execution of code, as compiler would add runtime code for checking `checking index out of bound` error.

### for

```rs
fn main() {
  let a = [1, 2, 4, 5, 6];

  for element in a.iter() {
    println!("{}", element);
  }
}
```

Given an array of items, a `for` loop would iterate over each of them and pass the value to defind variable. In above case, `element`.

```rs
fn main() {
  for number in (1..4).rev() {
      println!("{}!", number);
  }

  println!("LIFTOFF!!!");
}
```

## Related Code

1. `sources/temp-conversion.rs`
