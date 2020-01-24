setTimeout(testFunc, 3000);

function testFunc() {
    let size = document.getElementsByTagName("iframe").length-1;
    console.log(document.getElementsByTagName("iframe")[size]);
    document.getElementsByTagName("iframe")[size].contentWindow.document.head.insertAdjacentHTML('beforeend',
    '<link rel="stylesheet" type="text/css" href="' + 
        chrome.runtime.getURL("dracula_theme.css") + '">'
    );
}