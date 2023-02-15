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
        let breakpointType = typeof this.settings.breakpoint === 'number';
        let breakpointWidth = window.innerWidth >= this.settings.breakpoint;

        let lastToFocus = this.el.querySelectorAll('a, button');
        let index = lastToFocus.length - 1;

        lastToFocus[index].addEventListener('focusout', (e) => {
            if (!this.el.matches(':focus-within')) {
                this.collapse();
            }
        });

        this.el.addEventListener('click', (e) => {
            this.target = e.target;

            if (breakpointType && breakpointWidth) {
                //desktop
                e.preventDefault();
                this.parentContainer = this.findParent(this.target, 'main');
                this.button = this.parentContainer.querySelector('[aria-haspopup]');
                this.hiddenArea = this.parentContainer.querySelector('[aria-hidden]');

                switch (true) {
                    case this.target.getAttribute('aria-haspopup') === 'true':
                        if (!this.parentContainer.classList.contains(this.classNameActive)) {
                            this.expand();
                        } else {
                            this.collapse();
                        }
                        break;

                    case Object.keys(this.target.dataset).includes('close'):
                        this.collapse();
                        this.button.focus();

                        break;

                    default:
                        break;
                }
            } else {
                //mobile
            }
        });

        this.el.addEventListener('keydown', (e) => {
            if (breakpointType && breakpointWidth) {
                let key = e.which;
                if (key === 27) {
                    // escape
                    e.preventDefault();
                    this.collapse();
                    this.button.focus();
                }
            }
        });
    }
};

NavControl.prototype.findParent = function (element, type) {
    let end = element.parentElement.classList.contains(this.settings.SELECTOR_NAV);
    if (Object.keys(element.dataset).includes(type)) {
        return element;
    } else if (element.parentElement && !end) {
        return this.findParent(element.parentElement, type);
    } else {
        return false;
    }
}

NavControl.prototype.expand = function() {
    this.hiddenArea.setAttribute('aria-hidden', 'false');
    this.button.setAttribute('aria-expanded', 'true');
    this.parentContainer.classList.add(this.classNameActive);
    if (this.activeElement && this.parentContainer !== this.activeElement) {
        this.collapse();
    }
    this.activeElement = document.querySelector(this.settings.SELECTOR_NAV + ' .' + this.classNameActive);
}

NavControl.prototype.collapse = function() {
    this.hiddenArea.setAttribute('aria-hidden', 'true');
    this.button.setAttribute('aria-expanded', 'false');
    this.activeElement.classList.remove(this.classNameActive);
    this.activeElement = null;
}
