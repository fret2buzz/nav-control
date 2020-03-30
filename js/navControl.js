/*
 *  navControl 2020
 *  Under MIT License
 */
;
(function($, window, document, undefined) {
    "use strict";

    const pluginName = "navControl";
    const defaults = {
        breakpoint: 768,
        duration: 300,
        SELECTOR_NAV: '.js-nav',
        SELECTOR_NAV_LEVEL: '.js-nav-level',
        SELECTOR_BACK: '.js-go-back',
        SELECTOR_HAS_SUBNAV: '.js-has-subnav'
    };

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function() {
            var self = this;
            this.$el = $(this.element);
            console.log(this.settings.duration);

            this.$navigation = this.$el.find(this.settings.SELECTOR_NAV);
            this.$firstMenuElement = this.$navigation.find(' > ' + this.settings.SELECTOR_NAV_LEVEL);

            if (this.settings.duration > 0) {
                this.$firstMenuElement.css('transitionDuration', this.settings.duration + 'ms');
            }

            this.$el.on('click', this.settings.SELECTOR_BACK, function(e){
                self.onClickGoBackButton(this, e);
            });
            this.$el.on('click', this.settings.SELECTOR_HAS_SUBNAV, function(e){
                self.onClickNextButton(this, e);
            });
        },
        onClickNextButton: function(element, event) {
            if ($(window).width() < this.settings.breakpoint) {
                event.preventDefault();

                var $el = $(element);

                this.topPosition = this.$el.scrollTop();
                $el.parent().addClass('active-xs');

                var leftPosition = $el.parents(this.settings.SELECTOR_NAV_LEVEL).length * -100;
                this.$firstMenuElement.css('left', leftPosition + '%');

                var height = $el.nextAll(this.settings.SELECTOR_NAV_LEVEL).first().height();

                $el.nextAll(this.settings.SELECTOR_NAV_LEVEL).first().css('top', this.topPosition + 'px');

                setTimeout(() => {
                    $el.nextAll(this.settings.SELECTOR_NAV_LEVEL).first().css('top', 0);
                    this.$el.scrollTop(0);
                    this.$navigation.css('height', height + 'px');
                    $el.addClass('inactive-xs');
                    $el.parent().siblings().addClass('inactive-xs');
                    $el.nextAll(this.settings.SELECTOR_NAV_LEVEL).first().find('.js-mega-nav-col a').first().focus();
                }, this.duration);
            }
        },
        onClickGoBackButton: function(element, event) {
            event.preventDefault();
            var $el = $(element);

            var parents = $el.parents(this.settings.SELECTOR_NAV_LEVEL);
            var parentItem = $el.closest('.nav-item');

            parentItem.find('.js-has-subnav').removeClass('inactive-xs');
            parentItem.siblings().removeClass('inactive-xs');

            this.$el.scrollTop(this.topPosition);
            $el.closest(this.settings.SELECTOR_NAV_LEVEL).css('top', this.topPosition);

            // setTimeout(() => {
            //     console.log(this.$navigation);
            //     this.$navigation.css('height', 'auto');
            //     parentItem.removeClass('active-xs');
            // }, this.duration);

            // var leftPosition = (parents.length - 2) * -100;
            // this.$firstMenuElement.css('left', leftPosition + '%');
            // setTimeout(() => {
            //     parentItem.find('.js-has-subnav').focus();
            // }, this.duration);
        }
    });

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
