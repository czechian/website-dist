(function($) {
    $.gdFooter = function(element, options) {
        var defaults = {
            currentHome: {
                title: "GoodData",
                link: "https://www.gooddata.com"
            },
            definitionUrl: "https://www.gooddata.com/learn-assets/js/footer-definition.json",
            customFooter: {}
        }

        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
             element = element;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);

            $element.hide();

            if($.isEmptyObject(plugin.settings.customFooter)) {
                $.ajax({
                    url: plugin.settings.definitionUrl,
                    dataType: 'json',
                    success: function(definition) {
                        prepareFooter(definition);
                    },
                    error: function() {
                        $element.show()
                    }
                });
            } else {
                prepareFooter(plugin.settings.customFooter);
            }
        }

        var prepareFooter = function(definition) {
            var bannerLinksContainer, linksContainer, bottomContainer, copyrightContainer, buttonsContainer;

            if(definition.footer.bannerLinks) {
                bannerLinksContainer = $(document.createElement("ul")).addClass("gd-footer-banner-links gd-footer-links");
                bannerLinksContainer.append(prepareLinks(definition.footer.bannerLinks, "gd-footer-banner"))
            }

            if(definition.footer.links) {
                linksContainer = $(document.createElement("ul")).addClass("gd-footer-links");
                linksContainer.append(prepareLinks(definition.footer.links));
            }

            if(definition.footer.copyright) {
                copyrightContainer = $(document.createElement("div")).addClass("gd-footer-copyright");
                copyrightContainer.append(prepareCopyright(definition));
            }

            if(definition.footer.buttons) {
                buttonsContainer = $(document.createElement("div")).addClass("gd-footer-buttons");
                buttonsContainer.append(prepareButtons(definition));
            }

            if(definition.footer.copyright || definition.footer.buttons) {
                bottomContainer = $(document.createElement("div")).addClass("gd-footer-bottom");
                bottomContainer.append(buttonsContainer).append(copyrightContainer);
            }

            $element
                .empty()
                .addClass("gd-footer")
                .append(bannerLinksContainer)
                .append(linksContainer)
                .append(bottomContainer)
                .show();
        }

        var prepareLinks = function(definition, prefix) {
            return definition.map(function(link, i) {
                var prefixFormId = (prefix ? prefix : "gd-footer") + "-links-item-trigger-" + i,
                    title = $(document.createElement("label")),
                    trigger = $(document.createElement("input")),
                    sublinks;
                    sublinksElem = $(document.createElement("ul")).addClass(prefixClass("sublinks", prefix));

                trigger
                    .attr({
                        type: "checkbox",
                        tabIndex: -1,
                        id: prefixFormId,
                        name: prefixFormId
                    })
                    .addClass(prefixClass("links-item-trigger", prefix));

                title
                    .attr({
                        for: prefixFormId
                    })
                    .addClass(prefixClass("links-item-text", prefix));

                if(link.link) {
                    title.append($(document.createElement("a"))
                        .addClass(prefixClass("links-item-link", prefix))
                        .attr({
                            "href": linkAbsoluteUrl(link.link),
                            "id": `${currentHomeSlug()}-footer-${slug(link.title)}`
                        })
                        .text(link.title)
                    );
                } else {
                    title.text(link.title);
                }

                sublinks = link.items.map(function(link) {
                    var sublink = $(document.createElement("a"))
                        .addClass(prefixClass("sublinks-item-link", prefix))
                        .attr({
                            "href": linkAbsoluteUrl(link.link),
                            "id": `${currentHomeSlug()}-footer-sublink-${slug(link.title)}`
                        })
                        .text(link.title);
                    return $(document.createElement("li"))
                        .addClass(prefixClass("sublinks-item", prefix))
                        .append(sublink)
                        .get(0);
                });

                sublinksElem.append(sublinks);

                return $(document.createElement("li"))
                    .addClass(prefixClass("links-item", prefix))
                    .append(trigger)
                    .append(title)
                    .append(sublinksElem)
                    .get(0);
            });
        }

        var prepareCopyright = function(definition) {
            return definition.footer.copyright.map(function(item) {
                var copyrightElem = $(document.createElement("div")).addClass("gd-footer-copyright-text");

                if(item.link) {
                    var copyrightLink = $(document.createElement("a"))
                        .attr({
                            "href": linkAbsoluteUrl(item.link),
                            "id": `${currentHomeSlug()}-footer-copyright-${slug(item.text)}`
                        })
                        .text(item.text)
                        .addClass("gd-footer-copyright-link");
                    copyrightElem.append(copyrightLink);
                } else {
                    copyrightElem.text(item.text);
                }

                return copyrightElem.get(0);
            });
        }

        var prepareButtons = function(definition) {
            return definition.footer.buttons.filter(function(button) {
                return !button.hideOnLearn;
            }).map(function(button) {
                var buttonElem = $(document.createElement("a"))
                    .addClass("gd-footer-buttons-item")
                    .attr({
                        "href": linkAbsoluteUrl(button.link),
                        "id": `${currentHomeSlug()}-footer-btn-${slug(button.text)}`
                    });

                if(button.icon) {
                    buttonElem.addClass("gd-footer-buttons-item-icon-button");
                    //true => is social
                    buttonElem.attr("rel", "noreferrer noopener");
                    if(button.iconType && button.iconType === "svg") {
                        buttonElem.append($(button.icon).addClass("gd-footer-buttons-icon"));
                    } else {
                        buttonElem.css({ backgroundImage: "url(" + button.icon + ")"});
                    }
                } else if (button.type) {
                    buttonElem.addClass("button button-" + button.type);
                    button.size && buttonElem.addClass("button-" + button.size);
                    button.color && buttonElem.addClass("button-" + button.color);
                }

                if(!button.icon) {
                    buttonElem.text(button.text);
                }

                return buttonElem.get(0);
            });
        }

        var prefixClass = function(suffix, prefix) {
            return (prefix ? (prefix + "-" + suffix + " ") : "") + "gd-footer-" + suffix;
        }

        var linkAbsoluteUrl = function(url) {
            return url.match(/^http(|s):\/\//) ? url : "https://www.gooddata.com" + url;
        }

        var slug = function(string) {
            return string ? string.toLowerCase().replace(/\s/g, "-") : "";
        }

        var currentHomeSlug = function() {
            return slug(plugin.settings.currentHome.title);
        }

        plugin.init();

    }

    $.fn.gdFooter = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('gdFooter')) {
                var plugin = new $.gdFooter(this, options);
                $(this).data('gdFooter', plugin);
            }
        });
    }

})(jQuery);
