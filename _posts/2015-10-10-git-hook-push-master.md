---
layout:     post
title:      Creating a pre-push Git Hook
date:       2015-10-10 12:31:19
summary:    Learn how to quickly setup a confirmation step before pushing your git changes up.
tags: [git, development]
categories: development
---

When it comes to developing projects on my own, I have to confess I tend to get lazy and sloppy with processes. Shame, much shame.

For example, [First Aid Git](http://firstaidgit.io) is hosted on a shared web server where I usually manually sync the distribution files created by the build. This usually means pushing the changes to Github, making sure everything still works, then `ssh`-ing into the server to upload the files.

Some time ago I hooked up [Deploybot](http://deploybot.com/) to that repo and wired it so every push to the `master` branch will immediately deploy to production (I know, living dangerously every single day, that's me). However more than once I still found myself pushing up to the `master` branch by default, triggering unwanted builds... so I finally took the time to learn about Git hooks.

### What are git hooks?

> "Git hooks are scripts that Git executes before or after events such as: commit, push, and receive. Git hooks are a built-in feature - no need to download anything. Git hooks are run locally."

That's from [Githooks](http://githooks.com/), and it's pretty much self-explanatory. You can trigger certain actions for each one of the available hooks (there are plenty), whether to prevent mistakes from happening, warning other team members that new code is available, enforcing commit and code standards, etc.

### Where are they set-up?

Inside your git project, there's a (most likely hidden) `.git` folder that contains a `hooks` folder. It will contain a few sample bash scripts already so it's pretty easy to get started. If you remove the `.sample` file name they will become active.

For myself, I simply needed something that would make me be absolutely certain I wanted to push to the `master` branch.

### Pre-push scripts

So here's my very simple script: it detects you're about to push to `master` and asks for your input to answer the magic question about the meaning of life. If the answer is correct, the push will continue, the build will run and the world will be a happy place with seals and otters dancing by the moonlight in a beautiful harmonic dance.

Create a file called `pre-push`, or rename the existing `pre-push.sample`.

{% highlight bash %}
#!/bin/bash
protected_branch='master'
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ $protected_branch = $current_branch ]
	then
		read -p "You're about to push to master. What's the meaning of life? > " -n 2 -r < /dev/tty
		echo
    		#if echo $REPLY | grep -E '^[Yy]$' > /dev/null
    		if echo $REPLY | grep -E '42' > /dev/null
    		then
        		exit 0 # carry on
    		fi
    		exit 1 # exit and go read a book
else
    exit 0
fi
{% endhighlight %}

**Breakdown**

First, we define the branch we want to protect in the variable. It could be `master`, but it can also be another one of your choice. Then we're very simply grabbing two strokes worth of input from the user in the terminal and checking if they equal to `42`, our answer to this rather simple and obvious question.

The commented `if` statement below it is another option if you want to skip user custom input: if you prefer, you can use that one instead to simply check for a simple `Y` or `N` prompt.

Save the file, and give it a go! There are plenty of very useful resources out there for githooks.
Here's a few:

- [Githooks documentation](http://longair.net/blog/2011/04/09/missing-git-hooks-documentation/)
- [Customising githooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Available hooks](https://git-scm.com/docs/githooks)

Happy pushing!
