---
layout:     post
title:      Making a weather station using Arduino and web sockets
date:       2016-10-11 12:31:19
summary:    A tutorial on how to make a real-time, searchable weather station using Arduino, johnny-five and web sockets
tags: [arduino, development]
categories: development, arduino
---

*A while ago, I wrote about how to get started with johnny-five for Arduino, a JavaScript/node.js library that can be used as a friendlier hardware interface than C. If you need to get started with the library, you can [read in that post](http://blog.ricardofilipe.com/post/getting-started-arduino-johhny-five) how to set johnny-five up or you can follow its very simple instructions on their website.*

This little project sort of builds upon the last one, perhaps making a more extensive usage of the Web rather than the hardware/Arduino bits themselves. In fact, hardware-wise, this project is incredibly simple (which was not the point, but it's something I failed to notice initially).

**Here's the project (apologies for the bad video quality):**

<iframe width="560" height="335" src="https://www.youtube.com/embed/8ie0TZ4B8FY" frameborder="0" allowfullscreen></iframe>

It's not very clear in the video, but the LEDs are acting **as a thermometer based on the temperature** of that location. The servo then moves to represent the **current weather on that location**. Yes, the printed icons are crappy and a 6 year old could do better than this, but it's what I could come up with on short notice!

#### What's happening

We're building an simple Web interface, running on a local (node) server, that accepts a location typed by the user. Using web sockets, we'll capture this location, make an API request to [OpenWeather API](https://openweathermap.org/api) which will get us the weather data. Then, we'll find a way to transform and represent the weather data into instructions for the hardware components.

#### What you'll need

- Arduino board
- 7 RGB LEDs (or any amount)
- 1 breadboard
- Jumper wires
- 1 capacitor
- 1 servo

#### Hardware setup

Here's the schematic. It's pretty straightforward; our servo is connected to the `PCM 11` port on the Arduino board.

![](https://cldup.com/VOMR8CYy-s.png)

If you're wondering about the capacitor, [here's why](http://electronics.stackexchange.com/questions/175431/using-a-capacitor-to-properly-power-a-servo).

### OpenWeather API

In order to use OpenWeather's API, we need an API key to use, otherwise we won't have access to it. To get one, follow the [instructions on their API page](https://openweathermap.org/appid#get); after signing up, head other to their `/api_keys` section and generate one. It should look something like the following (note that the following key is invalid, though):

`bdcf92bdc2316115261ff4f7de818935`

*For simplicity's sake, we're storing this key in a local variable in our file. Ideally, and on a production environment, you'd want to keep this key private by storing it on an `environment variable` instead.*

That's it for the API. Save it, we'll be using it in our main `index.js` file as a variable.

### The setup

You can find the [full code on Github](https://github.com/magalhini/arduino-projects/tree/master/weather-station), but here's a quick breakdown of what's happening.

In order to simplify the logic, everything is written in chainable form using `Promises`. Just by reading the function names that make up the whole demo, even without having written them, it's pretty easy to see what we're trying to achieve:

{% highlight javascript %}

getForecast(data.city)             // Get the weather data
  .then(getCurrentWeather)         // Parse the current weather
  .then(moveServoToCondition)      // Move the servo using the weather data
  .then(lightUpLeds)               // Light up the thermometer
  .catch(err => console.log('Error getting weather: ', err))
});
{% endhighlight %}

#### Sockets and johnny-five

We want all of those methods to run once johnny-five is running **and** the web sockets get some new data (meaning the user has entered a new location). So we'll wrap the code above in **johnny-five and socket.io connections**, like so:

{% highlight javascript %}

five.Board().on('ready', function() {
  // Servo is connected to port 11
  servo = new five.Servo(11);

  // These are the ports we're using for the LEDs
  leds = new five.Leds([9,8,7,6,5,4,3]);

  // Setting up the listeners for our web socket events.
  io.on('connection', (client) => {

    // Listen to changes sent by the search field on the page.
    // Once a 'search-weather' event is sent, trigger the chain
    client.on('search-weather', (data) => {
      getForecast(data.city)
        .then(getCurrentWeather)
        .then(moveServoToCondition)
        .then(lightUpLeds)
        .catch(err => console.log('Error getting weather: ', err))
    });
  });
});
{% endhighlight %}

#### Calling the API

Great, so how can we fetch the weather data from the API? There's a ton of libraries to choose from, but I like to stick with `fetch`, since it should soon become the *de facto* API to use for external requests. The node.js implementation of it is called **node-fetch** and we can install it, just like socket.io, via npm:

`npm install --save node-fetch socket.io`

Here's our function that requests the weather data:

{% highlight javascript %}
const apiKey = '<YOUR_API_KEY>';
const fetch = require('node-fetch');

function getForecast(place) {
  const weatherURL = 'http://api.openweathermap.org/data/2.5/forecast?' + 'q=' + encodeURIComponent(place) +'&mode=json&units=metric&appid=' + apiKey;

  return new Promise((res, rej) => {
    fetch(weatherURL)
      .then(response => res(response.json()))
      .catch(err => rej(err));
  });
}
{% endhighlight %}

By itself, `fetch` returns the data wrapped in a Promise, so we'll resolve it using the data we fetched. If the request fails, we'll `reject` the Promise with the error.

#### Moving the servo

The servo motor is surprisingly simple to use using johnny-five and I highly encourage you to look at [its API on the source documentation](http://johnny-five.io/examples/servo/). There's tons of methods you can use to make it move, but at its core, it's as simple as telling it to move between an angle of `0` and `180` degrees, and providing an optional speed argument in milliseconds:

`servo.to(angle, speed)`

To move the servo based on the current weather condition, I'm being incredibly rude and nasty with the code, actually. OpenWeather responds with a specific **weather code** and **text description** for each situation, so I'm literally comparing the string value and mapping it to an angle that I previously checked based on the location of my physical, printed markers (through trial and error).

{% highlight javascript %}
function mapConditionToAngle(condition) {
  switch (condition) {
    case 'clear sky':
    case 'sky is clear':
    return 160;
    case 'shower rain':
    case 'light rain':
    return 85;
    case 'rain':
    case 'moderate rain':
    return 105;
    case 'scattered clouds':
    return 115;
    case 'broken clouds':
    return 135;
    case 'thunderstorm':
    return 150;
  }
}

// Eg: If the condition is "broken clouds", return an angle of 135 degrees

{% endhighlight %}

#### LED thermometer

For the LEDs to work as a thermometer, I'm also being quite raw and literally defining breakpoints for them. If the temperature is less than `N` degrees, return a lower number of LEDs; increasing it as the temperature value rises higher. In our code, anything above 27ºC lights up all LEDs. Why 27? Well that's pretty hot in my book.

To make them light up as a range, we loop over them like so:

{% highlight javascript %}
leds.forEach((led, index) => {
  if (index <= value) {
    led.on();
  } else {
    led.off();
  }
});
{% endhighlight %}

#### Serving the files

After wiring up all the bits and pieces (again, follow along the source code), we serve this code using *Express.js*, just like in the previous tutorial. We're hardcoding the port to be `3000` but you can use whatever you want; please note that if your port differs, you'll also need to change it in the front-end code, which we'll get to next.

To run it, serve it with node:

`node index.js`

And point your browser to `http://localhost:3000`. If you download the other files from the repo (namely, the entry point `index.html`) you'll get the full markup in the browser.

#### The front-end code

We need some markup (and CSS, why not) and JS to allow the user to search for a location, send it over to our local server using web sockets, and get things moving (literally).

If you take a peek at the [index.html](https://github.com/magalhini/arduino-projects/blob/master/weather-station/index.html) file on the repo, you'll find all the markup and this simple JavaScript method:

{% highlight javascript %}

<script>
  (function() {
    // connect to our socket connection on the server
    var socket = io.connect(window.location.hostname + ':' + 3000);
    var input = document.querySelector('input');

    input.addEventListener('change', getWeather);

    function getWeather(e) {
      var value = e.target.value.trim();
      socket.emit('search-weather', {
        city: value
      });
    }
    socket.on('connect', function(data) {
      socket.emit('join');
    });
  }());
</script>

{% endhighlight %}

In the first line, we establish our connection to `socket.io`. On each `input` change, we send the value through the socket connection under the key of `search-weather`, which just happens to be what our previous node.js code is listening to! What a happy coincidence!

#### Tweaking

If you decide to try this out, the only thing you'll need to tweak are the **angle values for your marker distribution**. Get creative, hopefully more creative than I did, because that's precisely the point of messing around with an Arduino! For this project, I focussed too much on the Web part and not so much on learning more about the hardware, which is something I'll certainly work on for the next project.

If you got any questions or doubts, feel free to ping me on [Twitter](http://twitter.com/magalhini).
