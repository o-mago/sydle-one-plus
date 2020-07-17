let css = `
.modal-window {
    position: fixed;
    background-color: rgba(255, 255, 255, 0.25);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s;
    &:target {
      visibility: visible;
      opacity: 1;
      pointer-events: auto;
    }
    &>div {
      width: 400px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 2em;
      background: #ffffff;
    }
    header {
      font-weight: bold;
    }
    h1 {
      font-size: 150%;
      margin: 0 0 15px;
    }
  }
  
  .modal-close {
    color: #aaa;
    line-height: 50px;
    font-size: 80%;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
    width: 70px;
    text-decoration: none;
    &:hover {
      color: black;
    }
  }
  
  .modal-window div:not(:last-of-type) {
    margin-bottom: 15px;
  }
`;

function buildFavorites() {
    let favItems = "";
    favList && favList[workspace] && favList[workspace].forEach((elem) => {
        favItems += buildFavItem(elem);
    })
    return '<p-treenode id="favorito" class="dropzone">' +
        '<!---->' +
        '<!---->' +
        '<li class="ui-treenode dropzone">' +
        '<div id="fav-tab-label" class="ui-treenode-content dropzone" pdraggable="expr" draggable="true">' +
        '<span id="fav-arrow" class="ui-treenode-icon ti-angle-down" style="pointer-events: none;">' +
        '</span>' +
        '<!---->' +
        '<!---->' +
        '<span class="ui-treenode-label ui-corner-all dropzone">' +
        '<!---->' +
        '<span class="not-leaf" style="color: #000000; pointer-events: none;">Favoritos</span>' +
        '<!---->' +
        '<span class="ti-heart title-button dropzone" style="margin-left: 5px">' +
        '</span>' +
        '</span>' +
        '</div>' +
        '<!---->' +
        '<ul id="favorites-list" class="ui-treenode-children dropzone" style="display: block;">' +
        '<!---->' +
        favItems +
        '</ul>' +
        '</li>' +
        '<!---->' +
        '<!---->' +
        '</p-treenode>';
}

function buildFavItem(elem) {
    let [child, parent] = elem.split("/");
    return '<p-treenode data-fav="' + elem + '">' +
        '<!---->' +
        '<!---->' +
        '<li data-close class="ui-treenode">' +
        '<span data-rem="' + elem + '" class="ui-treenode-icon ti-close" style="margin-left: -16px; visibility: hidden">' +
        '</span>' +
        '<span class="ui-treenode-leaf-icon ui-treenode-icon ' + String.fromCharCode(65 + Math.floor(Math.random(new Date) * 26)) + '">' +
        '</span>' +
        '<div data-fav="' + child + '" class="ui-treenode-content" style="display:inline;">' +
        '<span class="ui-treenode-icon  fa fa-fw">' +
        '</span>' +
        '<!---->' +
        '<!---->' +
        '<span class="ui-treenode-label ui-corner-all">' +
        '<!---->' +
        '<span>' + elem + '</span>' +
        '<!---->' +
        '</span>' +
        '</div>' +
        '<!---->' +
        '</li>' +
        '<!---->' +
        '<!---->' +
        '</p-treenode>'
}

let favoritesHTML = '<button id="fav-button" class="ng-star-inserted dropzone" title="Arraste para cá suas classes favoritas" style="' +
    'background: 0 0;border: 0;font-size: 14px;color: #838383; z-index: 99999;float: right;display: inline-block; visibility: hidden;">' +
    '<span class="ti-heart title-button" style="pointer-events: none;">'
'</span>' +
    '</button>';

var listener = false;

var dragged = null;

var workspace = window.location.hostname.split(".sydle")[0];

var favList = undefined;

var dragListenerOn = false;

chrome.storage.onChanged.addListener((changes, namespace) => {
    let size = document.getElementsByTagName("iframe").length - 1;
    let iframe = document.getElementsByTagName("iframe")[size].contentWindow.document;
    Object.keys(changes).forEach((key) => {
        if (key === 'selectedTheme') {
            iframe.getElementById("ace-sydle").remove();
            iframe.head.insertAdjacentHTML('beforeend',
                '<link id="ace-sydle" rel="stylesheet" type="text/css" href="' +
                chrome.runtime.getURL(changes[key].newValue) + '">'
            );
        } else if (key === 'fontFamily') {
            iframe.getElementById("font-sydle").remove();
            iframe.head.insertAdjacentHTML('beforeend',
                '<link id="font-sydle" rel="stylesheet" type="text/css" href="' +
                chrome.runtime.getURL(changes[key].newValue) + '">'
            );
        } else if (key === 'fontSize') {
            iframe.getElementById("font-size-sydle").remove();
            iframe.head.insertAdjacentHTML('beforeend',
                '<style id="font-size-sydle" type="text/css">' +
                '.ace-chrome {font-size: ' + changes[key].newValue + 'px!important;}' +
                '</style>"'
            );
        }
    })
});

