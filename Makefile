UGLIFY = node_modules/uglify-js/bin/uglifyjs

all: min

min: js/main.min.js

js/main.min.js: \
	js/src/header-nav.js\
	js/src/scroll-top.js\
	js/main.js
	cat $^ | $(UGLIFY) > $@

clean:
	$(RM) -r js/main.min.js
