let clickHandler = (e, tab) => {
    chrome.tabs.executeScript(tab.id, {file: "getDOM.js"});
    console.log(e);
}

let favHandler = (info, tab) => {
    console.log(info);
}

chrome.contextMenus.create({
    "title": "Git",
    "contexts": ["frame"],
    "onclick" : clickHandler
});

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});