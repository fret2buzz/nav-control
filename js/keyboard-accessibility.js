/*
 *  navControl 2020
 *  Under MIT License
 */
(function ($, window, document, undefined) {
    'use strict';

    const pluginName = 'keyboardAccessibility';
    const defaults = {
        breakpoint: 992, // desktop breakpoint
        CLASSNAME_ACTIVE: 'active',
        CLASSNAME_NAV_ITEM_PARENT: 'js-nav-item-parent',
        CLASSNAME_ITEM_LINK: 'js-nav-item-link',
        CLASSNAME_DROPDOWN: 'js-nav-dropdown',
        CLASSNAME_HAS_SUBNAV: 'js-has-subnav',
    };

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function () {
            var self = this;
            this.$el = $(this.element);
            var breakpoint = typeof this.settings.breakpoint === 'number' && $(window).width() >= this.settings.breakpoint;
            var selectors = {
                inner: '.' + this.settings.CLASSNAME_DROPDOWN + ' a',
                main: '.' + this.settings.CLASSNAME_ITEM_LINK,
            };
            this.$mainLinks = this.$el.find(selectors.main);

            this.$el.on('keydown', selectors.inner + ', ' + selectors.main, function (e) {
                // console.log(this);

                self.currentLink = this;
                self.$currentLink = $(self.currentLink);
                self.$innerLinks = self.$currentLink.closest('.' + self.settings.CLASSNAME_NAV_ITEM_PARENT).find(selectors.inner);
                self.currentIndex = self.$innerLinks.index(self.currentLink);
                self.hasSubnav = self.$currentLink.hasClass(self.settings.CLASSNAME_HAS_SUBNAV);
                self.firstLevel = self.$currentLink.parent().hasClass(self.settings.CLASSNAME_NAV_ITEM_PARENT);
                self.active = self.$currentLink.parent().hasClass(self.settings.CLASSNAME_ACTIVE);

                if (breakpoint) {
                    var key = e.which;

                    if (e.which === 9 && e.shiftKey && self.firstLevel) {
                        // shift + Tab
                        self.removeActiveItem();
                    }

                    var supportedKeyCodes = [32, 13]; // spacer, enter

                    if (supportedKeyCodes.indexOf(key) >= 0 && self.hasSubnav) {
                        e.preventDefault();
                        self.toggleActive();
                    }

                    if (key === 27) {
                        // escape
                        e.preventDefault();
                        self.removeActiveItem();
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
            this.$el.on('click', '.' + this.settings.CLASSNAME_ITEM_LINK, function (e) {
                self.$currentLink = $(this);
                self.hasSubnav = self.$currentLink.hasClass(self.settings.CLASSNAME_HAS_SUBNAV);
                self.active = self.$currentLink.parent().hasClass(self.settings.CLASSNAME_ACTIVE);
                if (breakpoint && self.hasSubnav) {
                    e.preventDefault();
                    self.toggleActive();
                }
            });
        },
        horizontal: function (next, event) {
            var $parent = this.$currentLink.parent();
            var $closestItem = this.$currentLink.closest('.' + this.settings.CLASSNAME_NAV_ITEM_PARENT);
            event.preventDefault();
            this.removeActiveItem();
            if (this.firstLevel) {
                // top level
                // set focus on prev/next of the parent links
                $parent = next ? $parent.next() : $parent.prev();
                $parent.find('a').first().focus();
            } else {
                // set focus on prev/next of the parent links
                $closestItem = next ? $closestItem.next() : $closestItem.prev();
                $closestItem.find('a').first().focus();
            }
        },
        vertical: function (down, event) {
            event.preventDefault();
            if (down) {
                // top level
                if (this.firstLevel && this.hasSubnav && !this.active) {
                    this.removeActiveItem();
                    this.addActiveItem();
                } else if (this.firstLevel) {
                    console.log(this.$innerLinks);
                    this.$innerLinks.eq(0).focus();
                } else {
                    console.log(this.currentIndex);
                    this.$innerLinks.eq(this.currentIndex + 1).focus();
                }
            } else {
                // top level
                if (this.firstLevel && this.hasSubnav && this.active) {
                    this.removeActiveItem();
                } else {
                    console.log(this.currentIndex);
                    this.$innerLinks.eq(this.currentIndex - 1).focus();
                }
            }
        },
        removeActiveItem: function () {
            var $el = this.$el.find('.' + this.settings.CLASSNAME_ACTIVE);
            if ($el.length) {
                $el.attr('aria-expanded', 'false');
                $el.removeClass(this.settings.CLASSNAME_ACTIVE);
                var index = $el.index();
                this.$mainLinks.eq(index).focus();
            }
        },
        addActiveItem: function () {
            this.$currentLink.parent().addClass(this.settings.CLASSNAME_ACTIVE);
            this.$currentLink.attr('aria-expanded', 'true');
        },
        toggleActive: function (active) {
            this.removeActiveItem();
            if (!this.active) {
                this.addActiveItem();
            }
        },
    });

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };
})(jQuery, window, document);
