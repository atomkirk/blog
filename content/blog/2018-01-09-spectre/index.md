---
title: Spectre
date: 2018-01-09
---

I spent quite a while trying to understand the Spectre vulnerability.[^1] Here's my attempt to explain it:

Let's say you create an array `numbers` in javascript with length 4 and `[1, 2, 3, 4]` in it.

And lets say it ends up next to a sensative password in memory belonging to your password manager app.

```
-----------------------------------------------
1 | 2 | 3 | 4 | p | a | $ | $ | w | o | r | d |
-----------------------------------------------
```

The `1-4` bytes are mine, I have access to them. If I try to access past it:

```js
numbers[4] // `4` would access the index of `p`
```

it will return `undefined`. In other languages, like C, it'll just crash with a `SEG_FAULT`, meaning I tried to read memory I don't own.

Lets say I loop through the array like this:

```js
for (i = 0; i < numbers.length + 1; i++) {
    numbers[i]
}
```

Notice the `numbers.length + 1`. This means its going to loop one passed the last element. I've intentionally made this loop so that
it will try and read the byte right after this array ends, a byte I do not own.

Because of speculative execution, the CPU will notice that I usually execute inside this `for` loop, so even on the last iteration,
even though the CPU will end up discarding the result, it WILL execute `numbers[4]` and load the value into the cache.
If we could conditionally load something into memory that we own based on what the value is in the memory we don't own,
we could figure out what the value is!

Here's the bug:

We can indirectly prod the cache to see whats there. Lets create another array with 128 values:

```js
var otherArray = [1,2,3,4,..128]
```

Then, lets access that new array using the `&` bitwise operator on the value of the original array:

```js
for (i = 0; i < otherArray.length + 1; i++) {
  var tmp = numbers[i]
  otherArray[(tmp & 1) * 128]
}
```

On the last loop, the loop that the CPU does speculatively, `tmp` will equal `p` from `pa$$word`, because the CPU does not check
during the speculative execution if we own it yet.

`p` is `112` in ascii, which is `1110000` in binary. If we do a bitwise AND `&` (remember 1 & 1 = 1, 0 & 1 = 0) we get `1110000 & 1 = 0`.

The least significant bit of `p` is `0`, so `0 & 1 = 0`. If the value of `tmp` (which is `numbers[4]`) is `p`, then `(tmp & 1)`
will be `0` and `otherArray[0 * 128]`[^2] will be `otherArray[0]`. When the CPU speculatively executes that last loop, it will read `otherArray[0]`
into the cache. We own `otherArray[0]`, so if we can know that it is in the cache, we then know that the first bit of `tmp` is 0…

If something is in the CPU cache, it is accessed WAY faster than if it is not. All we have to do is time how fast it takes to read `otherArray[0]`
and if its much faster than reading from memory, then we know `otherArray[0]` is in the cache and thus we know that the first bit of `tmp` is `0`.

If we repeat this to find out the 2 through 8th byte, we then get `1110000` which is ascii `p`. If we repeat more, we get all of `pa$$word`.

So thats how it works.

What does the latest safari update do to fix it? It just makes it so that websites can't measure smaller than 1ms. If you update,
websites won't be able to time and distinguish if something is in the cache or not!


[^1]: I read a lot of explanations but after reading this a few times, it clicked, so I borrowed code examples from it https://webkit.org/blog/8048/what-spectre-and-meltdown-mean-for-webkit/
[^2]: The reason we use 128 is that we want to use a large enough number to spread out the memory access across memory pages. When memory is loaded into the cache, it is loaded in blocks called pages. If we use too small of a number, the same page will be loaded regardless of the unowned memory and we won't be able to infer the value.