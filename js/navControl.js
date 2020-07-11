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
        duration: 400, // animation time
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
            var target = e.target;
            var selBack = self.settings.SELECTOR_BACK.substr(1);
            var selNext = self.settings.SELECTOR_HAS_SUBNAV.substr(1);
            if (target.classList.contains(selBack)) {
                self.onClickGoBackButton(target, e);
            };
            if (target.classList.contains(selNext)) {
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
NavControl.prototype.parents = function (element) {
    var node = element;
    var leftPosition = 0;
    while (node.className.indexOf(this.settings.selector.substr(1)) < 0) {
        node = node.parentNode;
        if(node.classList.contains(this.settings.SELECTOR_NAV_LEVEL.substr(1))) {
            leftPosition++;
        };
    }
    return leftPosition;
}
NavControl.prototype.onClickNextButton = function (element, event) {
    var self = this;
    if (window.innerWidth < this.settings.breakpoint) {
        event.preventDefault();

        this.topPosition = this.el.scrollTop;

        element.parentNode.classList.add(this.settings.CLASSNAME_ACTIVE);

        var leftPosition = this.parents(element);

        this.firstMenuElement.forEach(function(element){
            element.style.left = (leftPosition * -100) + '%';
        });
        this.transition();

        var height = element.parentNode.querySelector(this.settings.SELECTOR_NAV_LEVEL).offsetHeight;
        element.parentNode.querySelector(this.settings.SELECTOR_NAV_LEVEL).style.top = this.topPosition + 'px';

        setTimeout(function () {
            element.parentNode.querySelector(self.settings.SELECTOR_NAV_LEVEL).style.top = '0';
            self.el.scrollTop = 0;
            self.navigation.style.height = height + 'px';
            element.classList.add(self.settings.CLASSNAME_INACTIVE);
            Array.from(element.parentNode.parentNode.children).forEach(function (el){
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
    Array.from(parentItem.parentNode.children).forEach(function (el){
        el.classList.remove(self.settings.CLASSNAME_INACTIVE);
    });
    this.transition();
    var pos = this.topPosition - this.el.scrollTop;
    this.el.scrollTop = this.topPosition;

    element.closest(this.settings.SELECTOR_NAV_LEVEL).style.top =  pos + 'px';

    var height = parentItem.parentNode.offsetHeight;

    var leftPosition = this.parents(element);
    this.firstMenuElement.forEach(function(element){
        element.style.left = ((leftPosition - 2) * -100) + '%';
    });

    setTimeout(function () {
        self.navigation.style.height = height + 'px';
        parentItem.classList.remove(self.settings.CLASSNAME_ACTIVE);
        element.closest(self.settings.SELECTOR_NAV_LEVEL).style.top = '0';
        parentItem.querySelector(self.settings.SELECTOR_HAS_SUBNAV).focus();
    }, this.settings.duration);
};
