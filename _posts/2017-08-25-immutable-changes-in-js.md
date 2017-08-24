---
layout:     post
title:      Immutable changes to Objects and Arrays in JavaScript
date:       2017-08-25 12:31:19
summary:    Data immutability is an amazing pattern to minimise unpredictable behaviour in our code. But with raw JavaScript, we might need a refresher on their different implementations.
tags: [javascript, development]
categories: development
---

2017 is the year of data immutability 🙌 Well, in JavaScript, this is. Unlike most _trends_ in the world of JavaScript, code immutability is bound to stick around us for a while, and for good reason: firstly, because it's not _a trend_. It's a way of coding (and thinking about code) that promotes clarity, ease of use and understanding data flow, and makes code less prone to errors.

While the new syntax of JS gives us a more robust toolset to work with than ever before, without the use of libraries like **[Immutable.js](https://facebook.github.io/immutable-js/)**, things can still look a little bit scary when you put it all together, hence why getting comfortable with reading and writing the most common use cases is very helpful.

In this short post, we'll look at pure JS ways (ES2015++, and yes, I may have just invented this notation) to, add, remove, and update deeply nested properties in Objects, Arrays, and finding common patterns to reproduce these operations.

_Playground: [Direct link to the JS Bin](http://jsbin.com/kikajon/edit?js,console)_

## Objects

Let's take an initial object, `person`, which we can think of as being a piece of application state, that we want to change. À là redux thinking, we should always return a new copy of this object and **never change it directly**.

{% highlight javascript %}
const person = {
  name: 'Ricardo',
  location: 'Berlin',
  interests: {
    coffee: 9,
    climbing: 9,
    wasps: 0
  }
};
{% endhighlight %}

### Changing a simple object property

Modifying a top level property is remarkably simple using `Object.assign`. We'll explore more of its use cases (and alternatives) in a little bit, but for now let's simply create a modified copy of our object with `name` set to "Douglas".

{% highlight javascript %}
const updatedPerson = Object.assign({}, person, {
  name: 'Douglas'
});
{% endhighlight %}

_Simples_. We're telling Object.assign to _take this empty {}, apply person on top, and modify the name property_. The rest of our object looks the same.

### Changing deeply nested properties

Here's a common mistake when using `Object.assign` to copy an object: forgetting to copy the **inner objects** we're trying to mutate. Let's say we want to change the coffee: interest to 10 and `location` from "Berlin" to the "Moon" (a common train route from Berlin. It takes a while). What if we try the following application:

{% highlight javascript %}
const updated = Object.assign({}, person, {
  location: 'Moon',
  interests: {
    coffee: 10 // Crap! Only this one is copied
  }
});
{% endhighlight %}

On the surface, it might seem like this works, but this doesn't copy the rest of the `interests` object. It will leave us with an updated `{coffee: 10}` and `location: 'Moon'`, but it won't copy `climbing` or `wasps`. No one needs wasps, anyway. But how do we solve this?

Instead, we need to also deeply copy the `interests` object, like so:

{% highlight javascript %}
const updated = Object.assign({}, person, {
  location: 'Moon',
  interests: Object.assign({}, person.interests, {
    coffee: 10 // All other interests are copied
  })
});
{% endhighlight %}

Notice the double `Object.assign`. A bit verbose, in truth, as all objects need to be assigned in order not to lose properties.

### Spread operators

We can make this look more tidy by making use of the `spread` operator, which takes the form of `...` — in fact, the previous example can be re-written as:

{% highlight javascript %}
const updated = {
  ...person,
  interests: {
    ...person.interests,
    coffee: 10,
  }
}
{% endhighlight %}

Much nicer to look at! Spread operators are so incredible that you should definitely [read more about them at MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator).

## Deleting properties

Now, onto deleting (or removing) properties from objects. The `delete` keyword is a mutating action, so we can't use it when we're thinking about immutable data.

There's a few different ways to go around it, some more efficient than others. One approach is to recreate our entire object, but **ignoring the properties we want to be removed**. Let's create a function that accepts our object, and the name of the property we would like to see removed:

{% highlight javascript %}
const removeProperty = (obj, property) => {
  return  Object.keys(obj).reduce((acc, key) => {
    if (key !== property) {
      return {...acc, [key]: obj[key]}
    }
    return acc;
  }, {})
}
{% endhighlight %}

_Note: this was written in long form for readability's sake. You can omit some all of those return statements._

It looks a bit convoluted, but what's happening is pretty simple: for each key that **is not** the one we passed, we keep adding it to the accumulator, returned by the `reduce` function.
So now, if we wanted the `interests` property removed from our `person` object, we can use this like so:

{% highlight javascript %}
const updated = removeProperty(person, 'interests');
{% endhighlight %}

Which would give us a brand new copy of the object, except for that property:

{% highlight javascript %}
{
  name: 'Ricardo',
  location: 'Berlin',
}
{% endhighlight %}

### Aside: using lodash

If you're using **lodash** in your project, then you can make use of some its methods to help you change objects. **However, you should note that by default, most of lodash methods mutate the original objects**, which more often than not will mess up your immutable data. An exception, however, is [the `_.omit` method](https://lodash.com/docs/4.17.4#omit), which you can use to delete a property from an object.

Once again, let's try and remove the `interests` property like we did before, but using lodash. This time, we'll write it in a reducer-style function, just as an example:

{% highlight javascript %}
import { omit } from lodash;

const reducer = (state, action) => {
  switch (action.type) {
    case 'DELETE_KEY':
      return omit(state, action.key);
    default:
      return state;
  }
}
{% endhighlight %}

This will work, even without the */fp* subset of lodash. So if you're already using lodash, you'll get this for free.
We could use it like this:

{% highlight javascript %}
const newState = reducer(person, {
  type: 'DELETE_KEY',
  key: 'interests'
});
{% endhighlight %}

_...which would give us the same result. Once again, be weary of using some lodash methods when reassigning data, as **most of their methods mutate the original object**. Consider using the [/fp](https://github.com/lodash/lodash/wiki/FP-Guide) subset variation._

### More complex updating

Initially, it can be hard to grasp how to mix and match these operations for objects. Re-combinining properties, while updating them at the same time, is a pattern very commonly with Redux reducers. For practice, let's look at an example of a more complex operation.

Consider our original data, an array of users with an ID:

{% highlight javascript %}
const users = [
  {name: 'john', id: 176},
  {name: 'gary', id: 288},
  {name: 'louise', id: 213}
];
{% endhighlight %}

In **Redux**, it's common practice to [normalise your application state](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html), by having data grouped by ID for easier lookups. So let's say this is what we want to do now, we want a **new array** which has the users **grouped by ID**. For kicks, let's also have the **first letter of their names uppercased.**

In short, we want to go from the first table, to the second one:

![table](https://cldup.com/79MfpMU_bY.thumb.png)

How do we return the `object.id` as a key, though? This is where you'll see the `[item.id]: something` notation. It allows you to dynamically pull in the value and use it as a key. So with that in mind, let's write our `byId` function that also uppercases the first letter:

{% highlight javascript %}
const byId = (state) => state.reduce((acc, item) => ({
  ...acc,
  [item.id]: Object.assign({}, item, {
    name: item.name.charAt(0).toUpperCase() + item.name.slice(1)
  })
}), {})
{% endhighlight %}

This will **return a new object with the ID of each user as the key**, spreading all their values into each object, and modify their `name` properties to have the first character uppercase.

What if we wanted to update more properties, other than just the name? This is where you'll think about combining **pure functions** in order to manipulate the data as you need, but always returning a new copy. Let's refactor this a little bit by creating a `updateUser` function:

{% highlight javascript %}
const updateUser = (user) => Object.assign({}, user, {
  name: user.name.charAt(0).toUpperCase() + user.name.slice(1)
});

const byId = (state) => state.reduce((acc, item) => ({
  ...acc,
  [item.id]: updateUser(item),
}), {})
{% endhighlight %}

All we need now to get a new piece of state with our users grouped by ID is simply:

{% highlight javascript %}
const usersById = byId(users);
{% endhighlight %}

## Arrays

Cool, so what about arrays? Let's consider an original piece of immutable data, a very simple Array:

{% highlight javascript %}
const original = ['a', 'c', 'd', 'e'];
{% endhighlight %}

Having an array, you would often want to do one of the following:

- Insert an item by index
- Remove an item by index
- Remove by item
- Insert an item to the end

### Inserting by index

We've conveniently forgot to add `b` next to the `a` value in our index. Oh no, what a tremendous disaster for our alphabet app! How do we insert an item at a given index, in an immutable fashion?
One way to think about it is to:

- 1) _Copy the array until the specified index_

- 2) _Add our new item_

- 3) _Copy the rest of the array from the specified index_

So we could write a helper function with the following signature:

`insertByIndex = (state, newItem, insertAt)`

> Where `state` is the original array, `newItem` is the value of the item we'd like to add, and `insertAt` is a number (index) at which location we want to insert our `newItem`.

A simple way to write such a helper function could be the following:

{% highlight javascript %}
const insertByIndex = (state, newItem, insertAt) =>
  [
    ...state.slice(0, insertAt),
    newItem,
    ...state.slice(insertAt)
  ]
{% endhighlight %}

_Wait, what?_

Okay, let's break this down. We've already seen that the `spread` operator (...) copies values, and that's exactly what we're doing here. First, we're returning a new Array; copy it from the beginning until our index, insert our new value (`b`), then copy the rest of the array from there.

So an example of its usage would be:

{% highlight javascript %}
insertByIndex(original, 'b', 1) // ["a", "b", "c", "d", "e"]
{% endhighlight %}

### Removing by index

Removing an Array by index is much simpler, luckily, as long as we can afford to use `Array.filter`.
Let's think: The `filter` method gives us the index value as the second argument, so that means we want to return *all values which don't have the index of N*.

{% highlight javascript %}
const removeByIndex = (arr, at) => arr.filter((item, idx) => idx !== at);
{% endhighlight %}

### Removing by item

If you want to remove an item directly (say, `b`, instead of its index), we can still use `filter` like we did previously, but we'll filter out the item itself and forget about the index:

{% highlight javascript %}
const removeByItem = (arr, value) => arr.filter((item) => item !== value);
{% endhighlight %}

### Adding an item

Adding an item to the end of an Array is also quite simple, but **don't you dare to think of push!** In fact, good old `concat()` is your immutable friend. Using `.push` mutates the original array, which will inevitably lead to unpredictable behaviour.

{% highlight javascript %}
const addItem = (arr, value) => arr.concat(value);
{% endhighlight %}

So if we wanted to add `banana` to our alphabet array (why wouldn't you?), we could do:

{% highlight javascript %}
addItem(original, 'banana') // ["a", "c", "d", "e", "banana"]
{% endhighlight %}

## Food for thought

Even if you're using an immutable library like Immutable.js or the [fp flavour of lodash](https://github.com/lodash/lodash/wiki/FP-Guide), it's still a great idea to have a good grasp of how immutability works with simple JavaScript. Immutable.js comes at a rather hefty weight as a dependency, and there are alternatives such as the also popular [dot-prop-immutable](https://github.com/debitoor/dot-prop-immutable).

When should you use a library for immutability or go raw with JavaScript? That really depends on the complexity of your data changes, the amount of overhead you can bring both to your codebase and to your team (it's _yet another thing to learn_). I'd argue that knowing the barebones implementation of most patterns is useful to understand, especially when using Redux or any other similar pattern that thrives in code immutability.

**Very useful resources:**

- [Intro to Immutable.js](https://www.sitepoint.com/immutability-javascript/)

- [Redux Immutable Patterns](http://redux.js.org/docs/recipes/reducers/ImmutableUpdatePatterns.html)

- [More ES2015 examples](https://wecodetheweb.com/2016/02/12/immutable-javascript-using-es6-and-beyond/)

- [Spread Syntax: MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator)

___

Anything I might have overlooked or gotten wrong? Don't be afraid to ping me on [Twitter](http://twitter.com/magalhini).
