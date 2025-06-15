---
draft: true
meta:
  image:
  description: null
featured: false
title: "Scaling WebSockets"
date: 2025-02-12T22:39:22+05:30
tags: []
categories: []
---

So, you’ve built this amazing real-time app using WebSockets. Everything works perfectly in development—one server, one client, instant communication. But then, you deploy it to production, and suddenly, things break. Why? Because traditional client-server models weren’t exactly designed for scaling WebSockets efficiently.

Let’s break it down and figure out how to _unscale_ WebSockets and make them work at scale.

### The Problem with Traditional WebSocket Scaling

In a traditional client-server model, when a user connects to a WebSocket server, a persistent connection is established. Sounds great, right? But here’s the catch:

1. **Multiple Servers, Random Assignments**: When traffic increases, we scale by spinning up multiple servers behind a load balancer. A new user’s WebSocket connection could land on _any_ of these servers.
2. **No Cross-Server Communication**: Let’s say User 1 connects to Server A and User 2 connects to Server B. If an event occurs on Server A that should be sent to User 2, Server A has _no idea_ how to reach User 2 because there’s no direct link between servers.
3. **Clients Only Listen**: Unlike traditional HTTP requests where the client _pulls_ data, WebSockets are about _pushing_ data from the server. But the client itself doesn’t expose an endpoint—so a different server can’t just directly push a message to it.

So, what’s the fix? Enter the **secondary server model**.

### The Secondary Server Model: Scaling WebSockets Properly

Instead of each WebSocket connection going directly to our main servers, we introduce **secondary WebSocket servers** that handle all WebSocket connections. Here’s how it works:

1. **Clients connect to Secondary WebSocket Servers**: All WebSocket connections go to dedicated secondary servers instead of our main servers.
2. **Main Servers Talk to Secondary Servers**: The main servers (handling application logic) push updates to these secondary servers over HTTP or another messaging protocol.
3. **Secondary Servers Handle the Broadcasts**: When an event happens in the main server, it pushes the update to the correct secondary server, which then forwards it to the connected client over WebSockets.

This setup removes the need for WebSocket servers to talk directly to each other. Instead, the main servers act as the single source of truth and dictate what data gets pushed where.

#### What Happens When Load Increases?

- We **spin up more secondary WebSocket servers**, distributing users across them.
- The main servers **only push updates to the relevant secondary server**, keeping things efficient.
- We **scale horizontally as needed**, handling as many WebSocket connections as physically possible.

### Conclusion

WebSockets aren’t inherently scalable using traditional methods, but by introducing a layer of **secondary WebSocket servers**, we can decouple WebSocket handling from application logic. This allows us to scale efficiently while keeping everything in sync.

So, the next time your WebSocket implementation starts to buckle under load, remember: it’s not about scaling _up_—it’s about unscaling the WebSockets and scaling _out_!
