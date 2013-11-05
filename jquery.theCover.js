/**
 * jquery.theCover.js
 * Thiago Lagden | @thiagolagden | lagden@gmail.com
 * jQuery plugin
 */
;(function (window) {
    var $ = window.jQuery,
        pluginName = "theCover",
        defaults = {
            theCss: "theCover"
        };

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$win = $(window);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            if (this.$element.css('backgroundImage') != 'none')
                this.simulate();
        }
        , simulate: function() {
            var backgroundImage = this.$element.css('backgroundImage').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            this.$element
            .append('<div class="' + this.options.theCss + '-viewport"><img src="' + backgroundImage + '"></div>')
            .addClass(this.options.theCss + '-resize');

            var viewport = this.$element.find('.' + this.options.theCss + '-viewport:eq(0)');
            var img = viewport.find('img:eq(0)');

            var ow = img.width();
            var oh = img.height();

            this.$win
            .on('resize.' + this._name, {"el": this.$element, "viewport": viewport, "img": img, "ow": ow, "oh": oh}, this.resize)
            .trigger('resize.' + this._name);
        }
        , resize: function(ev) {
            var min_w = 0;
            var $el = ev.data.el,
                $viewport = ev.data.viewport,
                $img = ev.data.img,
                ow = ev.data.ow,
                oh = ev.data.oh,
                scale_h = $el.width() / ow,
                scale_v = $el.height() / oh,
                scale = scale_h > scale_v ? scale_h : scale_v;

            $viewport.width($el.width());
            $viewport.height($el.height());

            if (scale * ow < min_w) scale = min_w / ow;

            $img.width(scale * ow);
            $img.height(scale * oh);

            $viewport.scrollLeft(($img.width() - $el.width()) / 2);
            $viewport.scrollTop(($img.height() - $el.height()) / 2);
        }
    };

    $.fn[pluginName] = function(options) {
        var args = arguments;
        var hasSupport = Boolean($.support.leadingWhitespace);
        if (hasSupport === false) {
            if (options === undefined || typeof options === "object") {
                return this.each(function() {
                    if (!$.data(this, pluginName))
                        $.data(this, pluginName, new Plugin(this, options));
                });
            } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
                var returns;

                this.each(function() {
                    var instance = $.data(this, pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === "function")
                        returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                });

                return returns !== undefined ? returns : this;
            }
        }
        return null;
    };
})(window);
