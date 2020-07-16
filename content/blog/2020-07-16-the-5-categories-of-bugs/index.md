---
title: The 5 categories of bugs
date: 2020-07-16
---

### Syntax errors
**Your parser won't make it passed this** no matter what language.[^1] You get immediate feedback if you haven't stated something correctly.

### Linking, reference & type errors
**Where your code references other code incorrectly.** A compiled language, with a linker, won't compile on this. Javascript,
and most dynamic languages, will run just fine and only crash when it tries to execute that instruction. This is a [slow
feedback loop](http://localhost:8000/2020-07-01-fast-feedback-loops/), especially if its in error handling code that is hard to test. Building, refreshing your browser,
navigating to that page, opening the drawer, creating a new resource, saving… finally to see that you misspelled `savve()`.
Other ways to cause these errors is to pass arguments in the wrong order, pass the wrong number of arguments, use or
compare the wrong types, etc.

### Forgetting to handle a failure scenario
**This is any time your code crashes because of an exception.** Most languages have a way to catch exceptions, if you
remember, so you can handle them gracefully without crashing. Some languages are a mixture of value errors and exceptions
(Elixir). A current trend is toward value errors even though languages that only support value errors have been around
for decades (ML). Interestingly, if you introduce just 2 more ideas, Algebraic Data Types and Exhaustive Matching, you
can define a language where runtime errors don't happen in practice. (Elm, Rust)

### Executing the wrong code at the wrong time
**Calling the wrong function, infinite loops, forgetting a condition, unsanitized user input.** Declarative languages help a lot with this, but
I don't know of anything that can reliably detect or prevent it. I mean,
proving logically if a function ever stops executing is a [known intractable problem](https://en.wikipedia.org/wiki/Halting_problem).
Some causes of this are: calling the
wrong function, not understand the code, forgetting possible states. Both security and performance bugs fall under this
category. A thoughtfully used language with advanced types[^2] can help mitigate this, but all languages will compile and
run with these types of errors. These are the hardest types of errors to catch and thorough tests are the only way I know
how to drastically reduce them.

### "Works as designed" but the designs are wrong
You, as the programmer, are blameless. Product told you to do something stupid that all users consider the totally wrong
behavior. This is a bug, but it's not yours. Some examples of this are: telling people they unsubscribed from your
newsletter when they really didn't. Or a website that can't load fast because there are too many 3rd party ads and trackers.

Humans make mistakes, but we tighten our feedback loops and make less mistakes with languagues that prevent entire
categories of errors.

[^1]: Actually, browsers will try and show whatever HTML it can make sense of.
[^2]: I've read that Idris, with dependent types, can prevent some bugs in this category.
