if (typeof chrome !== "undefined") {
    browser = chrome;
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const loadComplete = changeInfo.status === "complete" && tab.url;
    if (!loadComplete) {
        return;
    }

    const casePattern = new RegExp("^https?://skin\\.club/.*/cases/open/.*");
    if (casePattern.test(tab.url)) {
        browser.tabs.executeScript(tabId, {file: "./scripts/cscript_cases.js"});
        return;
    }

    const battlePattern = new RegExp("^https?://skin\\.club/.*/battles/.*");
    if (battlePattern.test(tab.url)) {
        browser.tabs.executeScript(tabId, {file: "./scripts/cscript_case_battle.js"})
        return;
    }

    // resuming...
});
