/*
 *  navControl 2020
 *  Under MIT License
 */
(function ($, window, document, undefined) {
    'use strict';

    const pluginName = 'keyboardAccessibility';
    const defaults = {
        breakpoint: 992, // desktop breakpoint
        SELECTOR_NAV_FIRST: '.js-nav-item-first',
        SELECTOR_FIRST_LEVEL_LINK: '.js-nav-item-first > a',
        SELECTOR_NAV_LEVEL: '.js-nav-level',
        SELECTOR_CLICKABLE: '.js-nav-clickable',
        CLASSNAME_ACTIVE: 'active',
        CLASSNAME_NAV_ITEM_FIRST: 'js-nav-item-first',
        CLASSNAME_CLICKABLE: 'js-nav-clickable',
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

            this.$el.on('keydown', 'a', function (e) {
                if (breakpoint) {
                    var key = e.which;
                    if (key === 27) {
                        // escape
                        self.removeActiveItem();
                    }
                    if (key === 37) {
                        // left
                        self.horizontal(this, false, e);
                    }
                    if (key === 39) {
                        // right
                        self.horizontal(this, true, e);
                    }
                    if (key === 38) {
                        // up
                        self.vertical(this, false, e);
                    }
                    if (key === 40) {
                        // down
                        self.vertical(this, true, e);
                    }
                }
            });
            this.$el.on('keydown', this.settings.SELECTOR_FIRST_LEVEL_LINK, function (e) {
                if (breakpoint) {
                    var key = e.which;
                    if (e.which === 9 && e.shiftKey) {
                        // shift + Tab
                        self.removeActiveItem();
                    }
                }
            });
            this.$el.on('keydown', this.settings.SELECTOR_CLICKABLE, function (e) {
                if (breakpoint) {
                    var key = e.which;
                    var supportedKeyCodes = [32, 13]; // spacer, enter
                    if (supportedKeyCodes.indexOf(key) >= 0) {
                        e.preventDefault();
                        self.toggleActive(this);
                    }
                }
            });
            this.$el.on('click', this.settings.SELECTOR_CLICKABLE, function (e) {
                if (breakpoint) {
                    e.preventDefault();
                    self.toggleActive(this);
                }
            });
        },
        horizontal: function (element, next, event) {
            var $el = $(element);
            var $parent = $el.parent();
            var $closestItem = $el.closest(this.settings.SELECTOR_NAV_FIRST);
            event.preventDefault();
            this.removeActiveItem();
            if ($parent.hasClass(this.settings.CLASSNAME_NAV_ITEM_FIRST)) {
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
        vertical: function (element, down, event) {
            var $el = $(element);
            var $parent = $el.parent();
            event.preventDefault();
            // if (down) {
            //     // top level
            //     if ($el.hasClass(this.settings.CLASSNAME_CLICKABLE) && !$parent.hasClass(this.settings.CLASSNAME_ACTIVE)) {
            //         this.toggleActive(element);
            //     }
            //     // $parent.find(this.settings.SELECTOR_NAV_LEVEL+' a').first().focus();
            // } else {
            //     if ($el.hasClass(this.settings.CLASSNAME_CLICKABLE) && $parent.hasClass(this.settings.CLASSNAME_ACTIVE)) {
            //         this.toggleActive(element);
            //     }
            // }
        },
        removeActiveItem: function () {
            var $el = this.$el.find('.'+this.settings.CLASSNAME_ACTIVE);
            console.log($el);
            $el.attr('aria-expanded', 'false');
            $el.removeClass(this.settings.CLASSNAME_ACTIVE);
        },
        addActiveItem: function (element) {
            var $el = $(element);
            $el.parent().addClass(this.settings.CLASSNAME_ACTIVE);
            $el.attr('aria-expanded', 'true');
        },
        toggleActive: function (element) {
            var $el = $(element);
            var isActive = $el.parent().hasClass(this.settings.CLASSNAME_ACTIVE);
            this.removeActiveItem();
            if (!isActive) {
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
