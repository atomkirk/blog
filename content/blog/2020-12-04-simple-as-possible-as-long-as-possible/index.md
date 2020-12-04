---
title: Simple as possible as long as possible
date: 2020-12-04
---

The value of simplicity is underated in software development. Recently,  a buddy of mine [Parker Wightman](https://twitter.com/parkerwightman)
and I were brainstorming how to bundle some simple
javascript for a mobile app he was working on. He could have gone full webpack and spent all day configuring
an industry standard js app, but instead we did this in `package.json`:

```
"scripts": {
  "build": "esbuild a.ts b.ts --bundle --format=iife --outfile=app.js --global-name=app"
}
```

Boom, it's done. [esbuild](esbuild.github.io) is super simple by itself, but the point is we chose the simplest
tool to get the current job done. We don't actually know this will need to expand into something much more
complicated. If you know it will, it's good to design for that to save time in the long run, but if
you don't, it's **much** easier to expand on something or redo a simple thing than to slim down or redo a
overly-engineered thing.

Finally, we wanted to add some tests. Whats the simplest thing we could do?

```
"scripts": {
  "build": "esbuild a.ts b.ts --bundle --format=iife --outfile=app.js --global-name=app"
  "test": "esbuild a.ts b.ts jest-test.ts --bundle --format=iife --outfile=app.js --global-name=app && jest test"
}
```

To run tests, we just bundle the test at the bottom of the js file and then call `jest` on it. Sometimes it's hard
to keep javascript simple, but in this case we did.

One thing I've noticed over the past couple years of studying software design patterns is that following patterns
sometimes comes at the cost of simplicity and directness. As a project grows, there comes a point at which it is not
simple no matter what you do. At that point, patterns that add indirection are worth it because they, while not simplifying the
project overall, simplify small parts of the project. This allows developers to work on small parts without understanding
the impact their changes will make on everything else.

My point is, it's better to stay as simple as you can for as long as you can, because there's **always** a tradeoff.
While patterns can make small pieces "simple" they make the whole thing more complex. Both matter because half the time you or an architect has to
touch many pieces of a system and the complexity of the system as a whole has a real cost.
