/*
 *  navControl 2020
 *  Under MIT License
 */
;
(function($, window, document, undefined) {
    "use strict";

    const pluginName = "navControl";
    const defaults = {
        breakpoint: 768, // tablet breakpoint
        duration: 300, // animation time
        SELECTOR_NAV: '.js-nav',
        SELECTOR_NAV_ITEM: '.js-nav-item',
        SELECTOR_NAV_LEVEL: '.js-nav-level',
        SELECTOR_BACK: '.js-go-back',
        SELECTOR_HAS_SUBNAV: '.js-has-subnav',
        CLASSNAME_ACTIVE: 'active-xs',
        CLASSNAME_INACTIVE: 'inactive-xs'
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
            var self = this;

            if ($(window).width() < this.settings.breakpoint) {
                event.preventDefault();

                var $el = $(element);

                this.topPosition = this.$el.scrollTop();
                $el.parent().addClass(this.settings.CLASSNAME_ACTIVE);

                var leftPosition = $el.parents(this.settings.SELECTOR_NAV_LEVEL).length * -100;
                this.$firstMenuElement.css('left', leftPosition + '%');

                var height = $el.nextAll(this.settings.SELECTOR_NAV_LEVEL).first().height();

                $el.nextAll(this.settings.SELECTOR_NAV_LEVEL).first().css('top', this.topPosition + 'px');

                setTimeout(function() {
                    $el.nextAll(self.settings.SELECTOR_NAV_LEVEL).first().css('top', 0);
                    self.$el.scrollTop(0);
                    self.$navigation.css('height', height + 'px');
                    $el.addClass(self.settings.CLASSNAME_INACTIVE);
                    $el.parent().siblings().addClass(self.settings.CLASSNAME_INACTIVE);
                    $el.nextAll(self.settings.SELECTOR_NAV_LEVEL).first().find('a').first().focus();
                }, this.settings.duration);
            }
        },
        onClickGoBackButton: function(element, event) {
            var self = this;
            event.preventDefault();
            var $el = $(element);

            var parents = $el.parents(this.settings.SELECTOR_NAV_LEVEL);
            var parentItem = $el.closest(this.settings.SELECTOR_NAV_ITEM);

            parentItem.find(this.settings.SELECTOR_HAS_SUBNAV).removeClass(this.settings.CLASSNAME_INACTIVE);
            parentItem.siblings().removeClass(this.settings.CLASSNAME_INACTIVE);

            this.$el.scrollTop(this.topPosition);
            $el.closest(this.settings.SELECTOR_NAV_LEVEL).css('top', this.topPosition);

            setTimeout(function() {
                console.log(self.$navigation);
                self.$navigation.css('height', 'auto');
                parentItem.removeClass(self.settings.CLASSNAME_ACTIVE);
            }, this.settings.duration);

            var leftPosition = (parents.length - 2) * -100;
            this.$firstMenuElement.css('left', leftPosition + '%');
            setTimeout(function() {
                parentItem.find(self.settings.SELECTOR_HAS_SUBNAV).focus();
            }, this.settings.duration);
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
