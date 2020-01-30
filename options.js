// Saves options to chrome.storage
function save_options() {
    var theme = document.getElementById('theme').value;
    chrome.storage.sync.set({
        selectedTheme: theme
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        selectedTheme: 'styles/dracula.css',
    }, function (items) {
        document.getElementById('theme').value = items.selectedTheme;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

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
                }
            });
        })();
    });
});

// themes.forEach(item => {
//     let opt = document.createElement("option");
//     opt.value= "styles/"+item;
//     opt.innerHTML = files;

//     document.getElementById('theme').appendChild(opt);
// });