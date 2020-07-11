/*
 *  navControl 2020
 *  Under MIT License
 */
function NavControl(options) {
    'use strict';

    // Default settings
    this.defaults = {
        breakpoint: 992, // desktop breakpoint
        duration: 400, // animation time
        fixedHeader: true,
        SELECTOR_CONTAINER: '.js-nav-control',
        SELECTOR_NAV: '.js-nav',
        SELECTOR_NAV_ITEM: '.js-nav-item',
        SELECTOR_NAV_LEVEL: '.js-nav-level',
        SELECTOR_BACK: '.js-go-back',
        SELECTOR_HAS_SUBNAV: '.js-has-subnav',
        SELECTOR_HEADER: '.js-nav-level-header',
        CLASSNAME_ACTIVE: 'active-xs',
        CLASSNAME_INACTIVE: 'inactive-xs',
        CLASSNAME_VISIBLE: 'active',
        CLASSNAME_NAV_ITEM_PARENT: 'js-nav-item-parent',
        CLASSNAME_ITEM_LINK: 'js-nav-item-link',
        CLASSNAME_DROPDOWN: 'js-nav-dropdown',
        CLASSNAME_HAS_SUBNAV: 'js-has-subnav',
    };

    // Merge user options into defaults
    this.settings = Object.assign({}, this.defaults, options);

    // Get an element and show the message
    this.el = document.querySelector(this.settings.SELECTOR_CONTAINER);
}

