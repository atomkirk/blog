---
title: Elixir TDD in VSCode
date: "2020-07-01"
description: Set up a task to run on save that runs your tests in Elixir
---

A really great workflow is to write your test first (TDD anyone?), run the test to verify it fails (eliminate false positive) and then
write the implementation. I've included a [runOnSave](https://marketplace.visualstudio.com/items?itemName=pucelle.run-on-save) setting to run a test file anytime it is saved and, second, to run any failed
tests as soon as any other elixir file is saved.

```json
{
  "runOnSave.commands": [
      {
          "match": ".*\\.exs$",
          "command": "(cd elixir && mix test ${file})",
          "runIn": "terminal"
      },
      {
          "match": ".*\\.ex$",
          "command": "(cd elixir && mix test --failed)",
          "runIn": "terminal"
      }
  ]
}
```

So, you write the test, save, it fails.
You write Elixir code, save, it still fails.
You keep writing Elixir code and saving until it passes.

This is obviously cool. But one thing that is particularly cool is that while you are writing the implementation, you often want
to peek at values and experiment with code. Well, thats easy! Just write the code, `IO.inspect` it and then save! You'll instantly
get feedback on your experiment using your test data. It's like writing your code in a repl. Except it's tested. And in version control.