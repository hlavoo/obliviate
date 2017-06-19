(function () {
    var obliviate = false,
        obliviating = false,
        oneWeek = 7 * 24 * 60 * 60 * 1000,
        lastWeek,
        now;

    function obliviateCache () {
        if (obliviating === false) {
            if (typeof chrome.browsingData !== 'undefined') {
                obliviating = true;
                now = new Date().getTime();
                lastWeek = now - oneWeek;

                chrome.browsingData.removeCache({
                    'since': lastWeek
                }, function() {
                    obliviating = false;
                });
            }
        }
    }

    function iconClick () {
        obliviate = !obliviate;
        if (obliviate) {
            chrome.browserAction.setIcon({
              path: 'icon-active.png'
            });

            chrome.browserAction.setTitle({
              title: 'Obliviate: Enabled'
            });

            chrome.webRequest.onBeforeRequest.addListener(obliviateCache, {
                urls: ["<all_urls>"]
            });
            
            chrome.tabs.reload();
        } else {
            chrome.browserAction.setIcon({
                path: 'icon.png'
            });

            chrome.browserAction.setTitle({
              title: 'Obliviate: Disabled'
            });

            chrome.webRequest.onBeforeRequest.removeListener(obliviateCache);
        }
    }

    chrome.browserAction.onClicked.addListener(iconClick);
}());

