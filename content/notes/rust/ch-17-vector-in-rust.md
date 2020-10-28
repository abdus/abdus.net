---
title: "Vector in Rust"
date: 2020-08-12T08:36:16+05:30
draft: false
tags: [vector, collection]
categories: [rust]
sources:
  - https://doc.rust-lang.org/book/ch08-01-vectors.html
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

Vector:

- stores value of **same type**
- stores values **next to each other in heap**
- can store values **dynamically**

### creating a Vector

when using _associate function_ `::new()`, one must use **type annotation**
so that compiler have info about what kind of values to be stored in there

```rust
// empty vector
let v1: Vec<i32> = Vec::new();

// vecor with some initial values
let v2: vec![1, 2, 3];
```

### updating a vector

Vector provide methods for running operations on any of its instances.

```rust
let mut v = Vec::new();

// add new values
v.push(5);
v.push(10);
```

> when a vector is dropped, all its content would vanish as well

### accessing values

vectors are **indexed by number, starting at 0**

there are two ways to access a vactor element. first way is similar to
accessing array elements. second option is, using vector-specific methods

1. accessing using `&` and `[]`

   ```rust {hl_lines=[2]}
   let v = vec![1, 2, 3];
   println!("first element: {}", &v[0]);

   println!("{}", &v[1000]); // panics
   ```

   This methods is quite straightforward. but it would _*create panic*_ when
   the index is out of bound.

2. using `.get()`

   ```rust {hl_lines=[3]}
   let v = vec![1, 2, 4];

   match v.get(2) {
     Some(third) => println!("third element is: {}", third),
     None => println("no third element present"),
   }
   ```

   `.get()` returns enum `Option<T>` which have two variants: `Some<T>` and
   `None`.

while **holding a reference** to an item, new items **cannot be added**.
check out the following code for example:

```rust
// won't compile
let mut v = vec![1, 2, 3, 4, 5];

let first = &v[0];

v.push(6);

println!("The first element is: {}", first);
```

this is because of Rust's borrowing rules. When holding a reference to an
element, pointer would **point to an specific memory location**. if new item gets
added, the length of Vector would expand making it **not able to fit** in current
memory sequence at times. if that happens, the whole vector would be **relocated**
to an **available continous memory location**. This, in turn, would make the
**reference to previously allocated memory invalid**. Hence Rust does not allow it.

### iterating & mutating a vector 

one could iterate over a vector using `for` loop.

```rust
let v = vec![1, 2, 4, 5];
for i in &mut v {
  // prints the value of `i`
  println!("{}", i); 

  // modify `i`
  *i += 10;
}
```

`*` is known as **dereference operator**. `&` returns reference to the element.
so, in order to edit that element, we must get its true value.

### using enum to store multiple types

```rust
enum SpreadsheetCell {
  Int(i32),
  Float(f64),
  Text(String),
}

let row = vec![
  SpreadsheetCell::Int(3),
  SpreadsheetCell::Text(String::from("blue")),
  SpreadsheetCell::Float(10.12),
];
```
