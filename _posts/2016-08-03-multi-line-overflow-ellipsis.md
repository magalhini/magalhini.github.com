---
layout:     post
title:      Multi line overflow ellipsis with CSS
date:       2016-08-03 12:31:19
summary:    How to achieve the text overflow ellipsis effect on multi line content, using only CSS.
tags: [sass, development]
categories: development
---

We all (should) know by now that adding an ellipsis overflow to a text element is not effective content strate...
However, it still makes sense to use this technique on some UI elements. Whether or not it is sensible to apply this technique to your content, it's up to you.

Technically, here's what we'll achieve:

![](https://cldup.com/67BFMCcvIm.gif)

#### Notice how the "..." is in the third line of the text.

Achieving this one a single line of text has been possible for many years now, using a combination of `text-overflow: ellipsis` and `max-width`. But what if we want to have the `...` on the second, maybe third line of a paragraph?
This is easy to [hack with JavaScript](https://github.com/josephschmitt/Clamp.js), truncating it to a maximum number of characters. But it should be possible with CSS alone.

### Webkit to the rescue

Bear in mind that this solution is **only available for Webkit** browsers at the moment. It relies on the `line-clamp` property which almost does the work by itself, but there's a few other gotchas to consider.

How can we do this?

{% highlight css %}
.list__item p {
  display: inline-block; // for non Webkit browsers
  display: -webkit-box;  // needed for the effect to cut off
  -webkit-line-clamp: 3;  // line to cut off
  -webkit-box-orient: vertical;
}

.list__item:hover p {
  display: inline-block; // show the whole thing
}
{% endhighlight %}

Notice that `line-clamp` only works when `-webkit-box` is applied to the same element.

### Gotchas

Apart from working only on Webkit, you may need to play around with the `line-height` or `max-height` of your text if there's padding around it. There's a chance that the text will cut off while still displaying a little bit of the next line, so it requires a little bit of manual fine-tuning.

- [See support for line-clamp](http://caniuse.com/#feat=css-line-clamp)

#### Here's the full pen:

<p data-height="265" data-theme-id="0" data-slug-hash="qNrRov" data-default-tab="result" data-user="magalhini" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/magalhini/pen/qNrRov/">qNrRov</a> by Ricardo Magalhães (<a href="http://codepen.io/magalhini">@magalhini</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
