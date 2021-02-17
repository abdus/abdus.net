---
title: "MySQL in Arch Linux"
date: 2021-02-17T14:41:32+05:30
draft: false
meta:
  image: https://i.ibb.co/7rNdBjB/mariadb.png
  description: How to install MariaDB(MySQL), create and modifu user, database etc on Arch Linux and other distributions
tags: [mysql, sql, relational]
categories: [database]
sources:
  - https://www.linode.com/docs/guides/how-to-install-a-lamp-stack-on-arch-linux
  - https://wiki.archlinux.org/index.php/MariaDB
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

Yesterday, I was installing LAMP stack on my local machine to get some work
done. For some weird reasons, I thought I would be able to access the database
as the `root` user through a non-root process. Here are some notes about that
just in case I encounter such issues again in future.

## Installation

First thing first, we need `mysql` binary to be able to create and manipulate
databases. Let me get that from Arch Package Repository.

```bash
# I am on Arch. So, my package manager is `pacman`.
# if you are running Debian(or similar), use `apt`
# instead.
$ sudo pacman -Syu mariadb
```

## Initialize MariaDB

Once the installation process is over, we need to initialize the data directory.
We also need to create [system tables](https://mariadb.com/kb/en/system-tables/).
One of these system databases is `mysql` which contains the `user`
table(`mysql.user`). This table is responsible for managing user privileges.

We have got a script for this. It is provided by MariaDB. Please note that this
script requires to be run as root (or by the superuser).

```sh
$ sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
```

### Start MariaDB Daemon

After running the above command, start MySQL as a system daemon. To do that,
depending on the system, we can use `systemd`.

```sh
# for machines having systemd
$ sudo systemctl start mariadb.service # starts the service

# after starting the service, make sure to `enable` it
# so that it automatically starts on reboot
$ sudo systemctl enable mariadb.service

# check if the process is up and running using
$ sudo systemctl status mariadb.service
```

At this point, the MySQL server should be up and running. To confirm that it is
running, run `mysql -u root -p`. This will return a password prompt for you to
enter the MySQL password.

### Fixing Password Error

Unless you run that command with Super User's privilege, you are likely to get a
password mismatch error. That's because a regular user can't access
`root@localhost` user (as that is MySQL's super admin account).

We now have to create a new user for regular MySQL workflow. To create a new
user, first log-in as `root` using `sudo` (or superuser).

```sh
$ sudo mysql -u root -p
# This will log you in with a prompt where you can run SQL.
```

### Create New User

To create a new user, we have to perform some SQL black magic in the SQL prompt.

```sql
-- replace USERNAME. make sure it's in lowercase
CREATE USER 'USERNAME'@'localhost' IDENTIFIED BY 'YOUR_PASSWD';
```

### Create a Database

We need to create a database where `USERNAME` will be running database
operations. We are creating it now so that the `USERNAME` can be assigned to it
(you can choose to do this step at the end. No issues). So...yeah, more SQL
black magic.

```sql
CREATE DATABASE database_name;
```

### Assign a Database User

Now that we have created a new database, time to assign `USERNAME` to take the
control of this database. Some more SQL commands would be sufficient for that.

```sql
GRANT ALL PRIVILEGES ON database_name.* TO 'USERNAME'@'localhost';
FLUSH PRIVILEGES;
```

Once you run all those SQL commands, exit from MariaDB prompt using `quit`
(or `^C`).

### Verify

Time to verify if we can log in with the newly created user. To do that, we can
log in to MariaDB shell using `mysql -u USERNAME -p` (with or without `sudo`).

Enter your password and you will be inside the MariaDB shell. Enjoy!
