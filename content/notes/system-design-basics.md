---
title: "System Design Basics"
date: 2021-02-08T08:50:02+05:30
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

## Before designing a System

1. Clarify the system requirements and agree on the scope of system.
   - _**User Cases**_
     - who will be using it
     - how they are going to use it
   - _**Constraints**_
     - traffic and data handling constraints at scale
     - scale of the system(req/s, req types data write/s, data read/s)
     - other requirements such as multi-threading, read or write oriented
2. Abstract Design(High-level architectures)
   - Sketch the important components and connections between them
     - **application service layer**
     - list of **required services**
     - **data storage** layer
     - load balancers, service partitions, database(master/slave db clusters),
       caching system
3. Component Design
   - component + API
   - **object oriented design**
     - map features to modules
     - relationship among modules:
       - singeletons (uniq instance)
       - compositions (made up of many other objects)
       - inheritance
     - Database Schema Design
4. Understanding Bottlenecks

