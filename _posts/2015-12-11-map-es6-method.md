---
layout:     post
title:      Using ECMAScript6 Map()
date:       2015-12-11 12:31:19
summary:    A quick overview of a still overlooked new ES6 method.
tags: [javascript, es6]
categories: development
---

Even though I've been using ECMAScript6 for quite a while now, I'm still far from using it on its full potential. One of the reasons is that up until now I've been completely overlooking the new `Map` method, which consists of a simple key/value map with a few helper methods.

Despite its apparent simplicity, most of us keep re-implementing this functionality over and over again for every project, one way or another. It can be particularly useful to keep track of properties, state, or to simply have a list of properties that you can iterate through using other ES6 methods. [MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map) describes it as such:

> The Map object is a simple key/value map. Any value (both objects and primitive values) may be used as either a key or a value.

Its benefit comes from the built-in functionality that it has, such as **getters**, **setters** and methods for length, deletion and so on. Here's a quick overview:

### Creating a Map

{% highlight javascript %}

let map = new Map();
map.set('user', 'John');

map.get('user') // >>> 'John'

{% endhighlight %}

Pretty straightforward: we have `get` and `set` methods available with which we can set key/value properties on the map. We can also check if a key is available on the Map by using `has`:

{% highlight javascript %}

let map = new Map();
map.set('user', 'John');

map.has('user') // >>> true

{% endhighlight %}

No more checking against `.length` or `!!(property)`! The `user` key exists. The benefit of `has()` is that the value of the given key can be `falsy` and we're still strictly checking against the existence of the key.

As for properties, its length can be verified with the `size` property, like so:

{% highlight javascript %}

let map = new Map();
map.set('user', 'John');

map.size; // >>> 1

{% endhighlight %}

### Iterators and more iterators

The true fun of `Map` however, starts when we make use of its iterable properties. Using its `values` or `entries` methods returns new Iterator objects that we can use to, well, iterate! A neat trick that I've discovered recently consists in pairing these with the also new `Array.from()` method if an array-like iteration is desired.

{% highlight javascript %}

let map = new Map();

map.set('user', 'John');
map.set('id', '3452');

// Iterator for its keys
map.keys(); // >>> MapIterator {"user", "id"}

// Iterator for its values
map.values(); // >>> MapIterator {"John", "3452"}

// Turn the iterator keys into an Array
Array.from(map.keys); // >>> ["user", "id"]

{% endhighlight %}

Notice the last example; Map is highly versatile, and it's particularly useful to use in Model-like instances without having to worry about the basic manipulation logic.

In fact, calling `Array.from()` on the Map itself returns a useful Array where each element contains an Array with both key and value pairs available:

{% highlight javascript %}

let map = new Map();

map.set('user', 'John');
map.set('id', '3452');

// Convert the iterator into an array
Array.from(map); // >>> [["user", "John"], ["id", "3452"]]

{% endhighlight %}

Another cool thing is that complex data types can be used as keys. Here, we are storing an `Object` as the key for the Map itself, followed by its value:

{% highlight javascript %}

let map = new Map();
const user = {name: 'John'};

map.set(user, 3452);
map.has(user); // >>> true

map.clear(); // example on how to clear everything on the map

{% endhighlight %}

### Where to go from here

I'd suggest getting familiar with the other properties and methods provided at the [MDN documentation](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map) as a start, and play around with them on JSBin.

If you're using Map already, I'd love to hear where and how you're using it. Which are the best use cases you've found so far?

Shout out to me on [Twitter](http://twitter.com/magalhini).
