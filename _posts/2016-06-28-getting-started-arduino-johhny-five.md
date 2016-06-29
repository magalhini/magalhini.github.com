---
layout:     post
title:      Getting started with Arduino, johnny-five and Websockets
date:       2016-06-28 12:31:19
summary:    First steps into the Arduino world, using JavaScript, websockets and node.js as an interface. Exciting physical times!
tags: [arduino, development]
categories: development, arduino
---
#### Or how I've learned to cope with JavaScript fatigue.

##### [Find this project on Github](https://github.com/magalhini/arduino-rgb-sockets)

I've very recently started to play with an [Arduino Starterkit](https://www.arduino.cc/en/Main/ArduinoStarterKit).

Knowing literally zero about hardware components, electronics and how one would even write code for this physical world, I can honestly say I was very surprised at how easy and accessible getting started was. My `hello world` of robotics (a blinking LED light, of course!) was done from scratch in under ten minutes, which was surprisingly quick and painless.

But the real fun began when JavaScript and node.js entered the picture on electronics!

![RGB Led](https://cldup.com/hMVcXIKZAW.gif)

### Wait... Arduino and node.js?

You might think you're confined to programming your Arduino with the subset of C/C++, since it's the default programming language for this environment. Most Arduino starter kits will give you sample projects with code in C.

While there's nothing wrong with doing this (I'm still following the starter projects in C and learning from them), the possibility of using the power of JavaScript (and by extension, the power of the Web!) allows you to think much more creatively, especially if you come from a Web development background.

Plus, you get to brush up your node.js skills a bit. 🏆

### Here's Johnny ...five!

[Johnny-five](https://github.com/rwaldron/johnny-five) is a _JavaScript Robotics programming framework_. It enables **you to read and write** to and from your Arduino board using JavaScript. It's open source and has a very straightforward [API](http://johnny-five.io/api/) that resembles jQuery, so it's actually very likely that it will already look very familiar to you.

Take a look at the following snippet of code to change the colour of an RGB led:

{% highlight javascript %}
 led.color({
   red: 255,
   blue: 0,
   green: 0
 });
{% endhighlight %}

Even if you've never programmed before, I'd argue that's a pretty straightforward way of declaring what you want to happen to an LED light.

### What you'll build

Here's the full video of what we'll be making: I'm using an iPad here to control the color of the light, but obviously you could do it using your phone too:


<iframe width="560" height="315" src="https://www.youtube.com/embed/nLPQNb3Q3B8" frameborder="0" allowfullscreen></iframe>


### What you'll need

- Arduino board
- 1 RGB LED
- 1 breadboard
- Jumper wires
- 3 resistors (220Ω)

Again, if you just want to copy and paste the code for this, it's [available on Github](https://github.com/magalhini/arduino-rgb-sockets).

### Hardware

Notice that this LED has **4 legs**, instead of the usual 2 for regular LEDs. In fact, the RGB LED can as the name itself implies, produce 3 colours simultaneously: red, green and blue. The longer leg is called the **cathode**, and you'll use this to connect to ground (-).

Here's a schematic of how you'll build it:

![Arduino](https://cldup.com/tpAXpcprk4.png)

*(Side note: while searching for a place where I could draw diagrams and schematics of electronics, I stumbled upon [123d Circuits](https://123d.circuits.io). This is incredible, not only you can make these diagrams but you can also simulate code in them! Epic? Epic!)*

I won't go into the details as to why we're connecting these to the PCW slots, as I'm sure someone else out there will make a better job at explaining this than me. In a nutshell, the PCW connectors enable us to work with values that aren't simply `0` and `1` (useful for on and off states), since we want to be able to give values from `0` to `255` to each individual colour.

### Step #1: Making room for johnny

So let's prepare your Arduino to receive JavaScript! Luckily, you'll only have to do this once.

- 1) Connect your Arduino to your computer, as you would normally when writing code using the provided Arduino IDE editor If you don't have the Arduino IDE yet, [get it here](https://www.arduino.cc/en/Main/Software).

- 2) On the Arduino IDE, select **Tools > Port** and ensure you have `(Arduino Uno)` selected.

- 3) Still on this IDE, select **File > Examples > Firmata > StandardFirmata** and click the Upload button.

- 4) That's it! Your Arduino is now able to read the connections that johnny-five will be mediating. You can close the Arduino IDE and fire up your favourite code editor.

