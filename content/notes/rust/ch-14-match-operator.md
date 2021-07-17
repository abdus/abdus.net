---
date: 2020-06-03T12:48:31+05:30
title: "Match Control flow"
categories: [rust]
tags: ["control-flow", "match"]
---

`match` is a control flow operator. It works similar to a coin sorting machine,
i.e. it would start matching patterns(a.k.a arms) from top to bottom until
it finds a matching pattern. Example:

```rs
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter
}

fn match_coin(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}

fn main() {
    let c = match_coin(Coin::Penny);
    println!("{}", c);
}
```

[Skipped this chapter. Gotta finish it later on]
