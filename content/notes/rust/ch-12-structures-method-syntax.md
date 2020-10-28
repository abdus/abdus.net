---
date: 2020-05-24T10:34:27+05:30
title: 'Structures: Method Syntax'
tags: ['structures', 'struct', 'method']
categories:
  - rust
---

Methods are smiilar to function. Unlike functions, methods are defined within the context of a structure(or an enum or a trait object).

A method(s) is defined using `impl` keyword.

> Method's first parameter is always `self`, which represents the instance of the struct the method is being called on.

## Using Method Syntax

```rs
struct Rect {
  height: i32,
  width: i32,
}

impl Rect {
  fn area(&self) -> i32 {
    self.width * self.height
  }
}

fn main() {
  let r1 = Rect {
    height: 4,
    width: 5,
  };

  println!("Area: {}", r1.area()); // 20
}
```

In above example, `area()` is a method of `struct Rect`. `&self` is refers to the `struct` where it is defined. `&self` is passed by reference because we don't need its ownership.

A method can **accept multiple parameters**. Following is an example:

```rs
struct Rect {
  height: i32,
  width: i32,
}

impl Rect {
  fn area(&self) -> i32 {
    self.width * self.height
  }

  fn can_hold(&self, r: &Rect) -> bool {
    self.width > r.width && self.height > r.height
  }
}

fn main() {
  let r1 = Rect {
    height: 4,
    width: 5,
  };

  let r2 = Rect {
    height: 2,
    width: 3,
  };

  println!("Area: {}", r1.area()); // 20
  println!("Can Hold r2: {}", r1.can_hold(&r2)); // true
}
```

**Multiple `impl` block** to a same struct can exist. Example:

```rs
struct Rect {
  height: i32,
  width: i32,
}

impl Rect {
  fn area(&self) -> i32 {
    self.width * self.height
  }
}

imple Rect {
  fn can_hold(&self, r: &Rect) -> bool {
    self.width > r.width && self.height > r.height
  }
}
```

## Associated Functions

Associated functions are similar to methods, except that they won't have access to any instance of the `struct` they were defined in. This is because they don't accept a `self` parameter. `String::from()` is a associated function. Associated functions are called **directly on the `struct`**, unlike methods which are called upon instances.

They generally return a new instance of the `struct` they were defined in. For example:

```rs
struct Rect {
  height: i32,
  width: i32,
}

impl Rect {
  fn square(size: i32) -> Rect {
    Rect {
      height: size,
      width: size,
    }
  }
}
```
