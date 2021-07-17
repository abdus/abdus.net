---
date: 2020-04-26T21:03:58+05:30
title: Ownership
tags: ['ownership']
categories: [rust]
excerpt: Each value in Rust has a variable that is called its **Owner**. There can only be one owner at a time. When the owner goes out of scope, the value will be dropped.
---

## Ownership Rules

- Each value in Rust has a variable that is called its **Owner**.
- There can only be one owner at a time.
- When the owner goes out of scope, the value will be dropped.

Type `String` can be mutated, but string literals can not. Reason behind: literals are stored in stack during compile-time, which makes it impossible to grow an string during runtime. Type `String` can be mutated because, it's stored in heap.

> Rust has no Garbage Collector. It takes a different approach to release unused memory. Whenever a variable goes out of scope, the memory which was occupied by variable, would be returned.

```rs
{
  let s = String::from("hello"); // s is valid from this point forward

  // do stuff with s
}
// this scope is now over, and s is no
// longer valid
```

There is a special function called `drop` which Rust calls internally to release unused memory space.

## Variables and their Values

```rs
let a = 10; // initial declaration
let b = a;  // value of `a` was copied to `b` as a
            // new variable
```

> In Rust, primitive values are always stored in Stack. Heap is for Compound variables.

```rs
let s1 = String::from("hello");
let s2 = s1;    // pointer to `s1`'s object. `s1` destroyed
```

An object is made up of three parts: 1. **Pointer** to the memory location where object is stored 2. **Length** 3. **Capacity**

**s1(stored in Stack)** and **hello(stored in heap)**

![](https://doc.rust-lang.org/book/img/trpl04-01.svg)

On assigning `s1` to a new variable, it will point to the same heap location. Because, when a `s1` is assigned to `s2`, all three parts(ptr, len, capacity) were copied.

**s2(stored in Stack):**

![](https://doc.rust-lang.org/book/img/trpl04-02.svg)

Now, when `s1` and `s2` would go out of the scope, compiler would try to free the same memory twice, which is known as **Double Free Error**. This would lead to **memory corruption**, and ultimately security vulnerabilities.

Here, **Rust's memory safety** rules comes into play. Compiler makes previous variable(`s1`, in this case) invalid, copying everything to `s2`. Accessing `s1` after declaring `s2` would result into error.

```sh
error[E0382]: use of moved value: `s1`
```

## Move

The process of creating a new variable and invalidating previous one is known as **Move**. (Somewhat similar to a _Shallow Copy_ in other languages). This method copies stack-data to a new location.

## Copy

Deep Copy means copying a variable to a new location, completely. This copying incudes Stack data(ptr, length, capacity) along with heap data(Type `String` and similar)

In order to deep copy an object, one could use `clone()` method.

```rs
let s1 = String::from("Hello");
let s2 = s1.clone();
```

## Ownership and Functions

Ownership in function works in a similar way as variables. Passing a value to function would eiter move or copy.

```rust
fn main() {
  let s = String::from("Hello, World"); // `s` came into scope

  make_move(s); // `s` out of scope as it's moved to `make_move` function

  println!("value of x is {}", x); // error[E0382]: borrow of moved value: `s`

  let x: u32 = 123; // `x` came into scope

  make_copy(x); // `x` moves to `make_copy`. but since `x` is of type u32, it can still be used

  println!("value of x is {}", x);
}

// changes ownership of parameter
fn make_move(some_str: String) {
  println!("value of some_str is {}", some_str);
}

// does not changes ownership of parameter
fn make_copy(some_int: u32) {
  println!("value of some_int is {}", some_int);
}
```

> Returning value from a function would also transfar the value. (Example Below)

```rust
fn main() {
  let s1 = give_ownership();  // came into scope
  let s2 = String::from("Hello World"); // came into scope
  let s3 = take_and_give_back(s2); // came into scope. `s2` moved into `take_and_give_back` which in turn ruturned it to `s3`
}
// all variables goes out of scope.
// `s1` dropped
// nothing happens to `s2` as it was moved previously
// `s3` dropped

fn give_ownership() -> String {
  String::from("Hello, world")
}

fn take_and_give_back(str: String) -> String {
  str
}
```

> The ownership of a variable follows the same pattern every time: assigning a value to another variable moves it. When a variable that includes data on the heap goes out of scope, the value will be cleaned up by drop unless the data has been moved to be owned by another variable.
