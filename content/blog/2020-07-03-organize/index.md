---
title: Organize by feature not by function
date: "2020-07-03"
---

Most the software projects I've worked on organized code around what they do. All the controllers together, all views
together, etc. The directory structure usually looks like this:

```bash
app/
  controllers/
    users_controller
    invoices_controller
    trasactions_controller
  views/
    users_view
    invoices_view
    transactions_view
  …
test/
  controller_tests/
    users_controller_test
  …
```

What? When was the last time you were working on a bunch of controllers across features? Way more often, we work across all
the functions of a single feature. [^1]

Instead, organize your project around features, like this:

```
app/
  users/
    controller
    controller_test
    view
    view_test
  invoices/
    controller
    controller_test
    view
    view_test
  …
```

Putting tests next to what they test is something I kifed from Go and it's awesome. Here's why:

1. They are right next to each other! You should be editing the test in tandem with what it tests so having it
together is very convenient.
1. Stuff that isn't tested starts to stand out like a sore thumb. Its becomes very obvious when a file is missing its
companion test file.
1. It's very easy to configure your editor to run only the relevant test on save. You can set up a trigger such that
when any file is saved, it uses variables to run the relevant test file:

```json
{
  "command": "mix test ${currentFile}_test.exs"
}
```

[^1]: Most UI projects organize around screens or components. That's fine because most features are "naturally" organized by screen or component.