_Troubleshooting: Actually, I was unable to upload the Firmata using the Arduino IDE running 1.6.8. Apparently it's a known bug, and after updating to the 1.6.9 version everything went smoothly._

### Step #2: Give johnny a light

Since we'll be using node.js to communicate with the Arduino, make sure to [have it installed](https://nodejs.org/en/) on your machine first.
Then create a new folder somewhere on your machine, create a file called `app.js` and install johnny-five on this folder, by running on your terminal on this directory:

`npm install johnny-five`

Later we'll need to install other packages such as `express` to create a local server so we can have interaction via a server, but for now, this is really all you need to communicate with the Arduino itself.

To make sure it's working, you can run the following:

{% highlight javascript %}
var five = require("johnny-five");
var myBoard;

myBoard = new five.Board();

myBoard.on("ready", function() {
  console.log('Arduino is ready!');
});
{% endhighlight %}

You should see `Arduino is ready!` on your terminal, after running `node app.js`.

### Step #3: Controlling the colours

There's tons of ways we can control the individual colours for the RGB light. One of the projects in the **Starter Arduino Kit** reads the ambient lightning values using light sensors, and changes the colours accordingly. You can also manipulate it based on temperature or any other external input.

In this case, we're interested in building a web interface so we can manipulate the values directly. And this is why we're going to use web sockets, namely a neat little library called `socket.io`.

The benefit of this is **real time effects**: this is what allows you have your Arduino connected to your computer, but being able to control the input from a phone or an iPad that's pointing to your server.

By broadcasting the change events, anyone else connected to the server will also see the same values that you do (think, chat application. Works both ways).

#### Creating the Web Server

So we're going to build a local web server. Since we're already using node.js for this, let's simply deploy a quick and simple `express` server that will host the code and serve the static client files for us.

So let's install both `express` and `socket.io` before moving on:

`npm install express socket-io`

And into our `app.js` folder, let's dump the following code:

{% highlight javascript %}
'use strict';

const five = require('johnny-five');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let led = null;

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html')
});

five.Board().on('ready', function() {
  console.log('Arduino is ready.');

  // Initial state for the LED light
  let state = {
    red: 1, green: 1, blue: 1
  };

  // Map pins to digital inputs on the board
  led = new five.Led.RGB({
    pins: {
      red: 6,
      green: 3,
      blue: 5
    }
  });

  // Helper function to set the colors
  let setStateColor = function(state) {
    led.color({
      red: state.red,
      blue: state.blue,
      green: state.green
    });
};

  // Listen to the web socket connection
  io.on('connection', function(client) {
    client.on('join', function(handshake) {
      console.log(handshake);
    });

    // Set initial state
    setStateColor(state);

  // Every time a 'rgb' event is sent, listen to it and grab its new values for each individual colour
    client.on('rgb', function(data) {
      state.red = data.color === 'red' ? data.value : state.red;
      state.green = data.color === 'green' ? data.value : state.green;
      state.blue = data.color === 'blue' ? data.value : state.blue;

      // Set the new colors
      setStateColor(state);

      client.emit('rgb', data);
      client.broadcast.emit('rgb', data);
    });

    // Turn on the RGB LED
    led.on();
  });
});

const port = process.env.PORT || 3000;

server.listen(port);
console.log(`Server listening on http://localhost:${port}`);
{% endhighlight %}

#### Breaking it down

That's a lot of code at once, so let's break this down. The first part simply sets up express and serves our local files (the HTML and the JavaScript client) in the `3000` port.

The second part is all the Arduino magic.
All the code that's wrapped inside `five.Board().on('ready', function() {...}` executes once the connection to the Arduino is made. If you're coming from a web development background, think of it as your `document.ready`.


