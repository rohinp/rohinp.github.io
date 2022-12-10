---
title: Functions Day 0
date: 2022-12-10
categories: [Functional Programming, Functions]
tags: [functional programming, functions, basic, function composition]
img_path: /day0/
mermaid: true
---

# A gentle introduction to functions.

### The intended audience: `Beginner level`

### What are we talking about:
Everything about programming functions without using functional programming jargons.
I'll leave up to the reader to relate a particular concept in this article with a FP jargon :-)

### Programming Language:
The examples are in scala, but can be demonstrated in any other programming language which supports creating and composing(more about this in a moment) functions.

### Introduction:

#### What is a function:

---
Below diagram from wiki might help to understand.
If X is a set of shapes and Y is a set of colours then the relation between these two set is what we call a function.

![Wiki Domain-CoDomain](function2.png)

Another diagram again taken from wiki, gives an idea of how you can picture what a function can be. If `f` is a function then for a given value `x` it produces a result `f(x)`.

![Wiki Function diagram](function1.png)

May be writing it in a programming language will help to understand better. Then here is a simple example of a function in scala.

![function example](function_example00.jpg)

The syntax might be a bit overwhelming, specially if you are new to programming/scala.
But stay with me, will try to make it digestible.
From the above example, the function creation can be divided into three parts.
1. Name of the function `doubleIt` created using the `val` keyword. 
   1. In general, we can pass data (here by data I mean an object or primitive type) to a function or assign data to a variable or return data from a function as return type.
   2. In scala apart from data we can also pass, return or assign variables with functions. This is always difficult to visualize at first, specially if new to functional programming. But that's the entire goal of the blog series to make you start thinking in terms of functions. 
   3. There is a colon after the function name `val doubleIt :` which indicates that the type of this variable follows it. In our case the type is not a simple `Int`, `String`, `Double`, etc. but a function type.
2. Next the function signature `Int => Int`. 
   1. In simple words a function which takes an `Int` and returns an `Int`
   2. Anything on left of `=>` is the input to the function and to right of `=>` is the output type.
   3. This is basically a `syntactic sugar`, and to not push it further and keep things simple we will go into what goes behind the scene later on in the blog series. We will also discuss in more details about syntactic sugar later, as it might help us to do some other fany things with functions later on.
   4. Again the syntax is a bit obscure for beginners, but if you visualize in terms of the images which we saw earlier it might help.
3. The function body, or the implementation part. `x => x + 2`
   1. It is kind of similar to what we saw in the type signature above #2. with a difference that the left and right side of the `=>` were types and now in #3 those are values.
   2. In the code examples we will always see left of `=` is a type and right of `=` is a value.
   3. Here value is basically a function implementation, we could have written `(x:Int) => x * 2`. But because we mentioned a type signature we no longer need to.
   4. Again left of `=>` is input and right of `=>` is our put.
   5. The right of `=>` is multiplication operation, for example calling `doubleIt(3)` will result to a value `6`
   6. If all this made sense and if you are ready to dive further than congratulations! we are going to start a real fun ride soon.  

But... But before we dive further lets do one more example. This time a function which takes two parameters.

![function example](function_example01.jpg)

1. Name of the function, probably the above explanation applies here as well, so we are good here.
2. Function type is a bit different as it takes two parameters now `(Int, Int) => Int`
   1. In order to pass two parameters we can group them in parentheses `(Int, Int)`
   2. Apart from that all the other parts remain the same.
   3. Obviously we can create function with different types for example `(String, Int) => Double`. But for simplicity same types in example.
   4. Also, there are other ways to pass multiple parameters to functions, but we stick to this method for now and then discuss other methods later.
   5. I'm sure if we want to pass three parameters you know what the type and implementation syntax might be. If yes then cool, and if no then don't worry we will see some examples soon.
3. There is not much to discuss in terms of implementation as well, everything which we discussed in #1 example applies here too.