const favClick = (event) => {
    if (!event.isTrusted) {
        return;
    }
    // console.log(event);
    let parent = event.srcElement.innerText.split("/")[1];
    let child = event.srcElement.innerText.split("/")[0];
    let iframe = event.path[event.path.length - 2];
    let options = iframe.querySelectorAll('div.ui-treenode-content');
    let closed = true;
    options.forEach((option) => {
        if (option.innerText === parent) {
            // console.log(option.children[0].classList);
            if (!option.children[0].classList.contains("ti-angle-down")) {
                // console.log(option);
                option.click();
            } else {
                closed = false;
            }
            // console.log(option.parentElement.children[1]);
            if (option.parentElement.children[1]) option.parentElement.children[1].querySelectorAll('div.ui-treenode-content').forEach((element) => {
                // console.log("oi");
                if (element.innerText === child) {
                    element.click();
                }
            })
            if (closed) {
                option.click();
            }
            // if(n > 0) {
            //     console.log("tentou");
            //     option.click();   
            // }
            // n++;
        }
    });
}

const removeFavClick = (event) => {
    // console.log(event);
    let iframe = event.path[event.path.length - 2];
    let removedElem = event.srcElement.attributes[0].value;
    let option = iframe.querySelector('p-treenode[data-fav="' + removedElem + '"]');
    option.remove();
    favList[workspace] = favList[workspace].filter((value) => {
        return value !== removedElem;
    })
    checkFavorites();
    chrome.storage.sync.set({
        sydleFav: favList
    }, () => { });
}

const removeCss = () => {
    let size = document.getElementsByTagName("iframe").length - 1;
    // console.log("okadokasod");
    if (document.getElementsByTagName("iframe")[size].contentWindow.document.getElementById('ace-chrome') !== null) {
        // console.log("ACHOU");
        document.getElementsByTagName("iframe")[size].contentWindow.document.getElementById('ace-chrome').remove();
    }
}

var showId = false;



function updateCss() {
    // console.log("teste");
    try {
        let size = document.getElementsByTagName("iframe").length - 1;
        try {
            addGeneralCss();
        } catch (e) {
    
        }
        try {
            addWorkspace();
        } catch (e) {
    
        }
        chrome.storage.sync.get({
            showId: false
        }, function (items) {
            if (items.showId) {
                console.log(size);
                try {
                    showCardId(size);
                } catch (e) {

                }
            }
        });
        if (size >= 0) {
            let iframe = document.getElementsByTagName("iframe")[size].contentWindow.document;
            if (iframe.getElementById('ace-sydle') === null) {

                iframe.addEventListener('DOMNodeInserted', removeCss);

                chrome.storage.sync.get({
                    selectedTheme: 'styles/dracula.css',
                    fontFamily: 'fontFamilies/monospace.css',
                    fontSize: '12'
                }, function (items) {
                    if (iframe.getElementById('ace-sydle') === null) {
                        iframe.head.insertAdjacentHTML('beforeend',
                            '<link id="ace-sydle" rel="stylesheet" type="text/css" href="' +
                            chrome.runtime.getURL(items.selectedTheme) + '">'
                        );
                        iframe.head.insertAdjacentHTML('beforeend',
                            '<link id="font-sydle" rel="stylesheet" type="text/css" href="' +
                            chrome.runtime.getURL(items.fontFamily) + '">'
                        );
                        iframe.head.insertAdjacentHTML('beforeend',
                            '<style id="font-size-sydle" type="text/css">' +
                            '.ace-chrome {font-size: ' + items.fontSize + 'px!important;}' +
                            '</style>"'
                        );
                    }
                });
            }
            buildFavoritesTab();
            // document.getElementsByTagName("iframe")[size].contentWindow.document.querySelector('.btn-script').addEventListener('click', removeCss(size));
        }
    } catch {

    }
}

