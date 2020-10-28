---
date: 2020-06-02T01:50:27+05:30
title: 'Enum'
tags: ['enum']
categories: [rust]
---

> `enum` is a type that can be any one of several variants.

## Enum Example

```rust
enum IPAddrKind {
    V4,
    V6,
}
```

## Enum Values

Enum values can be accessed using `::` which is useful. Reason is, each value inside that given enum is of same type. For example:

```rs
enum IPAddrKind {
    V4,
    V6,
}

fn main() {
    let version_four = IPAddrKind::V4;
    let version_six = IPAddrKind::V6;

    // following are valid
    route(IPAddrKind::V4);
    route(IPAddrKind::V6);
}

// `ip_kind` would accept both `V4` and `v6`
fn route(ip_kind: IPAddrKind) -> bool {
    true
}
```

## Attaching data

```rs
enum IPAddrKind {
    V4(String),
    V6(String),
}

fn main() {
    let home = IPAddrKind::V4(String::from("127.0.0.1"));
    let loopback = IPAddrKind::V6(String::from("::1"));
}
```

An enum could hold any kind of data; be it a `struct`, integers, string, or even another enum etc etc. For example:

```rs
struct IPv4Addr {
    addr: String,
}

struct IPv6Addr {
    addr: String,
}

enum IPAddr {
    V4(IPv4Addr),
    V6(IPv6Addr),
}
```

> The advantage of defining `enum` over `struct` is that all data that it would be holding, will be under a same namespace. This would make passing them as function argument easier.

## The `Option` enum

Rust does not have `null`, because they believe that it would probably bring some unintentional errors to the code. 

Rust handles the concept of whether a value is present or absent in a diiferent way. `Option` enum is a predefined enum which have two variants: `Some` and `None`. `Some` can hold any kind of data. And `None` would hold nothing, obviously. 

```rs
enum Option<T> {
    Some(T),
    None,
}
```

The `<T>` syntax is a generic type parameter. This means the `Some` variant of `Option` can hold one piece of data of any type.

enum `Option` is included in prelude. One does not have to explicitly bring it in scope. Even the variants of `Option` are directly available for use.

Example:

```rs
let some_number = Some(5);
let some_str = Some("Hello");

let absent_number: Option<i32> = None;
```

It is important to mention data type when using `None`. Compiler can't extract the type from `None` variant to assign it to `Some`.

Note that the `Option<T>` and `T`(where `T` holds a value of any type) are not same. That's because, let's say, we stored a `i32` value in `T` and assigned it to a variable. Now what compiler unserstands is `i32` is a premitive data type, whereas `Option<i32>` is of type `Option`. Doing any operation between `i32` and `Option<i32>` would result in an error.

This prevents programmer from making errors by assuming a value is not null when it actually is. In order to perform any ops with `Option<i32>`, one must convert it to type `i32`. There are utility methods like `is_some`, `is_none`, `clone` are available under `Option` enum which could be used to carry out conversions.












