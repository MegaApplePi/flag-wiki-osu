import L10n from "./L10n.js";

declare const $: any;

//#region DOM
const COOKIES_IS_ENABLED = navigator.cookieEnabled;

const $helpButton: HTMLDivElement = document.querySelector('[data-button="help"]');
const $exampleButton: HTMLDivElement = document.querySelector('[data-button="example"]');
const $configButton: HTMLDivElement = document.querySelector('[data-button="config"]');

const $configCountryTitleCheckbox: HTMLInputElement = document.querySelector('#config-country-title');
const $configCountryAltCheckbox: HTMLInputElement = document.querySelector('#config-country-alt');
const $configOutputInputCheckbox: HTMLInputElement = document.querySelector('#config-output-input');
const $configLanguageSelect: HTMLSelectElement = document.querySelector('#config-language');

const $errorsButton: HTMLDivElement = document.querySelector('[data-button="errors"]');
const $errorsList: HTMLDivElement = document.querySelector("#errors-list");

const $parseButton: HTMLDivElement = document.querySelector('[data-button="parse"]');

const $inputTextarea: HTMLTextAreaElement = document.querySelector("#input");
const $outputTextarea: HTMLTextAreaElement = document.querySelector("#output");

const $outputHasErrors: HTMLSpanElement = document.querySelector("#output-has-errors");
const $outputCopyButton: HTMLDivElement = document.querySelector('[data-button="output-copy"]');
//#endregion

let lanauages = L10n.getLangCodes();
for (let language of lanauages) {
  let $option: HTMLOptionElement = document.createElement("option");
  $option.setAttribute("value", language);
  $option.textContent = L10n.getLangName(language);

  $configLanguageSelect.insertAdjacentElement("beforeend", $option);
}

function updateInterfaceStrings() {
  const elements = [...document.body.querySelectorAll<HTMLSpanElement>("[data-l10n]")];
  for (const element of elements) {
    element.textContent = L10n.getInterfaceString(element.dataset.l10n);
  }
}

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
}

try {
  $configLanguageSelect.querySelector<HTMLOptionElement>(`option[value="${localStorage.getItem("output-language")}"]`).setAttribute("selected", "");
  L10n.setLang(localStorage.getItem("output-language"));
} catch {
  $configLanguageSelect.querySelector<HTMLOptionElement>('option[value="en"]').setAttribute("selected", "");
  L10n.setLang("en");
} finally {
  updateInterfaceStrings();
}

// everything should be ready at this point, so we'll enable the buttons
$helpButton.removeAttribute("disabled");
$exampleButton.removeAttribute("disabled");
$configButton.removeAttribute("disabled");
$parseButton.removeAttribute("disabled");
$inputTextarea.removeAttribute("disabled");

const FLAGS = L10n.getString("flag") as string[];
const FLAG_CODES = Object.freeze(Object.keys(FLAGS));

//#region config events
function $configCountryAltCheckbox_change() {
  if ($configCountryAltCheckbox.checked) {
    $configOutputInputCheckbox.checked = true;
    $configOutputInputCheckbox.disabled = true;
  } else {
    $configOutputInputCheckbox.checked = false;
    $configOutputInputCheckbox.disabled = false;
  }
}
$configCountryAltCheckbox.addEventListener("change", $configCountryAltCheckbox_change);

// for checkboxes
function $config_change(event: Event) {
  let target = event.target as HTMLInputElement;
  let targetName = target.dataset.checkbox;
  if (target.checked) {
    localStorage.setItem(targetName, "true");
  } else {
    localStorage.setItem(targetName, "false");
    if (targetName === "country-alt") {
      localStorage.setItem("output-input", "false");
    }
  }
}

// Do not set the config events if cookies are disabled (upon setting will prevent the site from functioning properly)
if (COOKIES_IS_ENABLED) {
  $configCountryTitleCheckbox.addEventListener("change", $config_change);
  $configCountryAltCheckbox.addEventListener("change", $config_change);
  $configOutputInputCheckbox.addEventListener("change", $config_change);
}
function $configLanguageSelect_change(event: Event) {
  let target = event.target as HTMLSelectElement;
  L10n.setLang(target.value);
  updateInterfaceStrings();

  if (COOKIES_IS_ENABLED) {
    localStorage.setItem("output-language", target.value);
  }
}
$configLanguageSelect.addEventListener("change", $configLanguageSelect_change);
//#endregion

function $exampleButton_click() {
  if (!$exampleButton.classList.contains("menu__button--disabled")) {
    $inputTextarea.value = L10n.getString("example") as string;
  }
}
$exampleButton.addEventListener("click", $exampleButton_click);

