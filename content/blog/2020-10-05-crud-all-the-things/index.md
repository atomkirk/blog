---
title: Crud all the things
date: 2020-10-05
---

My argument is simple: All interactions with a resource should be done using the following interface[^1]:

```
create(attributes: Map)
read(resource_identifier)
update(resource, new_attributes: Map)
delete(resource_identifier)
```

Anything more specific than this is overly complex, hard to adapt, hard to extend and very hard to understand.

Here's some examples of violations I've seen in the wild and we can compare:

1. A graphql endpoint called `toggleUserActive` vs `update(active: false)`

Using the first strategy, we have to include a ton of boilerplate to handle that specific route or graphql edge. Why, when you can coalesce all of those into one `update` where you can update multiple attributes at once and get all the errors back and once? The second is flexible, extendible and obvious.

This is an egregious example of duplicating lots of routing code for each and every attribute of a resource. Now lets look at some more subtle violations that are just as bad. These ones happen way more often because they feel so reasonable at first:

2. `deposit(attributes)`

This is actually not very different from #1, because it's equivalent to `create_with_deposit_type(other_attributes)`.

This should be something like: `Transaction.create(%{kind: "deposit", amount: 3})`

3. `reserve(property_id)` or `send(invoice_id)`

This is the most common and reasonable but I would still argue against it. Behind the scenes, you are mutating a
resource, so just use CRUD!

For reservations, instead of `Property.reserve(…)` or `POST /properties/3/reserve` we should just do:

```
Reservation.create({property_id: 3, start_date: …, end_date: …})
```

What if you add functionality to reserve a new type of thing? You could make it polymorphic and have one clear and predictable
way to create reservations.

When an invoice is sent, we create an action resource to log the history of the send. So, instead, let's do:

```
Action.create({type: "Send", invoice_id: 3, emails: ['blah@example.com']})
```

I'll accept other opinions on this, but here's mine: A resource models something in the real world, so in this case,
a real-world email is being sent and this action models it. Most of the time the real world resource already exists when
we model it, but in this case, when I create a send action for an invoice, I'm both creating it in the real world and in
our model at the same time.

#### Why is this more flexible and easier to adapt?

Think about all that goes into updating a resource. You need to route it, authorize the user for
that resource, authorize the user to perform that action on that resource, etc. It is a lot of
duplicated logic to do that for each attribute[^2]. And, when the requirements ask you to change
multiple things about a resource at once, you now need two ways to perform the same mutation. 🤢

#### Why does it make code hard to understand?

Every time I come across this in someone else's code, I first try to figure out "how should this
feature change application state?" "What resources am I modifying?" Then, I read code for an hour
looking at all the different ways they create the resource, all the many ways they read or update the resource, etc and
try to figure out which one is the most natural place to add the way _I_ need to modify the resource. Do I use one
of these many ways? Do I add a new way? Then I take a walk and fume about why there isn't just a `Resource.update`.

If anyone who modified your code just had to reason about resources and moving them from one state to another, they could
look for the right CRUD functionality and know exactly what to do with it.

#### All your favorite libraries do this

All our favorite standard libraries have these function signatures. Here's an example from elixir for mutating maps:

```
Map.new(attributes)
Map.put(map, new_attributes)
Map.delete(map, key)
```

Dig far enough, and its our overly specific abstractions built on top of great interfaces that ruin things. Go deep enough
and the ORM we're using has these function signatures.

Stripe's API is a loved by a lot of people; it follows this principle with few exceptions. Actually, I bet all your
favorite APIs use this principle, but then we turn around and write our own task specific code on top of it.

#### Conclusion

Stick to CRUD for interacting with resources as much as possible, from your API (`POST /reservations`) all the
down to your ORM and standard libraries.

[^1]: These signatures can be adapted to OOP (e.g. `User.create(attributes)`, `user.update(attributes)`, etc)
[^2]: You can authorize per field/attribute too with CRUD, so you don't lose functionality but gain flexibility.
