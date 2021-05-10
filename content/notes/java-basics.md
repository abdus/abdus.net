---
title: "Java: Basics"
date: 2021-04-30T14:56:39+05:30
draft: false
tags: [java]
categories: [java]
sources:
  - https://www.geeksforgeeks.org/java
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

Java is a General Purpose, Object Oriented Programming Language heavily used in
Enterprise projects.

## Java Naming Conventions

Following a standard naming convention would make a project codebase more
readable and maintainable. Following are some of those standards used to name
different things in Java.

### Classes and Interfaces

- names should be nouns
- first letter of each internal word should be capitalised
- must avoid acronyms and abbreviations

Example:

```java
interface Bicycle
class MountainBike implements Bicycle

interface Sport
class Football implements Sport
```

### Methods

- should be verbs
- first letter of the name should be lowercase
- first letter of each internal work should be uppercase

example:

```java
void changeGear(int value);
void speedUp(int increment);
void applyBrakes(int decrement);
```

### Variables

- short and meaningful
- can start with `_` or `$`
- should be [mnemonic](https://www.urbandictionary.com/define.php?term=mnemonic)
- avoide once-char variable name
- ( **Constants** ) should be all uppercase + snake case

### Packages

- prefix should be all-lowercase ASCII letters
- prefix should start with one of the top-level domains (eg. edu, gov, mil etc)

## JVM

- Java Virtual Machine is the run-time engine to run a Java Program
- part of JRE (Java Runtime Environment)
- JVM call the `main` method

![java virtual machine](https://media.geeksforgeeks.org/wp-content/uploads/jvm-3.jpg)

### class loader subsystem

responsible for three activities

- loading
- linking
- initialization

#### Loading

class loader reads `.class` file, generate the corrosponding binary
and sace it in the method area.

for each `.class` file, JVM stores:

- fully qualified name of the loaded class and its immediate parent class
- whether `.class` file is related to Class or Interface or Enum
- modifier, variables and method info

JVM stores these information inside the Heap memory.

Information about a class can be accessed using multiple classes JVM provides.
Example:

```java
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class Test {
  public static void main(String[] args) {
    Student s1 = new Student();

    // getClass returns an object of type `Class`
    Class c1 = s1.getClass();
    System.out.println(c1.getName());

    // get all method names
    Method m[] = c1.getDeclaredMethods();
    for (Method method : m)
      System.out.println(method.getName());

    // get all field names
    Method f[] = c1.getDeclaredFields();
    for (Method field : m)
      System.out.println(field.getName());
  }
}

class Student {
  private String name;
  private int roll_no;

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public int getRollNo() { return roll_no; }
  public void setRollNo(int roll_no) { this.roll_no = roll_no; }
}
```

#### Linking

performs:

- **verification:** ensures correctness of the `.class` file. it checks whether
  the file is properly formatted. if not, JVM will raise a run-time exception
  called `java.lang.VerifyError`
- **preparation:** JVM allocates memory for class variables and initializing the
  memoru to default value
- **resolution:** process of replacing symbolic reference from the type with
  direct reference

### Data types

- Primitive Types
  - Boolean Type
    - `boolean`
  - Numeric Type
    - Character Type
      - `char` (single 16-bit Unicode character)
    - Integral Value
      - Integer
        - `byte`
        - `short`
        - `int`
        - `long`
      - Floating Point
        - `float`
        - `double`
- Non-Primitive Type
  - String
  - Array
  - Class
  - ... etc

> Non-primitive data type is also known as reference data type

## Variables

- is a name given to a memory location
- must be declared before use

example:

```java
class Test {
  int count = 100;
}
```

### Types of Variables

1. **Local Variable**:
   - definded within a method, constructor or a block
   - scope of local variable is within the declaraion block
2. **Instance Variable**:
   - decared inside a class
   - destroyed when the class instance is get destroyed
   - modifiers can be used to restrict the access of a variable
   - initialization is not mandatory. default value is 0.
   - can be accessed only by creating an object
3. **Static Variables**
   - declared with `static` keyword within a class outside of any methods
   - can have only one copy of Static variable, irrespective of how many
     objects were created
   - create at the start of program. and destroed when the execution is finished
   - initialization is not mandatory. defaults to 0.
   - trying to access static variable through an object would throw an warning,
     but won't halt the execution. compiler wil replace the object name with
     class name
   - static variables can be accessed without initializing an object

## Loops

```java
class Loop {
  public static void main(String[] args) {
    // while
    while (true) {
      System.out.println("Hello");
    }

    // for loop: the classic for loop

    // enhanced for loop
    // when there's no need for element index,
    // enhanced for loop can be used
    String array[] = {"Jon", "Snow"};

    for (String s : array) {
      System.out.println(x);
    }

    // do while: similar to other languages
  }
}
```

## String

Strings in Java can be declared in two ways. Strings are baked by a char array
internally. Hence, they are immutable. All strings are terminated with `\0`(null
character).

```java
class StringExample {
  public static void main() {
    String str1 = "String"; // stores in constant pool
    String str2 = new String("kaboom"); // stores in heap

    // to store a string from heap to constant pool,
    // `intern` method.
    String str3 = str2.intern();
  }
}
```

Some classes that provides more flexible ways to work with string:

- [`StringBuffer`](http://www.geeksforgeeks.org/stringbuffer-class-in-java/)
- [`StringBuilder`](https://www.geeksforgeeks.org/stringbuilder-class-in-java-with-examples/)
- [`StringTokenizer`](https://www.geeksforgeeks.org/stringtokenizer-class-java-example-set-1-constructors/)
- [`StringJoiner`](https://www.geeksforgeeks.org/java-util-stringjoiner-java8/)

### String Methods

- `int length`: retuns length of the string
- `char charAt(int i)`: returns the char at `i` index
- `String substring(int i)`: returns the substring from `i` to the end of the str
  passing a second argument would return str upto (index - 1)
- `String concat(String r)`: append a string. returns the full string.
- `int indexOf(String s, int i)`: returns position of the string `s`. second
  parameter sets the index from where the search should start
- `int lastIndexOf(String s)`: position of last occurance
- `boolean equals(Object obj)`: compares string to the specified object. another
  variant is `equalsIgnoreCase(String s)`
- `int compareTo(String s)`: compare to another string. returns `<0` if `s1`
  comes before `s2`, `0` is both are equal, `>0` is `s1` comes after `s2`.
  another variant is `compareToIgnoreCase`
- `String toLowerCase()`: converts to lower case
- `String toUpperCase()`: converts to upper case
- `String replace(char old, char new)`: replaces char with a new one

## Array

```java
class Arr {
  public static void main(String args[]) {
    int myArr[] = new int[20]; // array of int of length 20
  }
}
```

### Jagged Array

a jagged array is an array of arrays such that member arrays
can be of different sizes.

```java
class Jagged {
  public static void main(String args[]) {
    int arr[][] = new int[3][];
    arr[0] = new int[10];
    arr[1] = new int[12];
    arr[2] = new int[15];
  }
}
```

### Clone an Array

there are multiple methods for cloning an array.

#### Shallow Clone

does not clone, just set the memory location

```java
int[] arr = new int[10];
int copy[] = new int[arr.length];

copy = arr;
```

#### Iterate and Copy

```java
int[] arr = new int[10];
int copy[] = new int[arr.length];

for (int i = 0; i < arr.length; i++) {
  copy[i] = arr[i];
}
```

#### using Clone()

```java
int[] arr = new int[10];
int[] copy = arr.clone();
```

#### using Arrays.copyOf()

```java
import java.util.Arrays;

int[] arr = {1, 2, 3, 5, 10};
int[] copy = Arrays.copyOf(arr, 5); // copy first 5 element
```

#### using Arrays.copyOfRange()

```java
import java.util.Arrays;

int[] arr = {1, 2, 3, 5, 10};
int[] copy = Arrays.copyOfRange(arr, 2, 4); // 2 is index, and 4 is the length
```

### Array to String

an array can be converted to string using Arrays.toString() or
StringBuilder.append()

```java
import java.util.Arrays;

int[] arr = {1, 2, 3, 5, 10};
System.out.println(Arrays.toString(arr));

StringBuilder str = new StringBuilder("Hello");
char[] world = { ' ', 'W', 'o', 'r', 'l', 'd' };

str.append(world);
```

### Array equality

to check whether two arrays are equal, Arrays.equals() method can be used:
`Arrays.equals(arr1, arr2);`. Similarly for nested arrays, use
`Arrays.deepEquals(arr1, arr2);`

## Rules for method overloading

1. access modifiers can allow more, but not less, access than the overriden
   method. trying to convert a `protected` method to `private` would result in
   compile-time error
2. methods declared as `final` cannot be overriden
3. `static` methods cannot be overriden
4. `private` method cannot be overriden
5. overriden method must have same return type (or should be a sub-type)
6. constructors cannot be overriden
7. exception handling
   1. subclass overriden method cannot throw checked exception if superclass
      method does not throw any exceptions
   2. if superclass method throws an exception, subclass overriden method can
      throw the same exception or subclass exception. there is not problem is
      subclass method does not throw any

| Overriding                                                                             | Overloading                                  |
| :------------------------------------------------------------------------------------- | :------------------------------------------- |
| runtime polymorphism                                                                   | compile-time polymorphism                    |
| is about same method, same signature but different class connected through inheritance | is about same method but different signature |

## Exceptions

exception is an unwanted event, which occurs during the execution of program
that disrupts the normal flow of the instructions.

an **error** indicates a serious problem that a resonable application should not
try to catch. an **exception** should be catched when possible.

Exceptions and Errors are subclass of class Throwable.

**Unchecked** Exceptions and Errors are the ones that won't be checked during
the compile time. whereas, **Checked** exceptions will always be checked. In
Java, all exceptions except for _`RuntimeException`_ are **Unchecked**. All
errors are unchecked.

**Checked** exceptions must be handled.

### Throwing an Exception

```java
throw new ArithmeticException("/ by 0");
```

In order to write a custom exception, one must extend either `Throwable` or one
of the subclasses of `Throwable`. generally, people extend `Exception` class.

### Handling Exceptions

there are two ways to handle an exception:

- using `try/catch`
- by declaring that the method can throw using `throws`

```java
// using `throws`
public void sleep() throws InterruptedException {
  Thread.sleep(1000000);
}

// using try and catch
public void sleep() {
  try {
    Thread.sleep(100000);
  } catch (InterruptedException e) {
    System.out.println(e.getMessage());
  }
}
```

## Threads

Java supports Multi-Threading. By default, Java runs everything on a single
thread. That means, if there's any task that takes some time to process, codes
after that task have to wait.

Multi-Threading can be achieved in two ways in Java.

- extending a class to `Thread` superclass.
- implementing `Runnable` interface when there is a need for multiple
  inheritance

```java
// extending the thread class
class Demo extends Thread {
  // todo: tasks
}

// elsewhere
Thread t1 = new Demo();
t1.start();
```

when implementing the `Runnable` interface, thread can be created by passing an
instance of the class to `Thread` object's constructor.

```java
class Demo extends SomeOtherClass implements Runnable {
  public void run() {
    System.out.println("hello world");
  }
}

// elsewhere
Demo d1 = new Demo();
Thread t1 = new Thread(d1);
t1.start();
```

## Lambda Function

Lambda expressions are similar to methods, but they don't need a name, and can
be implemented right in the body of a method.

> Lambda functions can be compared to Fat Arrow functions in JavaScript

```java
// lambda expression
ArrayList<Integer> n = new ArrayList<Integer>;
n.add(1);
n.add(2);
n.add(3);
n.add(4);
n.add(5);
n.add(6);

n.forEach(n -> { System.out.println(n); });
```

Lambda functions can be stored in a variable. `Consumer` interface can be used
to store it.


```java
import java.util.function.Consumer;

// elsewhere
Consumer<Integer> method = (n) -> { System.out.println(n); }
n.forEach(method);
```

> To use a lambda expression in a method, the method should have a parameter 
> with a single-method interface as its type. Calling the interface's method
> will run the lambda expression.
