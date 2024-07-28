browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const loadComplete = changeInfo.status === "complete" && tab.url;
    if (!loadComplete) {
        return;
    }

    const urlPattern = new RegExp("^https?://.*skin\\.club/.*/cases/open/.*");
    if (urlPattern.test(tab.url)) {
        browser.tabs.executeScript(tabId, {file: "content_script.js"});
    }
});
