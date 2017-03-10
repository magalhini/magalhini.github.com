---
layout:     post
title:      React Render Callback Pattern
date:       2017-03-10 12:31:19
summary:    A very clean and efficient pattern for rendering conditional components in React.
tags: [react, development]
categories: development
---

I've recently stumbled upon a very interesting rendering pattern in React that I don't see very often in the wild. I believe it's known as **render callback pattern** and it's a useful pattern when you don't want to overcomplicate children receiving properties using `React.cloneElement` or any of that fancy (though useful) magic.

_Code: [Direct link to the JS Bin](http://jsbin.com/pazejo/edit?js,output)_

Here's how we would like to use it:

{% highlight javascript %}
const App = () => {
  return (
    <div>
      <FieldItem username='magalhini'>
        {user => user === null
        ? <Loading />
        : <Profile info={user} />}
      </FieldItem>
    </div>
  );
};
{% endhighlight %}

### The problem

`FieldItem` will render either the `Loading` or the `Profile` component, depending on the existence of a `user` property. It also passes down a prop of its own, `username`, that one of these components can consume to make a call, for example.

What is interesting here is that `<FieldItem/>` uses a function as a child. Any **child component inside it** is now free to consume this `prop` however it needs to, totally decoupled from the parent. How cool is that?

### How to make this work

To make the above work, the key is to treat `this.props.children` as a function. So in order for the `Profile` component to render whatever it needs to render, it needs to run the callback on the `children` function, passing it the `user` argument it expects. Here's an example implementation of `Profile`:

{% highlight javascript %}

class FieldItem extends React.Component {
  state = { user: null }

  componentDidMount() {
    // We can make an ajax call here, for e.g.
    setTimeout(() => this.setState({
      user: `I have now fulfilled something for ${this.props.username}`
    }), 1500);
  }

  render() {
    // Render the children with a function using state as the argument
    return this.props.children(this.state.user);
  }
}
{% endhighlight %}

### Breaking this down

The key there is the child component rendering `return this.props.children(this.state.user)` with its own state. **This means its up to the component to decide how to use the arguments it receives**, and the parent component `FieldItem` doesn't care: it only manages which component to render, in this case.

Looking at `Profile`, since `user` is `null` for 1500ms, the callback receives `null` as a value for `user`, thus rendering `<Loading />` first. Once we have a `user`, the Profile component will then render. I really enjoy the simplicity and the cleanliness of this approach managing components.

A working example:

<a class="jsbin-embed" href="http://jsbin.com/pazejo/2/embed?js,output">JS Bin on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?3.41.6"></script>
___

Anything I might have overlooked or gotten wrong? Don't be afraid to ping me on [Twitter](http://twitter.com/magalhini).