function addGeneralCss() {
    if (!document.getElementById('general-css')) {
        var style = document.createElement('style');
        style.innerHTML = css;
        style.id = 'general-css';
        document.head.appendChild(style);
    }
}

function addWorkspace() {
    if (!document.getElementById('workspace-id')) {
        let upperBar = document.getElementsByClassName('subheader')[0];
        let titleBar = document.getElementsByClassName('sy-title-column')[0];
        let buttonBar = document.getElementsByClassName('sy-button-column')[0];
        upperBar.style = "display: flex;";
        titleBar.style = "flex-grow: 1; flex-basis: 0;";
        buttonBar.style = "flex-grow: 1; flex-basis: 0;";
        buttonBar.insertAdjacentHTML('beforebegin', '<span id="workspace-id" style="text-align: center; flex-grow: 1; flex-basis: 0; margin: auto auto; font-size: 17pt; font-weight: 300;">' + workspace.toUpperCase() + '</span>');
    }
}

var firstCardId = null;
var cardsSize = 0;

function showCardId(size) {
    if (size >= 1) {
        let iframe = document.getElementsByTagName("iframe")[size - 1].contentWindow.document;
        let cards = iframe.querySelectorAll('[data-card-id]');
        let firstId = cards[0].getAttribute('data-card-id');
        if (firstCardId !== firstId || cardsSize !== cards.length) {
            firstCard = firstId;
            cardsSize = cards.length;
            for (let i = 0; i < cards.length; i++) {
                // let icon = '<div style="text-align: center;" class="ti-info-alt icon-id"></div>';
                let cardBody = cards[i].getElementsByClassName('media-body')[0];
                let dataCardId = cards[i].getAttribute('data-card-id');
                let dataCardClassId = cards[i].getAttribute('data-card-class-id');
                // if (!cards[i].getElementsByClassName('icon-id').length) {
                //     cardBody.insertAdjacentHTML('beforeend', icon);
                //     // var modal = document.createElement('div');
                //     // modal.innerHTML = `<div>
                //     //     <a href="#" title="Close" class="modal-close">Close</a>
                //     //     <div id="id-modal"></div>
                //     //     <div id="class-id-modal"></div>
                //     // </div>`;
                //     // modal.id = 'open-modal';
                //     // modal.class = 'modal-window';
                //     // document.body.appendChild(modal);
                //     cards[i].getElementsByClassName('icon-id')[0].addEventListener('click', infoClick);
                // }
                if (!cards[i].getElementsByClassName('info-panel').length) {
                    cardBody.insertAdjacentHTML('beforeend', `
                    <div id="info-panel" class="info-panel">
                        <div style="text-align: center; font-size: 1.1rem;" class="ti-info-alt icon-id"></div>
                        <div id="sy-info" class="sy-info" style="display: none; font-size: 72%;">
                            <div id="sy-id" class="sy-id" _ngcontent-c13="">
                                <div _ngcontent-c13="" class="others">
                                    <span style="display: inline; color: #9a9a9a;" _ngcontent-c13="" class="card-feature-label">_id: </span>
                                    <span style="display: inline; user-select: text; cursor: auto; color: #2e2e2e;" _ngcontent-c13="" class="truncate fix-userTask-name" title="${dataCardId}">${dataCardId}</span>
                                </div>
                            </div>
                            <div id="class-id" class="class-id" _ngcontent-c13="">
                                <div _ngcontent-c13="" class="others">
                                    <span style="display: inline; color: #9a9a9a;" _ngcontent-c13="" class="card-feature-label">class._id: </span>
                                    <span style="display: inline; user-select: text; cursor: auto; color: #2e2e2e;" _ngcontent-c13="" class="truncate fix-userTask-name" title="${dataCardClassId}">${dataCardClassId}</span>
                                </div>
                            </div>
                        </div>
                    </div>`);
                    cards[i].getElementsByClassName('icon-id')[0].addEventListener('click', infoClick);
                }
            }
        }
    }
    let iframeElem = document.getElementsByTagName("iframe")[size];
    let iframe = iframeElem.contentWindow.document;
    let source = iframeElem.getAttribute("src");
    let cid = source.match(/(?<=cid=)[^&]*/)[0];
    let id = source.match(/(?<=&id=)[^&]*/)[0];
    let cardTitle = iframe.getElementsByClassName('sy-card-title');
    for (let i = 0; i < cardTitle.length; i++) {
        if (!cardTitle[i].getElementsByClassName('sy-info').length) {
            cardTitle[i].insertAdjacentHTML('beforeend', `
            <div id="sy-info" class="sy-info" style="font-size: 72%;">
                <div class="sy-id" _ngcontent-c21="">
                    <div _ngcontent-c21="" class="others">
                        <span style="display: inline; color: #9a9a9a;" _ngcontent-c21="" class="card-feature-label">_id: </span>
                        <span style="display: inline; user-select: text; cursor: auto;  color: #2e2e2e;" _ngcontent-c21="" class="truncate fix-userTask-name" title="${id}">${id}</span>
                    </div>
                </div>
                <div class="class-id" _ngcontent-c21="">
                    <div _ngcontent-c21="" class="others">
                        <span style="display: inline; color: #9a9a9a;" _ngcontent-c21="" class="card-feature-label">class._id: </span>
                        <span style="display: inline; user-select: text; cursor: auto;  color: #2e2e2e;" _ngcontent-c21="" class="truncate fix-userTask-name" title="${cid}">${cid}</span>
                    </div>
                </div>
            </div>`);
        }
    }
}

