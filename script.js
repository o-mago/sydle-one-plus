chrome.storage.onChanged.addListener((changes, namespace) => {
    Object.keys(changes).forEach((key) => {
        if(key === 'selectedTheme') {
            let size = document.getElementsByTagName("iframe").length-1;
            document.getElementsByTagName("iframe")[size].contentWindow.document.head.insertAdjacentHTML('beforeend',
            '<link id="ace-sydle" rel="stylesheet" type="text/css" href="' + 
            chrome.runtime.getURL(changes[key].newValue) + '">' 
            );
        }
    })
});

const removeCss = () => {
    let size = document.getElementsByTagName("iframe").length-1;
    console.log("okadokasod");
    if(document.getElementsByTagName("iframe")[size].contentWindow.document.getElementById('ace-chrome') !== null) {
        console.log("ACHOU");
        document.getElementsByTagName("iframe")[size].contentWindow.document.getElementById('ace-chrome').remove();    
    }
}

function updateCss() {
    try {
        let size = document.getElementsByTagName("iframe").length-1;
        if(size >= 0) {
            if(document.getElementsByTagName("iframe")[size].contentWindow.document.getElementById('ace-sydle') === null) {

                document.getElementsByTagName("iframe")[size].contentWindow.document.addEventListener('DOMNodeInserted', removeCss);
                
                chrome.storage.sync.get({
                    selectedTheme: 'styles/dracula.css',
                }, function (items) {
                    document.getElementsByTagName("iframe")[size].contentWindow.document.head.insertAdjacentHTML('beforeend',
                    '<link id="ace-sydle" rel="stylesheet" type="text/css" href="' + 
                    chrome.runtime.getURL(items.selectedTheme) + '">' 
                    );
                });
            }
            // document.getElementsByTagName("iframe")[size].contentWindow.document.querySelector('.btn-script').addEventListener('click', removeCss(size));
        }
    } catch {

    }
}

document.addEventListener('DOMNodeInserted', updateCss);