/*
 *  navControl 2020
 *  Under MIT License
 */
(function ($, window, document, undefined) {
    'use strict';

    const pluginName = 'keyboardAccessibility';
    const defaults = {
        breakpoint: 992, // desktop breakpoint
        CLASSNAME_NAV_LEVEL: 'js-nav-level',
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
            this.$innerLinks = $(selectors.inner);
            this.$mainLinks = $(selectors.main);

            this.$el.on('keydown', selectors.inner + ', ' + selectors.main, function (e) {
                // console.log(this);

                var hasSubnav = $(this).hasClass(self.settings.CLASSNAME_HAS_SUBNAV);
                var firstLevel = $(this).parent().hasClass(self.settings.CLASSNAME_NAV_ITEM_PARENT);
                var active = $(this).parent().hasClass(self.settings.CLASSNAME_ACTIVE);

                if (breakpoint) {
                    var key = e.which;

                    if (e.which === 9 && e.shiftKey && firstLevel) {
                        // shift + Tab
                        self.removeActiveItem();
                    }

                    var supportedKeyCodes = [32, 13]; // spacer, enter

                    if (supportedKeyCodes.indexOf(key) >= 0 && hasSubnav) {
                        e.preventDefault();
                        self.toggleActive(this, active);
                    }

                    if (key === 27) {
                        // escape
                        e.preventDefault();
                        self.removeActiveItem();
                    }
                    if (key === 37) {
                        // left
                        self.horizontal(this, false, e, firstLevel);
                    }
                    if (key === 39) {
                        // right
                        self.horizontal(this, true, e, firstLevel);
                    }
                    if (key === 38) {
                        // up
                        self.vertical(this, false, e, firstLevel, active);
                    }
                    if (key === 40) {
                        // down
                        self.vertical(this, true, e, firstLevel, active);
                    }
                }
            });
            this.$el.on('click', '.' + this.settings.CLASSNAME_ITEM_LINK, function (e) {
                if (breakpoint && $(this).hasClass(self.settings.CLASSNAME_HAS_SUBNAV)) {
                    var active = $(this).parent().hasClass(self.settings.CLASSNAME_ACTIVE);
                    e.preventDefault();
                    self.toggleActive(this, active);
                }
            });
        },
        horizontal: function (element, next, event, firstLevel) {
            var $el = $(element);
            var $parent = $el.parent();
            var $closestItem = $el.closest('.' + this.settings.CLASSNAME_NAV_ITEM_PARENT);
            event.preventDefault();
            this.removeActiveItem();
            if (firstLevel) {
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
        vertical: function (element, down, event, firstLevel, active) {
            var $el = $(element);
            var $parent = $el.parent();
            event.preventDefault();
            if (down) {
                // top level
                if (firstLevel && !active) {
                    this.removeActiveItem();
                    this.addActiveItem(element);
                } else {
                    this.$innerLinks.first().focus();
                }
            } else {
                // top level
                if (firstLevel && active) {
                    this.removeActiveItem();
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
        addActiveItem: function (element) {
            var $el = $(element);
            $el.parent().addClass(this.settings.CLASSNAME_ACTIVE);
            $el.attr('aria-expanded', 'true');
        },
        toggleActive: function (element, active) {
            this.removeActiveItem();
            if (!active) {
                this.addActiveItem(element);
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
