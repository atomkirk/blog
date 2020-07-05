---
title: The importance of factories
date: 2020-07-04
---

I think languages and frameworks should be batteries included. Or, if they are taking a hard stance on minimalism,
"blessed" packages for doing all the basic tasks like testing and parsing JSON.

One of the things I think languages should have first class support for is factories. We all need to generate example
data for testing and seeding. Any time you define a type, you should be able to call a `create` function and get an example
of that type!

Elixir does not have this built in, so here's a simple implementation to demonstrate how I think it should work:

```elixir
defmodule App.Factory do
  alias App.Repo

  def create(module, overrides \\ %{})

  def create(module, overrides) when is_list(overrides), do: create(module, Map.new(overrides))

  def create(module, overrides) do
    attributes = module.example() |> Map.merge(overrides)
    struct(module)
    |> changeset(attributes)
    |> Repo.insert!()
  end

  def changeset(%App.User{} = struct, attributes) do
    App.User.registration_changeset(struct, attributes)
  end

  def changeset(%{__struct__: module} = struct, attributes) do
    module.changeset(struct, attributes)
  end
end
```

Then, wherever you define a type, maybe you can customize how examples of that are generated:

```elixir
defmodule App.User do
  use App.Web, :model
  alias App.Repo

  schema "users" do
    field(:name, :string)

    timestamps()

    belongs_to(:account, App.Account)
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name])
    |> validate_required([:name])
  end

  # **HERE** we customize how examples of App.User are created
  def example do
    %{
      name: Faker.Person.name(),
      address: Faker.Address.street_address()
    }
  end
end
```

And then we can use it like this:

```elixir
import App.Factory

account = create(App.Account, name: "My Company")
user = create(App.User, account_id: account.id) # %App.User{name: "Steve Urkel", account_id: 1}
```

So, a few things things make this really nice:

1. You create an example of a type with the fields and values automatically generated. You shouldn't have to add custom
generation of values at every call site every time a new field is added to the type.
2. You should be able to pass in overrides to provide specific values for fields. This is most useful in testing.
3. Factories should not build relationships automatically. Going down this path is a really great way to generate a ton
more example data than you need and slowing down your tests. It'll be death by a thousand cuts.
4. You should be able to customize how values are generated. If you have a field named `address` you should be able to
make it generate values that are valid addresses.

A super useful sibling to this is a "faker" library that can generate example data that looks like real data. So far
every language I've used, someone in the community has built this.