---
title: Correctness
date: "2015-05-28T22:40:32.169Z"
description: This is a custom description for SEO and Open Graph purposes, rather than the default generated excerpt. Simply add a description field to the frontmatter.
---

so, in my mind, program correctness is non-optional for 2 reasons 1) users trust 2) saves time in the
long run. Tracking down and fixing bugs can eat up 10 hours a week. Also on a large team, working
on each other peoples code is very hard to get right because you're missing context, so types can
make it so you can confidently work on other peoples code faster

When things go wrong in software, there are 4 sensible things to do, depending on the problem
1. retry it automatically (network issue, etc)
2. tell the user it didn't work and that it might work if they try it again (network issue kept happening, etc)
3. tell the user, but also notify the developers because is something they should be aware of and probably need to fix
4. Do some default behavior, use a default value or whatever
The worst thing you can do, to lose money in a trading situation or lose users trust, is to either do literally nothing, or show some gobbly gook error message that looks awful

so if you fetch a record from the db where name can be null, it would be represented as Some(name) | None. So its like an enum, where the Some variant can have a value attached. Then, the compiler forces you to deal with all cases:
case nameColumn do
| Some(name) -> "Hello #{name}!"
| None -> "Hello there!"
white_check_markeyesraised_hands

you can't not handle all possible cases
white_check_markeyesraised_hands

remember how I said NASA's apollo program thought through and handled explicitly eveyr possible execution path the program could take? ML languages make sure you do that
white_check_markeyesraised_hands

so then the question is "is it way more work to write NASA thorough code when I'm building a url shortener?"
white_check_markeyesraised_hands

and if you know the language, I think the conclusion is no
white_check_markeyesraised_hands

because ML languages also have a lot of expressiveness and terseness that make up for it
white_check_markeyesraised_hands

plus, you're going to eventually, but in dynamic languages, you do it after the user complains and you see "can't call method on null" in the error tracker. You'll go add a check for null and explicitly handle it…
white_check_markeyesraised_hands

so…you can either do it now or you can do it in a long feedback loop of "user complains, find in bug tracker, create branch, handle null explicitly, open MR, get approvals, deploy" for each and every case…
white_check_markeyesraised_hands

## Classes of bugs

- Forgot to handle a possible case (null, result variant)
- Executed the wrong code (usually happens with copy/paste)
- Misunderstood requirements (requirements were unclear or unspecified, programmer cut corners, etc)
- Selected the wrong data (bad SQL query)
- Unintended consequence (Regex to match emails that doesn't match all valid emails. Most security issues fall into this category)