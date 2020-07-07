---
title: Fast feedback loops
date: "2020-07-01"
---

If you’re a software company, two things count: moving faster and having less bugs than all your competitors. [^1]

As software engineers, we rarely know if our code is correct without running it. On one extreme, your loops are big where you
write code in large chunks and then test the app in the browser. Maybe you push giant commits to CI and (in a typical
org) wait 15m for your CI to run to see if tests are passing. [^2] Your feedback loops are large and you wait 20s+ from
the moment you're done typing to see the result. It's not fun and it leads to distraction.

On the other extreme, you write the test first. You use a language or a build system orders of magnitude faster then today's
popular choices. You use a strongly typed language with editor support. You run the relevant test on every save. You do
everything you can to tighten that feedback loop. You move insanely fast, your code is robust and you have fun.

## Type safety

Type safety is a fast feedback loop. As soon as you build, you know if you’ve mispelled something or passed the wrong
arguments. Refactoring is as easy as changing the interface and fixing all the errors. An editor plugin will give you
quality autocomplete, errors inline immediately and tell you the shape of variables in your code. This is a compliment
to high test coverage, property based testing & fast builds/tests, not a replacement.

## Test driven development

If you have a process like [running tests on save](/2020-07-01-fast-feedback-loops) or [test && commit || revert](https://medium.com/@kentbeck_7670/test-commit-revert-870bbd756864)
you have an immediate feedback loop about the code as you are writing it. One thing I like about running the tests on
every save is you can throw in log statements and see the output as soon as you save; very much like a REPL, except its
in the context of your app.

## Pair programming

Code reviews are a big chunk of a developers day. Pair programming allows the code reviews to happen in real-time as you’re
writing code. Whats more, that tight feedback loop of live conversation, both people with full context, fully invested,
leads to significantly better code and an accelerated advancement of everyone’s skill and experience. What you save in
time reviewing and tech debt more than makes up for the purely “lines of code written” opportunity cost.[^3]

A half way

## Fast build times

Slow build times will make all of this painful. This is a problem, because the vast majority of popular tech stacks today
get very slow as the project grows. This means this workflow is out of reach for most engineering teams.
[Go](https://golang.org/), [Ocaml](https://ocaml.org/), [ReasonML](https://reasonml.github.io/),
[vlang](https://vlang.io/), [esbuild](https://github.com/evanw/esbuild), [Elm](https://github.com/evancz/elm-project-survey/issues/33)
are some rock stars. The feedback in these languages feels instant. There are some mid range options where, after some
monthly tweaking, will only make you wait 5-10s for an incremental compile and start up. [Elixir](https://elixir-lang.org/)
is an example I've used.

If a software company wants to move faster than its competitors, it has to tighten its feedback loop.

[^1]: Or potential competitors. Many an incumbent has been taken down by a fast moving startup.
[^2]: A lot do this because tests run too slow on their local machine.
[^3]: I've only done the normal sporadic pair programming that everyone does on a team, but I've always thought it was
awesome. My interest in it is well explained by [this article](https://jasonlarsen.me/2020/02/16/ship-faster-with-this-one-weird-trick).