const toggleExtensionBtn = document.querySelector("#btn-toggle-extension");
const settingsBtn = document.querySelector("#btn-settings");
const closeBtn = document.querySelector("#btn-close");

// event handlers
toggleExtensionBtn.addEventListener("click", async () => {
    await browser.storage.local.get(["extensionEnabled"], data => {
        const newState = !data.extensionEnabled;
        browser.storage.local.set({extensionEnabled: newState}, () => toggleExtensionBtn.textContent = newState ? "Turn Extension Off" : "Turn Extension On");
    });
});
settingsBtn.addEventListener("click", () => alert("TODO"));
closeBtn.addEventListener("click", () => window.close());

// at startup
browser.storage.local.get(["extensionEnabled"], data => toggleExtensionBtn.textContent = data.extensionEnabled ? "Turn Extension Off" : "Turn Extension On");
