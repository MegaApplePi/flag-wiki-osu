import L10n from "./L10n";

declare const $: any;

//#region DOM
const COOKIES_IS_ENABLED = navigator.cookieEnabled;

const $helpButton: HTMLDivElement = document.querySelector('[data-button="help"]') as HTMLDivElement;
const $exampleButton: HTMLDivElement = document.querySelector('[data-button="example"]') as HTMLDivElement;
const $configButton: HTMLDivElement = document.querySelector('[data-button="config"]') as HTMLDivElement;

const $configCountryTitleCheckbox: HTMLInputElement = document.querySelector('#config-country-title') as HTMLInputElement;
const $configCountryAltCheckbox: HTMLInputElement = document.querySelector('#config-country-alt') as HTMLInputElement;
const $configOutputInputCheckbox: HTMLInputElement = document.querySelector('#config-output-input') as HTMLInputElement;
const $configParsefixCheckbox: HTMLInputElement = document.querySelector('#config-parsefix') as HTMLInputElement;
const $configLanguageSelect: HTMLSelectElement = document.querySelector('#config-language') as HTMLSelectElement;
const CONFIG_SETTINGS = {
  get countryTitle(): boolean {
    return $configCountryTitleCheckbox.checked;
  },

  get countryAlt(): boolean {
    return $configCountryAltCheckbox.checked;
  },

  get outputInput(): boolean {
    return $configOutputInputCheckbox.checked;
  },

  get parsefix(): boolean {
    return $configParsefixCheckbox.checked;
  },

  get language(): string {
    return $configLanguageSelect.value;
  }
}

const $errorsButton: HTMLDivElement = document.querySelector('[data-button="errors"]') as HTMLDivElement;
const $errorsList: HTMLDivElement = document.querySelector("#errors-list") as HTMLDivElement;

const $parseButton: HTMLDivElement = document.querySelector('[data-button="parse"]') as HTMLDivElement;

const $inputTextarea: HTMLTextAreaElement = document.querySelector("#input") as HTMLTextAreaElement;
const $outputTextarea: HTMLTextAreaElement = document.querySelector("#output") as HTMLTextAreaElement;

const $outputHasErrors: HTMLSpanElement = document.querySelector("#output-has-errors") as HTMLSpanElement;
const $outputCopyButton: HTMLDivElement = document.querySelector('[data-button="output-copy"]') as HTMLDivElement;
//#endregion

let lanauages = L10n.getLangCodes();
for (let language of lanauages) {
  let $option: HTMLOptionElement = document.createElement("option");
  $option.setAttribute("value", language);
  $option.textContent = L10n.getLangName(language);

  $configLanguageSelect.insertAdjacentElement("beforeend", $option);
}

