---
layout:     post
title:      Hardware for Front End Developers
date:       2016-12-19 12:31:19
summary:    For the Web Advent Calendar of 2016, here's an introduction to johnny-five, Arduino and web interactivity. I'll explain how my interactive "Light My House" project was built, in the process.
tags: [arduino, development]
categories: development
---

##### And a little Christmas project.

<div class="post__intro">
Hey! This article and project was written specifically for the wonderful <a href="http://web.advent.today">Web Advent Calendar 2016</a> of <a href="https://twitter.com/kosamari">@kosamari</a>. Make sure not to miss the other selected articles!
</div>

One of my very few regrets in my *professional life* is not having started sooner tinkering with electronics and physical hardware.

Granted, I was always put off by the fact that "_I don't know a single thing about electronics_". As a front-end developer who didn't even have an engineering background in University, the physical world of wires, LEDs, capacitors and other strange words has put me off from this side of development until about a year ago.

However, despite still fumbling for help and instructions on how to wire electronic components together, here's something I've made in a day. [This page,](http://therapeutic-appliance.surge.sh/) controls the following:

<iframe width="590" height="345" src="https://www.youtube.com/embed/H3JkoRcEhp8" frameborder="0" allowfullscreen></iframe>

_Anyone on the Internet can control the colour of the tiny little house on my desk. It's as fun as it is surprising and annoying! Here I'm using an iPad as an external user to change the colour._

[I wrote an introductory article about getting started with an Arduino](http://blog.ricardofilipe.com/post/getting-started-arduino-johhny-five), after having bought a Starterkit that already included a bunch of components that would be more than enough to get me started. It comes with a little handbook of project instructions and explanations, and under a couple of hours I was able to get things to blink, and move, and make noise! Woah, how did that happen?

> The tl;dr: It's easier than you think.

### I'm here to tell you that it's not hard. If it's not fun, you're doing it wrong.

If you've ever used an Arduino before, you probably had to use the built-in Sketch that compiles code directly into the board, using a C-based programming language. While there's nothing wrong with this approach, it's not particularly the most accessible... and initially, it had put me off too.

The _issue_ with the Arduino Sketch is that it doesn't hide the complexity behind the hardware connections: you'll need to manually define and transform the voltage settings, common conversions between units and so on. While this may be a great way of learning the internal way of the hardware components, it's not exactly fun or the fastest...

> I don't care about the math converting voltage to Celsius degrees. Just give me the damn Celsius already!

And that is why we have **johnny-five**.

### johnny-five and node.js

[johnny-five](https://github.com/rwaldron/johnny-five) is a JavaScript Robotics programming framework. It enables you to read and write to and from your Arduino board using JavaScript. It’s open source and has a very straightforward API that resembles jQuery, so it’s actually very likely that it will already look very familiar to you.

Take a look at the following snippet of code to change the colour of an RGB led:

{% highlight javascript %}
led.color({
   red: 255,
   blue: 0,
   green: 0
});
{% endhighlight %}

Even if you’ve never programmed before, I’d argue that’s a pretty straightforward way of declaring what you want to happen to an LED light.

### Using johnny-five

Writing your hardware applications in JavaScript is remarkably simple and it only takes seconds to setup: the only thing that's needed is to upload a new protocol into the Arduino, called **Firmata**. Once you do this, connecting to the Arduino is as straightforward as running any local node.js application. [You can find instructions on its repo](https://github.com/rwaldron/johnny-five).

### A Christmas project

![christmas house picture](https://cldup.com/-HDPMfZ28x.JPG)

I present you: **[Come on baby, light my house](http://therapeutic-appliance.surge.sh/)**, a project which lets anyone on the Internet control the colour of the little house on my desk, as well as playing an incredibly annoying music song on request:

The setup for this is extremely simple. Here's a breakdown, or you can have a look at the entire source code on [Github](https://github.com/magalhini/code-from-the-blog/tree/master/xmas-thing):

1. A node.js server connects the RGB LED light to an express.js server, running locally;
2. Using socket.io listeners, the colour is changed based on the event sent by the client (web page). The colour picker sends an event with the RGB values to change through the socket.io connection;
3. The server listen to the `rgb` event and reacts by telling johnny-five to change the colour;
4. The local server is piped to the public Web using a service like `ngrok`.

**True fact:** _The paper house took longer than writing the code. I glued my fingers, then my sweater to the project, then glued my fingers again... art is hard._

Have a look at the main [`index.js`](https://github.com/magalhini/code-from-the-blog/blob/master/xmas-thing/index.js) file from this project, which contains both the server code and the Arduino hardware connections.

### The hardware? Figure it out as you go!

**Confession:** I still never have any clue how to wire things up when I think of a project idea. I rely solely on the _power of the Interwebz_ to provide me with such information, and I learn on the spot.

![detailed view of the project hardware](https://cldup.com/4D13bjzFKq.jpg)

Ultimately, you're bound to need a power source connected to the breadboard, some resistors or capacitors per sensor, and the sensors connected to either the `digital` or `analog` outputs. And in a nutshell, that will always be it.

But I'll give you a taste of how simple it is to just get started. A blinking LED light requires **absolutely no wires** and less than a **handful lines of code**:

![](https://github.com/rwaldron/johnny-five/raw/master/assets/led-blink.gif)

{% highlight javascript %}
var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  // Create an Led on pin 13
  var led = new five.Led(13);
  // Blink every half second
  led.blink(500);
});
{% endhighlight %}

### But Ricardo, I still don't know anything about hardware!

And neither do I; that's my point. The Internet is [full of demos](https://www.reddit.com/r/NodeBots/comments/27c8h7/nodebots_project_photos/) using johnny-five, and if you take a look at its [API](http://johnny-five.io/api/) you'll find all the schematics you could possibly ever need to wire things up yourself.

The main reason I advocate for johnny-five and JavaScript with an Arduino is creativity; you **shouldn't need to worry about getting things perfect**. In this project, I'm even using jQuery on the client (#yolo), the code isn't minified, there's no build tool, etc, because that's all besides the point. The point is to come up with a useful/silly/whatever idea, and get your hands dirty.

You can program your project using ES2015, node streams, strict functional programming, or... don't care about it at all. The result is the physical thing, the idea that works and moves. Just picture not having to worry about code performance for once in your life. It feels like a hackathon because in part, it is one!

### Getting creative

Let go of the things you don't know about. You don't know how to wire up a temperature sensor to a RGB light, but you know you'll figure it out. What can you do with the sensors you have?

Think about your favourite APIs: maybe move a servo when your [API request to Github](https://developer.github.com/v3/) receives a new pull request on your server. Maybe move a needle to indicate the current weather somewhere in the world, using a weather API.

Blink an LED when someone [retweets you on Twitter?](https://dev.twitter.com/rest/public) Or send an email when your motion sensor detects movement in your house.

Oh, I know... how about a small [simple robot that you can control](https://bocoup.com/weblog/controlling-the-robotsconf-sumobot-with-arduino-uno-johnny-five)?

Or use it as input: There are physical buttons to use with an Arduino, so you could even use it as a source of input. Hell, someone [built an Arduino project that force deletes all of their emails on the push of a button](https://github.com/steveszc/inbox0)

**The possibilities are endless**. And you'll have so much fun because you don't need to configure Webpack 45 times during your project.

### How do I get started?

The hard truth is that **you'll need to buy components**, as an Arduino by itself is pretty useless. At first, you don't know which ones: how many wires should you buy, how many resistors, capacitors, sensors...? Well, these are all questions you don't want to think about when you start. I strongly suggest you get a Starter kit, like I did, so you don't have to worry about getting the right pieces.

Here's the best ones, in my opinion:

- [Arduino Starter Kit](https://www.arduino.cc/en/Main/ArduinoStarterKit)
- [Johnny-five starter Kit](https://www.sparkfun.com/products/13847)
- [A list of other kits](http://www.makeuseof.com/tag/4-best-starter-kits-arduino-beginners/)

> Starter kits are the best way to reduce the initial friction of getting started.

These kits will already include projects you can follow along. Most of them will be written in C, but the hardware schematics will be 100% the same. It's actually quite fun to try to re-interpret the instructions from C into JavaScript, but you don't have to. I still follow along my kit instructions in C because sometimes I like to do it the "hardcore" way.

### Exercises to get started

[Node-Ardx has a set of very interesting follow along](http://node-ardx.org/exercises/1) exercises for various sensors, that you can start doing as soon as you get your kit. My absolute favourite for inspiration is [Web on Devices](http://www.webondevices.com/).

Anything I might have overlooked or gotten wrong? Don't be afraid to ping me on [Twitter](http://twitter.com/magalhini).