function $outputCopyButton_click() {
  if ($outputCopyButton.hasAttribute("disabled")) {
    return;
  }
  $outputCopyButton.querySelector('[data-l10n="copy"]').classList.remove("d-none");
  $outputCopyButton.querySelector('[data-l10n="copied"]').classList.add("d-none");
  $outputCopyButton.querySelector('[data-l10n="failed"]').classList.add("d-none");

  if ("clipboard" in navigator) {
    navigator.clipboard.writeText($outputTextarea.value)
    .then(() => {
      $outputCopyButton.setAttribute("disabled", "");
      $outputCopyButton.querySelector('[data-l10n="copied"]').classList.remove("d-none");
  $outputCopyButton.querySelector('[data-l10n="copy"]').classList.add("d-none");
    })
    .catch(() => {
      $outputCopyButton.setAttribute("disabled", "");
      $outputCopyButton.querySelector('[data-l10n="failed"]').classList.remove("d-none");
  $outputCopyButton.querySelector('[data-l10n="copy"]').classList.add("d-none");
    });
  } else {
    try {
      $outputTextarea.select();
      document.execCommand("copy");
      $outputCopyButton.setAttribute("disabled", "");
      $outputCopyButton.querySelector('[data-l10n="copied"]').classList.remove("d-none");
  $outputCopyButton.querySelector('[data-l10n="copy"]').classList.add("d-none");
    } catch {
      $outputCopyButton.setAttribute("disabled", "");
      $outputCopyButton.querySelector('[data-l10n="failed"]').classList.remove("d-none");
  $outputCopyButton.querySelector('[data-l10n="copy"]').classList.add("d-none");
    }
  }
  setTimeout(() => {
    $outputCopyButton.removeAttribute("disabled");
    $outputCopyButton.querySelector('[data-l10n="copy"]').classList.remove("d-none");
    $outputCopyButton.querySelector('[data-l10n="copied"]').classList.add("d-none");
    $outputCopyButton.querySelector('[data-l10n="failed"]').classList.add("d-none");
  }, 1000);
}
$outputCopyButton.addEventListener("click", $outputCopyButton_click);

//#region FileReader
function fileReader_load(e): void {
  let text = e.target.result;
  if (text) {
    $inputTextarea.value = text;
  }
}
function window_drop(e): void {
  let fileReader = new FileReader();
  fileReader.addEventListener("load", fileReader_load);
  e.preventDefault();
  let file = e.dataTransfer.files[0];
  if (file && file.type === "text/markdown") {
    fileReader.readAsText(file);
  }
}
window.addEventListener("drop", window_drop);
//#endregion

//#region parsing
function makeReference(countryCode: string): string {
  return `[flag_${countryCode}]`;
}

// This is where most of the magic stays
function $parseButton_click() {
  while ($errorsList.firstChild) {
    $errorsList.firstChild.remove();
  }

  let lines = $inputTextarea.value.split("\n");
  let flags_list = new Map();
  let flags_output = "";
  let invalid_flags = [];
  let replacementData = [];

  // Inspect all lines
  for (let i = 0; i < lines.length; i++) {
    let inputRegex = /!\[([^\]]*?)\](\[flag_(.*?)\]|\(\/wiki\/shared\/flag\/(.*?)\.gif(?: ".*?")?\))/g;
    let inputRegexMatch: RegExpExecArray;
    while ((inputRegexMatch = inputRegex.exec(lines[i])) != null) {
      let countryCode: string;
      if (inputRegexMatch[3]) {
        countryCode = inputRegexMatch[3].toUpperCase();
      } else {
        countryCode = inputRegexMatch[4].toUpperCase();
      }
      if (!FLAG_CODES.includes(countryCode)) {
        invalid_flags.push([countryCode, (i + 1)]);
      }

      // the replacements need to be done in reverse
      replacementData.unshift([i, inputRegexMatch, countryCode]);

      let newKey = makeReference(countryCode);
      if ($configCountryTitleCheckbox.checked) {
        flags_list.set(newKey, `/wiki/shared/flag/${countryCode}.gif "${FLAGS[countryCode] ? FLAGS[countryCode] : "FLAG_NOT_FOUND"}"`);
      } else {
        flags_list.set(newKey, `/wiki/shared/flag/${countryCode}.gif`);
      }
    }
  }

  // Run the replacements
  replacementData.forEach((value) => {
    let replacementValue: string;

    if ($configCountryAltCheckbox.checked) {
      replacementValue = `![${value[2]}]${makeReference(value[2])}`;
    } else {
      replacementValue = `![]${makeReference(value[2])}`;
    }

    lines[value[0]] = `${lines[value[0]].substring(0, value[1].index)}${replacementValue}${lines[value[0]].substring(value[1].index + value[1][0].length, lines[value[0]].length)}`;
  });

  if (invalid_flags.length > 0) {
    $errorsButton.removeAttribute('disabled');
    $outputHasErrors.classList.remove("d-none");

    for (let i = 0; i < invalid_flags.length; i++) {
      let $_li = document.createElement("li");
      $_li.textContent = `${invalid_flags[i][0]} (line: ${invalid_flags[i][1]})`;
      $errorsList.insertAdjacentElement("beforeend", $_li);
    }
  } else {
    $errorsButton.setAttribute('disabled', '');
    $outputHasErrors.classList.add("d-none");
  }

  flags_list = new Map([...flags_list.entries()].sort());
  flags_list.forEach((value, key) => {
    flags_output += `${key}: ${value}\n`;
  });
  if ($configOutputInputCheckbox.checked) {
    $outputTextarea.textContent = `${lines.join("\n")}\n${flags_output}`;
  } else {
    $outputTextarea.textContent = flags_output;
  }
  $('#output-modal').modal("show");
}
$parseButton.addEventListener("click", $parseButton_click);
//#endRegion
