---
title: "Complete Ethical Hacking"
date: 2020-10-20T23:40:32+05:30
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

## Why Linux?

- it's open-source
- free of cost
- environment for pen-testing
- good for development
- very light
- varities of distributions

## Network Commands in Linux

`ifconfig` - shows interfaces and IP addresses corosponding to those interfaces

- MAC Addr - Unique addresses for every device in the world. used to communicate
  within local network
- IP Addr - used to communicate over internet. may change.

### Loopback Interface

any traffic that computer sends to the loopback network is addressed to the same
computer. loopback interface have IP address 127.0.0.0/8 The most common IP
address for the loopback interface is 127.0.0.1 . Loopback interface is
represented with `lo` in `iwconfig`/`ipconfig` output.

although any interface can be used to identify the device, loopback interface
is generally used.

## Information Gathering

- first step in pen-testing
- act of gathering data for our target
- any type of data which might help us achieve our shits

### Types of Information Gathering

**Active Info Gathering** from target(website etc)

directly get the data from target. examples: direct packets exchange, talking
with employes etc etc

**Passive Info Gathering** from target

collecting info from a middle source. example: google about target and gather
data from a third party website etc

### Goals

- IP Address(s)
- Employee Emails
- Employee Phone Numbers
- Technologies

  - Operating System
  - Networks
  - Software

### Tools for Gathering Information

- _WhatWeb_ - Gather information about a website. for more info `man whatweb`
- _theHarvester_ - Gather info about Email, Hostname and Username
- _hunter.io_ - Gather info about Email
- _redhawk_

> Tools often fail. Find related tools in GitHub.
