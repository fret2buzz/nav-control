/*
 *  navControl 2020
 *  Under MIT License
 */
(function ($, window, document, undefined) {
    'use strict';

    const pluginName = 'keyboardAccessibility';
    const defaults = {
        breakpoint: 992, // desktop breakpoint
        CLASSNAME_VISIBLE: 'active',
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
            this.selectors = {
                inner: '.' + this.settings.CLASSNAME_DROPDOWN + ' a',
                main: '.' + this.settings.CLASSNAME_ITEM_LINK,
            };
            this.currentIndex = 0;

            this.$el.on('keydown', self.selectors.inner + ', ' + self.selectors.main, function (e) {
                self.currentLink = this;
                self.$currentLink = $(self.currentLink);
                self.hasSubnav = self.$currentLink.hasClass(self.settings.CLASSNAME_HAS_SUBNAV);
                self.firstLevel = self.$currentLink.parent().hasClass(self.settings.CLASSNAME_NAV_ITEM_PARENT);
                self.active = self.$currentLink.parent().hasClass(self.settings.CLASSNAME_VISIBLE);

                if (typeof self.settings.breakpoint === 'number' && $(window).width() >= self.settings.breakpoint) {
                    var key = e.which;
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
                self.active = self.$currentLink.parent().hasClass(self.settings.CLASSNAME_VISIBLE);
                if (typeof self.settings.breakpoint === 'number' && $(window).width() >= self.settings.breakpoint && self.hasSubnav) {
                    e.preventDefault();
                    self.toggleActive();
                }
            });
        },
        horizontal: function (next, event) {
            var $parent = this.$currentLink.parent();
            var $closestItem = this.$currentLink.closest('.' + this.settings.CLASSNAME_NAV_ITEM_PARENT);
            event.preventDefault();
            if (this.firstLevel) {
                // top level
                // set focus on prev/next of the parent links
                $parent = next ? $parent.next() : $parent.prev();
                if ($parent.length) {
                    $parent.find('a').first().focus();
                }
            } else {
                // set focus on prev/next of the parent links
                $closestItem = next ? $closestItem.next() : $closestItem.prev();
                $closestItem.find('a').first().focus();
            }
        },
        vertical: function (down, event) {
            event.preventDefault();
            var $navItemParent = this.$currentLink.closest('.' + this.settings.CLASSNAME_NAV_ITEM_PARENT);
            var $navItemPrev = this.$currentLink.parent().prev();
            var $innerLinks = $navItemParent.find(this.selectors.inner);

            if (down) {
                // top level
                if (this.firstLevel && this.hasSubnav && !this.active) {
                    this.currentIndex = 0;
                    this.removeActiveItem();
                    this.addActiveItem();
                } else if (this.firstLevel && this.hasSubnav) {
                    $innerLinks.eq(0).focus();
                } else if (this.currentIndex < $innerLinks.length - 1) {
                    this.currentIndex = $innerLinks.index(document.activeElement);
                    this.currentIndex++;
                    $innerLinks.eq(this.currentIndex).focus();
                } else if ($navItemParent.next().length) {
                    $navItemParent.next().find(this.selectors.main).focus();
                }
            } else {
                // top level
                if (this.firstLevel && this.hasSubnav && this.active) {
                    this.removeActiveItem();
                } else if (this.firstLevel && $navItemPrev.length) {
                    $navItemPrev.find(this.selectors.main).focus();
                } else if (this.currentIndex === 0) {
                    $navItemParent.find(this.selectors.main).focus();
                } else {
                    this.currentIndex = $innerLinks.index(document.activeElement);
                    this.currentIndex--;
                    $innerLinks.eq(this.currentIndex).focus();
                }
            }
        },
        removeActiveItem: function () {
            var $el = this.$el.find('.' + this.settings.CLASSNAME_VISIBLE);
            if ($el.length) {
                $el.find(this.selectors.main).attr('aria-expanded', 'false');
                $el.removeClass(this.settings.CLASSNAME_VISIBLE);
            }
            if (!this.firstLevel) {
                this.$currentLink
                    .closest('.' + this.settings.CLASSNAME_NAV_ITEM_PARENT)
                    .find(this.selectors.main)
                    .focus();
            }
        },
        addActiveItem: function () {
            this.$currentLink.parent().addClass(this.settings.CLASSNAME_VISIBLE);
            this.$currentLink.attr('aria-expanded', 'true');
        },
        toggleActive: function () {
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
