function buildFavorites() {
    let favItems = "";
    favList[workspace].forEach((elem) => {
        favItems += buildFavItem(elem);
    })
    return '<p-treenode id="favorito" class="dropzone">'+
    '<!---->'+
    '<!---->'+
    '<li class="ui-treenode dropzone">'+
    '<div id="fav-tab-label" class="ui-treenode-content dropzone" pdraggable="expr" draggable="true">'+
    '<span id="fav-arrow" class="ui-treenode-icon  ti-angle-down" style="pointer-events: none;">'+
    '</span>'+
    '<!---->'+
    '<!---->'+
    '<span class="ui-treenode-label ui-corner-all dropzone">'+
    '<!---->'+
    '<span class="not-leaf dropzone" style="color: #000000; pointer-events: none;">Favoritos</span>'+
    '<!---->'+
    '<span class="ti-heart title-button dropzone" style="margin-left: 5px">'+
    '</span>'+
    '</span>'+
    '</div>'+
    '<!---->'+
    '<ul id="favorites-list" class="ui-treenode-children dropzone" style="display: block;">'+
    '<!---->'+
    favItems+
    '</ul>'+
    '</li>'+
    '<!---->'+
    '<!---->'+
    '</p-treenode>';
}

function buildFavItem(elem) {
    let [child, parent] = elem.split("/");
    return '<p-treenode data-fav="'+elem+'">'+
    '<!---->'+
    '<!---->'+
    '<li data-close class="ui-treenode">'+
    '<span data-rem="'+elem+'" class="ui-treenode-icon ti-close" style="margin-left: -10px; visibility: hidden">'+
    '</span>'+
    '<span class="ui-treenode-leaf-icon ui-treenode-icon '+String.fromCharCode(65+Math.floor(Math.random(new Date) * 26))+'">'+
    '</span>'+
    '<div data-fav="'+child+'" class="ui-treenode-content" style="display:inline;">'+
    '<span class="ui-treenode-icon  fa fa-fw">'+
    '</span>'+
    '<!---->'+
    '<!---->'+
    '<span class="ui-treenode-label ui-corner-all">'+
    '<!---->'+
    '<span>'+elem+'</span>'+
    '<!---->'+
    '</span>'+
    '</div>'+
    '<!---->'+
    '</li>'+
    '<!---->'+
    '<!---->'+
    '</p-treenode>'
}

let favoritesHTML = '<button id="fav-button" class="ng-star-inserted dropzone" title="Favoritos" style="'+
'background: 0 0;border: 0;font-size: 14px;color: #838383; z-index: 99999;float: right;display: inline-block; visibility: hidden;">'+
'<span class="ti-heart title-button" style="pointer-events: none;">'
'</span>'+
'</button>';

var listener = false;

var dragged = "";

var workspace = window.location.hostname.split(".sydle")[0];

var favList = undefined;

var dragListenerOn = false;

chrome.storage.onChanged.addListener((changes, namespace) => {
    let size = document.getElementsByTagName("iframe").length-1;
    let iframe = document.getElementsByTagName("iframe")[size].contentWindow.document;
    Object.keys(changes).forEach((key) => {
        if(key === 'selectedTheme') {
            iframe.head.insertAdjacentHTML('beforeend',
            '<link id="ace-sydle" rel="stylesheet" type="text/css" href="' + 
            chrome.runtime.getURL(changes[key].newValue) + '">' 
            );
        } else if(key === 'fontFamily') {
            iframe.head.insertAdjacentHTML('beforeend',
            '<link rel="stylesheet" type="text/css" href="' + 
            chrome.runtime.getURL(changes[key].newValue) + '">' 
            );
        }
    })
});

