---
layout:     post
title:      Typography — Deep Into OpenType Features
date:       2016-04-11 12:31:19
summary:    Digging deep into the state of OpenType features for typography today.
tags: [typography, fonts, css]
categories: development
---

What are **OpenType features?** Typekit defines them better than I ever could:

> "OpenType features are like secret compartments in fonts."

They can make your written content easier to read, more versatile and more legible.

I see OpenType features as like super powers to typography. If you have ever looked at beautifully written books and noticed the little details like old style numerals, fractions, custom ligatures and wondered how to get them into the Web, well then this is a great time to be alive!

Here's a preview of only a handful of features:

![Example of feaures](https://cldup.com/l23dhciIPz.gif)

##### Play with the demo above [here](http://open-type.surge.sh)

Using these features can dramatically increase our content's readability and legibility, not to mention the aesthetic goodness that it can provide when used sensibly. Knowing how accessible they're now becoming, I've never wanted to write my own novel more than I do now. Check out [Typekit's overview](https://helpx.adobe.com/typekit/using/open-type-syntax.html) on these features (with examples) and play with the [sample page I've created](http://open-type.surge.sh) as a live demo for this post.

They're not only useful for the beautification of the written word, but also for the written *number*. Enabling a couple of these features on tables like this finally makes science justice, on the web:

![Table example](https://cldup.com/HEg-q-usGi.gif)

##### Above: enabling scientific ligatures (sinf), proportional numbers (pnum), ordinals (ordn)

But with great power comes great responsibility, and it's not all unicorns and rainbows just yet. The OpenType's specification is far from stable and can introduce some unwanted behavior. So let's dig in!

## Finding the right typefaces

Not all typefaces contain these special features. In fact, we're more likely to find them on higher-end typefaces using paid services like [Typekit](http://typekit.net), [Font Spring](https://www.fontspring.com/) and [Typography.com](http://typography.com), for example. Google Fonts, which contains a giant library of free typefaces, already gives us a few that provide a handful of OpenType features.

[Raleway](https://www.google.com/fonts/specimen/Raleway), for instance, contains discretionary ligatures and it won't cost us a penny.

If using Typekit, the features for each typefaces can be seen by clicking the `(?)` icon on the kits:

![Typekit](https://cldup.com/PhnheKjpz7-3000x3000.png)

#### What if I want to include/create my own?

You can create and manage your own, yes! I won't go deep into this topic since it's not the article's scope, but you can make use of [Font Squirrel's Generator](https://www.fontsquirrel.com/tools/webfont-generator) to upload your typefaces and select exactly which features you want it to contain. If you go into **Expert Mode**, this is what you'll see:

![Font Squirrel Generator](https://cldup.com/NNewcHQyWr-2000x2000.png)


Apart from creating our own, how do we find which typefaces have custom features? At the moment, it's trial and error. I've asked Typekit if they have a list of OT features sorted by typeface and there isn't one at the moment. We do have to include them in a kit first, then check. If you know of a place where you can find a well documented list with typefaces and their OT, feel free to drop me a line.

## Using OpenType features in CSS

It makes me cringe a bit to try and make sense of the specification. We'll find references to two different kinds of rules, `font-variant` and `font-feature-settings`, sometimes even both. What does this mean?

{% highlight css %}
.onum {
	font-variant-numeric: oldstyle-nums;
	font-feature-settings: 'onum';
}
{% endhighlight %}

`font-variant-*` acts like a more specific rule for the individual OpenType sub-properties, while `font-feature-settings` behaves like a single rule, containing a list of the sub-properties we want to enable.

These two properties, refer to **high-level** and **low-level** syntax. They can inherit from each other, but not all rules or browsers can do so elegantly, hence why their usage can be tricky to get right.

The **low-level syntax** is partially available in most browsers and it's the one we'll see using the four letters designation, such as `hlig` (*historial liguatures*), `smcp` (*small capitals*) and so on. The downfall is that they rely on being specified on a single property, making the usage of several features at once tricky. **The high level syntax solves the issue** by specifying a specific property to itself, but browser support is [still low](caniuse.com/#feat=font-feature).

Here's an example for Oldstyle Numerals:

##### Low-level Syntax

{% highlight css %}
.onum {
	font-variant-numeric: oldstyle-nums;
}
{% endhighlight %}

##### High-level Syntax

{% highlight css %}
.onum {
    -webkit-font-feature-settings: 'onum';
       -moz-font-feature-settings: 'onum=1';
        -ms-font-feature-settings: 'onum';
            font-feature-settings: 'onum';
}
{% endhighlight %}

And the result:

![onum example](https://cldup.com/qxtr31k-Jg.gif)

### So which syntax to use...?

The specification recommends using the high-level syntax, but using it by itself isn't going to work very well at the time of writing. Ideally, a combination of both should be used, paying special attention to inheritance.

**Consider the following example:**

{% highlight css %}
.parent {
	font-variant-numeric: oldstyle-nums;
	font-feature-settings: 'onum';
}

.child {
	font-variant-caps: small-caps;
	font-feature-settings: 'smcp';
}

{% endhighlight %}

In this example, `font-feature-settings` declared in the child component **takes over** and completely overrides the rule for the **Oldstyle Numerals** given from the parent. In order to have the `.child` class use both of these features, we'd need to explicitly declare both properties like so:

{% highlight css %}
.child {
	font-variant-caps: small-caps;
	font-variant-numeric: oldstyle-nums;
	font-feature-settings: 'smcp', 'onum';
}

{% endhighlight %}

Here, the high-level syntax allows us to specify the list of features we want to enable.
Note that `font-variant` doesn't necessarily need a shorthand version. We could also write:

```
.child {
	font-variant: small-caps oldstyle-nums;
}
```

## But we got a weight problem

So far, despite all the hassle around enabling and pairing which features we want to use, we haven't yet seen a downside to enabling OpenType features that aren't enabled by default in a font file. So, should we? Let's have a look at Typekit.

![Typekit without OT](https://cldup.com/fNfYPldAm4-3000x3000.png)

We can see here a kit that contains only two typefaces: *Adobe Caslon Pro*, for the body text, and *Bickham Script*, for a potentially gorgeous headline. We're not going to be greedy and we'll include only the basic fonts: Regular, Italic and Bold for the *Adobe Caslon*, and only Regular for *Bickham Script*.

The total size of this kit is a reasonable ~ 200kb.

Let's enable OpenType features for both of these typefaces, since we want to have nice ligatures, old style numerals and the swashes for the headline. We're fancy.

![Typekit with OT](https://cldup.com/fmY8AOE7-U-1200x1200.png)

##### Boom! Our kit just grew to a whopping ~ 800kb in size.

**From 200kb to 800kb.** We might as well buy the metal casts themselves, *amiright?* This is some heavy metal. In fact, the OT features for Bickham Script alone for only one font style weigh in around 200kb. So there is definitely a trade off to be aware of here; as our webpages grow in size due to bigger and bigger boilerplates and development frameworks, we are not necessarily helping the issue by throwing in arguably unnecessary flourishes at the problem.

## We also have a browser problem

Defaults are also a bit of a concern, at least at the time of writing, for some features. Taking `common-ligatures` as an example, we can check on the great [State Of Web Type website](http://stateofwebtype.com/#Standard%20Ligatures%20%28liga%29) that:

- Chrome supports ligatures, but does not enable them by default
- Only Safari enables them by default...
- ... but they can't actually be disabled in Safari either
- There are still bugs rendering ligatures with older browser versions

Another important thing to note is that Chrome, Safari and Firefox fully support the `text-rendering` property, which calculates kerning *automagically*. This is why some ligatures and kerning are enabled by default even if we don't do it manually: these browsers turn these features on if they're available. This is not the case of Internet Explorer, and nope, not even Edge.

Here's the current state of support for `font-feature-*` right now (April 2016), provided by [caniuse](http://caniuse.com):

![caniuse](https://cldup.com/5uRsNgF0lw.thumb.png)

On the plus side, the recent `iOS 9.3 Safari` finally supports OpenType features. Good work, Apple!

### Your content may need a revisit

Another thing to take into account is that we shouldn't just blindly apply all the features to our existing content and expect everything to look just right.

There's usually a golden rule for capitalised content in content: NEVER TO WRITE IN CAPITALS IN YOUR MARKUP, even if it's meant to be displayed in capital letters. Instead, write as you normally would and style that particular piece using `text-transform: uppercase;`.

Sensible, right? However, if we're making the switch from fake small capitals to true small capitals (and we should, by the way, very rarely *faux* small capitals are a good idea), consider the following:

#### Small Capitals (smcp) vs. Capitals 2 Small Caps (c2cp)

`smcp` and `c2sc` are not the same thing. The former will convert all text into small capitalised letters, *whether they are originally written in capitals or not.* The latter only applies small capitals to content that *is already* written in capitals, **or given the property of `text-transform: uppercase` to begin with.**

#### Final Considerations

Given the performance hit that enabling Open Type features by default can have, it's up to us to be responsible about its usage. How responsible? Well, a good example would be to enable these features so we can **use only one typeface instead of two**, for example, in our designs. Some typefaces become so versatile that you can definitely get away with a distinct, beautiful typographic design by using a single typeface. So maybe you don't need that extra font file for a headline, you can use small caps (`smcp`) instead...?

Features like proportional numbers (`pnum`), scientific inferiors (`sinf`) and even fractions (`frac`) make wonders for reading tabular data and they should be used whenever available. 

Since the properties' specification is still evolving, it's a good idea to keep a close eye on it. Luckily, projects like [Utility Open Type](http://utility-opentype.kennethormandy.com/) are doing a great job at keeping track of the changes and offering us an easier way to use them.

#### Where to go from here

FontFont has a wonderfully detailed guide to OpenType features with dozens of examples, some of them almost unheard of, that you should definitely [read and cuddle with](https://www.fontfont.com/staticcontent/downloads/FF_OT_User_Guide.pdf).
[Adobe Typekit's post](https://helpx.adobe.com/typekit/using/use-open-type-features.html#features) on OpenType is a little bit out of date, but still a great resource to check out.

[Utility Open Type](http://utility-opentype.kennethormandy.com/) gives you the most usable CSS file to provide support for all OpenType features; though it's a bit on the fatty side. I suggest you have a look at its source and include only the CSS for the features you need.

Oh, and here's a quick list of (almost!) all features. There's a lot.

```
onum
lnum
tnum
zero
frac
sups
subs
ordn
smcp
c2sc
case
liga
dlig
hlig
calt
swsh
hist
ss01
kern
locl
rlig
medi
init
isol
fina
mark
mkmk
```

Anything I might have overlooked or gotten wrong? Don't be afraid to ping me on [Twitter](http://twitter.com/magalhini).
