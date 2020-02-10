let clickHandler = (e, tab) => {
    chrome.tabs.executeScript(tab.id, {file: "getDOM.js"});
    console.log(e);
}

chrome.contextMenus.create({
    "title": "Git",
    "contexts": ["frame"],
    "onclick" : clickHandler
});