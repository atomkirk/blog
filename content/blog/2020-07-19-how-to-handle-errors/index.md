---
title: How to handle errors
date: 2020-07-19
---

Everything useful a program does can be described as a "side-effect." A purely functional language that produces no
side-effects is also purely and utterly useless. It is these side effects where things go wrong. Any useful operation
on a resource your program tries to perform, even if your code has no bugs, could fail for the following reasons that
are completely out of your control:

- The resource doesn't exist (file doesn't exist, server turned off, bad address).
- You can't reach it (WiFi disconnected, bad nginx config, timeouts).
- The user is not allowed to access it.

In any of these cases, the user should get a thorough explanation of what's wrong and a suggestion of what to do next.
Here are some example suggestions for each of the above failures.

- Ask the user if they have the right identifier/url/address. Suggest they double check the spelling or contact who gave it to them.
- Suggest the user checks their internet connection. Also, network errors can often be resolved by waiting a moment and trying again. If your database deadlocked, you can say "Whoops, our system tried to handle too much. Trying again usually works." Your suggestion will depend on the specific reason it can't be reached.
- Suggest the user talk to the owner of the resource and ask for access.

Sometimes we can provide the user with a call to action. For example, a "Retry" button. Or, a form to send a message to
the owner of the resource. We should do everything we can to accommodate.

Here are some rules about retrying failures:

- If the user initiated the operation and the failure could be temporary, let the user retry it themselves. If we told them it failed and also retried it, they may retry it and now you’ve done the operation twice.
- If the error is probably not temporary, explain to the user what's wrong and suggest next steps.
- You can retry the operation automatically in these two cases:
    - If the user did not initiate the operation, such as a scheduled or recurring event that happens automatically. The user just expects it to happen and won't retry it for you. It's safe to retry it with exponential backoff and then notify the user if it keeps failing.
    - If the user initiated it, is waiting for a response, but the operation is fast enough that it can be retried without the user suspecting a problem.

### How a language can help

Most languages use exceptions for errors, which if you forget to catch, will terminate your program with an error written
for the programmer. A common approach is to set up a catch all that returns a general error like "500 sorry something
went wrong". Sometimes you can map the type of error to a better message. Often it's a library that throws the error
and it would be quite hard to track down and handle each exception possible across all the libraries you're using. In
the past, I’ve just added mappings as I see new errors in the error reporter.

This is far easier in languages with value errors instead of exceptions. I'll use Elm as an example, although there are
a few others like Rust, Pony & v-lang.

When you make an HTTP call in Elm, it returns a `Result` which is either `Ok Response` or `Err Http.Error`. Elm forces
you to handle both `Ok` and `Err`, and then, it forces you to handle all possible reasons for the error. If you forget
one, it fails to compile (with a super friendly error and suggestion, by the way). Check out this beautiful Elm function:

```elm
friendlyHttpError error =
    case error of
        BadUrl url ->
            "I couldn't find anything at " ++ url ++ ". Try checking the spelling or contact who you recieved it from."

        Timeout ->
            "Ugh. it took too long for the server to respond! Its probably super busy. Try again in a minute."

        NetworkError ->
            "Did your wifi drop out? Try checking your router."

        BadStatus status ->
            "Hmm, I don't understand that status code: " ++ String.fromInt status ++ ". Please send this message to us and we can help."

        BadBody body ->
            "Uh oh, I couldn't understand the message from the server: " ++ body ++ ". Please send this message to us and we can help."
```

Errors will happen. Users will see errors. We should put a lot of thought into our error messages. When a user sees a
helpful explanation and suggestion, it turns a bad experience into a good one. It also builds trust. The language you
choose can make this much easier.
