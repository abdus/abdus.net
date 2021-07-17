---
title: "Handling Errors"
date: 2020-08-12T12:03:43+05:30
draft: true
tags: [error, error handling]
categories: [rust]
sources: []
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

two kind of errors in Rust:

- **recoverable**, which are of type `Result<T, E>`
- **unrecoverable**, with `panic!()` macro
