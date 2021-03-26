---
title: Simple Elixir Decimal Interpreter
date: 2021-03-26
---

I needed a way to allow a user to provide an equation that uses variables and then compute that equation with the
variables. Elixir to the rescue!

Elixir has this awesome [Code module](https://hexdocs.pm/elixir/Code.html#string_to_quoted/2) where you can pass it
a string and it will give you back an AST.

Most of the values in these equations will be money, so I needed a way to interpret and compute the equations with
Elixir's Decimal library so that rounding is handled properly. So, I wrote the simplest interpreter ever for a language
that can only do simple math equations 😬

```elixir
defmodule Equation do

  defmodule MissingVariableError do
    defexception message: "this variable does not have a value"
  end

  def compute(equation, variable_values) do
    with {:ok, ast} <- Code.string_to_quoted(equation),
         {:ok, value} <- do_compute(ast, variable_values) do
           value
    else
      {:error, {_, _, _}} ->
        {:error, :syntax_error}

      error ->
        error
    end
  end

  defp do_compute(ast, values) do
    {:ok, compute_step(ast, values)}
  rescue
    MissingVariableError ->
      {:error, :missing_variable}

    _ ->
      {:error, :syntax_error}
  end

  defp compute_step({:*, _, [a, b]}, v), do: Decimal.mult(compute_step(a, v), compute_step(b, v))
  defp compute_step({:+, _, [a, b]}, v), do: Decimal.add(compute_step(a, v), compute_step(b, v))
  defp compute_step({:-, _, [a, b]}, v), do: Decimal.sub(compute_step(a, v), compute_step(b, v))
  defp compute_step({:/, _, [a, b]}, v), do: Decimal.div(compute_step(a, v), compute_step(b, v))
  defp compute_step({:__aliases__, _, [vname]}, v) do
    case v[vname] do
      nil ->  raise MissingVariableError
      val -> val
    end
  end
  defp compute_step(float, _) when is_float(float), do: Decimal.from_float(float)
  defp compute_step(int, _), do: Decimal.new(int)

end
```

Here it is in action:

```elixir
defmodule EquationTest do
  use ExUnit.Case, async: true

  test "multiplication", do: assert Equation.compute("A * B", %{A: 3, B: 5}) == Decimal.new(15)
  test "division", do: assert Equation.compute("A / B", %{A: 15, B: 5}) == Decimal.new(3)
  test "subtraction", do: assert Equation.compute("A - B", %{A: 3, B: 5}) == Decimal.new(-2)
  test "complex", do: assert Equation.compute("(A * B) / C", %{A: 3, B: 5, C: 5}) == Decimal.new(3)
  test "money", do: assert Equation.compute("(A * B) / C", %{A: "1213.33", B: "-5.30", C: "3.34"}) |> Decimal.round(2) == Decimal.from_float(-1925.34)
  test "with literal", do: assert Equation.compute("(A * B) / 5.0", %{A: 3, B: 5}) == Decimal.new(3)

  test "syntax error", do: assert Equation.compute("A * B C", %{A: 3, B: 5, C: 2}) == {:error, :syntax_error}
  test "missing var", do: assert Equation.compute("A * B", %{A: 3}) == {:error, :missing_variable}

end
```