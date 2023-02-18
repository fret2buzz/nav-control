/*
 *  navControl 2023
 *  Under MIT License
 */

class NavControl {
    constructor(options) {
        // Default settings
        this.defaults = {
            BREAKPOINT: 1024,
            CLASSNAME_NAV: 'js-nav',
            CLASSNAME_VISIBLE: 'm-active',
            CLASSNAME_OPENED: 'm-opened',
            DATA_MAIN: 'main',
            DATA_CLOSE: 'close',
        };

        // Merge user options into defaults
        this.settings = Object.assign({}, this.defaults, options);
        this.classNameActive = this.settings.CLASSNAME_VISIBLE;
        this.timeoutId = null;
        this.el = document.querySelector('.' + this.settings.CLASSNAME_NAV);
    }

    // Init
    init() {
        if (this.el) {
            if (this.isDesktop()) {
                document.addEventListener('click', event => {
                    this.clickOutside(event);
                });

                this.el.addEventListener('keydown', event => {
                    this.handleKeyDown(event);
                });
            }

            this.el.addEventListener('click', event => {
                this.handleClick(event);
            });
        }
    }

    clickOutside(e) {
        const isClickInside = this.el.contains(e.target);
        if (!isClickInside) {
            this.collapse();
        }
    }

    handleKeyDown(e) {
        const key = e.which;
        let hasFocus = this.el.matches(':focus-within');

        if (key === 27) {
            // escape
            e.preventDefault();
            this.collapse();
            this.button.focus();
        }

        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
          if (!hasFocus) {
            this.collapse();
          }
        }, 200);
    }

    handleClick(e) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.target = e.target;

        if (this.isDesktop()) {
            // click on level 1 button
            if (this.target.getAttribute('aria-haspopup') === 'true') {
                this.initParentContainer();

                if (!this.parentContainer.classList.contains(this.classNameActive)) {
                    // close previous
                    this.collapse();
                    // expand new
                    this.expand();
                } else {
                    this.collapse();
                }

                e.preventDefault();
            }

            // close button
            if (Object.keys(this.target.dataset).includes(this.settings.DATA_CLOSE)) {
                this.collapse();
                this.button.focus();

                e.preventDefault();
            }
        } else {
            // click on level 1 button
            if (this.target.getAttribute('aria-haspopup') === 'true') {
                this.initParentContainer();

                if (!this.parentContainer.classList.contains(this.classNameActive)) {
                    this.mobileCollapse();
                    this.mobileExpand();
                }

                e.preventDefault();
            }

            // close button
            if (Object.keys(this.target.dataset).includes(this.settings.DATA_CLOSE)) {
                this.mobileCollapse();
                e.preventDefault();
            }
        }
    }

    initParentContainer() {
        this.parentContainer = this.findParent(this.target, this.settings.DATA_MAIN);
        if (!this.parentContainer) {
            return false;
        }
        this.button = this.target;
        this.hiddenArea = this.parentContainer.querySelector('[aria-hidden]');
    }

    isDesktop() {
        let typeNumber = typeof this.settings.BREAKPOINT === 'number';
        return typeNumber && window.innerWidth >= this.settings.BREAKPOINT;
    }

    findParent(element, type) {
        if (!element) {
            return false;
        }

        let end = element.parentElement.classList.contains(this.settings.CLASSNAME_NAV);

        if (Object.keys(element.dataset).includes(type)) {
            return element;
        } else if (element.parentElement && !end) {
            return this.findParent(element.parentElement, type);
        } else {
            return false;
        }
    }

    expand() {
        this.hiddenArea.setAttribute('aria-hidden', 'false');
        this.button.setAttribute('aria-expanded', 'true');
        this.parentContainer.classList.add(this.classNameActive);

        const sel = '.' + this.settings.CLASSNAME_NAV + ' .' + this.classNameActive;
        this.activeElement = document.querySelector(sel);
    }

    collapse() {
        if (!this.activeElement) {
            return false;
        }

        this.hiddenArea.setAttribute('aria-hidden', 'true');
        this.button.setAttribute('aria-expanded', 'false');
        this.activeElement.classList.remove(this.classNameActive);
        this.activeElement = null;
    }

    mobileExpand() {
        this.expand();
        this.mobileAddClone()
    }

    mobileCollapse() {
        this.collapse();
        this.mobileRemoveClone();
    }

    mobileAddClone() {
        if (this.sub) {
            this.sub.remove();
            this.sub = null;
        }

        const cloneElement = this.button.nextElementSibling.cloneNode(true);
        cloneElement.id = "active-level";
        this.el.appendChild(cloneElement);
        this.sub = document.getElementById('active-level');
        this.sub.querySelector('a, button').focus();
        this.el.classList.add(this.settings.CLASSNAME_OPENED);
    }

    mobileRemoveClone() {
        this.el.classList.remove(this.settings.CLASSNAME_OPENED);
        this.button.focus();
    }
}
