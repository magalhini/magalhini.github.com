var HeaderNavigation = function(element) {
    'use strict';

    var doc = document;
    var defaultSection = doc.querySelector('.posts-list');

    var headerNavigation = {
        start: function() {
            this._el = document.querySelector(element);

            if (!this._el) return false;

            this._activeSection = defaultSection;
            this._activeItem = doc.querySelector('[data-link="posts-list"]');

            this.toggleActive(this._activeItem);

            this._el.addEventListener('click', this.clickHandler.bind(this));
        },

        clickHandler: function(e) {
            if (window.location.pathname !== '/') return window.location = '/';

            var target = e ? e.target : window.event.srcElement,
                action = '';

            e.preventDefault();

            if (target.nodeName.toLowerCase() === 'a') {
                action = target.attributes['data-link'].value;

                this.navigateTo(action);
                this.toggleActive(target);
            }
        },

        toggleActive: function(item) {
            this._activeItem.classList.remove('is-selected');
            item.classList.add('is-selected');
            this._activeItem = item;
        },

        navigateTo: function(action) {
            this._activeSection.style.display = 'none';
            this._activeSection = doc.querySelector('.' + action);
            this._activeSection.style.display = 'block';
        }
    }

    return headerNavigation;
};

window.HeaderNavigation = HeaderNavigation;
