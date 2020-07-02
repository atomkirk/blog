---
title: Fast feedback loops
date: "2020-07-01"
---

If you’re a software company, winning means two things: 1) more features faster, and 2) less bugs, than all your competitors.

By features I mean refinements too. Some apps would be worse with more features, so they need to just be faster, easier to use, etc. all of which are features.

We software engineers make things. We do experiments. On one extreme, you could write all the code up front and then push a giant commit to CI and (in a typical org) wait 15 mins to see if it passes. You’d do this because running all your js tests locally freezes your computer. You open your browser, sign in, go to the page, click around until it breaks. Then you do it all again. Once its working, you add just enough tests to appease a code reviewer.

On the other extreme, you write the test first. You use a language or a build system orders of magnitude faster then the most popular choice. You use a strongly typed language with editor support. You set up a keyboard shortcut to run the relevant test. You do everything you can to tighten that feedback loop. You move insanely fast and you have fun.


## Type safety

Type safety is a very fast feedback loop. As soon as you try to build, you know if you’ve mispelled something or passed the wrong arguments. You can approach a similar result with 100% test coverage, property based testing & fast builds/tests. But, it could take months to catch an edge case, 100% coverage is very hard to achieve and editors can’t use tests to tell you rich info about your code or automate things for you. Try VSCode with Typescript to see what tooling type checking makes possible.

## Test driven development



## Fast build times

Very few talk about this, but I believe this matters a lot more than people realize. Maybe most developers don’t complain about it because the biggest project they work on is at work and they don’t mind the opportunity to check twitter while it builds.

Any other techniques to tighten your feedback loop will fall flat if you have to wait 20 seconds to get feedback. The language Go had fast build times as a primary language goal. It’s actually part of the reason the language is so simple.

I’m not going to say Go is the only language for being productive, but I think more languages should prioritize this. Ocaml is another language that compiles fast. esbuild is a js bundler, written in Go, that builds js projects very fast. The latest version of Elm builds incredibly fast.

## Pair programming

Code reviews are a big part of a developers day. Pair programming allows the code reviews to happen in real-time as you’re writing code. Whats more, that tight feedback loop of live conversation, both people with full context, fully invested, leads to significantly better code and an accelerated advancement of everyone’s skill and experience. What you save in time reviewing and tech debt more than makes up for the purely “lines of code written” opportunity cost.

The problem is, the idea sounds unpleasant, so most, including me, are hesitant to commit to it full time. One idea I’ve had is to do zoom reviews. Forget the diffs and multiple reviewers. Have one person get on a call with you and walk them through the code, in context. I think this is worth trying and could lead to far better reviews than 2 people looking at line diffs.
