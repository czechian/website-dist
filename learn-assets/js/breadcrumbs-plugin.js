(function($) {
    $.gdBreadcrumbs = function(element, options) {
        var defaults = {
            visibleLinks: {
                start: 1,
                end: 1
            },
            shortenButton: "⋯"
        }

        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
             element = element;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            breadcrumbs();
        }

        var menuTrigger, menuContainer, shortenButton, open;

        var breadcrumbs = function() {
            var children = $element.children(),
                toBeHidden = children.slice(
                    plugin.settings.visibleLinks.start, 
                    children.length - plugin.settings.visibleLinks.end
                ),
                arrow = $(document.createElement("i")).addClass("icon icon--caret-right"),
                classes = [];

            $element.addClass("gd-breadcrumb");

            if(toBeHidden.length > 0) {
                menuTrigger = $(document.createElement("li")).attr("tabIndex", 0).addClass("gd-breadcrumb-item gd-breadcrumb-item-with-menu");
                menuContainer = $(document.createElement("ul")).addClass("gd-breadcrumb-item-menu");
                shortenButton = $(document.createElement("button"))
                    .addClass("gd-breadcrumb-item-menu-trigger")
                    .text(plugin.settings.shortenButton);

                open = false;
                shortenButton.on("click", handleMenu);
                toBeHidden.each(function(i, elem) {
                    classes.push(elem.classList.value);
                });
                menuContainer = toBeHidden.wrapAll(menuContainer).parent();
                menuTrigger = menuContainer.wrap(menuTrigger).parent();
                menuTrigger.prepend(shortenButton).append(arrow).addClass(classes.join(" "));
            }

            children.addClass("gd-breadcrumb-item");
        }

        var handleMenu = function(event) {
            event.stopPropagation();
            open = !open;
            toggleMenu(open);
            if(open) {
                $("body").one("click", menuClose);
            }
        }

        var toggleMenu = function(open) {
            shortenButton.toggleClass("active", open);
            menuContainer.toggleClass("open", open);
        }

        var menuClose = function() {
            open = false;
            toggleMenu(open);
        }

        plugin.init();

    }

    $.fn.gdBreadcrumbs = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('gdBreadcrumbs')) {
                var plugin = new $.gdBreadcrumbs(this, options);
                $(this).data('gdBreadcrumbs', plugin);
            }
        });
    }

})(jQuery);
