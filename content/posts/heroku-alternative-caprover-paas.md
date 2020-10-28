---
title: "Get Your Own Heroku - a Guide on How to Run a Custom 'PaaS' for deploying Apps"
date: 2020-04-26T11:05:04+05:30
draft: false
tags: ['paas', 'heroku', 'node.js', 'vps', 'custom platform']
categories: ['cloud']
---

Heroku is a fantastic platform for Node.js developers. It made deployment
of Node.js apps super easier. But obviously. it have so many limitations on
free-tier, which makes it less ideal for deploying certain kind of projects,
like a  telegram bot etc.

## The Idea

I was having a pretty similar issue. I needed to host a bot. Initially, it was
in Heroku, but due to the fact that every apps on Heroku free tier goes for
sleep after inactivity of around 30 minutes. This, generally, is not a problem
for websites, but bots won't work. There is always a delay on bot response.

First, I thought I would build my own Heroku-like platform. But it's not really
easy. So, I went off with an open-source 'Platform as a Service' software.

Likely, there are many such open-sourced products available. One of them is
**[CapRover](https://github.com/caprover/caprover)**.

### Features

1. Docker-based deployment. Each of the deployed app would have their own
isolated space.
2. Support for `Dockerfile`. A `Dockerfile` would maximize the possibilities of
what you could do with the deployments.

## Prerequisites

Nothing much required, really! All you need is:

- A VPS to host CapRover. Preferably DigitalOcean
    It should also have a Linux OS installed. Ubuntu is preferred.
- Basic Linux Shell Skills for installing required applications.
- A Domain Name

### Initial Server Setup

If you are using Digital Ocean, first you need to create a droplet. Digital
Ocean have a nice guide on [how-to setup a droplet](https://www.digitalocean.com/docs/droplets/how-to/create/).

Once you are done creating a Droplet, it's time to update the system.
To do that, you need to access your droplet using SSH.
[This tutorial](https://www.digitalocean.com/docs/droplets/how-to/connect-with-ssh/)
would help you do that.

After connecting to droplet via SSH, update and upgrade the system using
`sudo apt update && sudo apt upgrade`. Note that, these commands are for Ubuntu.

We also need a couple of other software in order to get our CapRover
server up and running. We will be installing them one by one.

#### Docker

CapRover is built on top of Docker. So, it's an essential essential software.
To install docker, checkout the official [Docker documentation for Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

> You may need to add the current user to `docker` group. To do so,
run `sudo usermod -aG docker <user_name>`. Otherwise, you will get a docker error.

#### Node.js and NPM

Yeah, these Node thing is everywhere these days :/ But anyways, it should be
relatively easier to install. Note that, by default Ubuntu repository have
`node v8.x.x`. We need at least `v10.x.x`. So to install
`node v13.x.x` via NodeSource:

```sh
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
```

Then run `apt-get install` command.

```sh
sudo apt-get install -y nodejs
```

To confirm that you have Node installed, run `node -v` from terminal.

#### NPM

It's possible that NPM was installed along with Node.js. You can verify that
using `npm -v`. In case it is not installed, install it from Ubuntu repository
using `sudo apt install npm`.

By default, NPM needs `sudo` to install global packages, which is not
recommended. To change this behavior, change `prefix` in NPM config.
Run `npm config set prefix dir_name`(replace `dir_name`
with a directory name where you want to have npm packages).
You also, need to add `dir_name/bin` to your PATH variable.

### Domain Setup

By now, you should have a static IP address assigned to your Digital Ocean
droplet. If you have a domain name purchased, you need to point it to your
server IP address using A record. For example: you want
`captain.yourdomain.com` as your app host. You need to setup two
different a records.

```txt
cap              A         3.23.76.12
*.captain        A         3.23.76.12
```

At this point, your server is ready to host CapRover. You may additionally need
to allow some ports in order to make CapRover work.
You can allow them using `ufw` command in Ubuntu.

```sh
ufw allow 80,443,3000,996,7946,4789,2377/tcp; ufw allow 7946,4789,2377/udp;
```

Note that, this command must run in root shell.

## Install CapRover and CapRover CLI

Thanks to the devloper of CapRover, it's super easy to install.
All we need is to run one command, sit back and watch it installing.

```sh
docker run -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover
```

Once the CapRover installation is done, visit `cap.domainname.com:3000` to
verify if CapRover is working. We also need to install CapRover CLI in order
to manage deployment, sertup server etc. To install CapRover from NPM,
run `npm i -g caprover`. Once installed, run `caprover serversetup`,
and follow the interactive command prompt.

At this point, you have a CapRover instance running successfully. Check this
guide for various
[deployment methods](https://caprover.com/docs/deployment-methods.html).

> Before deploying a project, make sure to create an `app` using the Web GUI.
Otherwise, you won't be able to deploy.

For more information about CapRover and it's configurations,
check out its **[official docs](https://caprover.com/docs)**.

## Conclusions

Having a self-managed PaaS could be very handy.
Following are a few reasons I choose to go with a self-managed PaaS
for hosting apps.

1. I would be saving money.
      Generally, if I go for Heroku non-free tier, I would be paying a lot
      of money compared to what I pay now.
2. Shared Resources.
      Server resources won't get wasted because each and every app would be
      able to access resources from the same resource pool. So, let's say,
      I have 2 GB of RAM. And I need only 1 GB to host XYZ webapp.
      Now, I can use the remaining amount of RAM to spin-up a
      new instance ABC webapp.
3. Support for [insert techstack name]
      Since, CapRover uses docker to deploy a new instance, I can basically
      run apps built using any back-end technologies.
      And write how to deploy it using a Dockerfile. I have so much
      flexibility now.

The only downside I could think of is, I have to look after the server.
This is won't be a big deal, thanks to AWS ❤️

