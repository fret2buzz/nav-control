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
        CLASSNAME_VISIBLE: 'active',
    };

    // Merge user options into defaults
    this.settings = Object.assign({}, this.defaults, options);

    this.el = document.querySelector(this.settings.SELECTOR_NAV);
}

NavControl.prototype.init = function () {
    if (this.el) {
        let self = this;
        let settings = this.settings;

        this.el.addEventListener('click', function (e) {
            let target = e.target;

            if (window.innerWidth >= settings.breakpoint) {
                //desktop
                let hasSubnav = target.getAttribute('aria-haspopup') == 'true';

                if (hasSubnav) {
                    e.preventDefault();
                    let parentElement = target.parentElement;
                    let classNameActive = settings.CLASSNAME_VISIBLE;
                    let activeElement = document.querySelector(settings.SELECTOR_NAV + ' .' + classNameActive);

                    function expand() {
                        parentElement.querySelector('[aria-hidden]').setAttribute('aria-hidden', 'false');
                        target.setAttribute('aria-expanded', 'true');
                        parentElement.classList.add(classNameActive)
                    }

                    function collapse() {
                        parentElement.querySelector('[aria-hidden]').setAttribute('aria-hidden', 'true');
                        target.setAttribute('aria-expanded', 'false');
                        activeElement.classList.remove(classNameActive);
                    }

                    if (parentElement.classList.contains(classNameActive)) {
                        collapse();
                    } else {
                        expand();
                    }

                    if (activeElement !== null) {
                        collapse();
                    }
                }
            } else {
                //mobile
            }
        });
    }
};

