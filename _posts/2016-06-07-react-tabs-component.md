---
layout:     post
title:      React Tabs Component
date:       2016-06-7 12:31:19
summary:    Re-creating a more dynamic and accessible Tabbed component using React and ES2015.
tags: [react, development]
categories: development
---

## React Tabs Component

The other day I was sniffing the web around for a simple implementation of an accessible Tabs component using React. I quickly came across a good, dead-simple implementation of one, written by [Todd Motto on his blog](https://toddmotto.com/creating-a-tabs-component-with-react/).

So if you want to learn how the component itself works, please have a read through Todd's post first!

Given that the post itself was a bit outdated, and the scope of that post wasn't really accessibility, I decided to re-write his logic changing the Component a bit, hopefully making it more modular and accessible. I've also re-written it in ES2015 syntax, because _ES2015 ALL THE THINGS_.

Here's a demo:

<a class="jsbin-embed" href="http://jsbin.com/porefa/embed?output">JS Bin on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?3.35.13"></script>

So let's take a look at our new requirements:

### Requirement #1: Dynamic data

The first requirement would be to accept a **configuration object** to build the tabs component, instead of hard-coding them. For this, we'll be working with a simple structure consisting of an array of objects that will provide the **label** of the tab and its **contents**. This will be treated as `props` in React.

{% highlight js %}
const tabs = [{
  name: 'Tab 1',
  content: 'Content for tab 1'
}, {
  name: 'Tab 2',
  content: 'Content for tab 2'

}, {
  name: 'Tab 3',
  content: 'Content for tab 3'
}];
{% endhighlight %}

So how does it work?

The component owns one piece of `state`: the `<Tabs>` component will keep track of which tab is currently selected. This will be marked by the `index` of each tab.

**Improvement & food for thought**: Instead of having the component own that piece of state for the selected Tab, we could pass down the behaviour as a property, instead of having it as a click handler. The benefit of this would be a much more decoupled implementation: for example, clicking a tab could then fire a *Flux* action instead.

### Requirement #2: Pre-select a tab

In the original tutorial, the choice of pre-selection of the active Tab wasn't working. We'll be giving this option at the top level component; if it's not there it will default to the first one (index 0).

So our main Application will pass this down as a `firstSelect` property:

{% highlight js %}
const App = (props) => {
  return (
    <Tabs selected={props.firstSelect || 0}>
    {...}
  );
}

ReactDOM.render(<App tabs={tabs} firstSelect={1} />, document.getElementById('app'));
{% endhighlight %}

In this example, we're selecting by default the second tab (index 1).

### Requirement #3: Accessibility

There are some improvements we can make to a tabbed component in order to make it a bit more accessible. The first thing we can do is to make use of a couple of ARIA labels: each item will have the following:

{% highlight js %}
<li role="tab" key={idx} aria-controls={`panel${idx}`}>
{% endhighlight %}

... and the list itself:


{% highlight js %}
<ul className="tabs__labels" role="tablist">
  {this.props.children.map(labels.bind(this))}

{% endhighlight %}

### Requirement #4: Turn components into stateless components

The `<Pane>` and the main `<App>` components are purely presentational, since they hold no logic at all. That means we can refactor it into a stateless component (given that we're using React 0.14+), like so:

{% highlight js %}
const Pane = (props) => {
  return <div>{props.children}</div>;
}
{% endhighlight %}

The full code:

{% highlight js %}
// from https://toddmotto.com/creating-a-tabs-component-with-react/

const tabs = [{
  name: 'Tab 1',
  content: 'Content for 1'
}, {
  name: 'Tab 2',
  content: 'Content for 2'

}, {
  name: 'Tab 3',
  content: 'Content for 3'
}];


const App = (props) => {
  return (
    <Tabs selected={props.firstSelect || 0}>

    {props.tabs.map(tab =>
      <Pane label={tab.name}>{tab.content}</Pane>)
    }
    </Tabs>
  );
}

const Pane = (props) => {
  return <div>{props.children}</div>;
}


class Tabs extends React.Component {
  constructor(props) {
    super(props);  

    this.state = { selected: this.props.selected };
  }

  _renderTitles() {
    function labels(child, idx) {
      let activeClass = (this.state.selected === idx ? 'is-active' : '');
      return (
        <li role="tab" key={idx} aria-controls={`panel${idx}`}>
          <a className={activeClass}  onClick={this.onClick.bind(this, idx)} href="#">
            {child.props.label}
          </a>
        </li>
      );
    }

   return (
      <ul className="tabs__labels" role="tablist">
        {this.props.children.map(labels.bind(this))}
      </ul>
    );
  }


  onClick(index, event) {
    event.preventDefault();
    this.setState({
      selected: index
    });
  }

  render() {
    return (
      <div className="tabs">
        {this._renderTitles()}

        <div className="tabs__content">
          {this.props.children[this.state.selected]}
        </div>
      </div>);
  }
}

ReactDOM.render(<App tabs={tabs} firstSelect={1} />, document.getElementById('app'));
{% endhighlight %}

Anything I might have overlooked or gotten wrong? Don't be afraid to ping me on [Twitter](http://twitter.com/magalhini).
