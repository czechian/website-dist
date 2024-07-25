(function($) {
    $.gdQuickSearch = function(element, options) {
        let defaults = {
            tab: "learn",
            version: "Cloud",
            plan: "Enterprise",
            lang: "en"
        };
        // when on localhost, change this to '/'
        let baseURL = "https://www.gooddata.com/";
        // let baseURL = "http://localhost:3000/";
        let plugin = this;
        plugin.settings = {};

        let $element = $(element),
            elementID = element;

        let nIntervId = null;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            addsClientInit();
            searchElementsInit();
            nIntervId = setInterval(UISetupInit, 100);
        };

        let addsClientInit = function() {
            let addsScript = $(document.createElement("script")).attr("type", "text/javascript").attr("src", "https://cdn.jsdelivr.net/combine/npm/addsearch-js-client@0.5/dist/addsearch-js-client.min.js,npm/addsearch-search-ui@0.4/dist/addsearch-search-ui.min.js");
            let addsStyle = $(document.createElement("link")).attr("rel", "stylesheet").attr("href", "https://cdn.jsdelivr.net/npm/addsearch-search-ui@0.4/dist/addsearch-search-ui.min.css");
            $("html head").append(addsScript).append(addsStyle);
        };

        let UISetupInit = function () {
            if (typeof AddSearchClient === "undefined") {
                return;
            }
            if (!AddSearchClient) {
                return;
            }
            let UiStyles =   $(document.createElement("link")).attr("rel", "stylesheet").attr("href", baseURL+"learn-assets/addsearch/dist/ui.min.css");
            let UiScript = $(document.createElement("script")).attr("type", "text/javascript").attr("src", baseURL+"learn-assets/addsearch/dist/ui.min.js");
            $("html head").append(UiStyles);
            $("html body").append(UiScript);
            clearInterval(nIntervId);
        };

        let searchElementsInit = function() {
            let quickSearchInputContainer = $(document.createElement("div")).attr("id", "searchfield-container");
            let quickSearchResultsContainer = $(document.createElement("div")).attr("id", "autocomplete-container");

            let searchVariables;

            switch (plugin.settings.tab) {
                case "help":
                    const docPath = ["free", "growth", "enterprise"].includes(plugin.settings.plan);
                    searchVariables =
                        $(document.createElement("script"))
                            .text(
                                "window.autocompleteFilterCategory = '0x"+plugin.settings.tab+".gooddata.com/1x"+(docPath ? "doc/2x" : "")+plugin.settings.plan+"';\n" +
                                "window.setLanguage = '"+plugin.settings.lang+"';");
                    break;

                case "gd-cn-doc":
                    searchVariables =
                        $(document.createElement("script"))
                            .text(
                                "window.searchResultsPageUrl = '"+baseURL+"learn/search-results.html?search_filters={\""+plugin.settings.tab+"\": 1,\"version\": \""+plugin.settings.version+"\"}';\n" +
                                "window.autocompleteFilterVersion = '"+plugin.settings.version+"';\n" +
                                `window.autocompleteFilterCategory = '0xwww.gooddata.com/1xdocs/2xcloud${plugin.settings.version === "cloud" ? "" : "-native"}';\n` +
                                "window.setLanguage = 'en';");
                    break;

                case "gd-py-doc":
                    searchVariables =
                        $(document.createElement("script"))
                            .text(
                                "window.searchResultsPageUrl = '"+baseURL+"learn/search-results.html?search_filters={\""+plugin.settings.tab+"\": 1,\"version\": \""+plugin.settings.version+"\"}';\n" +
                                "window.autocompleteFilterVersion = '"+plugin.settings.version+"';\n" +
                                "window.autocompleteFilterCategory = '0xwww.gooddata.com/1xdocs/2xpython-sdk';\n" +
                                "window.setLanguage = 'en';");
                    break;

                case "gd-ui-doc":
                    searchVariables =
                        $(document.createElement("script"))
                            .text(
                                "window.searchResultsPageUrl = '"+baseURL+"learn/search-results.html?search_filters={\""+plugin.settings.tab+"\": 1,\"version\": \""+plugin.settings.version+"\"}';\n" +
                                "window.autocompleteFilterVersion = '"+plugin.settings.version+"';\n" +
                                "window.autocompleteFilterCategory = '0xwww.gooddata.com/1xdocs/2xgooddata-ui';\n" +
                                "window.setLanguage = 'en';");
                    break;

                case "learn":
                    searchVariables =
                        $(document.createElement("script"))
                            .text(
                                "window.searchResultsPageUrl = '"+baseURL+"learn/search-results.html?search_filters={\""+plugin.settings.tab+"\": 1}';\n" +
                                "window.autocompleteFilterCategory = '0xuniversity.gooddata.com,0xcommunity.gooddata.com,0xsupport.gooddata.com,0xwww.gooddata.com/1xdevelopers/4xcloud';\n" +
                                "window.setLanguage = '"+plugin.settings.lang+"';");
                    break;

                case "university":
                    searchVariables =
                        $(document.createElement("script"))
                            .text(
                                "window.autocompleteFilterCategory = '0xuniversity.gooddata.com/';\n" +
                                "window.setLanguage = 'en';");
                    break;

                default:
                    // for support, uni and community - default set up
                    searchVariables =
                        $(document.createElement("script"))
                            .text(
                                "window.searchResultsPageUrl = '"+baseURL+"learn/search-results.html?search_filters={\""+plugin.settings.tab+"\": 1}';\n" +
                                "window.autocompleteFilterCategory = '0x"+plugin.settings.tab+".gooddata.com';\n" +
                                "window.setLanguage = '"+plugin.settings.lang+"';");
            }

            $element.append(quickSearchInputContainer).append(quickSearchResultsContainer).append(searchVariables);
        };

        plugin.init();
    };

    $.fn.gdQuickSearch = function(options) {
        return this.each(function() {
            if (undefined === $(this).data("gdQuickSearch")) {
                let plugin = new $.gdQuickSearch(this, options);
                $(this).data("gdQuickSearch", plugin);
            }
        });
    };
})(jQuery);