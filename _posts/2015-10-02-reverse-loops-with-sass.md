---
layout:     post
title:      Reverse loops with Sass
date:       2015-10-02 12:31:19
summary:    A quick tip on how to reverse a for loop in Sass.
tags: [sass, development]
categories: development
---

Here's a very quick one: revert (or inverted) `for loops` in Sass. I struggled with this for a bit longer that I wanted, so I'm going to share this one as a quick tip in case someone else runs into the same problem.

Let's say we want to loop through a list of colors, and use them in reverse order:

{% highlight scss %}
$list: #aaa, #bbb, #ccc, #ddd;
{% endhighlight %}

Here's (at least) one way to achieve the reversed loop:

{% highlight scss %}
@for $i from length($list)*-1 through -1 {
  .ring:nth-child(#{abs($i)}) {
    color: nth($list, $i);
  }
}
{% endhighlight %}

### What's happening here?

First, we grab the list length by using `length($list)`. Since Sass doesn't allow us to specify `0`
 as an end value, we need to get a bit creative here: so we multiply the list's length by `-1` to get a negative value, going through `-1`.

While negative values aren't that useful if you plan on using them for element selections like `nth-child($n)`, Sass gives us the `abs()` method, which will convert any negative number to a positive.

This will output:

{% highlight css %}
.ring:nth-child(4) {
  color: #aaa;
}

.ring:nth-child(3) {
  color: #bbb;
}

.ring:nth-child(2) {
  color: #ccc;
}

.ring:nth-child(1) {
  color: #ddd;
}
{% endhighlight %}

You can still access the value in its original order by using `abs()` again in the `nth` function if you need to.

Happy Sassing!