function updateInterfaceStrings(): void {
  const elements = [...document.body.querySelectorAll<HTMLSpanElement>("[data-l10n]")];
  for (const element of elements) {
    if (element.dataset.l10n) {
      element.textContent = L10n.getInterfaceString(element.dataset.l10n);
    }
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
  if (localStorage.getItem("parsefix") === "true") {
    $configParsefixCheckbox.checked = true;
  }
}

try {
  $configLanguageSelect.querySelector<HTMLOptionElement>(`option[value="${localStorage.getItem("output-language")}"]`)?.setAttribute("selected", "");

  let outputLanguage = localStorage.getItem("output-language")
  if (outputLanguage) {
    L10n.setLang(outputLanguage);
  } else {
    $configLanguageSelect.querySelector<HTMLOptionElement>('option[value="en"]')?.setAttribute("selected", "");
    L10n.setLang("en");
  }
} finally {
  updateInterfaceStrings();
}

// everything should be ready at this point, so we'll enable the buttons
$helpButton.removeAttribute("disabled");
$exampleButton.removeAttribute("disabled");
$configButton.removeAttribute("disabled");
$parseButton.removeAttribute("disabled");
$inputTextarea.removeAttribute("disabled");

const FLAG_CODES = Object.freeze(L10n.getFlagCodes());

//#region config events
function $configCountryAltCheckbox_change(): void {
  if (CONFIG_SETTINGS.countryAlt) {
    $configOutputInputCheckbox.checked = true;
    $configOutputInputCheckbox.disabled = true;
  } else {
    if (!CONFIG_SETTINGS.parsefix) {
      $configOutputInputCheckbox.checked = false;
      $configOutputInputCheckbox.disabled = false;
    }
  }
}
$configCountryAltCheckbox.addEventListener("change", $configCountryAltCheckbox_change);

function $configParseFixCheckbox_change(): void {
  if (CONFIG_SETTINGS.parsefix) {
    $configOutputInputCheckbox.checked = true;
    $configOutputInputCheckbox.disabled = true;
  } else {
    if (!CONFIG_SETTINGS.countryAlt) {
      $configOutputInputCheckbox.checked = false;
      $configOutputInputCheckbox.disabled = false;
    }
  }
}
$configParsefixCheckbox.addEventListener("change", $configParseFixCheckbox_change);

// for checkboxes
function $config_change(event: Event): void {
  let target = event.target as HTMLInputElement;
  let targetName = target.dataset.checkbox;
  if (targetName) {
    if (target.checked) {
      localStorage.setItem(targetName, "true");
    } else {
      localStorage.setItem(targetName, "false");
    }
  }
}

// Do not set the config events if cookies are disabled (upon setting will prevent the site from functioning properly)
if (COOKIES_IS_ENABLED) {
  $configCountryTitleCheckbox.addEventListener("change", $config_change);
  $configCountryAltCheckbox.addEventListener("change", $config_change);
  $configOutputInputCheckbox.addEventListener("change", $config_change);
  $configParsefixCheckbox.addEventListener("change", $config_change);
}
function $configLanguageSelect_change(event: Event): void {
  let target = event.target as HTMLSelectElement;
  L10n.setLang(target.value);
  updateInterfaceStrings();

  if (COOKIES_IS_ENABLED) {
    localStorage.setItem("output-language", target.value);
  }
}
$configLanguageSelect.addEventListener("change", $configLanguageSelect_change);
//#endregion

function $exampleButton_click(): void {
  if (!$exampleButton.classList.contains("menu__button--disabled")) {
    $inputTextarea.value = L10n.getString("example") as string;
  }
}
$exampleButton.addEventListener("click", $exampleButton_click);

function $outputCopyButton_click(): void {
  if ($outputCopyButton.hasAttribute("disabled")) {
    return;
  }
  $outputCopyButton.querySelector('[data-l10n="copy"]')?.classList.remove("d-none");
  $outputCopyButton.querySelector('[data-l10n="copied"]')?.classList.add("d-none");
  $outputCopyButton.querySelector('[data-l10n="failed"]')?.classList.add("d-none");

  if ("clipboard" in navigator) {
    navigator.clipboard.writeText($outputTextarea.value)
    .then(() => {
      $outputCopyButton.setAttribute("disabled", "");
      $outputCopyButton.querySelector('[data-l10n="copied"]')?.classList.remove("d-none");
      $outputCopyButton.querySelector('[data-l10n="copy"]')?.classList.add("d-none");
    })
    .catch(() => {
      $outputCopyButton.setAttribute("disabled", "");
      $outputCopyButton.querySelector('[data-l10n="failed"]')?.classList.remove("d-none");
      $outputCopyButton.querySelector('[data-l10n="copy"]')?.classList.add("d-none");
    });
  } else {
    try {
      $outputTextarea.select();
      document.execCommand("copy");
      $outputCopyButton.setAttribute("disabled", "");
      $outputCopyButton.querySelector('[data-l10n="copied"]')?.classList.remove("d-none");
      $outputCopyButton.querySelector('[data-l10n="copy"]')?.classList.add("d-none");
    } catch {
      $outputCopyButton.setAttribute("disabled", "");
      $outputCopyButton.querySelector('[data-l10n="failed"]')?.classList.remove("d-none");
      $outputCopyButton.querySelector('[data-l10n="copy"]')?.classList.add("d-none");
    }
  }
  setTimeout(() => {
    $outputCopyButton.removeAttribute("disabled");
    $outputCopyButton.querySelector('[data-l10n="copy"]')?.classList.remove("d-none");
    $outputCopyButton.querySelector('[data-l10n="copied"]')?.classList.add("d-none");
    $outputCopyButton.querySelector('[data-l10n="failed"]')?.classList.add("d-none");
  }, 1000);
}
$outputCopyButton.addEventListener("click", $outputCopyButton_click);

//#region FileReader
function fileReader_load(ev: ProgressEvent<FileReader>): void {
  let text = ev.target?.result;
  if (text) {
    $inputTextarea.value = text.toString();
  }
}
function window_drop(ev: DragEvent): void {
  let fileReader = new FileReader();
  fileReader.addEventListener("load", fileReader_load);
  ev.preventDefault();
  let file = ev.dataTransfer?.files[0];
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
function $parseButton_click(): void {
  while ($errorsList.firstChild) {
    $errorsList.firstChild.remove();
  }

  let lines = $inputTextarea.value.split("\n");
  let flags_list = new Map();
  let flags_output = "";
  let invalid_flags = [];
  let replacementData: {
    0: number,
    1: RegExpExecArray,
    2: string
  }[] = [];

  // Inspect all lines
  for (let i = 0; i < lines.length; i++) {
    let inputRegex = /!\[([^\]]*?)\](\[flag_(.*?)\]|\(\/wiki\/shared\/flag\/(.*?)\.gif(?: ".*?")?\))/g;
    let inputRegexMatch: RegExpExecArray|null;
    while ((inputRegexMatch = inputRegex.exec(lines[i])) != null) {
      let countryCode: string;
      if (inputRegexMatch[3]) {
        countryCode = inputRegexMatch[3].toUpperCase();
      } else {
        countryCode = inputRegexMatch[4].toUpperCase();
      }
      if (!FLAG_CODES.includes(countryCode)) {
        let solution: string;

        switch(countryCode) {
          case "BV":
            solution = `NO`;
          break;
          case "FX":
            solution = `FR`;
          break;
          case "UM":
            solution = `US`;
            break;
          default:
            solution = `__`;
          break;
        }
        invalid_flags.push([countryCode, (i + 1), solution]);

        if (CONFIG_SETTINGS.parsefix) {
          countryCode = solution;
        }
      }

      // the replacements need to be done in reverse
      replacementData.unshift([i, inputRegexMatch, countryCode]);

      let newKey = makeReference(countryCode);
      if (CONFIG_SETTINGS.countryTitle) {
        if (countryCode === "__") {
          flags_list.set(newKey, "/wiki/shared/flag/__.gif");
        } else {
          let countryName = L10n.getCountryName(countryCode);
          flags_list.set(newKey, `/wiki/shared/flag/${countryCode}.gif "${countryName ? countryName : "FLAG_NOT_FOUND"}"`);
        }
      } else {
        flags_list.set(newKey, `/wiki/shared/flag/${countryCode}.gif`);
      }
    }
  }

  // Run the replacements
  replacementData.forEach((value) => {
    let replacementValue: string;

    if (CONFIG_SETTINGS.countryAlt) {
      if (value[2] === "__") {
        replacementValue = `![]${makeReference(value[2])}`;
      } else {
        replacementValue = `![${value[2]}]${makeReference(value[2])}`;
      }
    } else {
      replacementValue = `![]${makeReference(value[2])}`;
    }

    lines[value[0]] = `${lines[value[0]].substring(0, value[1].index)}${replacementValue}${lines[value[0]].substring(value[1].index + value[1][0].length, lines[value[0]].length)}`;
  });

  if (invalid_flags.length > 0) {
    $errorsButton.removeAttribute('disabled');

    if (CONFIG_SETTINGS.parsefix) {
      $outputHasErrors.textContent = L10n.getInterfaceString("output-has-fixes");

      for (let i = 0; i < invalid_flags.length; i++) {
        let $_li = document.createElement("li");
        $_li.innerHTML = `${L10n.getInterfaceString("line")} ${invalid_flags[i][1]}: <code>${invalid_flags[i][0]}</code> &rarr; <code>${invalid_flags[i][2]}</code>`;
        $errorsList.insertAdjacentElement("beforeend", $_li);
      }
    } else {
      $outputHasErrors.textContent = L10n.getInterfaceString("output-has-errors");
      
      for (let i = 0; i < invalid_flags.length; i++) {
        let $_li = document.createElement("li");
        $_li.innerHTML = `<code>${invalid_flags[i][0]}</code> &mdash; ${L10n.getInterfaceString("line")} ${invalid_flags[i][1]} (${L10n.getInterfaceString("use-instead")} <code>${invalid_flags[i][2]}</code>)`;
        $errorsList.insertAdjacentElement("beforeend", $_li);
      }
    }
  } else {
    $errorsButton.setAttribute('disabled', '');
    $outputHasErrors.textContent = "";
  }

  flags_list = new Map([...flags_list.entries()].sort());
  flags_list.forEach((value, key) => {
    flags_output += `${key}: ${value}\n`;
  });
  if (CONFIG_SETTINGS.outputInput) {
    $outputTextarea.textContent = `${lines.join("\n")}\n${flags_output}`;
  } else {
    $outputTextarea.textContent = flags_output;
  }
  $('#output-modal').modal("show");
}
$parseButton.addEventListener("click", $parseButton_click);
//#endRegion
