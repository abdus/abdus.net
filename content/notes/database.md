---
title: "Database"
date: 2020-12-06T18:59:23+05:30
draft: false
tags: []
categories: []
sources:
  - https://academy.zerotomastery.io/courses/1073491/
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

<!--> Notes are from a course on Zero to Mastery I am currently doing-->

- [SQL](#sql)
  - [Query](#query)
  - [Comments](#comments)

## Database

It's a structured set of data which is structured in a certain way so that it
can be scaled as and when required.

## SQL

SQL is a query language for navigating through a database. SQL is used to
create, read, modify and delete records from a database.

### Query

A query, in SQL, is a way to make database engines understand user's
instructions.

Example: `SELECT * FROM Users WHERE role='manager`

breakdown of above example:

- `SELECT`: literal meaning.
- `*`: identifier (can be any column name from a table). `*` means select all
  available fields
- `FROM`: literal meaning
- `Users`: Name of the table
- `WHERE`: literal meaning
- `role='manager`: expression. `role` is a column name. this essentially means,
  return record only is column `role` matches the value `manager`

### Comments

In SQL, a line prefixed with `==` will be treated as a comment, and won't be
executed.

> SQL is a _Declarative_ Language.

TODO: Learn more about declarative and imperative language.

Original name of SQL is _*SEQUEL*_.

### SELECT Statement

Used to print/get data from a database.
