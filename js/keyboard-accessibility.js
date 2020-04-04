/*
 *  navControl 2020
 *  Under MIT License
 */
(function ($, window, document, undefined) {
    'use strict';

    const pluginName = 'keyboardAccessibility';
    const defaults = {
        breakpoint: 992, // desktop breakpoint
        SELECTOR_FIRST_LEVEL_LINK: '.js-nav-first-level-link',
        SELECTOR_NAV_ITEM: '.js-nav-item',
        SELECTOR_NAV_LEVEL: '.js-nav-level',
        SELECTOR_BACK: '.js-go-back',
        SELECTOR_HAS_SUBNAV: '.js-has-subnav',
        SELECTOR_HEADER: '.js-nav-level-header',
        CLASSNAME_ACTIVE: 'active',
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

            this.$el.on('focus mouseenter', this.settings.SELECTOR_FIRST_LEVEL_LINK, function () {
                if ($(window).width() >= self.settings.breakpoint) {
                    self.removeActiveItem();
                }
            });
            this.$el.on('keydown', this.settings.SELECTOR_HAS_SUBNAV, function (e) {
                if ($(window).width() >= self.settings.breakpoint) {
                    // console.log(this);
                    self.enterKey(this, e);
                }
            });
        },
        removeActiveItem: function () {
            var $el = this.$el.find(this.settings.SELECTOR_FIRST_LEVEL_LINK);
            // console.log($el);
            $el.attr('aria-expanded', 'false');
            // $el.css("background", "red");
            $el.parent().removeClass(this.settings.CLASSNAME_ACTIVE);
        },
        enterKey: function (element, event) {
            var self = this;
            var $el = $(element);
            var key = event.which;
            var supportedKeyCodes = [32, 13]; // spacer, enter

            if (supportedKeyCodes.indexOf(key) >= 0) {
                event.preventDefault();
                $el.parent().toggleClass(this.settings.CLASSNAME_ACTIVE);
                $el.attr('aria-expanded', $el.parent().hasClass(this.settings.CLASSNAME_ACTIVE));
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
