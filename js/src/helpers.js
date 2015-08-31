(function(glob) {
    glob.helpers = {
        fadeOut: function(el, r) {
            if (!r) el.style.opacity = 1;
            el.style.opacity -= 0.03;

            var d = function() {
                this.fadeOut(el, true)
            }.bind(this);

            if (el.style.opacity < 0) {
                el.style.display = 'none';
            } else {
                requestAnimationFrame(d);
            }
        },

        fadeIn: function(el, r) {
            el.style.opacity += 0.3;

            var d = function() {
                this.fadeIn(el, true);
            }.bind(this);

            if (el.style.opacity >= 1) {
                cancelAnimationFrame(d);
            } else {
                requestAnimationFrame(d);
            }
        }
    }
}(window));
