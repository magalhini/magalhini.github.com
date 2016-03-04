---
layout:     post
title:      A Gentle Introduction to Composition in JavaScript
date:       2016-03-04 12:31:19
summary:    This is the first post of a gentle introduction to functional programming and composition in JavaScript, using simple examples to reduce the friction of FP as much as possible for beginners.
tags: [javascript, es6, functional]
categories: development
---

##### Why Functional Programming?

I’ve been shifting my programmer's mindset to use more **Functional Programming** in JavaScript, initially as a way to exercise my brain and to revamp my way of writing code. As it happens, ES2015 gives us a nice tool belt to work with in a functional manner, so there’s really no excuse not to make use of it. What initially started as plain exercises quickly became my default way of thinking in terms of handling data now.

But there’s a lot to functional programming in JavaScript, more than simply working with methods like `map` and `reduce` and all of the new ones ES2015 is introducing. It's not only “avoiding loops”, and it can still get quite verbose when we look at things like currying, for example, so let's start simple.

This is my attempt at starting from scratch teaching the basics of FP in JavaScript. I thought I’d start from the very basics: making use of a functional mindset and using the basics of composition to perform some simple object queries and manipulations.

If you want to play directly with the source code, [you can find it on JSBin](http://jsbin.com/dupeme/edit?js,console).

### Working with Data

There's mainly one required concept to know about, before jumping into a more functional mindset. It's important to remember what **pure functions** are and always keep their concept in mind when manipulating data. So what is a pure function?

From this [Sitepoint article](http://www.sitepoint.com/functional-programming-pure-functions/), we get a nice definition for a pure function:

> A pure function is a function where the return value is only determined by its input values, without observable side effects. This is how functions in math work: Math.cos(x) will, for the same value of x , always return the same result.

Nicolas Carlo wrote a [fantastic article](http://www.nicoespeon.com/en/2015/01/pure-functions-javascript/) about pure functions in JavaScript that you should definitely have a look at if you want to know more about them.

#### Getting Practical

Let’s say we have an object which contains some monthly expenses. They have a name, a price and their category. We’d later like to query this object for data analysis.

{% highlight javascript %}

const expenses = [
  {
    name: 'Rent',
    price: 500,
    type: 'Household'
  }, {
    name: 'Netflix',
    price: 5.99,
    type: 'Services'
  }, {
    name: 'Gym',
    price: 15,
    type: 'Health'
  }, {
    name: 'Bills',
    price: 100,
    type: 'Household'
  }
];

{% endhighlight %}


### Exercise one: Sum up all the expenses

If you were told to sum all of the expenses in this object, how would you go about and do it? In traditional JS fashion, we would write a simple loop:

{% highlight javascript %}
var total = 0;

for (var i = 0; i < expenses.length; i++) {
  total += expenses[i].price;
}

console.log(total); // 620.99

{% endhighlight %}

Great, it works. But it’s not exactly… functional. Firstly, it’s **dependent on an external variable**: `total`. This variable might be overwritten somewhere else in the code, and it’s impossible to keep track of its state. Plus, if we need to calculate the sum of all the expenses again for any other incoming data, we’ll need to write another loop, since the original Array is hardcoded inside it.

So zero points for reusability, predictability and encapsulation for this method.

We could turn this into its own function, and make it a pure one. Pure functions depend on their inputs alone, and their output should be the exact same for the same input, but it would still lack the functional approach to it.

#### A more functional way

Let’s make use of `map` and `reduce` to create a generic function that calculates the total costs. Keep in mind that we would like to reuse this method with possible other objects; so in order to keep function purity in check, it will accept an argument (here defined as `arr`) to work on.

{% highlight javascript %}

const sumAll = (arr) => arr
  .map((item) => item.price)
  .reduce((acc, price) => acc + price, 0);

{% endhighlight %}

#### What’s happening here?

**Break it down!**

We're creating a method that accepts an Array `arr`. For this Array, we’ll `map` over every element (as `item`) and *only return* its price property. For this `price` property, we then use the `reduce` method to continuously increment `acc` (the accumulator, with an initial value of zero) with the price returned.

And we use it like so:

{% highlight javascript %}

let total = sumAll(expenses); // 620.99

{% endhighlight %}

Now this is much better. If there were more Expenses objects, we could simply throw them at this function, like bottles on a wall. Notice that there are no side effects here; no dependencies on external state either. `sumAll` takes one argument and acts upon it, purity is preserved.

### Composing things

So we want to be able to do some data analysis. How much am I spending on the ‘Household’ category, for example? It would be nice to easily retrieve all items in this category and quickly sum them up.

Given what we’ve learned already, let’s do this without resorting to loops and creating side effects. For now, let’s explicitly create a function that gives us all household expenses:

{% highlight javascript %}

var getHousehold = (src) => {
  return src.filter((item) => {
    return item.type === 'Household';
  });
};

{% endhighlight %}

Written in (semi) ES5 for a better understanding: here, we’re accepting our expenses as `src` and using `filter`, which takes a function, to let through only the items that match the type as being `Household`.

But because we like ES2015 so much, let’s write the exact same function in a more compact flavour:

{% highlight javascript %}

const getHousehold = (src) =>
	src.filter((item) => item.type === 'Household');

{% endhighlight %}

So, calling this method on our expenses:

{% highlight javascript %}

getHousehold(expenses); // object with only items with the type of ‘Household’

{% endhighlight %}

Great! We’re getting somewhere.

#### Functional + Functional

Now that we have a method to grab all household expenses and another one that sums all prices of a given source, we can easily pair these two together. If we wanted to log out the sum of household expenses, we could simply now use;

{% highlight javascript %}

let householdExpenses = sumAll(getHousehold(expenses)); // 600

{% endhighlight %}

This is great already! `sumAll` is receiving a filtered down version of the original expenses, provided by calling `getHousehold` on the expenses Array.

But we can do better with **composition**.

### Composition, you say?

Composition, according to Wikipedia:

> object composition (not to be confused with function composition) is a way to combine simple objects or data types into more complex ones.

In this case, we want to combine two methods to form a composite  that we can refer to directly. But let’s examine what’s happening under the hood ourselves, first.

Here’s an example of composition:

{% highlight javascript %}

var angryAndMad = compose(getMad, getAngry);
var johnIsAngryAndMad = angryAndMad('John');
var aliceIsAngryAndMad = angryAndMad('Alice');

{% endhighlight %}

With composition, we’re thinking in definitions. Breaking everything down to atoms. We define our concept of `angryAndMad`, which is **composed** of a combination of `getMad` and `getAngry`. Then, we apply the concept to two entities, and unfortunately John and Alice are our chosen victims here. We’re **applying** John and Alice to the composer of angry and mad.

_Back to our expenses application._

Noticed that `compose` method written? Let's assume that magical method for now, and use it to compose ourselves a method that does two things: gets our household expenses and sums up all of them.

Something in the means of:

{% highlight javascript %}

const sumOfHousehold = compose(getHousehold, sumAll);

{% endhighlight %}

And then applying our `expenses` source to it, like so;

{% highlight javascript %}

let householdPrices = sumOfHousehold(expenses);

{% endhighlight %}

Notice that if any particular stage we had more sources of data to work with, we would be on the clear. `sumOfHousehold` is not dependent on anything external, apart from the internal methods that it combines; we could easily apply it to a potential `expenses2` and `expenses3` Arrays if this kind of complexity raised.

### How does compose work?

In this case, the `compose` method accepts two arguments, both functions, and returns another function. This new function will return another function that contains the result of both arguments applied. Sounds confusing? Let’s look at a possible implementation of it, first in ES5 form:

{% highlight javascript %}

var compose = function(f, g) {
  return function(x) {
    return g(f(x));
  }
};

{% endhighlight %}

It returns the value of g applied on f, as a function. In ES2015 form, it looks much more concise:

{% highlight javascript %}

const _compose = (f,g) => (x) => g(f(x));

{% endhighlight %}

If you’re having trouble understanding what compose is actually doing, try and log out our composite function without calling it with arguments:

{% highlight javascript %}

const sumOfHousehold = compose(getHousehold, sumAll);
console.log(sumHouseholdExpenses);

{% endhighlight %}

It returns:

{% highlight javascript %}

function (x) {
  return g(f(x));
}

{% endhighlight %}

And of course it does! That `x` argument is what’s ready to receive our `expenses` source, or any other source for that matter. `g` and `f` are internally stored ready to act upon this argument.

### Another example

At this point, our code isn’t very useful. Let’s keep writing a couple more methods to allow us to work with the data we have. For our purposes, we want to grab a list of all possible categories in our list of expenses. Using traditional functional programming in JavaScript, this is easy:

{% highlight javascript %}

const getCategories = (arr) => arr
  .map((item) => item.type);

{% endhighlight %}

Grab our source, and for each one return their type.
This gives us:

{% highlight javascript %}

[“Household”, “Services”, “Health”, “Household”]

{% endhighlight %}

Ops. It works, but we’re getting “Household” twice, because there are two household expenses. We want to filter duplicates out. Let’s write a (very naive) function that does this!

{% highlight javascript %}

const uniqueElements = (arr) => arr.filter((item, pos) => arr.indexOf(item) == pos);

{% endhighlight %}

So now we can easily compose a function that displays all of our unique categories:

{% highlight javascript %}

const uniqueCategories = compose(getCategories, uniqueElements);
uniqueCategories(expenses); // [“Household”, “Services”, “Health”]

{% endhighlight %}

It works! And just like this, we’re now slowly building a solid base with a lot of helper methods, all with a decent level of abstraction (although not point-free, that’s a topic for another post) and without any side-effects to their sources.

### Where to go next?

Be on the lookout for the next series on Functional Programming, and in the meantime feel free to check out the following great resources, which I found to be the most useful so far:

- [Learning FP using Rx](http://reactivex.io/learnrx/)
- [FP for JavaScript People](https://medium.com/@chetcorcos/functional-programming-for-javascript-people-1915d8775504#.e2zqfd8df)
- [The 2 Pillars of JS: Functional Programming](https://medium.com/javascript-scene/the-two-pillars-of-javascript-pt-2-functional-programming-a63aa53a41a4#.kedjszosc)

Once again, you can find the source code for this tutorial [on JSBin](http://jsbin.com/dupeme/edit?js,console)

That's it for this lesson, I hope you've enjoyed it,
and be on the lookout for part two. If you spot any typos or have any suggestions, don't be afraid to ping me on [Twitter](http://twitter.com/magalhini).
