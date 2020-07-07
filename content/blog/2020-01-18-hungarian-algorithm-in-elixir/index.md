---
title: Hungarian algorithm in Elixir
date: 2020-01-18
---

The Hungarian (also called Munkres) is an assignment algorithm that optimizes for the lowerst total cost.

For example, if 5 painters need to be assigned to 5 jobs, each having a cost (driving time + paint cost + time cost),
this algorithm will find the optimal assignment with the lowest total cost.

One use case of this algorithm is comparing sets of drawings. If set A has 10 drawings and set B has some number of drawings, but
set B might be in a different order, or have drawings added or removed, you could create a matrix of differences from
each page in set A to each page in set B and then use the Hungarian algorithm to match each page in A to a page in B
such that the total difference is minimized.

[Here's my implementation](https://gist.github.com/atomkirk/a4ac4c3d6ef964eaab4b7f55ef045f83)

It is a pure function so many executions can be run in parallel without interfering.