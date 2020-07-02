---
title: Whats the fastest way to look up an index in Elixir?
date: "2020-04-15"
---

Lets create a long list of a million items and look up the 500,000th item
```elixir
iex(54)> range = 1..1_000_000
1..1000000

iex(55)> index = 500_000
500000

iex(57)> list = range |> Enum.map(& &1)
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...]

iex(58)> tuple = List.to_tuple(list)
{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...}

iex(59)> map = list |> Enum.with_index() |> Map.new()
%{
  702155 => 702154,
  868847 => 868846,
  899014 => 899013,
  ...
}
```

Here we can see that looking up an index in a linked list is very slow compared to looking up an index in a map or tuple:

```elixir
iex(61)> :timer.tc(fn -> Enum.each(1..1000, fn _ -> list |> Enum.at(index) end) end)
{2154386, :ok}
iex(62)> :timer.tc(fn -> Enum.each(1..1000, fn _ -> tuple |> elem(index) end) end)
{1357, :ok}
iex(63)> :timer.tc(fn -> Enum.each(1..1000, fn _ -> map[index] end) end)
{1065, :ok}
```

So, which is faster? A tuple or a map?

```elixir
iex(65)> :timer.tc(fn -> Enum.each(1..1_000_000, fn _ -> tuple |> elem(index) end) end)
{1272816, :ok}
iex(66)> :timer.tc(fn -> Enum.each(1..1_000_000, fn _ -> map[index] end) end)
{1065876, :ok}
```

A map keyed by index is even faster

<!-- ![Chinese Salty Egg](./salty_egg.jpg) -->
