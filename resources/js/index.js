import L10n from "./L10n.js";
/* DOM */
const $totNoCookie = document.querySelector("[data-toast=\"no-cookie\"]");
const $timNoCookie = document.querySelector("[data-toast=\"no-cookie\"] [data-time]");
const COOKIE_ENABLED = navigator.cookieEnabled;
const $btnHelp = document.querySelector("[data-button=\"help\"]");
const $diaHelp = document.querySelector("[data-dialog=\"help\"]");
const $btnHelpClose = document.querySelector("[data-button=\"help-close\"]");
const $btnExample = document.querySelector("[data-button=\"example\"]");
const $btnConfig = document.querySelector("[data-button=\"config\"]");
const $diaConfig = document.querySelector("[data-dialog=\"config\"]");
const $btnConfigClose = document.querySelector("[data-button=\"config-close\"]");
const $chkConfigIgnoreErrors = document.querySelector("[data-checkbox=\"ignore-errors\"]");
const $chkConfigCountryTitle = document.querySelector("[data-checkbox=\"country-title\"]");
const $chkConfigCountryAlt = document.querySelector("[data-checkbox=\"country-alt\"]");
const $chkConfigOutputInput = document.querySelector("[data-checkbox=\"output-input\"]");
if (COOKIE_ENABLED) {
    if (localStorage.getItem("ignore-errors") === "true") {
        $chkConfigIgnoreErrors.checked = true;
    }
    if (localStorage.getItem("country-title") === "true") {
        $chkConfigCountryTitle.checked = true;
    }
    if (localStorage.getItem("country-alt") === "true") {
        $chkConfigCountryAlt.checked = true;
        $chkConfigOutputInput.checked = true;
        $chkConfigOutputInput.disabled = true;
    }
    if (localStorage.getItem("output-input") === "true") {
        $chkConfigOutputInput.checked = true;
    }
}
else {
    delete $totNoCookie.dataset.hidden;
    let tick = 5;
    $timNoCookie.textContent = `${tick} second${tick === 1 ? "" : "s"}`;
    let timer = window.setInterval(() => {
        tick--;
        $timNoCookie.textContent = `${tick} second${tick === 1 ? "" : "s"}`;
        if (tick === 0) {
            $totNoCookie.dataset.hidden = "";
            window.clearInterval(timer);
        }
    }, 1000);
}
const $errorsOutput = document.querySelector("#errors-output");
const $btnErrors = document.querySelector("[data-button=\"errors\"]");
const $diaErrors = document.querySelector("[data-dialog=\"errors\"]");
const $btnErrorsClose = document.querySelector("[data-button=\"errors-close\"]");
const $diaErrorsList = document.querySelector("#errors-list");
const $btnParse = document.querySelector("[data-button=\"parse\"]");
const $input = document.querySelector("#input");
const $output = document.querySelector("#output");
const $outputErrors = document.querySelector("#output-errors");
const $diaOutput = document.querySelector("[data-dialog=\"output\"]");
const $btnOutputClose = document.querySelector("[data-button=\"output-close\"]");
$btnHelp.removeAttribute("data-disabled");
$btnExample.removeAttribute("data-disabled");
$btnConfig.removeAttribute("data-disabled");
$btnParse.removeAttribute("data-disabled");
$input.removeAttribute("disabled");
/* flags list */
const FLAGS = L10n.getString("flag");
const FLAG_CODES = Object.freeze(Object.keys(FLAGS));
/* help events */
function $btnHelp_click() {
    if (!$btnHelp.hasAttribute("data-disabled")) {
        delete $diaHelp.dataset.hidden;
    }
}
$btnHelp.addEventListener("click", $btnHelp_click);
function $btnHelpClose_click() {
    $diaHelp.dataset.hidden = "";
}
$btnHelpClose.addEventListener("click", $btnHelpClose_click);
/* config events */
function $btnConfig_click() {
    if (!$btnConfig.hasAttribute("data-disabled")) {
        delete $diaConfig.dataset.hidden;
    }
}
$btnConfig.addEventListener("click", $btnConfig_click);
function $btnConfigClose_click() {
    $diaConfig.dataset.hidden = "";
}
$btnConfigClose.addEventListener("click", $btnConfigClose_click);
// the input needs to be included so the user can copy the alt values
function $chkConfigCountryAlt_change() {
    // TOFIX this will also uncheck $chkConfigOutputInput if the user had already checked it
    if ($chkConfigCountryAlt.checked) {
        $chkConfigOutputInput.checked = true;
        $chkConfigOutputInput.disabled = true;
    }
    else {
        $chkConfigOutputInput.checked = false;
        $chkConfigOutputInput.disabled = false;
    }
}
$chkConfigCountryAlt.addEventListener("change", $chkConfigCountryAlt_change);
function $$config_change(event) {
    let target = event.target;
    let targetName = target.dataset.checkbox;
    if (target.checked) {
        localStorage.setItem(targetName, "true");
    }
    else {
        localStorage.setItem(targetName, "false");
        if (targetName === "country-alt") {
            localStorage.setItem("output-input", "false");
        }
    }
}
if (COOKIE_ENABLED) {
    $chkConfigIgnoreErrors.addEventListener("change", $$config_change);
    $chkConfigCountryTitle.addEventListener("change", $$config_change);
    $chkConfigCountryAlt.addEventListener("change", $$config_change);
    $chkConfigOutputInput.addEventListener("change", $$config_change);
}
/* example events */
function $btnExample_click() {
    if (!$btnExample.hasAttribute("data-disabled")) {
        $input.value = L10n.getString("example");
    }
}
$btnExample.addEventListener("click", $btnExample_click);
/* error events */
function $btnErrors_click() {
    if (!$btnErrors.hasAttribute("data-disabled")) {
        delete $diaErrors.dataset.hidden;
    }
}
$btnErrors.addEventListener("click", $btnErrors_click);
function $btnErrorsClose_click() {
    $diaErrors.dataset.hidden = "";
}
$btnErrorsClose.addEventListener("click", $btnErrorsClose_click);
/* output events */
function $btnOutputClose_click() {
    $diaOutput.dataset.hidden = "";
}
$btnOutputClose.addEventListener("click", $btnOutputClose_click);
/* drop events */
function fileReader_load(e) {
    let text = e.target.result;
    if (text) {
        $input.value = text;
    }
}
function window_drop(e) {
    let fileReader = new FileReader();
    fileReader.addEventListener("load", fileReader_load);
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    if (file && file.type === "text/markdown") {
        fileReader.readAsText(file);
    }
}
window.addEventListener("drop", window_drop);
/* parsing events */
function getCode(text) {
    // reference links = _xxyy]
    // inline links = /xxyy.
    let code = text.match(/(_|\/)..(?:..)?(\]|\.)/)[0];
    let codeFormatted = code.substring(1, (code.length - 1));
    return codeFormatted.toUpperCase();
}
function getNewKey(text) {
    return `[flag_${getCode(text)}]`;
}
function getReplacementLink(text) {
    let code = text.match(/\/..(?:..)?\./)[0];
    let codeFormatted = code.substring(1, (code.length - 1));
    return `[flag_${codeFormatted.toUpperCase()}]`;
}
function getFixedRef(text) {
    return `[flag_${getCode(text)}]`;
}
$btnParse.addEventListener("click", () => {
    while ($diaErrorsList.firstChild) {
        $diaErrorsList.firstChild.remove();
    }
    let lines = $input.value.split("\n");
    let flags_unsort = {};
    let flags_output = "";
    let invalid_flags = [];
    for (let i = 0; i < lines.length; i++) {
        /* ref links */
        if (/!\[(.+)?\]\[flag_..(?:..)?\]/g.test(lines[i])) {
            let key = lines[i].match(/\[flag_..(?:..)?\]/g);
            if (key) {
                for (let j = 0; j < key.length; j++) {
                    let countryMatch = key[j].match(/_..(?:..)?\]/g)[0];
                    let countryCode = countryMatch.substring(1, (countryMatch.length - 1)).toUpperCase();
                    // TOFIX this is duplicated to below
                    let ext;
                    if (countryCode.length === 2) {
                        ext = ".gif";
                    }
                    else if (countryCode.length === 4) {
                        ext = ".png";
                    }
                    let newKey = key[j].replace(key[j], getNewKey);
                    if (!FLAG_CODES.includes(countryCode)) {
                        invalid_flags.push([countryCode, (i + 1)]);
                    }
                    // parse with broken flags anyways
                    if ($chkConfigCountryTitle.checked) {
                        flags_unsort[newKey] = `/wiki/shared/flag/${countryCode}${ext} "${FLAGS[countryCode] ? FLAGS[countryCode] : "NOT_FOUND"}"`;
                    }
                    else {
                        flags_unsort[newKey] = `/wiki/shared/flag/${countryCode}${ext}`;
                    }
                    if ($chkConfigCountryAlt.checked) {
                        lines[i] = lines[i].replace(/!\[\]/g, `![${countryCode}]`);
                    }
                }
            }
        }
        /* inline links */
        if (/\(\/wiki\/shared\/flag\/..(?:..)?\.(gif|jpe?g|png)(?: ".*")?\)/g.test(lines[i])) {
            let key = lines[i].match(/\/flag\/..(?:..)?\./g);
            if (key) {
                for (let j = 0; j < key.length; j++) {
                    let countryMatch = key[j].match(/\/..(?:..)?\./g)[0];
                    let countryCode = countryMatch.substring(1, (countryMatch.length - 1)).toUpperCase();
                    // TOFIX this is duplicated from above
                    let ext;
                    if (countryCode.length === 2) {
                        ext = ".gif";
                    }
                    else if (countryCode.length === 4) {
                        ext = ".png";
                    }
                    let newKey = key[j].replace(key[j], getNewKey);
                    if (!FLAG_CODES.includes(countryCode)) {
                        invalid_flags.push([countryCode, (i + 1)]);
                    }
                    // parse with broken flags anyways
                    if ($chkConfigCountryTitle.checked) {
                        flags_unsort[newKey] = `/wiki/shared/flag/${countryCode}${ext} "${FLAGS[countryCode] ? FLAGS[countryCode] : "NOT_FOUND"}"`;
                    }
                    else {
                        flags_unsort[newKey] = `/wiki/shared/flag/${countryCode}${ext}`;
                    }
                    if ($chkConfigCountryAlt.checked) {
                        lines[i] = lines[i].replace(/!\[\]/g, `![${countryCode}]`);
                    }
                }
            }
        }
        // linkPath = "(/wiki/shared/flags/XX.xxx)" part; recognising title is supported
        let linkPath = lines[i].match(/\(\/wiki\/shared\/flag\/..(?:..)?\.(gif|jpe?g|png)(?: ".*")?\)/g);
        if (linkPath) {
            for (let j = 0; j < linkPath.length; j++) {
                lines[i] = lines[i].replace(linkPath[j], getReplacementLink);
            }
        }
        // referenceName = "[flag_XX]" part
        let referenceName = lines[i].match(/\[flag_..(?:..)?\]/g);
        if (referenceName) {
            for (let j = 0; j < referenceName.length; j++) {
                lines[i] = lines[i].replace(referenceName[j], getFixedRef);
            }
        }
    }
    if (invalid_flags.length > 0) {
        delete $errorsOutput.dataset.hidden;
        $btnErrors.textContent = `Errors (${invalid_flags.length})`;
        $outputErrors.textContent = `${invalid_flags.length} error${invalid_flags.length === 1 ? "" : "s"} found`;
        for (let i = 0; i < invalid_flags.length; i++) {
            let $_li = document.createElement("li");
            $_li.textContent = `${invalid_flags[i][0]} (line: ${invalid_flags[i][1]})`;
            $diaErrorsList.insertAdjacentElement("beforeend", $_li);
        }
    }
    else {
        $errorsOutput.dataset.hidden = "";
        $btnErrors.textContent = "Errors (0)";
        $outputErrors.textContent = "";
    }
    if (invalid_flags.length > 0 && !$chkConfigIgnoreErrors.checked) {
        delete $diaErrors.dataset.hidden;
    }
    else {
        // we want the flags to go in some kind of order
        let flags_sort = {};
        Object.keys(flags_unsort).sort()
            .forEach((key) => {
            flags_sort[key] = flags_unsort[key];
        });
        for (let key in flags_sort) {
            if (flags_sort.hasOwnProperty(key)) {
                flags_output += `${key}: ${flags_sort[key]}\n`;
            }
        }
        if ($chkConfigOutputInput.checked) {
            $output.textContent = `${lines.join("\n")}\n${flags_output}\n`;
        }
        else {
            $output.textContent = flags_output;
        }
        delete $diaOutput.dataset.hidden;
    }
});
//# sourceMappingURL=index.js.map