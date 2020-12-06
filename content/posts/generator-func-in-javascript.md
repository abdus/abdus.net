---
title: "Generator Functions in JavaScript (with real-world examples)"
date: 2020-11-12T18:54:26+05:30
draft: false
meta:
  image: https://i.ibb.co/QJqYYBn/f76eef870144.png # url to image. Important for blog listing and seo
  description: # overrides .Summary
tags: []
categories: [javascript]
---

Before I start writing anything, here's a discloser: I knew about generator
functions since a long time, but did not really had a chance to use them. In
this blogpost, I will demonstrate implementation of generator functions in
real-world scenerios.

![Generator Function](https://i.ibb.co/QJqYYBn/f76eef870144.png)

## Generator Function

Before we begin, let's quickly revise **what generator functions are**. They are
a special kind of function which is used to generate an iterator.

An Iterator is an Object which implements [the Iterator Protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol).

> The Iterator Protocol defines a standard way to produce sequential values and
> potentially a return value when all values have been generated.
> \- MDN

### Function Signature for Generator Functions

Function signature for a Generator Function is similar to a regular function.
The only difference is that, in iterator function, keyword `function` is
followed by an astrics(`*`).

```javascript
// function signature
function* generator(args) {}
```

### `yield` Keyword

As soon as the keyword `yield` is encountered, the function execution will
pause. And the value will be returned.

```javascript
// generator function
function* myGen() {
  yield 1;
  yield 2;
}
```

### `Iterator.next(arg)` Method

[`next()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/next)
is a method to return the current state of the generator function.
`next()` returns an object containing keys `value` and `done`. `value` holds
whatever is returned by `yield`. And `done` shows if the complete function is
done executing.

```javascript
function* myGen() {
  yield 1;
  yield 2;
}

const it = myGen();

myGen.next(); // { value: 1, done: false }
myGen.next(); // { value: 2, done: false }
```

Interesting thing is that, `next()` may accpet a value if passed. Passed value
will be returned as `yield` expression. For example, `name = yield name`.
Whatever is passed to `next()` method, will be stored in variable `name`.

> Arguments passed to first invocation of `next()` will be ignored.

### `Iterator.return()` Method

Assume that, for some reason, you need to complete executing the whole generator
function immediately. In such cases, do we have a viable option? Yes! it's
called [`return()`](#)

## Examples

Just as the title says, I am going to provide a few useful real-world usecases
for generator functions.

### 1. Generating Unique ID

Unique IDs are [important]() at multiple scenerios. It gets tricky to generate
those. Most of the time we depend upon external libraries.

To generate an unique ID, either we could simply write a number generator using
Generator Functions. Or we could convert them to some sort of strings. Both ways
works good.

Below is an example to generate unique strings.

```javascript
function* GenerateUniqueID() {
  let i = 0;
  while (true) {
    const str = btoa(i);
    i++;
    yield str;
  }
}
```

What this would do? It will simply create a Base64 representation of a given
number. Use this output as classname/key/id for any HTML element.

Another method could be to hash that number using MD5, SHA or similar. This way,
the resultant string would always be equal in length.

#wip
