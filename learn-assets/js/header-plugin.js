(function($) {
    $.gdHeader = function(element, options) {
        var defaults = {
            currentHome: {
                title: "GoodData",
                link: "https://www.gooddata.com"
            },
            definitionUrl: "https://www.gooddata.com/learn-assets/js/header-definition.json",
            customHeader: {}
        }

        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
             element = element;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);

            if($.isEmptyObject(plugin.settings.customHeader)) {
                $.getJSON(plugin.settings.definitionUrl, {}, function(definition) {
                    prepareHeader(definition);
                });
            } else {
                prepareHeader(plugin.settings.customHeader);
            }
        }

        var prepareHeader = function(definition) {
            var headerContainer = $(document.createElement("div")).addClass("gd-header");
            headerContainer
                .append(prepareMobileMenuTrigger(definition.header.links))
                .append(prepareLinks(definition));
            $element.append(headerContainer);
        }

        var prepareLinks = function(definition) {
            var linksContainer = $(document.createElement("ul")).addClass("gd-header-links"),
                links;

            links = definition.header.links.map(prepareLink);
            return linksContainer.append(links);
        }

        var prepareLink = function(link) {
            var linkContainer = $(document.createElement("li")).addClass("gd-header-link-item"),
                linkElem = $(document.createElement("a")).attr({
                    "href": link.link,
                    "id": `${currentHomeSlug()}-main-menu-${slug(link.title)}`
                }).text(link.title);

            if(isCurrentHome(link)) {
                linkElem.addClass("gd-header-link__active");
            }

            if(link.mobileOnly) {
                linkContainer.addClass("gd-header-link-item-mobile-only");
            }

            if(link.title === "Learn") {
                linkElem.addClass("gd-header-link__main");
            }

            if(link.type === "button") {
                linkElem.addClass("button");
            } else {
                linkElem.addClass("gd-header-link");
            }

            return linkContainer.append(linkElem).get(0);
        }

        var slug = function(string) {
            return string ? string.toLowerCase().replace(/\s/g, "-") : "";
        }

        var currentHomeSlug = function() {
            return slug(plugin.settings.currentHome.title);
        }

        var isCurrentHome = function(link) {
            return link.link === plugin.settings.currentHome.link;
        }

        var prepareMobileMenuTrigger = function(links) {
            var currentHome = links.filter(function(link) {
                return isCurrentHome(link) ? link : false;
            });

            return [
                $(document.createElement("input"))
                    .attr({
                        "type": "checkbox",
                        "id": "gd-header-mobile-menu-trigger-input",
                        "name": "gd-header-mobile-menu-trigger-input"
                    })
                    .addClass("gd-header-mobile gd-header-mobile-menu-trigger-input")
                    .on("change", function() {
                        $("html, body").toggleClass("scroll-fixed", $(this).is(":checked") ? "hidden" : "auto");
                    })
                    .get(0),
                $(document.createElement("label"))
                    .attr("for", "gd-header-mobile-menu-trigger-input")
                    .addClass("gd-header-mobile gd-header-mobile-menu-trigger")
                    .append("<span>")
                    .get(0)
            ];
        }

        plugin.init();

    }

    $.fn.gdHeader = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('gdHeader')) {
                var plugin = new $.gdHeader(this, options);
                $(this).data('gdHeader', plugin);
            }
        });
    }

})(jQuery);

(function($) {
    $.fixHeader = function(element, options) {
        var defaults = {
            fixClass: "gd-header-fixed"
        }

        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
            element = element,
            topOffset;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            topOffset = $element.offset().top;
            $(window).on("scroll", fixHeader);
            fixHeader();
        }

        var fixHeader = function() {
            $element.toggleClass(plugin.settings.fixClass, window.scrollY > topOffset);
        }

        plugin.init();

    }

    $.fn.fixHeader = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('fixHeader')) {
                var plugin = new $.fixHeader(this, options);
                $(this).data('fixHeader', plugin);
            }
        });
    }

})(jQuery);
