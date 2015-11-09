---
layout:     post
title:      Babel 6 and React 0.14
date:       2015-11-09 12:31:19
summary:    Both Babel.js and React.js recently introduced breaking changes from previous releases. Here's how to get them all to play well together.
tags: [javascript, es6, react]
categories: development
---

#### In this article: Setting up a boilerplate app using Babel, React and Browserify with ES6 and ES7 support.

Recently, [Babel.js](http://babeljs.io/blog/2015/10/29/6.0.0/) released their 6.x version which introduced several breaking changes from previous versions, causing a bit of personal panic on a project I'm working on. In a nutshell, most internal packages have now been externalised and it's up to you to individually require all the modules that you need to work with directly. A bit similar to what happened with Grunt quite a while ago: you get the core module, everything else is *opt-in*.

Babel now works by bundling `Plugins` and `Presets`. You can read about these in more detail on their latest release notes.

On this post, I'll run you through a very quick and simple implementation on how to get a project set up using Babel, React (and their `0.14` changes) with Browserify.

During the process, we'll also enable some ES7 experimental features to get an idea on how Babel presets work, bundling a bunch of them at once.

If you'd like to jump straight into the sample project, it's hosted on [Github](https://github.com/magalhini/react-es7-babel-browserify-sample); clone it and run `npm install`.

### The setup

Let's start by installing all the necessary dependencies. Before, while installing `babelify` alone would be enough, we now need to also install presets to make the compilation process work with ECMAScript6 and React. Luckily, Babelify already provides bundles (what they call "Stages") that include several packages of these new ES6 and ES7 features, so you don't have to install every single one of them individually.

For our sample project, start by creating an empty project using `npm init` and save the following packages:

{% highlight bash %}

npm install --save-dev babelify browserify babel-preset-stage-0 babel-preset-react babel-preset-es2015

{% endhighlight %}

That's it for the deveveloper's dependencies. Now moving onto React, one of the biggest changes with 0.14 is the splitting of the React framework from ReactDOM; you now have to install and use them separately.

The folks at ReactKungFu have written a nice [comprehensive guide](http://reactkungfu.com/2015/10/upgrading-to-react-014/) on how to upgrade to this version and you should definitely check it out.

{% highlight bash %}

npm install --save react react-dom

{% endhighlight %}

## The build script

Let's set up a build script using `npm`. Instead of specifying directly in the browserify command which presets we want to use, it's preferable to keep this as modular as possible and keep that piece of configuration separately; a separation of concerns, if you will. So for now, all you need is to include the script in your `package.json` file, like so:

{% highlight bash %}
"scripts": {
    "build": "browserify src/index.js -o dist/bundle.js"
  }
{% endhighlight %}

Very simply, running `npm build` will grab the `src/index.js` file and output the build in `dist/bundle.js`.

## Configuring Babel

At this point, Babel doesn't know that we want to use either *React*, *ES6* or *ES7* features. If you tried to compile any code containing one of these you'd get an error; Babel now needs to be taught that it's expecting these features.

We can do this by creating a `.babelrc` file in our project folder and dumping our configuration object there.
Quite simply:

{% highlight bash %}
{
  "presets": ["es2015", "stage-0", "react"]
}
{% endhighlight %}

To learn more about Babel's presets, check out [all the available ES2015 packages](https://babeljs.io/docs/plugins/preset-es2015/). Here's the one [for React](https://babeljs.io/docs/plugins/preset-react/).

## Configuring Browserify

Cool, Babel now knows what we'll be using. Next, configuring Browserify and telling it we want to transform our source files using Babelify (which in turn will use the previous configurations we just set up, so we don't need to worry about them at this point).

Getting back to our `package.json` file, we drop this object literal in the middle of it:

{% highlight bash %}

"browserify": {
    "transform": [
      ["babelify"]
    ]
}

{% endhighlight %}

## A sample React 0.14 usage

Here's an app that finds Batman.

It does very little: we'll be importing a `Utils` object that contains the data and the methods to find Batman.
The app itself is merely a React Class that makes use of the separate modules on the `+0.14` build, using ReactDOM.

You can find the commented code on the [Github file](https://github.com/magalhini/react-es7-babel-browserify-sample/blob/master/src/index.js).

{% highlight javascript %}

import Utils from './utils';
import React from 'react';
import ReactDOM from 'react-dom';

class Item extends React.Component {
	static defaultProps = {
		onClickHandler: null
	}

	constructor() {
		super();
		this.findBatman = ::this.findBatman;
		this.state = { hasBatman: false };
	}

	findBatman() {
		let batmanFound = Utils.data.filter((item) => item === 'found batman!');
		this.setState({ hasBatman: !!batmanFound });
	}

	render() {
		let { hasBatman } = this.state;

		let text = hasBatman ? 'We found Batman!' : 'Where is Batman?';
		let disabled = !!(hasBatman);
		let buttonText = hasBatman ? 'He was found' : 'Find Batman!';

		return(
			<div>
				<p>{text}</p>
				<button disabled={disabled} onClick={this.findBatman}>
					{buttonText}
				</button>
			</div>);
	}
};

ReactDOM.render(<Item/>, document.getElementById('app'));

{% endhighlight %}

## What's going on

A few things to note here: We now have, as discussed, a separate `React` and `ReactDOM` modules.
We are also creating a React component by extending `Component` and not by using `React.createClass`, which is how you should define and create React Components using ES6.

Since we're making use of ES7 experimental features (which is why we installed the `stage-0` preset!), we can set React's defaultProps using a `static` method. Remove the `stage-0` preset from our configuration and this code won't be valid anymore, requiring you to set up the properties on the class directly.

Another nicety of ES7 concerns the `::this.findBatman` method. Since creating a `React.Component` class requires our methods to be bound to its instance again, we have to do this nasty binding in the Class constructor. The `::` syntax is exactly the same as the following:

{% highlight javascript %}
this.findBatman = this.findBatman.bind(this);
{% endhighlight %}

You can read more about the ES7 binding operator in [this pretty cool post](http://blog.jeremyfairbank.com/javascript/javascript-es7-function-bind-syntax/).

## Putting it all together

That's pretty much it, assuming you already pulled the `Utils.js` file from the [repository](https://github.com/magalhini/react-es7-babel-browserify-sample/blob/master/src/utils.js). Now if we run `npm build` in the terminal, Browserify will compile our entry point, transform it using `Babelify`, which we taught how to expect React's syntax and ES6/7 features.

After that, you should have a `bundle.js` file in a `/dist` folder that you can include in your page as a regular script.

## Bonus: live compilation using Watchify

As a small nicety, we can also make use of the installed `watchify` package and set up an `npm` script that will automatically recompile the code for us every time we make changes to it. All we need to do is [add this line](https://github.com/magalhini/react-es7-babel-browserify-sample/blob/master/package.json#L9) to the `scripts` object literal in the `package.json` file and, of course, install the package itself:

`npm install --save-dev watchify`

Running `npm run start` now recompiles our code in the fly.

Ping me on [Twitter](http://twitter.com/magalhini) if there's something else you'd like to be added to this post. Also a huge thanks to [Luís Couto](https://twitter.com/coutoantisocial) for bearing with my ramblings on these Babel updates and for providing me a breakdown on the future of Babel!
