(function () {
    var obliviate = false,
        obliviating = false,
        oneWeek = 7 * 24 * 60 * 60 * 1000,
        lastWeek,
        now;

    // (∩｀-´)⊃━☆ﾟ.*･｡ﾟ
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

    function obliviateEnable () {
        chrome.browserAction.setIcon({
            path: 'icon-active.png'
        });

        chrome.browserAction.setTitle({
            title: 'Obliviate: Enabled'
        });

        chrome.webRequest.onBeforeRequest.addListener(obliviateCache, {
            urls: ["<all_urls>"]
        });

        chrome.storage.sync.set({ obliviate: true });
    }

    function obliviateDisable () {
        chrome.browserAction.setIcon({
            path: 'icon.png'
        });

        chrome.browserAction.setTitle({
          title: 'Obliviate: Disabled'
        });

        chrome.webRequest.onBeforeRequest.removeListener(obliviateCache);

        chrome.storage.sync.set({ obliviate: false });
    }

    function iconClick () {
        obliviate = !obliviate;

        if (obliviate) {
            obliviateEnable();
            chrome.tabs.reload();
        } else {
            obliviateDisable();
        }
    }

    chrome.storage.sync.get('obliviate', function (value) {
        if (value && value.obliviate) {
            obliviate = value.obliviate;
            obliviateEnable();
        }
    });

    chrome.browserAction.onClicked.addListener(iconClick);
}());

