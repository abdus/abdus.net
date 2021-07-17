---
date: 2020-05-20T09:30:00+05:30
title: Structures
tags: ['structures', 'struct']
categories: 
  - rust
---

Structures(`struct`) are compound(and user-defined) data types. Structures are much similar to tuples, except that data can named. Structures can be set as a return type in a function.

## Defining a Struct

Structures are defined using the keyword `struct`. Example:

```rs
struct Person {
  name: String,
  age: u64,
  sex: karwa_do,
}
```

## Instantiating Structs

In order to create a new instance of an Structure, one has to call that structure with concrete values. Example:

```rs
fn main() {
  let person1 = Person {
    name: "Jon",
    age: 632,
    sex: "male",
  }
}
```

## Accessing and Mutating values

Dot notation could be used to access a specific value. A structure must be declared as mutable if it needs to be mutated on a later stage. Individual values can't be mutated. Example:

```rs

Person {
  name: String,
  age: u64,
  sex: String,
}

fn main() {
  let mut person1 = Person {
    name: "Jon",
    age: 632,
    sex: "male",
  };

  person1.name = String::from("Jon Snow");
  println!("Name is {}", person1.name);
}
```

## Other Useful Things

1. If function parameter and `struct`'s property name is same, the value part could be omitted. For example, `let p1 = Person{ name }`(assuming that `name` is a function parameter).

2. **Struct update syntax** can be used to copy property from another instance of the same `struct`. For example:

```rs
fn main() {
  let p1 = Person {
    name: "Jon",
    age: 32,
    sex: "male",
  };

  let p2 = Person {
    name: "Tormund",
    age: 40,
    ..p1  // this would copy the value of
          // p1.age to this instance
  }
}
```

## Tuple Struct

Tuple struct looks similar to tuples. Unlike tuple, tuple struct does have a name.

```rs
struct Color(i32, i32, i32);

let black = Color(0, 0, 0);
```

## Example Code Snippet using Struct

```rs
#[derive(Debug)]
struct Rectangle {
    width: i32,
    height: i32,
}

fn main() {
    let r1 = Rectangle {
        height: 30,
        width: 20,
    };

    println!("Rectangle is {:#?}", r1);
    println!("Area is {}", area(&r1));
}

fn area(dimension: &Rectangle) -> i32 {
    dimension.height * dimension.width
}
```

**Note:**

1. By default, `println!` mecro can not print structures. A formatter `:?`(`:#?` for pretty print) should be added. Example: `println!("Rectangle is {:#?}", struct_instance);`

2. `#[derive(Debug)]` - Implements `std::fmt::Debug` in `struct Rectangle`. Without this method, above formatter won't work.

3. `&Rectangle` is used so that the `main` function can keep the ownership of `r1` instance.

> Structures could be anonymous as well as named. For example:

```rs
enum Rect {
  Dimension {
    height: u32,
    width: u32,
  }
}
```

`Rect::Dimension` is an anonymous struct
