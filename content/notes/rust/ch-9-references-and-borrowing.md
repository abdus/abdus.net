---
date: 2020-05-07T15:41:28+05:30
title: References and Borrowing
tags: ['references', 'ownership', 'borrowing']
categories: [rust]
---

When a variable is passed by reference to a function parameter, the function does not take ownership of that variable. Instead, it stores a pointer which would _refer_ to that specific memory location. Passing a variable by reference to a function is known as **Borrowing**.

```rs
fn main() {
  let s1 = String::from("Rust is awesome");
  let length_s1 = calc_len(&s1);

  println!("The length of '{}' is {}.", s1, len);
}

fn calc_len(str: &String) -> usize {
  str.len()
} // `str` goes out of scope. but since it never owned `s1`, nothing would happen.
```

Since the `calc_len` function does not own variable `s1`, `s1` never goes out of scope once the function is done executing.

> `&` is used to create a reference to a variable

## Mutating `passed by reference` variable

By default, mutations in borrowed variables are not allowed(just like in owned variables). One need to mutate it using the `mut` keyword. Example:

```rs
fn main() {
  let mut s1 = String::from("Hello, ");  // declare as mutable
  change_str(&mut s1);  // pass to func as mutable

  println!("{}", s1);
}

fn change_str(str: &mut String) {  // accept a mutable reference
  str.push_str("world");
}
```

### Mutable Variable Restrictions

1. A variable **can be mutated only once** at a given scope. This may look weird but it actually prevents unwanted data modifications(data race).

> A data race is similar to a race condition and happens when these three behaviors occur: 1. Two or more pointers access the same data at the same time. 2. At least one of the pointers is being used to write to the data. 3. There’s no mechanism being used to synchronize access to the data.

2. A variable can only be borrowed as mutable if its immutable reference is not used after borrowing it as mutable. Look at the following code snippet to understand better.

**Compiler Error**

```rs
let mut s = String::from("hello");

let r1 = &s; // no problem
let r2 = &s; // no problem
let r3 = &mut s; // BIG PROBLEM

println!("{}, {}, and {}", r1, r2, r3);
// immutable reference used
// after a mutable reference `r3`.

// error[E0502]: cannot borrow `s` as mutable
// because it is also borrowed as immutable
```

**No Compiler Errors**

```rs
let mut s = String::from("hello");

let r1 = &s; // no problem
let r2 = &s; // no problem
println!("{} and {}", r1, r2);
// r1 and r2 are no longer used after this point

let r3 = &mut s; // no problem
println!("{}", r3);
```

> Reference’s scope starts from where it is introduced and continues through the last time that reference is used

## Dangling References

Leaving a reference to a memory location which was returned/freed.

```rs
fn main() {
  let reference_to_nothing = dangle();
}

fn dangle() -> &String {
  let s = String::from("hello");

  &s
} // s went out of scope. So, the memory location was returned. `&s` points to a free memory location. This would result a compile-time error

// error[E0106]: missing lifetime specifier
```
