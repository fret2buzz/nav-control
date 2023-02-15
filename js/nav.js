/*
 *  navControl 2023
 *  Under MIT License
 */
function NavControl(options) {
    'use strict';

    // Default settings
    this.defaults = {
        breakpoint: 1024,
        SELECTOR_NAV: '.js-nav',
        CLASSNAME_VISIBLE: 'm-active',
    };

    // Merge user options into defaults
    this.settings = Object.assign({}, this.defaults, options);
    this.classNameActive = this.settings.CLASSNAME_VISIBLE;

    this.el = document.querySelector(this.settings.SELECTOR_NAV);
}

NavControl.prototype.init = function () {
    if (this.el) {
        let lastToFocus = this.el.querySelectorAll('a, button');
        let index = lastToFocus.length - 1;

        lastToFocus[index].addEventListener('focusout', (e) => {
            if (!this.el.matches(':focus-within')) {
                this.collapse();
            }
        });

        this.el.addEventListener('click', (e) => {
            this.target = e.target;

            if (window.innerWidth >= this.settings.breakpoint) {
                //desktop
                let hasSubnav = this.target.getAttribute('aria-haspopup') == 'true';

                if (!hasSubnav) {
                    return false;
                }

                e.preventDefault();
                this.parentElement = this.target.parentElement;
                this.hiddenArea = this.parentElement.querySelector('[aria-hidden]');

                if (!this.parentElement.classList.contains(this.classNameActive)) {
                    this.expand();
                } else {
                    this.collapse();
                }

            } else {
                //mobile
            }
        });
    }
};

NavControl.prototype.expand = function() {
    this.hiddenArea.setAttribute('aria-hidden', 'false');
    this.target.setAttribute('aria-expanded', 'true');
    this.parentElement.classList.add(this.classNameActive);
    if (this.activeElement && this.parentElement !== this.activeElement) {
        this.collapse();
    }
    this.activeElement = document.querySelector(this.settings.SELECTOR_NAV + ' .' + this.classNameActive);
}

NavControl.prototype.collapse = function() {
    this.hiddenArea.setAttribute('aria-hidden', 'true');
    this.target.setAttribute('aria-expanded', 'false');
    this.activeElement.classList.remove(this.classNameActive);
    this.activeElement = null;
}