const favClick = (event) => {
    if(!event.isTrusted) {
        return;
    }
    // console.log(event);
    let parent = event.srcElement.innerText.split("/")[1];
    let child = event.srcElement.innerText.split("/")[0];
    let iframe = event.path[event.path.length-2];
    let options = iframe.querySelectorAll('div.ui-treenode-content');
    let closed = true;
    options.forEach((option) => {
        if(option.innerText === parent) {
            // console.log(option.children[0].classList);
            if(!option.children[0].classList.contains("ti-angle-down")) {
                // console.log(option);
                option.click();
            } else {
                closed = false;
            }
            // console.log(option.parentElement.children[1]);
            if(option.parentElement.children[1]) option.parentElement.children[1].querySelectorAll('div.ui-treenode-content').forEach((element) => {
                // console.log("oi");
                if(element.innerText === child) {
                    element.click();
                }
            })
            if(closed) {
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
    console.log(event);
    let iframe = event.path[event.path.length-2];
    let removedElem = event.srcElement.attributes[0].value;
    let option = iframe.querySelector('p-treenode[data-fav="'+removedElem+'"]');
    option.remove();
    favList[workspace] = favList[workspace].filter((value) => {
        return value !== removedElem;
    })
    checkFavorites();
    chrome.storage.sync.set({
        sydleFav: favList
    },() => {});
}

const removeCss = () => {
    let size = document.getElementsByTagName("iframe").length-1;
    // console.log("okadokasod");
    if(document.getElementsByTagName("iframe")[size].contentWindow.document.getElementById('ace-chrome') !== null) {
        // console.log("ACHOU");
        document.getElementsByTagName("iframe")[size].contentWindow.document.getElementById('ace-chrome').remove();    
    }
}

function updateCss() {
    try {
        let size = document.getElementsByTagName("iframe").length-1;
        if(size >= 0) {
            let iframe = document.getElementsByTagName("iframe")[size].contentWindow.document;
            if(iframe.getElementById('ace-sydle') === null) {

                iframe.addEventListener('DOMNodeInserted', removeCss);
                
                chrome.storage.sync.get({
                    selectedTheme: 'styles/dracula.css',
                    fontFamily: 'monospace'
                }, function (items) {
                    iframe.head.insertAdjacentHTML('beforeend',
                    '<link id="ace-sydle" rel="stylesheet" type="text/css" href="' + 
                    chrome.runtime.getURL(items.selectedTheme) + '">' 
                    );
                    iframe.head.insertAdjacentHTML('beforeend',
                    '<link rel="stylesheet" type="text/css" href="' + 
                    chrome.runtime.getURL(items.fontFamily) + '">' 
                    );
                });
            }
            buildFavoritesTab();
            // document.getElementsByTagName("iframe")[size].contentWindow.document.querySelector('.btn-script').addEventListener('click', removeCss(size));
        }
    } catch {

    }
}

function toggleArrow(elem) {
    console.log(elem);
    elem.classList.toggle('ti-angle-down');
    elem.classList.toggle('ti-angle-right');
}

function checkFavorites() {
    let iframe = document.querySelector('iframe[slotname="explorer_class_listing"]').contentWindow.document;
    if(!favList[workspace] || favList[workspace].length === 0) {
        iframe.getElementById('favorito').style.display = 'none';
    } else {
        iframe.getElementById('favorito').style.display = 'block';
    }
}

function favLabelClick(event) {
    let iframe = event.path[event.path.length-2];
    let displayFav = iframe.getElementById("favorites-list").style.display;
    if(displayFav === 'block') {
        iframe.getElementById("favorites-list").style.display = 'none';
    } else {
        iframe.getElementById("favorites-list").style.display = 'block';
    }
    toggleArrow(iframe.getElementById("fav-arrow"));
}

function buildFavoritesTab() {
    if(document.querySelector('iframe[slotname="explorer_class_listing"]')) {
        // console.log("iweiwiewie");
        let iframe = document.querySelector('iframe[slotname="explorer_class_listing"]').contentWindow.document;
        
        if(favList === undefined) {
            chrome.storage.sync.get({
                sydleFav: {},
            }, function (items) {
                favList = items.sydleFav;
            });
            return;
        }
        if(!iframe.getElementById("favorito") && favList !== undefined) {
            console.log("oi");
            listener = false;
            iframe.querySelector("ul.ui-tree-container").insertAdjacentHTML('afterbegin', buildFavorites());
            checkFavorites();
            iframe.addEventListener("dragstart", function( event ) {
                // store a ref. on the dragged elem
                dragged = event.target.innerText + "/" + event.target.parentElement.parentElement.parentElement.parentElement.children[0].innerText;
                console.log("dragged ", dragged);
                // make it half transparent
                event.target.style.opacity = .2;
            }, false);
            iframe.addEventListener("dragend", function( event ) {
                // reset the transparency
                event.target.style.opacity = 1;
            }, false);
            addDraggedListeners(iframe);
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
    if(!document.getElementById('fav-button')) {
        console.log(document.querySelector("div.title"));
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
document.addEventListener("dragstart", function( event ) {
    // store a ref. on the dragged elem
    dragged = event.target;
    // make it half transparent
    event.target.style.opacity = .2;
}, false);

document.addEventListener("dragend", function( event ) {
    // reset the transparency
    event.target.style.opacity = "";
}, false);

function addDraggedListeners(where) {
    where.addEventListener("drag", function( event ) {

    }, false);
    
    /* events fired on the drop targets */
    where.addEventListener("dragover", function( event ) {
        // prevent default to allow drop
        event.preventDefault();
    }, false);
    
    where.addEventListener("dragenter", function( event ) {
        // highlight potential drop target when the draggable element enters it
        if (event.target.classList.contains("dropzone")) {
            event.target.style.color = "red";
        }
    
    }, false);
    
    where.addEventListener("dragleave", function( event ) {
        // reset background of potential drop target when the draggable element leaves it
        if (event.target.classList.contains("dropzone")) {
            event.target.style.color = "#838383";
        }
    
    }, false);
    
    where.addEventListener("drop", function( event ) {
        // prevent default action (open as link for some elements)
        // console.log("opppppaaaa");
        event.preventDefault();
        // move dragged elem to the selected drop target
        if (event.target.classList.contains("dropzone")) {
            console.log("apoooooooooooo");
            event.target.style.color = "#838383";
            console.log(dragged);
            if(!favList[workspace]) {
                favList[workspace] = [];
            }
            let sizeBefore = favList[workspace].length;
            favList[workspace].push(dragged);
            favList[workspace] = [... new Set(favList[workspace])];
            let sizeAfter = favList[workspace].length;
            console.log(favList);
            if(sizeAfter > sizeBefore) {
                checkFavorites();
                chrome.storage.sync.set({
                    sydleFav: favList
                }, () => {
                    let iframe = document.querySelector('iframe[slotname="explorer_class_listing"]').contentWindow.document;
                    if(!iframe.getElementById("favorites-list")) {
                        buildFavoritesTab();
                    } else {
                        iframe.getElementById("favorites-list").insertAdjacentHTML('beforeEnd', buildFavItem(dragged));
                        iframe.querySelectorAll('div[data-fav="'+dragged.split("/")[0]+'"]').forEach((elem, index) => {
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