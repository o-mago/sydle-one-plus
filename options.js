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

let themes = ["styles/ambiance.css", "styles/chaos.css", "styles/chrome.css", "styles/clouds.css", 
"styles/clouds_midnight.css", "styles/cobalt.css", "styles/crimson_editor.css", "styles/dawn.css", 
"styles/dracula.css", "styles/dreamweaver.css", "styles/eclipse.css", "styles/github.css", "styles/gob.css", 
"styles/gruvbox.css", "styles/idle_fingers.css", "styles/iplastic.css", "styles/katzenmilch.css", "styles/kr_theme.css", 
"styles/kuroir.css", "styles/merbivore.css", "styles/merbivore_soft.css", "styles/monokai.css", "styles/mono_industrial.css", 
"styles/pastel_on_dark.css", "styles/solarized_dark.css", "styles/solarized_light.css", "styles/sqlserver.css", "styles/terminal.css", 
"styles/textmate.css", "styles/tomorrow.css", "styles/tomorrow_night.css", "styles/tomorrow_night_blue.css", "styles/tomorrow_night_bright.css", 
"styles/tomorrow_night_eighties.css", "styles/twilight.css", "styles/vibrant_ink.css", "styles/xcode.css"];

themes.forEach(item => {
    let opt = document.createElement("option");
    opt.value= item;
    opt.innerHTML = item.split("/")[1].split(".")[0];

    document.getElementById('theme').appendChild(opt);
});