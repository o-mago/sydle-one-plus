chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log("osadiasjdisajd");
    for (key in changes) {
        if (key === 'selectedTheme') {
            chrome.storage.sync.get({
                selectedTheme: 'styles/dracula.css',
            }, function (items) {
                let size = document.getElementsByTagName("iframe").length-1;
                document.getElementsByTagName("iframe")[size].contentWindow.document.head.insertAdjacentHTML('beforeend',
                '<link id="ace-sydle" rel="stylesheet" type="text/css" href="' + 
                chrome.runtime.getURL(items.selectedTheme) + '">' 
                );
            });
        }
    }
});

function updateCss() {
    try {
        let size = document.getElementsByTagName("iframe").length-1;
        if(size >= 0) {
            if(document.getElementsByTagName("iframe")[size].contentWindow.document.getElementById('ace-sydle') === null) {
                chrome.storage.sync.get({
                    selectedTheme: 'styles/dracula.css',
                }, function (items) {
                    document.getElementsByTagName("iframe")[size].contentWindow.document.head.insertAdjacentHTML('beforeend',
                    '<link id="ace-sydle" rel="stylesheet" type="text/css" href="' + 
                    chrome.runtime.getURL(items.selectedTheme) + '">' 
                    );
                });
            }
        }
    } catch {

    }
}

document.addEventListener('DOMNodeInserted', updateCss);