// Cookie Policy Banner and Settings center
(function() {
    var Banner = '<div class="c-cookies-overlay__banner"><div id="cookies-banner" class="c-cookies-banner c-cookies-wrapper c-cookies-banner__closed"><div class="c-cookies-banner__inner"><div class="c-cookies-text-wrapper"><p class="c-h4 c-cookies-heading">Cookies help us to improve this website</p><p>In order to get the best experience on our website, including its functionality, content relevance and effective advertisement, please accept all cookies, by clicking the “OK” button. See more details in our <a href="https://www.gooddata.com/legal/#cookie-policy" target="_blank">Cookie Policy</a> and manage your Cookie preferences. Thank you.</p></div><div class="c-cookies-consent-wrapper"><a id="cookies-cookie-settings" class="c-cookies-link c-link">Manage cookies</a><button id="cookies-deny" class="c-cookies-button btn c-btn-default btn-xs d-none">Deny all</button><button id="cookies-accept" class="c-cookies-button btn c-btn-default btn-xs">OK</button></div></div></div></div>';

    var SettingsLevels = [{
        title: 'Necessary',
        subtitle: '(always on)',
        description: '<p>These cookies are strictly necessary to provide you with services available through our Websites, to analyze traffic and to use some of its features, such as access to secure areas.</p>',
        policyLevel: '1',
        changeable: false,
        checked: true
    }, {
        title: 'Website and content experience',
        description: '<p>These cookies provide us with information on how our websites are being used, to help us improve the quality and relevance of content we place on them. Additionally, they also allow us to show you embedded videos and remember your preferences and actions, so that the websites do not bother you with the same request repeatedly (e.g. filling a form to download a PDF file and provide feedback about such actions to our affiliated entities).</p>',
        policyLevel: '2',
        changeable: true,
        checked: false
    }, {
        title: 'Communications',
        description: '<p>These cookies remember what content you visited on our websites, to help us share with you only relevant marketing content that addresses your needs and interests. Our marketing content (i.e. banners) will appear on other websites.</p>',
        policyLevel: '3',
        changeable: true,
        checked: false
    }];

    const SettingsLevelsAll = SettingsLevels.map((level) => {
        return level.policyLevel;
    });

    var SettingsContent = '';
    SettingsLevels.forEach(function(section) {
        SettingsContent += '<label class="c-cookies-settings-section-wrapper"><div class="c-cookies-settings-section-title"><label class="c-cookies-settings-section-checkbox"><input type="checkbox"' + (section.changeable ? "" : " disabled") + ' value="' + section.policyLevel + '"' + (section.checked ? " checked" : "") + '><span></span></label><span class="c-h4 mb-0 c-cookies-settings-section-title-title">' + section.title + '</span>' + (section.subtitle ? '<span class="c-cookies-settings-section-title-subtitle">' + section.subtitle + '</span>' : '') + '</div><div class="c-cookies-settings-section-content"><div class="c-cookies-settings-section-inner">' + section.description + '</div></div></label>';
    });

    var Settings = '<div class="c-cookies-overlay c-cookies-overlay__closed"><div id="cookies-settings" class="c-cookies-settings-overlay c-cookies-settings__closed"><div class="c-cookies-wrapper c-cookies-settings-wrapper"><div class="c-cookies-settings-btn"><button type="button" id="cookies-settings-close" class="c-cookies-settings-btn-close"><span class="icon-cross"></span></button></div><span class="icon-cross"></span></button><p class="c-cookies-settings-heading">Manage cookies</p><div class="c-cookies-settings-inner"><p class="mt-1">GoodData categorizes three types of cookies according to the area they address: Necessary, Website related, and Communications related.</p>' + SettingsContent + '<div class="c-cookies-settings-stretch"></div></div><div class="c-cookies-settings-buttons-wrapper"><button id="cookies-settings-all" class="c-cookies-button c-cookies-button-settings-all btn c-btn-default btn-xs">Accept all</button><button id="cookies-save-settings" class="c-cookies-button c-cookies-button-save-settings btn c-btn-default btn-xs">Accept only selected</button><div class="c-cookies-settings-stretch"></div><a href="https://www.gooddata.com/legal/#cookie-policy" target="_blank" class="c-cookies-link c-link">Read cookie policy</a></div></div></div></div>';

    var dlCPL = []

    jQuery(document).ready(function ($) {
        var BannerRef, SettingsRef;

        var openBanner = function(delay) {
            setTimeout(function() {
                BannerRef.removeClass('c-cookies-banner__closed');
                BannerRef.parent().removeClass('c-cookies-overlay__closed');
            }, delay ? 1000 : 1);
        }

        var closeBanner = function() {
            BannerRef.addClass('c-cookies-banner__closed');
            BannerRef.parent().addClass('c-cookies-overlay__closed');
        }

        var openSettings = function() {
            SettingsRef.removeClass('c-cookies-settings__closed');
            SettingsRef.parent().removeClass('c-cookies-overlay__closed');
            $("body").addClass("modal-open");
            closeBanner();
        }

        var closeSettings = function() {
            SettingsRef.addClass('c-cookies-settings__closed');
            SettingsRef.parent().addClass('c-cookies-overlay__closed');
            $("body").removeClass("modal-open");
            window.location.hash = '';
        }

        var setSettingsLevels = function(levels) {
            if(levels) {
                levels.forEach(function(level) {
                    $(".c-cookies-settings-section-checkbox input[value=" + level + "]").prop("checked", true);
                });
            }
        }

        var getCookies = function() {
            var foundCookie = decodeURIComponent(document.cookie).split("; ").find((cookie) => {
                return cookie.split("=")[0] === "cookiePolicy";
            });
            return foundCookie && !foundCookie.split("=")[1].startsWith("default") && foundCookie.split("=")[1].split(",");
        }

        var setCookies = function(cookieLevel) {
            if(cookieLevel.length > 0) {
                var tld = window.location.hostname === "localhost" ? "localhost" : "." + window.location.hostname.split(".").slice(-2).join(".");
                var expirationDate = new Date();
                expirationDate.setMonth(expirationDate.getMonth() + 12);
                var cookiePolicy = "cookiePolicy=" + cookieLevel.sort().join(",");
                var cookieExpiration = "; secure; domain=" + tld + "; path=/; expires=" + (cookieLevel.indexOf("0") > -1 ? expirationDate.toUTCString() : "Fri, 31 Dec 9999 23:59:59 GMT");
                document.cookie = cookiePolicy + cookieExpiration;
            }
        }

        var handleGTMEvents = function(cookieLevel) {
            if(dataLayer) {
                cookieLevel.forEach(function(level) {

                    // Check DataLayer Pushes
                    if (!dlCPL.includes(level)) { 
                        dlCPL.push(level);

                        // Push DL
                        dataLayer.push({"event": "cookiePolicyL" + level});

                        var event = new Event("cookiePolicyL" + level);
                        window.dispatchEvent(event);
                    }
                });
            }
        }

        // GTAG push for following pages after consent
        if (sessionStorage.getItem("gtag") == 'true') {
            gtag('consent', 'default', {
                'ad_storage': sessionStorage.getItem("ad_storage"),
                'ad_user_data': sessionStorage.getItem("ad_user_data"),
                'ad_personalization': sessionStorage.getItem("ad_personalization"),
                'analytics_storage': sessionStorage.getItem("analytics_storage")
            });
        }

        var handleApproval = function() {
            setCookies(SettingsLevelsAll);
            closeBanner();
            closeSettings();
            handleGTMEvents(SettingsLevelsAll);

            // Gacid - OK
            window.cookiesP = true;

            // GTAG
            gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'analytics_storage': 'granted'
            });

            // Storage values update
            sessionStorage.setItem("ad_storage", "granted");
            sessionStorage.setItem("ad_user_data", "granted");
            sessionStorage.setItem("ad_personalization", "granted");
            sessionStorage.setItem("analytics_storage", "granted");
        }

        var handleDisapproval = function() {
            setCookies(["1"]);
            closeBanner();

            // GTAG
            gtag('consent', 'update', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
            });

            // Storage values update
            sessionStorage.setItem("ad_storage", "denied");
            sessionStorage.setItem("ad_user_data", "denied");
            sessionStorage.setItem("ad_personalization", "denied");
            sessionStorage.setItem("analytics_storage", "denied");
        }

        var handleEUVersion = function(cookies) {
            if(window.isEU) {
                $('#cookies-deny').removeClass("d-none");

                // Necessary cookies
                if(!cookies) {
                    setSettingsLevels(["1"]);
                    handleGTMEvents(["1"]);
                    setCookies(["defaultEU"]);

                    // GTAG Default EU
                    if (sessionStorage.getItem("gtag") == null) {
                        gtag('consent', 'default', {
                            'ad_storage': 'denied',
                            'ad_user_data': 'denied',
                            'ad_personalization': 'denied',
                            'analytics_storage': 'denied'
                        });
                        // Get saved data from sessionStorage
                        sessionStorage.setItem("gtag", true);

                        // Storage values update
                        sessionStorage.setItem("ad_storage", "denied");
                        sessionStorage.setItem("ad_user_data", "denied");
                        sessionStorage.setItem("ad_personalization", "denied");
                        sessionStorage.setItem("analytics_storage", "denied");
                    }
                }
            } else if(!cookies) {
                setSettingsLevels(SettingsLevelsAll);
                handleGTMEvents(SettingsLevelsAll);
                setCookies(["defaultUS"]);

                // GTAG Default nonEU
                if (sessionStorage.getItem("gtag") == null) {
                    gtag('consent', 'default', {
                        'ad_storage': 'granted',
                        'ad_user_data': 'granted',
                        'ad_personalization': 'granted',
                        'analytics_storage': 'granted'
                    });
                    // Get saved data from sessionStorage
                    sessionStorage.setItem("gtag", true);

                    // Storage values update
                    sessionStorage.setItem("ad_storage", "granted");
                    sessionStorage.setItem("ad_user_data", "granted");
                    sessionStorage.setItem("ad_personalization", "granted");
                    sessionStorage.setItem("analytics_storage", "granted");
                }
            }

            $(".c-cookies-button, .c-cookies-link").each(function() {
                if($(this).attr("id")) {
                    $(this).attr("id", $(this).attr("id") + (window.isEU ? "-eu" : "-nonEu" ))
                }
            });
        }

        var handleUrlParams = function() {
            const params = new URLSearchParams(window.location.search);
            const consent = params.get("consent");

            if(consent) {
                if(consent == "all") {
                    setCookies(SettingsLevelsAll);
                }

                if(consent.match(/^\d(,\d)*?$/)) {
                    setCookies(consent.split(","));
                }
            }
        }

        var revokeCookies = function() {
            const domain = ["", "domain=gooddata.com;", "domain=.gooddata.com;", "domain=www.gooddata.com;"];
            const sameSite = ["", "SameSite=Lax;", "SameSite=Strict;", "SameSite=None;"];
            document.cookie.split("; ").forEach(function(cookie) {
                const cookieVal = cookie.split("=")[0];
                domain.forEach(function(domain) {
                    sameSite.forEach(function(sameSite) {
                        document.cookie = `${cookieVal}=;max-age=0;path=/;${domain}${sameSite}`;
                    });
                });
            });
        }

        var saveSettings = function() {
            var settings = [];
            SettingsRef.find('.c-cookies-settings-section-checkbox input:checked').each(function() {
                settings.push($(this).val());
            });
            revokeCookies();
            setCookies(settings);
            closeSettings();
            closeBanner();
            handleGTMEvents(settings);

            var thisAdStorage;
            var thisAdUserData;
            var thisAdPersonalization;
            var thisAnalyticsStorage;

            if (settings.includes('3')) {
                thisAdStorage = 'granted';
                thisAdUserData = 'granted';
                thisAdPersonalization = 'granted';

                if (settings.includes('2')) {
                    thisAnalyticsStorage = 'granted';
                } else {
                    thisAnalyticsStorage = 'denied';
                }
            } else {
                thisAdStorage = 'denied';
                thisAdUserData = 'denied';
                thisAdPersonalization = 'denied';

                if (settings.includes('2')) {
                    thisAnalyticsStorage = 'granted';
                } else {
                    thisAnalyticsStorage = 'denied';
                }
            }

            // GTAG
            gtag('consent', 'update', {
                'ad_storage': thisAdStorage,
                'ad_user_data': thisAdUserData,
                'ad_personalization': thisAdPersonalization,
                'analytics_storage': thisAnalyticsStorage
            });

            // Storage values update
            sessionStorage.setItem("ad_storage", thisAdStorage);
            sessionStorage.setItem("ad_user_data", thisAdUserData);
            sessionStorage.setItem("ad_personalization", thisAdPersonalization);
            sessionStorage.setItem("analytics_storage", thisAnalyticsStorage);
        }

        var setSelectedPolicies = function(cookies) {
            SettingsRef.find('.c-cookies-settings-section-checkbox input').each(function() {
                var input = $(this);
                if(cookies.indexOf(input.val()) > -1) {
                    input.attr('checked', true);
                }
            })
        };

        var isCookieSettingsWindowOpen = function() {
            return window.location.hash.replace('#', '').split('/').indexOf('cookie-settings') > -1;
        }

        // Init
        $('body').append(Banner, Settings);
        handleUrlParams();

        var BannerRef = $('#cookies-banner');
        var SettingsRef = $('#cookies-settings');
        var cookies = getCookies();

        $('#cookies-open-settings').on('click', openSettings);
        $('#cookies-accept, #cookies-settings-all').on('click', handleApproval);
        $('#cookies-deny').on('click', handleDisapproval);
        $('#cookies-cookie-settings').on('click', openSettings);
        $('#cookies-save-settings').on('click', saveSettings);

        handleEUVersion(cookies);

        // Banner init
        if(cookies) {
            handleGTMEvents(cookies);
            setSelectedPolicies(cookies);
        };

        // Settings init
        $('#cookies-settings-close').on('click', function() {
            closeSettings();
            openBanner();
        });

        SettingsRef.find('.c-cookies-settings-section-visibility-toggle').first().attr('checked', true);
        isCookieSettingsWindowOpen() && openSettings();
        $(window).on('hashchange', function() {
            isCookieSettingsWindowOpen() && openSettings();
        });

        if(!cookies) {
            openBanner(true);
        }

        // Gacid - Init
        window.cookiesP = cookies;
    });
})();
