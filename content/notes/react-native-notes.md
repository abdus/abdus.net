---
title: "React Native Notes"
date: 2021-02-10T18:09:53+05:30
draft: true
tags: []
categories: []
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

## Why web-view is bad?

- Less performent compared to native and native-like technologies
- Does not follow OS's UI design pattern. Same design in both android and iOS

## Why React Native

- Big community. Makes development process easier as support can be expected
  from community when stuck
- Battle-tested framework. Used by companies like Facebook, Uber Eats, Discord,
  Skype. And invested by Shopify, Microsoft (despite having Xamarin) etc
- Cross-Platform. Write code once, and run it in three platform (Android, Web
  and iOS)

## React Native can't beat Native App's performence

To understand this, we first gotta understand how React Native works internally.
When we ship an app, it gets shipped with three things:

- React Native components compiled to Native Code
- JavaScript bundle
- JavaScript Virtual Machine ([JavaScriptCore](https://reactnative.dev/docs/javascript-environment),
  powers Safari)

React Native must ship a JavaScript engine in order to run JavaScript bundles.
This VM works as a **Message Broker**. When an event happens in View, OS will
communicate with JavaScript engine to understand how to handle the event.

We have two things to take into consideration. First, the boot-up time of that
JavaScript engine. Second, time require to communicate through the Message
Broker and execute code from JavaScript bundle containing business logic.

An app built with purely native technologies(like Java, Kotlin, Swift or
Objective-C) whon't have to undergo these tasks(communicating and VM boot-up).
Hence, the performence gain.

Note that, a React Native app running in iOS will be a bit faster than its
Android counterpart. JavaScriptCore is already available in iOS.

[Hermes](https://reactnative.dev/docs/hermes) is a new JavaScript which is going
to replace JavaScriptCore in coming days (one could opt-in for it).
Hermes is written specifically for running React Native apps. It boosts
_performence_, reduces _memory usage_ and improves _start-up time_.