function infoClick(event) {
    console.log(event);
    let syInfo = event.path[1].childNodes[3];
    if(syInfo.style.display === "none") {
        event.srcElement.style.color = "#001fff";
        syInfo.style.display = "block";
    } else {
        event.srcElement.style.color = "#929292";
        syInfo.style.display = "none";
    }
    // console.log("tessste");
    // let modal = document.getElementById("open-modal");
    // modal.visibility = 'visible';
    // let id = document.getElementById("id-modal");
    // id.innerText = "teste";
    // let classId = document.getElementById("class-id-modal");
    // classId.innerText = "teste";
}

function toggleArrow(elem) {
    // console.log(elem);
    elem.classList.toggle('ti-angle-down');
    elem.classList.toggle('ti-angle-right');
}

function checkFavorites() {
    let iframe = document.querySelector('iframe[slotname="explorer_class_listing"]').contentWindow.document;
    if ((!favList[workspace] || favList[workspace].length === 0) && iframe.getElementById('favorito')) {
        iframe.getElementById('favorito').style.display = 'none';
    } else if (iframe.getElementById('favorito')) {
        iframe.getElementById('favorito').style.display = 'block';
    }
}

function favLabelClick(event) {
    let iframe = event.path[event.path.length - 2];
    let displayFav = iframe.getElementById("favorites-list").style.display;
    if (displayFav === 'block') {
        iframe.getElementById("favorites-list").style.display = 'none';
    } else {
        iframe.getElementById("favorites-list").style.display = 'block';
    }
    toggleArrow(iframe.getElementById("fav-arrow"));
}

function buildFavoritesTab() {
    if (document.querySelector('iframe[slotname="explorer_class_listing"]')) {
        // console.log("iweiwiewie");
        let iframe = document.querySelector('iframe[slotname="explorer_class_listing"]').contentWindow.document;

        if (favList === undefined) {
            chrome.storage.sync.get({
                sydleFav: {},
            }, function (items) {
                favList = items.sydleFav;
            });
            return;
        }
        if (!iframe.getElementById("favorito") && favList !== undefined) {
            // console.log(iframe.getElementById("favorito"));
            listener = false;
            iframe.querySelector("ul.ui-tree-container").insertAdjacentHTML('afterbegin', buildFavorites());
            // console.log("oooo loquinho meu");
            checkFavorites();
            iframe.addEventListener("dragstart", function (event) {
                // store a ref. on the dragged elem
                if (event.target.children[1].classList.contains("ui-treenode-leaf-icon")) {
                    dragged = event.target.innerText + "/" + event.target.parentElement.parentElement.parentElement.parentElement.children[0].innerText;
                } else {
                    dragged = null;
                }
                // console.log("dragged ", dragged);
                // make it half transparent
                event.target.style.opacity = .2;
            }, false);
            iframe.addEventListener("dragend", function (event) {
                // reset the transparency
                event.target.style.opacity = 1;
            }, false);
            addDraggedListeners(iframe);
            // console.log("testando");
            iframe.getElementById("fav-tab-label").addEventListener('click', favLabelClick);
            iframe.querySelectorAll("div[data-fav]").forEach((elem, index) => {
                elem.addEventListener('click', favClick);
            });
            iframe.querySelectorAll("span[data-rem]").forEach((elem, index) => {
                elem.addEventListener('click', removeFavClick);
            });
            iframe.querySelectorAll("li[data-close]").forEach((elem, index) => {
                elem.addEventListener('mouseenter', (event) => {
                    event.srcElement.children[0].style.visibility = 'visible';
                });
                elem.addEventListener('mouseleave', (event) => {
                    event.srcElement.children[0].style.visibility = 'hidden';
                });
            });
        }
    }
    if (!document.getElementById('fav-button')) {
        // console.log(document.querySelector("div.title"));
        document.querySelector("div.title").insertAdjacentHTML('beforeend', favoritesHTML);
        // document.getElementById("fav-button").addEventListener('click', (event) => {
        //     console.log("irrrrrrraaaaa");
        //     event.stopPropagation();
        //     // let iframe = document.querySelector('iframe[slotname="explorer_class_listing"]').contentWindow.document;
        //     iframe.scrollTop = 0;
        // });
        document.getElementById("fav-button").parentElement.parentElement.addEventListener('mouseenter', (event) => {
            document.getElementById("fav-button").style.visibility = 'visible';
        });
        document.getElementById("fav-button").parentElement.parentElement.addEventListener('mouseleave', (event) => {
            document.getElementById("fav-button").style.visibility = 'hidden';
        });
    }
}

