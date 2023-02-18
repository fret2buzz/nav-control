/*
 *  navControl 2023
 *  Under MIT License
 */

class NavControl {
    constructor(options) {
        // Default settings
        this.defaults = {
            BREAKPOINT: 1024,
            TIME: 300,
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
        if (!this.el) {
            return false;
        }

        if (this.isDesktop()) {
            this.handleKeyDown = this.handleKeyDown.bind(this);
            this.el.addEventListener('keydown', this.handleKeyDown);
            this.clickOutside = this.clickOutside.bind(this);
            window.addEventListener('click', this.clickOutside);
        } else {
            this.el.style = "--time:" + this.settings.TIME + 'ms;';
        }

        this.handleClick = this.handleClick.bind(this);
        this.el.addEventListener('click', this.handleClick);

        this.reset = this.reset.bind(this);
        window.addEventListener('resize', this.reset);
    }

    destroy() {
        console.log('destroyed');
        this.el.removeEventListener('keydown', this.handleKeyDown);
        this.el.removeEventListener('click', this.handleClick);
        window.removeEventListener('resize', this.resizeWindow);
        window.removeEventListener('click', this.clickOutside);
    }

    removeSub() {
        if (this.sub) {
            this.sub.remove();
            this.sub = null;
        }
    }

    debounce(func, delay) {
        this.timeoutId;

        return () => {
            const args = arguments;
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                func(args);
            }, delay);
        }
    }

    reset() {
        let resizeFunc = this.debounce(() => {
            console.log('resized');
            if (this.activeElement) {
                this.removeSub();
                this.collapse();
                this.mobileRemoveClone();
                this.el.style = "--time:" + this.settings.TIME + 'ms;';
            }

        }, 200);

        resizeFunc();
    }

    clickOutside(e) {
        const isClickInside = this.el.contains(e.target);
        if (!isClickInside) {
            this.collapse();
        }
    }

    handleKeyDown(e) {
        const key = e.which;

        if (key === 27) {
            // escape
            e.preventDefault();
            this.collapse();
            this.button.focus();
        }

        let handleFocus = this.debounce(() => {
            let hasFocus = this.el.matches(':focus-within');
            if (!hasFocus) {
                this.collapse();
            }
        }, 200);
        handleFocus();
    }

    handleClick(e) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.target = e.target;
        this.hasClose = Object.keys(this.target.dataset).includes(this.settings.DATA_CLOSE);
        this.hasPopup = this.target.getAttribute('aria-haspopup') === 'true';

        if (this.isDesktop()) {
            // click on level 1 button
            if (this.hasPopup) {
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
            if (this.hasClose) {
                this.collapse();
                this.button.focus();

                e.preventDefault();
            }
        } else {

            // Prevent double-click
            if (this.hasPopup || this.hasClose) {
                if(this.inProgress) {
                    return false;
                }

                this.inProgress = true;

                setTimeout(() => {
                    this.inProgress = false;
                }, this.settings.TIME);
            }

            // click on level 1 button
            if (this.hasPopup) {
                this.initParentContainer();

                if (!this.parentContainer.classList.contains(this.classNameActive)) {
                    this.mobileCollapse();
                    this.mobileExpand();
                }

                e.preventDefault();
            }

            // close button
            if (this.hasClose) {
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
        this.mobileAddClone();
    }

    mobileCollapse() {
        this.collapse();
        this.mobileRemoveClone();
    }

    mobileAddClone() {
        this.removeSub();

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
