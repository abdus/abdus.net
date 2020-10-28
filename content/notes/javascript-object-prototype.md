---
title: "Javascript Object Prototype"
date: 2020-09-24T13:24:30+05:30
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

# Object

Object is `Class`. Almost **everything** in JavaScript is Object.

> All JavaScript values, except premitives, are object.

## Object Properties

Named value in JavaScript objects are called _properties_.
example:

    const person = {
        name: 'Jon',
        age: 23
    }

    person.name // property
    person.age  // property

### Accessing Object Properties

Object properties can be accessed in multiple ways.

1.  `person.name`
2.  `person["name"]`
3.  `const x = "name"; person[x]`

## Object Methods

An Object property is an Object method containing function definition.
example:

    const person = {
        name: 'Jon',
        age: 23,
        sayHi() {
            console.log("Hi, " + this.name);
        }
    }

    person.sayHi  // method

### Accessing Methods

Similar to accessing object properties, methods can be accessed in multiple
ways.

1.  `person.sayHi()`
2.  `person["sayHi"]()`
3.  `const x = "sayHi"; person[x]()`

## Object Creation

Objects can be created in multiple ways. Following are the ways explained in
detail.

### Object Literal

Most simplest list
of `key: value` pair inside curly braces {}

    const person = {
        name: 'Jon'
    }

### Using `new` Keyword

If `Object()` is invoked with a `new` keyword, it will return an object.

    const person = new Object();
    person.name = 'jon';
    person.sayHi = function sayHi() {
        console.log("Hi, " + this.name);
    }

### Using Constructor

To create
constructor is nothing but a function invoked with new keyword.

    function Person (name) {
        this.name = name;
    }

    Person.prototype.sayHi = function sayHi() {
        console.log("Hi, " + this.name);
    }

    const person = new Person('Jon');
    person.name  // prop
    person.sayHi // method

<div class="org-center">
<p>
The first two ways of defining objects does exactly the same thing. It&rsquo;s better
to use object literals to create objects in terms of <b>performence</b>, <b>readablity</b>
and <b>execution speed</b>.
</p>
</div>

## Object Mutablity

JavaScript objects are mutable by default. Meaning, they can be easily modified
after they are defined.

When new variable, the new variable would point to the
location of old object instead of copying it.
example:

    const person = { name: 'Jon', age: 23 };
    const person2 = person;  // person === person2

## Looping in Object

TBD
