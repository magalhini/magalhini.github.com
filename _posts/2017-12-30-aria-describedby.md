---
layout:     post
title:      How to use ARIA describedby and labelledby
date:       2017-12-30 12:31:19
summary:    A very clean and efficient pattern for rendering conditional components in React.
tags: [development]
categories: development
---

So many web developers stay away from doing accessibility right because they're afraid of causing more harm than good. I get that, as I had that fear myself in the past, when worrying about a11y was, shamefully, something I _could_ dismiss at first. However, now that I'm at Shopify and a11y is a non-negotiable, I'm learning that there is absolutely no excuse to at least not do the very basics right.

One of the most common questions I see developers having is about some ARIA attributes, namely when to use `aria-labelledby` and `aria-describedby`. So today, I'd like to share some quicks tips on how you can and should start including these very key attributes in your HTML semantics right now.

## aria-labelledby

As the name implies, "labelled by", this attribute receives the IDs of elements which establish a relationship between the elements. Unlike the `label` elements, which we should always use to name the elements, `labelledby` gives extended information that help make sense of what the element is.

To understand this better, keep this in mind: the `aria-labelledby` attribute is read by a screenreader after saying out loud the field type.
An example of when you'd want to use this is labeling choices, which are labeled by a previously appearing title:

{% highlight html %}
<h3 id="lunch_label">Café Options</h3>

<ul aria-labelledby="lunch_label" id="coffee-radio" role="radiogroup">
  <li id="o1">Macchiato</li>
  <li id="o2">Cappuccino</li>
  <li id="o3">Latte</li>
</ul>
{% endhighlight %}

As you noticed, we're using `labelledby` to refer to the previous `h3` element. **It always expects an ID string**.

**Another example, with multiple labels:**

{% highlight html %}
<div id="billing">Billing:</div>

<div>
  <div id="name">Name:</div>
  <input type="text" aria-labelledby="billing name"/>
</div>
<div>
  <div id="address">Address:</div>
  <input type="text" aria-labelledby="billing address"/>
</div>
{% endhighlight %}

_(This example was taken straight out of <a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute">MDN web docs for this attribute</a>)._

The main takeaway from this previous example is the fact we're passing in two identifiers: `billing` and `name`. This tells the screenreader that the inputs are part of a subsection within a section; in this case, the `name` input is labelled by the text _Name:_ and its section, _Billing._

### For read-only visual representations

Imagine this very common pattern: you have a star rating component for a product in your page.
You're displaying 4 images of full stars, and 1 image of an empty star. To sighted users, it's clear this product has a 4 out of 5 rating; but what about those who can't see the stars? How to overcome this issue?

★★★★☆

There are several ways to approach this problem, and all will depend on how much control you have over your own system. But an easy way to provide a text representation of the rating is to use `aria-labelledby` to point to an element ID which has a written value for the rating. Consider this:

{% highlight html %}
<span id="star-rating" class="visually-hidden">Rating: 4 of 5</span>
<div role="img" aria-labelledby="star-rating">
  ★★★★☆
</div>
{% endhighlight %}

### Using describedby for error messages

One of the most useful things about `aria-describedby` is that screen readers can use them to indicate when a field is in an error state (invalid password, malformed credit card details, etc). Have you ever stopped and wondered how do non-sighted users know when this happens, and what we can do about it?

An input element, for example, can be told to be described by an error message ID field. **If the describing field has no content, screen readers will ignore it;** but when it's visible in the DOM and with content, screen readers will pick up on this and use it to read the corresponding error message. How great is this? Take the following example:

### For error states

{% highlight html %}

<input type="text" aria-describedby="message-error">
<span id="message-error" class="visually-hidden">
  Error: this field is invalid
</span>

{% endhighlight %}

Adding the error message to the `#message-error` element will make sure the input associates the corresponding error message with this field. There's also, of course, other things to consider such as `aria-invalid`, but we'll leave that for another time.

### For tooltips associated with fields

When there's tooltips involved to help give more information about a certain field, it's very important to link the tooltip with the respective element. A sighted user can easily read the tooltip once the icon is hovered, but this is meaningless for non-sighted users. Here's a common example, about a CVV field for a credit card:

![Hovering over a tooltip](https://cldup.com/LPtQ6hwANu.gif)

Without any ARIA attributes, this is all that VoiceOver reads once the input is in focus: `CVV: Edit Text` (and this is assuming you have a `label-for` correctly in place. You do, don't you?). There's no information about a tooltip being there for the user to know where to find a CVV.

![No information](https://cldup.com/rdKWXr5Mce-3000x3000.jpeg)

However, it only takes a simple `aria-describedby="id-of-your-tooltip"` to make a world of a difference to non-sighted users. Take a look at VoiceOver will read now:

![The input is linked to the text of the tooltip](https://cldup.com/doG3TAvS1E-3000x3000.jpeg)

{% highlight html %}
<div class="form cvv">
  <label for="cvv">CVV</label>
  <input aria-describedby="cvv-label" type="text" name="CVV" id="cvv">
  <span class="cvv__tip">ℹ️</span>
  <span id="cvv-label" class="cvv__info">These are the 3 digits on the back of your credit card</span>
</div>
{% endhighlight %}

### Things to note

There's a few things to note when using any of these ARIA techniques. When we're using `aria-labelledby`, the associated ID is read **instead** of its own text content, rather than having the element being read in addition to the text content. [This section on W3C](https://www.w3.org/TR/WCAG20-TECHS/ARIA7.html) describes it well:

<span class="blockquote">The specified behaviour of aria-labelledby is that the associated label text is announced instead of the link text (not in addition to the link text). When the link text itself should be included in the label text, the ID of the link should be referenced as well in the string of IDs forming the value of the aria-labelledby attribute.</span>

It should never replace the use of `label` elements in forms. Consider it for the situations when you need multiple labels.

- aria-labelledby: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute
___

Anything I might have overlooked or gotten wrong? Don't be afraid to ping me on [Twitter](http://twitter.com/magalhini).
