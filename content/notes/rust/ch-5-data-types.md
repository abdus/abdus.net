---
date: 2020-04-21T11:30:38+05:30
title: Data Types
tags: ['data-types']
categories: [rust]
---

> Every value in Rust is of a certain data type, which tells Rust what kind of data is being specified so it knows how to work with that data.

## Data Types in Rust:

1. **Scalar**
   - **Integers**
     - (**`i8 | u8`**) - 8-bit Integer
     - (**`i16 | u16`**) - 16-bit Integer
     - (**`i32 | u32`**) - 32-bit Integer
     - (**`i64 | u64`**) - 64-bit Integer
     - (**`i128 | u128`**) - 128-bit Integer
     - (**`isize | usize`**) - Integer size depends upon the system architecture.
   - **Floating Point** Numbers
     - **`f32`** - Single-precision 32-bit floating point numbers
     - **`f64`**(default) - Single-precision 64-bit floating point numbers
   - **Booleans**
     - `true`
     - `false`
   - **Characters**
     - **`char`** - 4-bytes in size. Capable of holding an Unicode Scalar Value(including Chinese, Japanese, and Korean characters; emoji; and zero-width spaces etc)
2. **Compound**
   - **Tuple**
   - **Array**

### Tuple

General way of grouping togather a number of values with variety of types.

```rs
fn main() {
  let tup: (i32, f64, u8) = (500, 5.2, 1);

  // accessing values
  // destructuring method
  let (x, y, z) = tup;  // x = 500, y = 5.2, z = 1

  // `access by index` method
  let five_hun = tup.0;
  let float5_2 = tup.1;
  let one = tup.2;
}
```

### Array

Array stores collections of multiple values, but of same type.

```rs
fn main() {
  // declaring an array
  let a = [1, 3, 4, 6, 5];
  let b: [i32, 3] = [1, 4, 2];  // array of size 3 of type `i32`
  let c = [4, 10];    // array of size `10` containing same value, i.e. `4`

  // accessing an array
  const firstValue = a[0];
  const secondValue = a[1];

  // main panic
  const valueDoesNotExists = a[400];
}
```

> Accessing an element of an array which is past the end of the array, would result an `index out of bounds` error, which in result would `panic` the `main` thread. This gives a more safe memory access, as the program won't be able to access invalid memory location.

## Notes

1. Always check if index of an array which is supposed to be accessed, is less than the length of the array. Otherwise, `main` thread would panic.