##### Sockets

Whenever `socket.io` receives a change event, the values of the inputs (we'll get there in the next bit) are sent with it, as a data argument, like the following:

`client.on('rgb', function(data) {...})`

The event names, of course, can be whatever you want them to be. I've named this one `rgb`, because, well... that's what we're dealing with.

### Step #4: Adding client-side interactivity

The HTML markup is very simple:

```
<!doctype html>
<html lang="en">
    <head>
        <title>Arduino</title>
    </head>
    <body>
        <h3>Red:</h3>
        <input id="red" type="range" min="0" max="255" step="1" value="0">

        <h3>Green:</h3>
        <input id="green" type="range" min="0" max="255" step="1" value="0">

        <h3>Blue:</h3>
        <input id="blue" type="range" min="0" max="255" step="1" value="0">

        <!-- include the client socket library-->
        <script src="/socket.io/socket.io.js"></script>
        
        <script src="./client.js"></script>
    </body>
</html>
```

We have 3 sliders, one for each colour. If you want to add a dash of CSS styling as well, just [copy it over from the Github repo](https://github.com/magalhini/arduino-rgb-sockets). Notice how we're also including the script to connect to `socket.io`.

And finally, all of client interactivity code. On each `change` event for each slider, we're sending a new event to `socket.io` that contains some data: which colour was changed, and its new value.

{% highlight javascript %}
// client.js

(function() {
    var socket = io.connect(window.location.hostname + ':' + 3000);
    var red = document.getElementById('red');
    var green = document.getElementById('green');
    var blue = document.getElementById('blue');

    function emitValue(color, e) {
        socket.emit('rgb', {
            color: color,
            value: e.target.value
        });
    }

    red.addEventListener('change', emitValue.bind(null, 'red'));
    blue.addEventListener('change', emitValue.bind(null, 'blue'));
    green.addEventListener('change', emitValue.bind(null, 'green'));

    socket.on('connect', function(data) {
        socket.emit('join', 'Client is connected!');
    });

    socket.on('rgb', function(data) {
        var color = data.color;
        document.getElementById(color).value = data.value;
    });
}());
{% endhighlight %}

This is the data that we're listening to in our `app.js` file. Client emits data, `socket.io` receives it on the server, and then updates the Arduino values.

### Step #5: Firing it all up

So new's recap what we have so far:

- The `app.js` file is serving a local server using express, that uses web sockets to listen (and broadcast) to change events from the client;

- This same file uses johnny-five to send instructions to our hardware, based on the data received from the web socket connection;

- `index.html` is serving `client.js` which is emitting the output of the interaction with the sliders

All that's left to do is to start the local server. You can do this by typing, in the terminal:

`node app.js`

If everything is successful, you should see the success messages, and by pointing your browser to `http://localhost:8080` you should see our page!

If you don't, make sure to check your code against [the repository](https://github.com/magalhini/arduino-rgb-sockets).

## Awesome. What next?

What really excites me about this are the endless possibilities of where to take it from here. Sure we're directly manipulating the values for the LED, but we could very well be changing them based on a weather API, a Twitter account, Facebook messages, you name it.

In fact, most of this code is already re-usable. Once you fetch the data you want to use, broadcast it to your board, and decide how you want to externalise this data. Maybe using sound, maybe using an LCD? The Amazon's sensors department is your limit.

## More resources

To learn more about the johnny-five API and to try out other components, check:

- [Arduino Starter Kit](https://www.arduino.cc/en/Main/ArduinoStarterKit)
- [Johnny-five Inventor Starter Kit](https://www.sparkfun.com/products/13847)
- [Arduino Experimenter's Guide for NodeJS](http://node-ardx.org/)
- [Learn Arduino on Adafruit](https://learn.adafruit.com/series/learn-arduino)
- [Johnny-Five Hardware API](http://johnny-five.io/api/)

Anything I might have overlooked or gotten wrong? Don't be afraid to ping me on [Twitter](http://twitter.com/magalhini).