/* events fired on the draggable target */
document.addEventListener("dragstart", function (event) {
    // store a ref. on the dragged elem
    dragged = event.target;
    // make it half transparent
    event.target.style.opacity = .2;
}, false);

document.addEventListener("dragend", function (event) {
    // reset the transparency
    event.target.style.opacity = "";
}, false);

function addDraggedListeners(where) {
    where.addEventListener("drag", function (event) {

    }, false);

    /* events fired on the drop targets */
    where.addEventListener("dragover", function (event) {
        // prevent default to allow drop
        event.preventDefault();
    }, false);

    where.addEventListener("dragenter", function (event) {
        // highlight potential drop target when the draggable element enters it
        if (event.target.classList.contains("dropzone")) {
            event.target.style.color = "red";
        }

    }, false);

    where.addEventListener("dragleave", function (event) {
        // reset background of potential drop target when the draggable element leaves it
        if (event.target.classList.contains("dropzone")) {
            event.target.style.color = "#838383";
        }

    }, false);

    where.addEventListener("drop", function (event) {
        // prevent default action (open as link for some elements)
        // console.log("opppppaaaa");
        event.preventDefault();
        // move dragged elem to the selected drop target
        if (event.target.classList.contains("dropzone")) {
            event.target.style.color = "#838383";
        }
        if (event.target.classList.contains("dropzone") && dragged !== null) {
            // console.log("apoooooooooooo");
            event.target.style.color = "#838383";
            // console.log(dragged);
            if (!favList) {
                favList = {};
            }
            if (!favList[workspace]) {
                favList[workspace] = [];
            }
            let sizeBefore = favList[workspace].length;
            favList[workspace].push(dragged);
            favList[workspace] = [... new Set(favList[workspace])];
            let sizeAfter = favList[workspace].length;
            // console.log(favList);
            if (sizeAfter > sizeBefore) {
                checkFavorites();
                chrome.storage.sync.set({
                    sydleFav: favList
                }, () => {
                    let iframe = document.querySelector('iframe[slotname="explorer_class_listing"]').contentWindow.document;
                    if (!iframe.getElementById("favorites-list")) {
                        buildFavoritesTab();
                    } else {
                        iframe.getElementById("favorites-list").insertAdjacentHTML('beforeEnd', buildFavItem(dragged));
                        iframe.querySelectorAll('div[data-fav="' + dragged.split("/")[0] + '"]').forEach((elem, index) => {
                            elem.addEventListener('click', favClick);
                        });
                        iframe.querySelectorAll("span[data-rem]").forEach((elem, index) => {
                            elem.addEventListener('click', removeFavClick);
                        });
                        iframe.querySelectorAll("li[data-close]").forEach((elem, index) => {
                            elem.addEventListener('mouseenter', (event) => {
                                event.srcElement.children[0].style.visibility = 'visible';
                            });
                            elem.addEventListener('mouseleave', (event) => {
                                event.srcElement.children[0].style.visibility = 'hidden';
                            });
                        });
                    }
                });
            }
            // dragged.parentNode.removeChild( dragged );
            // event.target.appendChild( dragged );
        }

    }, false);
}

addDraggedListeners(document);

document.addEventListener('DOMNodeInserted', updateCss);