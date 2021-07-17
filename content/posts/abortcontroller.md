---
draft: false
meta:
  image: /images/262edf0c536be421bf4750d50673f523.jpg
  description: null
featured: false
title: "Terminating DOM Operations at will: 'AbortController' in JavaScript"
date: 2020-07-26T21:51:49+05:30
tags:
  - js
  - javascript
  - dom
categories:
  - javascript
tableofcontents: true
---

## Intro

**AbortController** is an interface which provides a way for terminating one or
more web request as and when desired.

This generally means that a request can be terminated by a user whenever needed,
irrespective of whether the operation is finished or not.
`AbortSignal` can be implemented in any web platform API which uses
[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

## The API

AbortController provides a few things for users to implement it effectively in
code. At the time of writing this, the constructor would return an instance which
contains a method `AbortController.abort()` and a property 
`AbortController.signal`(read-only).

- `AbortController.signal` - Returns a `AbortSignal` instance
- `AbortController.abort()` - Aborts a DOM Request

### AbortSignal

`AbortController.signal` returns an instance of type `AbortSignal` which 
represents the current state of the AbortController instance.
It has a read-only property `AbortSignal.aborted`. Type of property `aborted`
is `Boolean`.

`AbortSignal` is also responsible for communicating with DOM as an Event Listener
can be attached to it.

## Using AbortController

To use AbortController in a `Promise`, one must adhere to a few rules.
[Source](https://dom.spec.whatwg.org/#abortcontroller-api-integration)

- Function should accept `AbortSignal` through a `signal` property. For example:
  ```javascript
  function abortThis(arg1, { signal }) {
    return new Promise((resolve, reject) => {
      // function body
    })
  }
  ```
- When method `aborted()` is called, **reject the Promise** with a
`DOMException` `AbortError`
  ``` javascript
  throw new DOMException('aborted by user', 'ABORT_ERR');
  ```
-  Abort immediately if the `aborted` flag on `AbortSignal` is set to `true`.


## Browser Support

Despite being a relatively new API, browser support for AbortController is
quite awesome! All major browser _fully_ supports it. Following is a chart
from _Can I Use_.

<!--Embed for the feature from Can I Use-->
{{< caniuse feature="abortcontroller" periods="future_1,current,past_1,past_2" >}}

## Examples 

Following are a few examples of `AbortController` API. First one is using `fetch`
API. On the second example, I will try to implement it in a `Promise`.

### Using Fetch API

```javascript
const controller = new AbortController();
const signal = controller.signal;

// fetch a URL
fetch('https://jsonplaceholder.typicode.com/todos/1', { signal })
  .then(raw => raw.ok && raw.json())
  .then(console.log)
  .catch(e => console.log(e.message));

// driver code
setTimeout(() => {
  // abort network request if it takes
  // more than a second
  controller.abort();
}, 500);
```

The above code allows a network request to run for `500ms`. If data has been
fetched within that period, it would return JSON representation of the response.
Otherwise, it would abort the request.

### Implementing using Promise

In this section, I will try to implement `AbortController` for a function which
returns Promise. Should be quite easy and straightforward. [Here is a Gist](https://gist.github.com/abdus/90ec5cab55f55e44b18835276bdc66b2) for the same.

```javascript
/* this function would return a Promise
 * which would resolve with value `hello`
 * after 4s
 */
function abortTask({ signal }) {
  return new Promise((resolve, reject) => {
    // 1. check if it's already aborted
    if (signal && signal.aborted) {
      return reject(new DOMException('`signal` is in `aborted` state', 'ABORT_ERR'));
    }

    // wait for 4s
    setTimeout(() => resolve("hello"), 4000);

    // 2. add a listener to `signal` to check its state
    signal && signal.addEventListener('abort', () => {
      // reject promise when signal.aborted changes to `true`
      return reject(new DOMException('aborted by user', 'ABORT_ERR'));
    })
  })
}



/* DRIVER CODE */
let signal;   // just so that I could re-use it


// when `signal.aborted` is `false`
const abortController_1 = new AbortController();
signal = abortController_1.signal;

abortTask({ signal })
  .then(t => console.log(t)) // hello
  .catch(e => console.error(e.message))


// when `signal.aborted` is `true`
const abortController_2 = new AbortController();
signal = abortController_2.signal;

abortController_2.abort();

abortTask({ signal })
  .then(t => console.log(t))
  .catch(e => console.error(e.message)) // err


// when user calls AbortController.abort()
const abortController_3 = new AbortController();
signal = abortController_3.signal;

// abort task in 2s
setTimeout(() => abortController_3.abort(), 2000);

abortTask({ signal })
  .then(t => console.log(t))
  .catch(e => console.error(e.message)) // err
```
