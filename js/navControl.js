/*
 *  navControl 2020
 *  Under MIT License
 */
function NavControl(options) {
    'use strict';

    // Default settings
    this.defaults = {
        selector: '.js-nav-control',
        breakpoint: 992, // desktop breakpoint
        duration: 500, // animation time
        fixedHeader: true,
        SELECTOR_NAV: '.js-nav',
        SELECTOR_NAV_ITEM: '.js-nav-item',
        SELECTOR_NAV_LEVEL: '.js-nav-level',
        SELECTOR_BACK: '.js-go-back',
        SELECTOR_HAS_SUBNAV: '.js-has-subnav',
        SELECTOR_HEADER: '.js-nav-level-header',
        CLASSNAME_ACTIVE: 'active-xs',
        CLASSNAME_INACTIVE: 'inactive-xs',
    };

    // Merge user options into defaults
    this.settings = Object.assign({}, this.defaults, options);

    // Get an element and show the message
    this.el = document.querySelector(this.settings.selector);
};

NavControl.prototype.init = function () {
    if (this.el) {
        var self = this;

        this.navigation = this.el.querySelector(this.settings.SELECTOR_NAV);
        this.firstMenuElement = this.el.querySelectorAll(this.settings.SELECTOR_NAV + ' > ' + this.settings.SELECTOR_NAV_LEVEL);

        if (this.settings.fixedHeader > 0) {
            var fixedHeaders = this.el.querySelectorAll(this.settings.SELECTOR_HEADER);
            fixedHeaders.forEach(function (element){
                element.classList.add('nav-level-header-fixed');
            });
        }

        this.el.addEventListener('click', function (e) {
            let target = e.target;
            if (target.classList.contains(self.settings.SELECTOR_BACK.substr(1))) {
                // self.onClickGoBackButton(target, e);
            };
            if (target.classList.contains(self.settings.SELECTOR_HAS_SUBNAV.substr(1))) {
                self.onClickNextButton(target, e);
            };
        });
    }
};
NavControl.prototype.transition = function () {
    var self = this;

    if (this.settings.duration > 0) {
        this.firstMenuElement.forEach(function(element){
            element.style.transitionDuration = self.settings.duration + 'ms';
        });
        setTimeout(function () {
            self.firstMenuElement.forEach(function(element){
                element.style.transitionDuration = '0ms';
            });
        }, this.settings.duration);
    }
};
NavControl.prototype.onClickNextButton = function (element, event) {
    var self = this;
    if (window.innerWidth < this.settings.breakpoint) {
        event.preventDefault();

        this.topPosition = this.el.scrollTop;

        element.parentNode.classList.add(this.settings.CLASSNAME_ACTIVE);

        var node = element;
        var leftPosition = 0;

        while (node.className.indexOf(this.settings.selector.substr(1)) < 0) {
            node = node.parentNode;
            if(node.classList.contains(this.settings.SELECTOR_NAV_LEVEL.substr(1))) {
                leftPosition++;
            };
        }

        this.firstMenuElement.forEach(function(element){
            element.style.left = (leftPosition * -100) + '%';
        });
        this.transition();

        var height = element.parentNode.querySelector(this.settings.SELECTOR_NAV_LEVEL).offsetHeight;
        element.parentNode.querySelector(this.settings.SELECTOR_NAV_LEVEL).style.top = this.topPosition + 'px';

        setTimeout(function () {
            element.parentNode.querySelector(self.settings.SELECTOR_NAV_LEVEL).style.top = 0;
            self.el.scrollTop = 0;
            self.navigation.style.height = height + 'px';
            element.classList.add(self.settings.CLASSNAME_INACTIVE);
            var elementParent = element.parentNode.nextElementSibling;
            while (elementParent) {
                elementParent.classList.add(self.settings.CLASSNAME_INACTIVE);
                elementParent = elementParent.nextElementSibling;
            }
            elementParent = element.parentNode.previousElementSibling;
            while (elementParent) {
                elementParent.classList.add(self.settings.CLASSNAME_INACTIVE);
                elementParent = elementParent.previousElementSibling;
            }
            element.parentNode.querySelector(self.settings.SELECTOR_NAV_LEVEL + ' a').focus();
        }, this.settings.duration);
    }
};
