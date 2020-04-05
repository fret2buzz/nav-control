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
        CLASSNAME_ACTIVE: 'active',
        SELECTOR_CLICKABLE: '.js-nav-clickable',
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

            // removing 'active' class from navigation item with subnav on focus
            // on any of the first level links
            // this.$el.on('focus', this.settings.SELECTOR_FIRST_LEVEL_LINK, function () {
            //     var isActive = $(this).parent().hasClass(self.settings.CLASSNAME_ACTIVE);
            //     if ($(window).width() >= self.settings.breakpoint && !isActive) {
            //         self.removeActiveItem();
            //     }
            // });
            this.$el.on('keydown', this.settings.SELECTOR_CLICKABLE, function (e) {
                if ($(window).width() >= self.settings.breakpoint) {
                    var key = event.which;
                    var supportedKeyCodes = [32, 13]; // spacer, enter
                    if (supportedKeyCodes.indexOf(key) >= 0) {
                        self.toggleActive(this, e);
                    }
                }
            });
            this.$el.on('click', this.settings.SELECTOR_CLICKABLE, function (e) {
                if ($(window).width() >= self.settings.breakpoint) {
                    self.toggleActive(this, e);
                }
            });
        },
        removeActiveItem: function () {
            var $el = this.$el.find(this.settings.SELECTOR_FIRST_LEVEL_LINK);
            $el.attr('aria-expanded', 'false');
            $el.parent().removeClass(this.settings.CLASSNAME_ACTIVE);
        },
        toggleActive: function (element, event) {
            var $el = $(element);
            var isActive = $el.parent().hasClass(this.settings.CLASSNAME_ACTIVE);
            event.preventDefault();
            this.removeActiveItem();
            if (!isActive) {
                $el.parent().addClass(this.settings.CLASSNAME_ACTIVE);
                $el.attr('aria-expanded', 'true');
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