NavControl.prototype.init = function () {
    if (this.el) {
        var self = this;

        // XS part
        this.navigation = this.el.querySelector(this.settings.SELECTOR_NAV);
        this.firstMenuElement = this.el.querySelectorAll(this.settings.SELECTOR_NAV + ' > ' + this.settings.SELECTOR_NAV_LEVEL);

        if (this.settings.fixedHeader > 0) {
            var fixedHeaders = this.el.querySelectorAll(this.settings.SELECTOR_HEADER);
            fixedHeaders.forEach(function (element) {
                element.classList.add('nav-level-header-fixed');
            });
        }

        this.el.addEventListener('click', function (e) {
            var target = e.target;
            var selBack = self.settings.SELECTOR_BACK.substr(1);
            var selNext = self.settings.SELECTOR_HAS_SUBNAV.substr(1);
            if (target.classList.contains(selBack)) {
                self.onClickGoBackButton(target, e);
            }
            if (target.classList.contains(selNext)) {
                self.onClickNextButton(target, e);
            }

            // LG click
            self.hasSubnav = target.classList.contains(self.settings.CLASSNAME_HAS_SUBNAV);
            self.active = target.parentNode.classList.contains(self.settings.CLASSNAME_VISIBLE);
            if (typeof self.settings.breakpoint === 'number' && window.innerWidth >= self.settings.breakpoint && self.hasSubnav) {
                e.preventDefault();
                self.toggleActive(target);
            }
        });

        // LG part
        this.selectors = {
            inner: '.' + this.settings.CLASSNAME_DROPDOWN + ' a',
            main: '.' + this.settings.CLASSNAME_ITEM_LINK,
        };
        this.currentIndex = 0;

        this.el.addEventListener('keydown', function (e) {
            self.hasSubnav = e.target.classList.contains(self.settings.CLASSNAME_HAS_SUBNAV);
            self.firstLevel = e.target.parentNode.classList.contains(self.settings.CLASSNAME_NAV_ITEM_PARENT);
            self.active = e.target.parentNode.classList.contains(self.settings.CLASSNAME_VISIBLE);

            if (typeof self.settings.breakpoint === 'number' && window.innerWidth >= self.settings.breakpoint) {
                var key = e.which;
                var supportedKeyCodes = [32, 13]; // spacer, enter
                if (supportedKeyCodes.indexOf(key) >= 0 && self.hasSubnav) {
                    e.preventDefault();
                    self.toggleActive();
                }
                if (key === 27) {
                    // escape
                    e.preventDefault();
                    self.removeActiveItem(e.target);
                }
                if (key === 37) {
                    // left
                    self.horizontal(false, e);
                }
                if (key === 39) {
                    // right
                    self.horizontal(true, e);
                }
                if (key === 38) {
                    // up
                    self.vertical(false, e);
                }
                if (key === 40) {
                    // down
                    self.vertical(true, e);
                }
            }
        });
    }
};
NavControl.prototype.transition = function () {
    var self = this;

    if (this.settings.duration > 0) {
        this.firstMenuElement.forEach(function (element) {
            element.style.transitionDuration = self.settings.duration + 'ms';
        });
        setTimeout(function () {
            self.firstMenuElement.forEach(function (element) {
                element.style.transitionDuration = '0ms';
            });
        }, this.settings.duration);
    }
};
NavControl.prototype.parents = function (element) {
    var node = element;
    var leftPosition = 0;
    while (node.className.indexOf(this.settings.SELECTOR_CONTAINER.substr(1)) < 0) {
        node = node.parentNode;
        if (node.classList.contains(this.settings.SELECTOR_NAV_LEVEL.substr(1))) {
            leftPosition++;
        }
    }
    return leftPosition;
};
NavControl.prototype.onClickNextButton = function (element, event) {
    var self = this;
    if (window.innerWidth < this.settings.breakpoint) {
        event.preventDefault();

        this.topPosition = this.el.scrollTop;

        element.parentNode.classList.add(this.settings.CLASSNAME_ACTIVE);

        var leftPosition = this.parents(element);

        this.firstMenuElement.forEach(function (element) {
            element.style.left = leftPosition * -100 + '%';
        });
        this.transition();

        var height = element.parentNode.querySelector(this.settings.SELECTOR_NAV_LEVEL).offsetHeight;
        element.parentNode.querySelector(this.settings.SELECTOR_NAV_LEVEL).style.top = this.topPosition + 'px';

        setTimeout(function () {
            element.parentNode.querySelector(self.settings.SELECTOR_NAV_LEVEL).style.top = '0';
            self.el.scrollTop = 0;
            self.navigation.style.height = height + 'px';
            element.classList.add(self.settings.CLASSNAME_INACTIVE);
            Array.from(element.parentNode.parentNode.children).forEach(function (el) {
                el.classList.add(self.settings.CLASSNAME_INACTIVE);
            });
            element.parentNode.classList.remove(self.settings.CLASSNAME_INACTIVE);
            element.parentNode.querySelector(self.settings.SELECTOR_NAV_LEVEL).querySelector('a').focus();
        }, this.settings.duration);
    }
};
NavControl.prototype.onClickGoBackButton = function (element, event) {
    var self = this;
    event.preventDefault();
    var parentItem = element.closest(this.settings.SELECTOR_NAV_ITEM);

    parentItem.querySelector(this.settings.SELECTOR_HAS_SUBNAV).classList.remove(this.settings.CLASSNAME_INACTIVE);
    Array.from(parentItem.parentNode.children).forEach(function (el) {
        el.classList.remove(self.settings.CLASSNAME_INACTIVE);
    });
    this.transition();
    var pos = this.topPosition - this.el.scrollTop;
    this.el.scrollTop = this.topPosition;

    element.closest(this.settings.SELECTOR_NAV_LEVEL).style.top = pos + 'px';

    var height = parentItem.parentNode.offsetHeight;

    var leftPosition = this.parents(element);
    this.firstMenuElement.forEach(function (element) {
        element.style.left = (leftPosition - 2) * -100 + '%';
    });

    setTimeout(function () {
        self.navigation.style.height = height + 'px';
        parentItem.classList.remove(self.settings.CLASSNAME_ACTIVE);
        element.closest(self.settings.SELECTOR_NAV_LEVEL).style.top = '0';
        parentItem.querySelector(self.settings.SELECTOR_HAS_SUBNAV).focus();
    }, this.settings.duration);
};
NavControl.prototype.horizontal = function (next, event) {
    var parent = event.target.parentNode;
    var closestItem = event.target.closest('.' + this.settings.CLASSNAME_NAV_ITEM_PARENT);
    event.preventDefault();
    if (this.firstLevel) {
        // top level
        // set focus on prev/next of the parent links
        parent = next ? parent.nextElementSibling : parent.previousElementSibling;
        if (parent) {
            parent.querySelector('a').focus();
        }
    } else {
        // set focus on prev/next of the parent links
        closestItem = next ? closestItem.nextElementSibling : closestItem.previousElementSibling;
        closestItem.querySelector('a').focus();
    }
};
NavControl.prototype.vertical = function (down, event) {
    event.preventDefault();
    var navItemParent = event.target.closest('.' + this.settings.CLASSNAME_NAV_ITEM_PARENT);
    var navItemPrev = event.target.parentNode.previousElementSibling;
    var innerLinks = navItemParent.querySelectorAll(this.selectors.inner);

    if (down) {
        // top level
        if (this.firstLevel && this.hasSubnav && !this.active) {
            this.currentIndex = 0;
            this.removeActiveItem(event.target);
            this.addActiveItem(event.target);
        } else if (this.firstLevel && this.hasSubnav) {
            innerLinks[0].focus();
        } else if (this.currentIndex < innerLinks.length - 1) {
            this.currentIndex = [].indexOf.call(innerLinks, document.activeElement);
            this.currentIndex++;
            innerLinks[this.currentIndex].focus();
        } else if (navItemParent.nextElementSibling) {
            navItemParent.nextElementSibling.querySelector(this.selectors.main).focus();
        }
    } else {
        // top level
        if (this.firstLevel && this.hasSubnav && this.active) {
            this.removeActiveItem(event.target);
        } else if (this.firstLevel && navItemPrev) {
            navItemPrev.querySelector(this.selectors.main).focus();
        } else if (this.currentIndex === 0) {
            navItemParent.querySelector(this.selectors.main).focus();
        } else {
            this.currentIndex = [].indexOf.call(innerLinks, document.activeElement);
            this.currentIndex--;
            innerLinks[this.currentIndex].focus();
        }
    }
};
NavControl.prototype.removeActiveItem = function (link) {
    var el = this.el.querySelector('.' + this.settings.CLASSNAME_VISIBLE);
    if (el) {
        el.querySelector(this.selectors.main).setAttribute('aria-expanded', 'false');
        el.classList.remove(this.settings.CLASSNAME_VISIBLE);
    }
    if (!this.firstLevel) {
        link.closest('.' + this.settings.CLASSNAME_NAV_ITEM_PARENT)
            .querySelector(this.selectors.main)
            .focus();
    }
};
NavControl.prototype.addActiveItem = function (link) {
    link.parentNode.classList.add(this.settings.CLASSNAME_VISIBLE);
    link.setAttribute('aria-expanded', 'true');
};
NavControl.prototype.toggleActive = function (link) {
    this.removeActiveItem(link);
    if (!this.active) {
        this.addActiveItem(link);
    }
};
