---
title: "Why TypeScript"
date: 2021-07-26T20:39:12+05:30
draft: false
meta:
  image: # url to image. Important for blog listing and seo
  description: # overrides .Summary
tags: [typescript]
categories: [web]
---

For many of the developers, TypeScript seems like a completely new language.
But to me, it is just JavaScript with added type system. In this post, I am
going to discuss why we should use TypeScript over plain old JavaScript.

## Type System

Let me lead the post with TypeScript's awesome typing-system. In plain
JavaScript, there are no types. Values are assigned to variables dynamically.
When I say a language is dynamic, I essentially mean that we can re-assign
variables with different data types. For example, if we a declare variable `let whatever = 10`, this variable will be of type `Integer`. Now in a
strongly-typed static language, we cannot reassign this variable with a
different data type, say a `String`.

If a programmer has not used any statically-typed languages in the past, this
additional type-system on top of JavaScript can be a bit hectic and frustrating
while working on a project. But if we look at the bigger picture, we can
prevent so many bugs right at the compile time by passing values of the correct
type.

For example, if a function parameter type is set as `String`, and we pass a value
of type `Number` while invoking it, TypeScript compiler will not compile the
code. On the other hand, JavaScript will report no error at all.

## Self Documenting

Since each variable in TypeScript has a type associated with it, it's very
easy to read and understand that codebase. Check out the below code for example:

```typescript
interface DbOpts {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

function connectDB(opts: DbOpts) {
  return db.connect(opts);
}
```

In the above code snippet, if we call `connectDB()` function without the correct
parameter (or even a single property, as all of the properties, are
`required`), the TypeScript compiler will throw an error saying that there's a
type mismatch. Isn't that useful?

Of course, we can use JSDoc, but to be honest, JSDoc is not reliable when it
comes to type-checking. The reason is, JSDoc is a documentation tool, not a
compiler or type checker.

## Object-Oriented Programming

TypeScript fully supports object oriented programming. Class field modifiers
are a recent addition to JavaScript. Thanks to V8 engine, we can use it in Node
without any polyfill. TypeScript had these features for a long time. It
supports class field modifiers such as `private`, `public` and `protected`.

## Autocompletion

Almost all of the popular IDE and text editors have great support for
TypeScript. With TypeScript, you get better support for auto-completion of code.
And most of the time, editors would highlight any type of errors before you even
run the program.

Again, JSDoc can be a replacement for this. And it is what we used when
TypeScript was not so popular. But both of these tools have their own tasks to
accomplish.

## Transpile Code

TypeScript can compile to many versions of ECMAScript. You can use all the
latest features of JavaScript happily and still be stress-free about supporting
the older environments.

Point to be noted here: TypeScript does not polyfill anything. It converts code
from one version of JavaScript to another. For example, if your codebase has
some code snippets that the `target` version does not support, TypeScript will
convert the code so that it is compitable with the older version of ECMAScript.

```typescript
const isTrue: Boolean | undefined = undefined;
const hello = isTrue ?? "not set to a boolean value";
```

If we choose `ES3` as target, above snippet will be compiled to:

```javascript
"use strict";
var isTrue = undefined;
var hello =
  isTrue !== null && isTrue !== void 0 ? isTrue : "not set to a boolean value";
```

## Conclusions

There are certainly some drawbacks of using TypeScript over JavaScript. But
those drawbacks are so negligible that they don't even count.

TypeScript produces a maintainable codebase. Maybe it won't matter when the
codebase is small. But in the long run, we get a codebase that could be
maintained by People without losing their sanity. If someone in the
team has never used a statically-typed language before, they will need some
training.
