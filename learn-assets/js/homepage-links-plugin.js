(function($) {
    $.gdHompageLinks = function(element, options) {
        var defaults = {
            currentHome: {
                title: "GoodData",
                link: "https://www.gooddata.com"
            },
            definitionUrl: "https://www.gooddata.com/learn-assets/js/homepage-links-definition.json",
            customLinks: {}
        }

        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
             element = element;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);

            if($.isEmptyObject(plugin.settings.customHompageLinks)) {
                $.getJSON(plugin.settings.definitionUrl, {}, function(definition) {
                    prepareHompageLinks(definition);
                });
            } else {
                prepareHompageLinks(plugin.settings.customHompageLinks);
            }
        }

        var prepareHompageLinks = function(definition) {
            var container = $(document.createElement("div"))
                .addClass("gd-homepage-links")
                .append(prepareHeading(definition.section.heading))
                .append(prepareLinks(definition.section.links));

            $element.append(container);
        }

        var prepareHeading = function(text) {
            return $(document.createElement("h3")).addClass("gd-homepage-links-header").text(text);
        }

        var prepareLinks = function(links) {
            var container = $(document.createElement("div"))
                .addClass("gd-homepage-links-container")
                .append(links.map(prepareLink));
            return container;
        }

        var prepareLink = function(link) {
            if(link.link === plugin.settings.currentHome.link) {
                return;
            } else {
                var linkElem = $(document.createElement("a"))
                        .addClass("gd-homepage-links-link")
                        .attr({
                            "href": link.link,
                            "id": `${currentHomeSlug()}-block-find-your-answer-${slug(link.title)}`
                        }),
                    linkIcon = $(document.createElement("img"))
                        .addClass("gd-homepage-links-link-icon")
                        .attr({
                            "src": link.icon
                        }),
                    linkHeader = $(document.createElement("h2"))
                        .addClass("gd-homepage-links-link-header")
                        .text(link.title),
                    linkText = $(document.createElement("p"))
                        .addClass("gd-homepage-links-link-text")
                        .text(link.text),
                    linkLink = $(document.createElement("span"))
                        .addClass("gd-homepage-links-link-link")
                        .text(link.linkText);

                return linkElem.append(linkIcon, linkHeader, linkText, linkLink).get(0);
            }
        }

        var slug = function(string) {
            return string ? string.toLowerCase().replace(/\s/g, "-") : "";
        }

        var currentHomeSlug = function() {
            return slug(plugin.settings.currentHome.title);
        }

        plugin.init();

    }

    $.fn.gdHompageLinks = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('gdHompageLinks')) {
                var plugin = new $.gdHompageLinks(this, options);
                $(this).data('gdHompageLinks', plugin);
            }
        });
    }

})(jQuery);
