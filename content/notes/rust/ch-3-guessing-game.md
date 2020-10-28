---
title: Guessing Game
date: 2020-04-20T10:51:15+05:30
tags: [game]
categories: [rust]
---

```rust
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the Number!!");

    loop {
        println!("Please input your guess");

        let mut guess = String::new();
        let secret_number = rand::thread_rng().gen_range(1, 200);

        io::stdin()
            .read_line(&mut guess)
            .expect("Faild to Read Line");

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Invalid Input.");
                continue;
            }
        };

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too Small!"),
            Ordering::Greater => println!("Too Big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}
```

## Explanation

### The `use` statement

```rust
use rand::Rng;
use std::cmp::Ordering;
use std::io;
```

Rust only brings a few types into global scope, by default. The rest of the types a program needs, should be brought to scope by using the `use` keyword.

Here, `rand` is an external package, `Ordering` is an `enum` for comparing two variables of same type. `Ordering` provides `Ordering:Less`, `Ordering:Greater` and `Ordering:Equal`. `io` provides methods required for input and output.

### Loop

```rust
loop {

}
```

`loop` is keyword for creating infinite loops. In the above program, it allows user to keep-on guessing until they make the correct choice.

### `let`, `mut` and `String::new()`

```rust
let mut guess = String::new();
```

`let` is a keyword for **defining variables** and assign a value to it. By default, Rust variables are immutable. They can't be changed once declared. The `mut` keyword is used for **mutating a variable** so that it could be modified in a later stage.

The `String::new()` creates an empty value of type `string`. The **`new()` after `::` is known as an associated function** of the type `String`.

> An associated function is implemented on a type, rather than on a particular instance of a Type. Some languages call this a static method.

### Getting a Random Number

```rust
let secret_number = rand::thread_rng().gen_range(1, 200);
```

Here, a random number is generated using an external package called `rand`. It is first imported using `use rand::Rng;`. `rand::thread_rng` is the perticular generator used in this example. This generator is local to the current thread and seeded by the Operating System.

Method `gen_range()` generates a random number between two given parameter.

### Adding an external package

In order to add an external package, one needs add the package name and version number in `Cargo.toml` file. Cargo follows the specifications set by `SemVer`.
match guess.cmp(&secret_number) {
Ordering::Less => println!("Too Small!"),
Ordering::Greater => println!("Too Big!"),
Ordering::Equal => {
println!("You win!");
break;
}
}

### Getting input from `stdin`

```rust
io::stdin()
  .read_line(&mut guess)
  .expect("Faild to Read Line");
```

`read_line()` method gets a string from `stdin`. The `expect()` method is used to handle possible errors.

### Mutating Parameters

By default, parameters in Rust does not mutate. If the mutation is needed, it has to be done using `mut` keyword. For rxample, `someFn(&mut someVar)`. Here, `someVar` is passed by reference.

### Variable Shadowing and Error Handling

```rust
let guess: u32 = match guess.trim().parse() {
  Ok(num) => num,
  Err(_) => {
    println!("Invalid Input.");
    continue;
  }
};
```

Variable Shadowing is **the process of redeclaring a already defined variable with a new type**. This is a unique thing allowed in Rust! Shadowing helps a programmer to save-up memory space by reusing a variable.

**`u32`** (unsigned 32 bit Integer) is the data type the string is to be converted to.

`trim()` method (of type String) on `guess` variable removes extra characters like newline, trailing space etc from a String.

`parse()` method tries to parse a number from given string. It could result in either of two values: `Ok` and `Err`.

`match` is a keyword which is used to compare the value of `parse()` method with a given `enum`. So, if the `parse()` method returns `Ok`, `Ok(num) => num,` block would be executed. Otherwise, `Err(_) => { println!("Invalid Input."); continue; }` block would be executed.

### `Less`, `Greater`, `Equal`

```rust
match guess.cmp(&secret_number) {
  Ordering::Less => println!("Too Small!"),
  Ordering::Greater => println!("Too Big!"),
  Ordering::Equal => {
    println!("You win!");
    break;
  }
}
```

`Ordering` is provided by `std::cmp::Ordering`. It is used to compare the results of two number. This is used along with `.cmp()` method which returns an `enum`.
