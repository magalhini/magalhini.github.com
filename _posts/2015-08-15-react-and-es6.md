---
layout:     post
title:      Writing React Components with ES6
date:       2015-08-16 11:31:19
summary:    Transitioning from the classical way of writing React Components into ES6 has its quirks, but once you wrap your head around the new syntax, it's a breeze and a pleasure to work with.
tags: [javascript, es6, react]
categories: development
---

#### I'm becoming the biggest fan of writing React.js applications alongside Webpack and Babel, to take full advantage of some of the new ECMASCRIPT6 features.

However, writing React components in ES6 poses a couple of new issues which took me a while to fully figure out, especially when it comes to bound functions and mixins. As far as I'm aware, you can't use mixins in the same traditional React way, so we're going to have a look at how to overcome this.

### A simple class

A typical React class looks like the following:

{% highlight javascript %}
var React = require('react');

var Home = React.createClass({
  render: function() {
    return (<div></div>);
  }
});

module.exports = Home;
{% endhighlight %}

Let's ES6'ify this mother!


{% highlight javascript %}
import React from 'react';

class Home extends React.Component {
  render() {
    return (<div></div>);
  }
};

export default Home;
{% endhighlight %}

The main takeaways here are:

1. The `import`, which will replace the traditional `require` from your app. It also allows you to perform destructuring, so you can have multiple imports from the same source, which we're going to have a look at soon.
Since we're now extending classes, we're no longer creating a new instance of `createClass` and we need to extend `React.Component` directly.

2. Also notice how the `render` method (and all other methods) takes full advantage of the short syntax, dropping the `function` keyword.

3. Lastly, `module.exports` now becomes `export default`, followed by the `Class` name.

## Destructuring

If you haven't had a look at how destructuring works in ES6, there's no need to worry.
Making the transition as far as requiring modules goes is a very simple and obvious change once you figure
out the pattern.

Take a look at the following example:

{% highlight javascript %}
var Router = require('react-router').RouteHandler();
{% endhighlight %}

How to ES6'ify this? You can use destructuring:

{% highlight javascript %}
import { RouterHandler } from 'react-router';
{% endhighlight %}

And that's pretty much it. Notice that multiple imports are also supported:

{% highlight javascript %}
import { Object1, Object2 } from 'my-module';
{% endhighlight %}

## PropTypes

Another thing that changes in terms of implementation is `PropTypes`. Typically in React, these would simply be a declared object variable or defined directly inside your Class. Instead, with ES6 they need to be defined on the Class instance, like so:

{% highlight javascript %}
import React from 'react';

class Home extends React.Component {
  render() {
    return (<div></div>);
  }
};

Home.propTypes = {
  name: React.PropTypes.string.isRequired;
}

export default Home;
{% endhighlight %}

### Mixins

This is probably where most people get stuck when transitioning a React application to ES6, and so did I for a good while until the good folks at [Egghead](http://egghead.io) explained how this now works.

Let's include a simple mixin in our initial ES5 example:

{% highlight javascript %}
var React = require('react');
var Router = require('react-router');

var Home = React.createClass({
  mixins: [Router.Navigation],

  render: function() {
    var param = this.getParams().username;
    return (<div></div>);
  }
});

module.exports = Home;
{% endhighlight %}

Here, as an example, we're including the popular `react-router` module, which makes use of a mixin to use its properties.

With ES6 classes, **mixins are not allowed**. In the case of the Router, we need to introduce this new idea of **context** in React, so we can directly pass a function directly to each child, instead of specifically relying on the mixin. You can access this by using the `contextTypes` directly on the class itself.

Here's how it looks now, ES6'ified:

{% highlight javascript %}
import React from 'react';

class Home extends React.Component({
  render() {
      var router = this.context.router;
      var param = this.getParams().username;
      return (<div></div>);
  }
});

Home.contextTypes = {
    router: React.propTypes.func.isRequired
};

export default Home;

{% endhighlight %}

Let's break it down:

1. We don't need to include the Router import anymore. The `Router` module should be passed down
from the parent that's instantiating the child, so the Router state is now part of `this.props`.
The RouteHandler is now responsible to pass this state down.

2. Explicitely state that the class is expecting a function that will be a part of its `contextTypes`,
and assign it to router.

3. Now we can access the Router by using the Class's context.
