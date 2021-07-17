---
title: Cargo
date: 2020-04-19T14:32:19+05:30
categories: [rust]
---

Cargo is the Rust package manager and build tool. It's used to initialize, build and manage dependencies of a project.

## 1. `cargo new PROJECT_NAME`

```sh
$ cargo new cargo-example
Created binary (application) `cargo-example` package
```

To initialize a project, one needs to run `cargo new` followed by the `project_name`. Cargo will create a directory `project_name`, add `.gitignore`, `src/main.rs` and `Cargo.toml`.

The `src/main.rs` is the entry-point to the project. Rust expects project related codes to live inside `src` directory, leaving top-level directory for config files, readme etc. This makes project more organized.

`Cargo.toml` is the package file. This file stores everything needed for the project to build. The `[package]` section of the file stores the general package informaton. And `[dependencies]` section stores information dependency information.

## 2. `cargo build`

```sh
$ cargo new cargo-example
Compiling cargo-example v0.1.0 (/home/crow/Dev/rust/sources/cargo-example)
Finished dev [unoptimized + debuginfo] target(s) in 0.41s
```

`cargo build` generates an unoptimized build(along with debug info) out of the source code. Generated binary should be inside the `target` directory inside `example-project` To run the binary, one needs to call it like this: `./target/debug/cargo-example`, inside a terminal in project root.

## 3. `cargo run`

```sh
$ curgo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.01s
     Running `target/debug/cargo-example`
Hello, world!
```

`run` subcommand of `cargo` runs a compiled binary. Or if the binary is not available, it compiles source to binary and then run the resultant binary.

## 3. `cargo check`

```sh
$ cargo check
    Checking cargo-example v0.1.0 (/home/crow/Dev/rust/sources/cargo-example)
    Finished dev [unoptimized + debuginfo] target(s) in 0.13s
```

`check` checks the source if it's compilable. This command does not compile the source into a binary.

## 4. `cargo build --release`

```sh
$ cargo build --release
Compiling cargo-example v0.1.0 (/home/crow/Dev/rust/sources/cargo-example)
Finished release [optimized] target(s) in 0.29s
```

The `--release` flag compiles to an optimized binary suitable to use in production.

## `Cargo.lock`

This is a lockfile created and managed by Cargo to track exact version of dependencies. This file should not be edited manually.

