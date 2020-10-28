---
date: 2020-06-09T19:45:17+05:30
title: "Package Management"
categories: [rust]
tags: ["package"]
---

Package management comes into play when a project gets bigger and bigger.
Dividing codes into multiple files and grouping them make a project more
maintainable.

A package can contain multiple binary crate and optionally one library crate.

Additionally, a package can help encapsulate codes that are not meant for
others to see. It can also enable scoping.

Rust's Module System:

- Packages: Cargo feature that let user build, test and share crates
- Crates: A tree of modules that produces a library or executable
- Modules and `use`: Let user contron the organization, scope and encapsulation.
- Paths: A way of naming an item, such as `struct`, function or module

## Understanding `cargo new project-name`

When user runs `cargo new project-name`, Cargo generates a couple of files
inside `project-name` directory. They are: config.toml and `src/main.rs`.

`config.toml` is the configuration file. This file contains dependancies and
other project related informations.

`src/main.rs` is the entry point for the Rust compiler. One does not have to
mention entry point in config file, as Rust treats `main.rs` as entry point
by convention. Similarly, `src/lib.rs` means the project contains a library
crate with the same name as package. There can be any number of binaries
inside `bin/` directory.

## The `mod`

`mod` token stands for module. It can be used to declare a module. A module
can host multiple modules nested inside it. Other than modules, it can
hold `struct`, functions etc.

An example:

```rust
mod front_of_the_house {
    mod hosting {
        fn add_to_wishlist() {};
    }
}
```

## Paths

Rust find the codes we want to use by path. A path can be relative or absolute.
Absolute path starts with crate name or literal `crate`.

A relative path, on the other hand, starts from the current module and uses
`self`, `super` or an indetifier in current module.

Both absolute and relative paths are followed by one or more indetifier
separated by `::`.

Example:

```rust
pub fn call_them() {
    // absolute path
    crate::front_of_the_house::hosting::add_to_wishlist();

    // relative path
    front_of_the_house::hosting::add_to_wishlist();
}
```

## Exposing Paths using `pub`

By default, a path is always private. In order to make it public, `pub` keyword
must be prepend.

Example:

```rust
mod front_of_the_house {
    mod hosting {
        fn add_to_wishlist() {};
    }
}
```

## Relative path using `super`

`super` keyword is similar to UNIX `..` operator. It refers to parent module.

## Making `enum` and `struct` public

Prepeding `pub` keyword to a `struct` or `enum` would make it public.
However, an extra step would require for making `struct` field public.
One need to prepend `pub` keyword to any field that are supposed to be public.

Example:

```rust
mod back_of_house {
    pub struct Breakfast {
        pub toast: String,
        seasonal_fruit: String,
    }

    impl Breakfast {
        pub fn summer(toast: &str) -> Breakfast {
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }
}

pub fn eat_at_restaurant() {
    let mut meal = back_of_house::Breakfast::summer("Rye");

    meal.toast = String::from("Wheat");
    println!("I'd like {} toast please", meal.toast);
}
```

## The `use` Keyword

`use` keyword brings function, `struct` etc into the scope where it is being
called from. Example: 

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use front_of_the_house::hosting;

hosting::add_to_waitlist();   // this will refer to module `front_of_the_house`
```

It is wise to call parent(or a location) which clearly explains where the said
variable is defined, instead of just the associated function.

```rust
use front_of_the_house::hosting::add_to_waitlist; // not good
use front_of_the_house::hosting; // good. now we know where it is defined
```

Apart from that, bringing same two or more types with same name into scope
requires to call their parent modules.

```rust
use std::fmt;
use std::io;

fn function1() -> fmt::Result {}

fn function2() -> io::IoResult<()> {}
```

## The `as` keyword

`as` keyword can rename a module so that things does not conflict with each
other.

```rust
use std::fmt::Result;
use std::io::Result as IoResult;

fn function1() -> Result {}

fn function2() -> IoResult<()> {}
```

## Re-exporting an imported name

When bringing in a name into scope using `use`, the name is private to current
scope. This name could be re-exported for external codes to call it.

```rust
pub use crate::front_of_the_house::hosting;
```

In above example, anything that is attached to `hosting` that is public,
would become available for external codes to call.

## Using external packages

In order to use an external crate from crates.io, one needs to define it in
`Cargo.toml` file. When building the project, `cargo` automatically downloads
all mentioned crates from `Cargo.toml` and adds them to project.

```toml
// Cargo.toml
[dependencies]
rand = "0.5.5"
```

Calling `rand` in code:

```rust
use rand::Rng;

fn main() {
  let number = rand::thread_rng().gen_range(1, 101);
}
```

## Using nested paths

Different varient of `use` keyword can be used to reduce `use` list.

```rust
// SAME PREFIX

// this ...
use std::cmp::Ordering;
use std::io;

// can be written as ...
use std::{cmp::Ordering, io};



// ELIMINATE COMMON PART

use std::io;
use std::io::Write;
// to
use std::io::{self, Write};
```

## Glob Operator (`*`)

Glob operator bring every public names into scope.
Example: `use std::collections::*;`
