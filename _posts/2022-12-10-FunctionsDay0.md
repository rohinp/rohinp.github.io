---
title: Functions Day 0
date: 2022-12-10
categories: [Functional Programming, Functions]
tags: [functional programming, functions, basic, function composition]
img_path: /day0/
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
If A and B are set of values then we can define function as a mapping between values of set A and set B.
Below digram from wiki might help to understand.
![Wiki Domain-CoDomain](function2.png)

If :point_up: does not help then here is one more image.

![Wiki Function diagram](function1.png)
Lets see how does a function looks like scala, this is where things can/and will be different in other languages.