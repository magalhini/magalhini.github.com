var ScrollTop = function() {
    'use strict';

    var doc = document;

    var ScrollToTop = {
        start: function(el) {
            this._el = doc.getElementById(el);

            // If there's no element, do nothing.
            if (!this._el) return false;

            this._elOffset = this._el.offsetTop + this._el.offsetHeight;

            this._el.addEventListener('click', this.scrollToTop.bind(this));
            window.addEventListener('scroll', this.toggleFixed.bind(this));
        },

        /**
         * Scrolling behaviour to the top, using RAF.
         */
        scrollToTop: function(e) {
            this._frameID = requestAnimationFrame(this.scrollToTop.bind(this));

            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var rate = scrollTop / 100 * 10;

            if (scrollTop > 0) {
                var el = doc.documentElement.scrollTop === 0 ? doc.body : doc.documentElement;
                el.scrollTop = scrollTop - rate;
            } else {
                cancelAnimationFrame(this._frameID);
            }
        },

        /**
         * Only animate and display the anchor after some scrolling down.
         */
        toggleFixed: function(e) {
            var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var toTop = (window.pageYOffset || document.scrollTop) - (document.clientTop || 0);

            if (toTop > this._elOffset) {
                this._el.classList.remove('is-hidden');
                this._el.classList.add('is-visible');
            } else {
                this._el.classList.remove('is-visible');
                this._el.classList.add('is-hidden');
            }
        }
    };

    return ScrollToTop;
};

window.ScrollTop = ScrollTop;
