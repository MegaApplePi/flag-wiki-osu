import L10n from "./L10n.js";
//#region DOM
const $noCookieToast = document.querySelector('[data-toast="no-cookie"]');
const $noCookieTimer = document.querySelector('[data-toast="no-cookie"] [data-time]');
const COOKIES_IS_ENABLED = navigator.cookieEnabled;
const $helpButton = document.querySelector('[data-button="help"]');
const $exampleButton = document.querySelector('[data-button="example"]');
const $configButton = document.querySelector('[data-button="config"]');
const $configCountryTitleCheckbox = document.querySelector('#config-country-title');
const $configCountryAltCheckbox = document.querySelector('#config-country-alt');
const $configOutputInputCheckbox = document.querySelector('#config-output-input');
const $configLanguageSelect = document.querySelector('#config-language');
const $errorsButton = document.querySelector('[data-button="errors"]');
const $errorsList = document.querySelector("#errors-list");
const $parseButton = document.querySelector('[data-button="parse"]');
const $inputTextarea = document.querySelector("#input");
const $outputTextarea = document.querySelector("#output");
const $outputHasErrors = document.querySelector("#output-has-errors");
const $outputCopyButton = document.querySelector('[data-button="output-copy"]');
//#endregion
//#region create lanauage selector options
let lanauages = L10n.getLangCodes();
for (let lang of lanauages) {
    let $option = document.createElement("option");
    $option.setAttribute("value", lang);
    $option.textContent = L10n.getLangName(lang);
    $configLanguageSelect.insertAdjacentElement("beforeend", $option);
}
//#endregion
//#region update interface strings
function updateInterfaceStrings() {
    const elements = [...document.body.querySelectorAll("[data-l10n]")];
    for (const element of elements) {
        element.textContent = L10n.getInterfaceString(element.dataset.l10n);
        console.log(element.textContent);
    }
}
//#endregion
//#region restore options
if (COOKIES_IS_ENABLED) {
    if (localStorage.getItem("country-title") === "true") {
        $configCountryTitleCheckbox.checked = true;
    }
    if (localStorage.getItem("country-alt") === "true") {
        $configCountryAltCheckbox.checked = true;
        $configOutputInputCheckbox.checked = true;
        $configOutputInputCheckbox.disabled = true;
    }
    if (localStorage.getItem("output-input") === "true") {
        $configOutputInputCheckbox.checked = true;
    }
    try {
        $configLanguageSelect.querySelector(`option[value="${localStorage.getItem("output-language")}"]`).setAttribute("selected", "");
        L10n.setLang(localStorage.getItem("output-language"));
    }
    catch (_a) {
        $configLanguageSelect.querySelector('option[value="en"]').setAttribute("selected", "");
        L10n.setLang("en");
    }
    finally {
        updateInterfaceStrings();
    }
}
else {
    $noCookieToast.classList.remove("toast--hidden");
    let tick = 5;
    $noCookieTimer.textContent = `${tick} second${tick === 1 ? "" : "s"}`;
    let timer = window.setInterval(() => {
        tick--;
        $noCookieTimer.textContent = `${tick} second${tick === 1 ? "" : "s"}`;
        if (tick === 0) {
            $noCookieToast.dataset.hidden = "";
            window.clearInterval(timer);
        }
    }, 1000);
}
//#endregion
//#region enable interface
$helpButton.removeAttribute("disabled");
$exampleButton.removeAttribute("disabled");
$configButton.removeAttribute("disabled");
$parseButton.removeAttribute("disabled");
$inputTextarea.removeAttribute("disabled");
//#endregion
//#region get flags list from lang
const FLAGS = L10n.getString("flag");
const FLAG_CODES = Object.freeze(Object.keys(FLAGS));
//#endregion
//#region config events
function $chkConfigCountryAlt_change() {
    if ($configCountryAltCheckbox.checked) {
        $configOutputInputCheckbox.checked = true;
        $configOutputInputCheckbox.disabled = true;
    }
    else {
        $configOutputInputCheckbox.checked = false;
        $configOutputInputCheckbox.disabled = false;
    }
}
$configCountryAltCheckbox.addEventListener("change", $chkConfigCountryAlt_change);
// for checkboxes
function $config_change(event) {
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
// for language select
function $selConfigLanguage_change(event) {
    let target = event.target;
    localStorage.setItem("output-language", target.value);
}
// Do not set the config events if cookies are disabled (upon setting will prevent the site from functioning properly)
if (COOKIES_IS_ENABLED) {
    $configCountryTitleCheckbox.addEventListener("change", $config_change);
    $configCountryAltCheckbox.addEventListener("change", $config_change);
    $configOutputInputCheckbox.addEventListener("change", $config_change);
    $configLanguageSelect.addEventListener("change", $selConfigLanguage_change);
}
//#endregion
//#region example button events
function $btnExample_click() {
    if (!$exampleButton.classList.contains("menu__button--disabled")) {
        $inputTextarea.value = L10n.getString("example");
    }
}
$exampleButton.addEventListener("click", $btnExample_click);
//#endregion
/* output events */
function $btnOutputCopy_click() {
    if (!$outputCopyButton.classList.contains("menu__button--disabled")) {
        if ("clipboard" in navigator) {
            navigator.clipboard.writeText($outputTextarea.value)
                .then(() => {
                $outputCopyButton.classList.add("menu__button--disabled");
                $outputCopyButton.textContent = "Copied";
            })
                .catch(() => {
                $outputCopyButton.classList.add("menu__button--disabled");
                $outputCopyButton.textContent = "FAILED";
            });
        }
        else {
            try {
                $outputTextarea.select();
                document.execCommand("copy");
                $outputCopyButton.classList.add("menu__button--disabled");
                $outputCopyButton.textContent = "Copied";
            }
            catch (_a) {
                $outputCopyButton.classList.add("menu__button--disabled");
                $outputCopyButton.textContent = "FAILED";
            }
        }
    }
    setTimeout(() => {
        $outputCopyButton.classList.remove("menu__button--disabled");
        $outputCopyButton.textContent = "Copy";
    }, 1000);
}
$outputCopyButton.addEventListener("click", $btnOutputCopy_click);
/* drop events */
function fileReader_load(e) {
    let text = e.target.result;
    if (text) {
        $inputTextarea.value = text;
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
function makeReference(text) {
    return `[flag_${getCode(text)}]`;
}
function getReplacementLink(text) {
    let code = text.match(/\/..(?:..)?\./)[0];
    let codeFormatted = code.substring(1, (code.length - 1));
    return `[flag_${codeFormatted.toUpperCase()}]`;
}
$parseButton.addEventListener("click", () => {
    while ($errorsList.firstChild) {
        $errorsList.firstChild.remove();
    }
    let lines = $inputTextarea.value.split("\n");
    let flags_unsort = {};
    let flags_output = "";
    let invalid_flags = [];
    for (let i = 0; i < lines.length; i++) {
        /*   ref links                      inline links */
        if (/(!\[(.+)?\]\[flag_..(?:..)?\])|(\(\/wiki\/shared\/flag\/..(?:..)?\.(gif|jpe?g|png)(?: ".*")?\))/g.test(lines[i])) {
            let key = lines[i].match(/\[flag_..(?:..)?\]/g);
            if (key) {
                for (let j = 0; j < key.length; j++) {
                    let countryMatch = key[j].match(/_..(?:..)?\]/g)[0];
                    let countryCode = countryMatch.substring(1, (countryMatch.length - 1)).toUpperCase();
                    let ext;
                    if (countryCode.length === 2) {
                        ext = ".gif";
                    }
                    else if (countryCode.length === 4) {
                        ext = ".png";
                    }
                    let newKey = key[j].replace(key[j], makeReference);
                    if (!FLAG_CODES.includes(countryCode)) {
                        invalid_flags.push([countryCode, (i + 1)]);
                    }
                    // parse with broken flags anyways
                    if ($configCountryTitleCheckbox.checked) {
                        flags_unsort[newKey] = `/wiki/shared/flag/${countryCode}${ext} "${FLAGS[countryCode] ? FLAGS[countryCode] : "FLAG_NOT_FOUND"}"`;
                    }
                    else {
                        flags_unsort[newKey] = `/wiki/shared/flag/${countryCode}${ext}`;
                    }
                    if ($configCountryAltCheckbox.checked) {
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
                lines[i] = lines[i].replace(referenceName[j], makeReference);
            }
        }
    }
    if (invalid_flags.length > 0) {
        $errorsButton.removeAttribute('disabled');
        $outputHasErrors.classList.remove("d-none");
        for (let i = 0; i < invalid_flags.length; i++) {
            let $_li = document.createElement("li");
            $_li.textContent = `${invalid_flags[i][0]} (line: ${invalid_flags[i][1]})`;
            $errorsList.insertAdjacentElement("beforeend", $_li);
        }
    }
    else {
        $errorsButton.setAttribute('disabled', '');
        $outputHasErrors.classList.add("d-none");
    }
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
    if ($configOutputInputCheckbox.checked) {
        $outputTextarea.textContent = `${lines.join("\n")}\n${flags_output}`;
    }
    else {
        $outputTextarea.textContent = flags_output;
    }
    $('#output-modal').modal("show");
});
//# sourceMappingURL=index.js.map