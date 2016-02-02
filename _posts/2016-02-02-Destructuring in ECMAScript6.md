---
layout:     post
title:      Learning ES6 — Destructuring
date:       2016-02-02 12:31:19
summary:    Diving into more detail on ES2015's features. This time, destructuring objects, arrays and functions.
tags: [javascript, es6]
categories: development
---

Having used some features of ES6 for the past few months, I've noticed there are a few that I find myself using all the time and I consider to be real time savers. One of those is Object and Array destructuring, which turns out can also be used for Functions as well, which I only learned quite recently.

This will be a quick post showing off how you can use this feature for most value types.

### Arrays

Destructuring an Array is very simple: use square bracket notation around your assignments to grab the values according to the Array's order.

{% highlight javascript %}
const myArray = [23.3, 56.3];
let [first, second] = myArray;

console.log(first); // 23.3
console.log(second); // 56.3

{% endhighlight %}

Pretty simple: we're creating `first` and `second` variables which will grab the values from the Array, in order.
**Protip:** You can use commas to skip values! `[first,,third]` would literally skip the second value from the Array and return the third one.

### Objects

Destructuring objects in ES6 is a very powerful feature, mostly because it allows you to perform some transformation to the values at the same time. The most simple example of object destructuring is quite simply grabbing a value with the same variable name we're creating, like so:

{% highlight javascript %}

const {directPropertyName} = {
    directPropertyName: 'adventure',
    doesntMatter: 'time'
};

console.log(directPropertyName); // 'adventure'

{% endhighlight %}

Cool! From what could be an object of any size, we've created a variable that will look for its name as a key in that object, and assign itself the value. But we can extend this further and assign a **different name** to the variable, while specifying the key to look for in the object:

{% highlight javascript %}
const {
    directPropertyName: show
    } = { directPropertyName: 'adventure' };

console.log(show); // 'adventure'

{% endhighlight %}

Noticed the trick there? Using the `:` separator, we can specify "hey, grab *this* property and assign it to *that* variable."

### Methods

Destructuring in methods is a feature I haven't used much until very recently, because it's very easy to forget about. Paired with the default arguments though, it becomes a very useful tool in the tool belt to keep function boilerplate (think validation, verification, etc) at a minimum.

Here's a simple example: a method that logs out (using ES6 templating, why not?) the `name` property of an object that is sent to it.

Traditionally, it would look like the following:

{% highlight javascript %}
const readOut = obj => {
  console.log(`Things that are cool: ${obj.name}`);
};

readOut({
  name: 'Beards'
});

{% endhighlight %}

The `readOut` method here accepts the entire object, and looks for the `name` property at the same time that it's logging it out. Nothing new here, right? But it turns out we can do the following:

{% highlight javascript %}
const readOut = ({name}) => {
  console.log(`Things that are cool: ${name}`);
};

readOut({
  name: 'Beards'
});

{% endhighlight %}

Spotted the difference? We are now destructuring the `name` property directly in the method's arguments. The logging function is now spitting out the value of that directly.

**What if there's no value?**

Great question! And here comes ES6 default values to the rescue! There's no need to check directly for the integrity of the property value inside the function, as we can do so now within the arguments. An example:

{% highlight javascript %}
const readOut = ({name = 'Coffee'}) => {
  console.log(`Things that are cool: ${name}`);
};

readOut({}); // 'Coffee'

{% endhighlight %}

No `name` property was passed in as an argument, but we defined a default argument value. Note that we still need to pass in an object, even if it's an empty one, to the function.


That's it for this lesson, and be on the lookout for next parts. If you spot any typos or have any suggestions, don't be afraid to ping me on [Twitter](http://twitter.com/magalhini).
