var editor = ace.edit("editor");

// Saves options to chrome.storage
function save_options() {
    let theme = document.getElementById('theme').value;
    chrome.storage.sync.set({
        selectedTheme: theme
    }, function () {
        // Update status to let user know options were saved.
        let status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
    let font = document.getElementById("font").value.split(".")[0].split("/")[1];
    editor.setOptions({
        fontFamily: font
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        selectedTheme: 'styles/dracula.css',
    }, function (items) {
        document.getElementById('theme').value = items.selectedTheme;
        change_option();
    });
}

const change_option = () => {
    let theme = document.getElementById("theme").value.split(".")[0].split("/")[1];
    editor.setTheme("ace/theme/"+theme);
}

document.getElementById("theme").onchange = change_option;

chrome.runtime.getPackageDirectoryEntry(function(directoryEntry) {
    directoryEntry.getDirectory('styles', {}, function(subDirectoryEntry) {
        var directoryReader = subDirectoryEntry.createReader();
        var filenames = [];
        (function readNext() {
            directoryReader.readEntries(function(entries) {
                if (entries.length) {
                    for (var i = 0; i < entries.length; ++i) {
                        filenames.push(entries[i].name);
                    }
                    readNext();
                } else {
                    filenames.forEach(item => {
                        let opt = document.createElement("option");
                        opt.value= "styles/"+item;
                        opt.innerHTML = item.split('.')[0];
                    
                        document.getElementById('theme').appendChild(opt);
                    });
                    restore_options();
                }
            });
        })();
    });
    directoryEntry.getDirectory('fonts', {}, function(subDirectoryEntry) {
        var directoryReader = subDirectoryEntry.createReader();
        var filenames = [];
        (function readNext() {
            directoryReader.readEntries(function(entries) {
                if (entries.length) {
                    for (var i = 0; i < entries.length; ++i) {
                        filenames.push(entries[i].name);
                    }
                    readNext();
                } else {
                    filenames.forEach(item => {
                        let opt = document.createElement("option");
                        opt.value= "fonts/"+item;
                        opt.innerHTML = item.split('.')[0];
                    
                        document.getElementById('font').appendChild(opt);
                    });
                    restore_options();
                }
            });
        })();
    });
});

const startEditor = () => {
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/javascript");
    // editor.setOptions({
    //     fontFamily: "tahoma",
    //     fontSize: "10pt"
    // });
}

startEditor();

document.getElementById('save').addEventListener('click', save_options);