---
layout:     post
title:      Learning ES6 — Part I
date:       2015-08-14 12:31:19
summary:    Learning the various bits and pieces of ES6, step by step with a few practical code examples.
tags: [javascript, es6]
categories: development
---

Lately I've been trying to use every single possible excuse to write my JavaScript in ES6
form, especially on smaller side projects. The issue with the new features and syntax is,
as with anything new you're learning, practice: fail to do it often and it all slips by
in a week or two.

<blockquote>
  <p>
    How do I write an arrow function again?
  </p>
  <footer>Myself, every 7 days</footer>
</blockquote>

So I'm sharing a few lessons learned as a way to make them stick into my head, and by hopefully
helping you understand these features better just as well. In this first lesson, we'll cover:

- **Variable Types**
- **Arrow Functions**
- **Classes**
- **Extending Classes**
- **Templates**

You can obviously learn so much more about ES6 elsewhere. The guys at **2ality** have an incredible
[guide to ES6](http://www.2ality.com/2015/08/getting-started-es6.html) that covers a lot of the new features. Eric Douglas is compiling a pretty handy list of ES6 resources [on Github](https://github.com/ericdouglas/ES6-Learning). Also check out the Babel guides on [ECMASCRIPT6](https://babeljs.io/docs/learn-es2015/) if you need to dive a little deeper into these concepts.

One of my recent favourites is [Tower of Babel](https://github.com/yosuke-furukawa/tower-of-babel), a series of challenges provided via CLI to help you understand pretty much all features of ES6.

If you'd like to quickly try ES6 without having to set yourself a project, perhaps the quickest way to do
it is to jump into JSBin and set the JavaScript engine to **Babel**, and just start coding. [Here's something](http://jsbin.com/wecoga/edit?js,console) to get you started!

## Variables: `let` there be `const`

Variables in JavaScript have always been a bag of mixed feelings: the `var` keyword is as simple
as it is confusing for beginners, especially when it comes to hoisting, closures and generally everything
that relates with block scope.
The new `let` and `const` keywords concern how variables can now be treated in ES6. The classic `var` keyword is still accepted of course, and it still works the very same way you'd expect it to work.

### The let keyword

The main difference between `var` and `let` is its scope. `let` now restricts the scope of the variable to the current block, unlike `var` does. Here's its simplest example:

{% highlight javascript %}
if (1) {
  let x = 'hi';
  var y = 'there';
}

console.log(x); // Reference error
console.log(y); // 'there'

{% endhighlight %}

This makes it great for iterating over loops, for example, as the value of the index will always be block scoped and you'll always get the current value without needing to resort to a funny closure workaround.

### Constants

The `const` keyword works just like `let` does, meaning it also restricts its scope to the block where it is being used. However, unlike `let`, `const` assignments are immutable. They are literally constants, which means you'll get an error thrown if you attempt to change their value.

{% highlight javascript %}
const myConst = 1;
myConst = 2; // immediately throws an error
{% endhighlight %}

### Complex types: semi-immutable

However, complex types are not fully immutable. This means that both Arrays and Objects' values can be altered, as long as the original constant type remains the same.

{% highlight javascript %}
const arr = [1,2];
arr[0] = 'a';
arr[1] = 'b';
arr.push('c');

// This is like, totally allowed.

const obj = { val: 1 };
obj.val = 2;

{% endhighlight %}

## Classes: Creating and extending

Rejoice, JS has now Classes! Well, a syntax for them at least. Under the hood, they work
mostly like you're already used to manage prototypal inheritance.

In ES5 you'd typically write something like this:

{% highlight javascript %}
function API(url) {
    this.url = url;
}

API.prototype.getUrl = function () {
    return 'Getting ' + this.url;
};
{% endhighlight %}

And in ES6, this would be its equivalent:

{% highlight javascript %}

class API {
    constructor(url) {
        this.url = url;
    }

    getUrl() {
        return 'Getting ' + this.url;
    }
}

{% endhighlight %}

More on getters and setters later.

### Extending Classes

The first thing to note about extending classes is that by default, the `Super` class is simply an `Object`.
Classes can be created by simply stating:

`class Page {}`

This is then the same as writing:

{% highlight javascript %}
class Page extends Object {}
new Page()  // instanceof Object === true
{% endhighlight %}

Classes that extend each other following this principle are also instances of an Object. Continuing with the previous example:

{% highlight javascript %}
class SubPage extends Page {}
new SubPage() // instanceof Object === true
{% endhighlight %}

This also means that classes which inherit from each other are also instances of their parents.
Predictably so.

{% highlight javascript %}
class SubPage extends Page {}
new SubPage // instanceof Page === true
{% endhighlight %}

### Under the hood with Prototypes

To get a better understanding of what's really happening with plain old JavaScript, we can easily check that classes that inherit from others also share their prototype.

{% highlight javascript %}
class Item {}
class SubItem extends Item {}
Item.isPrototypeOf(SubItem) // === true
{% endhighlight %}

And perhaps more importantly, their actual prototype is the very same:

{% highlight javascript %}
Item.prototype.isPrototypeOf(SubItem.prototype) // === true
{% endhighlight %}

### A practical example

The following demonstrates how we can implement getter methods without explicitly declaring them.
Notice how simply writing a `get name()` method allows us to call it using `getName()`.

{% highlight javascript %}
class Item {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }
}

class PricedItem extends Item {
  constructor(name, price) {
    super(name);

    this._price = price;
  }

  get price() {
    return this._price;
  }
}

let item = new Item('product');
let item2 = new PricedItem('product2', '25.99');

{% endhighlight %}

### Super

When extending classes, you can easily access the inherited methods from the parent using super. However, it's worth nothing that simply redefining the method in the extended class will not automatically override the previous method; it still expects to be called using the super reference.

Take the following example:

{% highlight javascript %}

class A {
  sayHi() {
      return 'Hello';
  }
}

class B extends A {
  sayHi() {
      return super.sayHi();
  }
}

new B().sayHi() // 'hello'

{% endhighlight %}

In the above example, we told our B Class to return its Super method, so it also returns "hello".

## Extending Classes with Parameters

An interesting case for extending classes with the new ES6 possibilities is to make use of the new rest arguments, which is accessed as three dots (...). This is different from using the arguments keyword, as the arguments themselves are already accessible as an array.

Here's a sample implementation of how you can extend a Class passing in all the parameters the Parent Class accepts:

{% highlight javascript %}
class Parent {
  constructor(value1, value2) {
    this.total = value1 + value2;
  }
}

class Child extends Parent {
  constructor(...args) {
    super(...args);
  }
}

var child = new Child(1,4);
console.log(child.total) // === 5
{% endhighlight %}

child.total equals 5, because we're giving the Child class 2 arguments, receiving them at the constructor level and sending them up to the parent using the super() call.


## Arrow Functions

Arrow functions represent not only a new way of creating a function, but also do so by preserving
the value of `this` within its context. This means that you don't need to, in most cases, to either
store the true value of `this` in those nasty `var self` or even to use bind.

But first, let's see how they compare to ES5 methods. Personally, the biggest value of Arrow
functions for me is how concise, short and sweet they look on functional programming, especially
for very simple callbacks.

In their simplest form:

{% highlight javascript %}

var func = () => {  return 'I can return' ;}

{% endhighlight %}

Which predictably outputs:

{% highlight javascript %}

function func() {
  return 'I can return';
}

{% endhighlight %}

Actually, you don't even need the `return` keyword.

{% highlight javascript %}
var func = () => 'I can return';
{% endhighlight %}

### Parameters

{% highlight javascript %}
var func = param => param + 1;
{% endhighlight %}

Which generates:

{% highlight javascript %}

function func(param) {
  return param + 1;
}

{% endhighlight %}

Let's do a typical ES5 map:

{% highlight javascript %}

var arr = [1,2,3];
var squares = arr.map(function(item) {
    return item * item;
});

{% endhighlight %}

And its ES6 counterpart:

{% highlight javascript %}

let arr = [1,2,3];
let squares = arr.map(item => item * item);

{% endhighlight %}

If the method receives only one argument, there's no need to wrap it in parenthesis.
Let's check out a fully functional sequence:

{% highlight javascript %}

let arr = [1,2,3,4];

let b = arr
  .filter(el => el > 2)     // get bigger than 2    === [3,4]
  .map(el => el * 2)        // multiply each by 2   === [6,8]
  .reduce((a,b) => a + b);  // sum all values       === 14

console.log(b); // 14

{% endhighlight %}

## Template Strings

Template strings are a wonderful way to escape the doom of concatenating strings in a very ugly
way all the time. In a nutshell, here's how they work.

### Multiline Strings

You can have multiline strings without the need to add `\n`.

{% highlight javascript %}

var line = `I am the
  content
  for this
  multiline`;

{% endhighlight %}

### Interpretation

Adding values to be interpreted can be achieved by using `${x}`:

{% highlight javascript %}

var x = 20;
var msg = `hello ${x}`;

console.log(msg); // hello 20

{% endhighlight %}

### Sending them as arguments

This is a very cool one, you can send template strings as arguments to methods just as you would
with any string.

{% highlight javascript %}

function toUpper(str) {
  return str.toUpperCase();
}

var uppercased = toUpper(`uppercase me`);
console.log(uppercased); // === UPPERCASE ME

{% endhighlight %}

### Accessing values in the template

Notice how the arguments after the first one consist of the multiple values
sent individually to the function.

{% highlight javascript %}

function showValues(array, valueOne, valueTwo) {
  console.log(valueOne) // "avocados"
}

showValues`one=${"avocados"}, two=${"rock"}`;

{% endhighlight %}

That's it for this lesson, which was also my very first post on this blog. Yay! I hope you've enjoyed it,
and be on the lookout for part two. If you spot any typos or have any suggestions, don't be afraid to ping me on [Twitter](http://twitter.com/magalhini).
