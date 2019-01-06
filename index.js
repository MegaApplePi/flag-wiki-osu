(function() {
  "use strict";
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
  } else {
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

  const $parse = document.querySelector("[data-button=\"parse\"]");

  const $input = document.querySelector("#input");

  const $output = document.querySelector("#output");
  const $outputErrors = document.querySelector("#output-errors");
  const $diaOutput = document.querySelector("[data-dialog=\"output\"]");
  const $btnOutputClose = document.querySelector("[data-button=\"output-close\"]");

  /* flags list */
  const FLAGS = Object.freeze({
    "AD": "Andorra",
    "AE": "United Arab Emirates",
    "AF": "Afghanistan",
    "AG": "Antigua and Barbuda",
    "AI": "Anguilla",
    "AL": "Albania",
    "AM": "Armenia",
    "AN": "Netherlands Antilles",
    "AO": "Angola",
    "AR": "Argentina",
    "AS": "American Samoa",
    "AT": "Austria",
    "AU": "Australia",
    "AW": "Aruba",
    "AX": "Åland Islands",
    "AZ": "Azerbaijan",

    "BA": "Bosnia and Herzegovina",
    "BB": "Barbados",
    "BD": "Bangladesh",
    "BE": "Belgium",
    "BF": "Burkina Faso",
    "BG": "Bulgaria",
    "BH": "Bahrain",
    "BI": "Burundi",
    "BJ": "Benin",
    "BL": "Saint Barthélemy",
    "BM": "Bermuda",
    "BN": "Brunei Darussalam",
    "BO": "Bolivia", // "BO": "Plurinational State of Bolivia",
    // "BQ": "Bonaire, Sint Eustatius and Saba",
    "BR": "Brazil",
    "BS": "Bahamas",
    "BT": "Bhutan",
    // "BV": "Bouvet Island",
    "BW": "Botswana",
    "BY": "Belarus",
    "BZ": "Belize",

    "CA": "Canada",
    // "CC": "Cocos (Keeling) Islands",
    "CD": "Democratic Republic of the Congo",
    "CF": "Central African Republic",
    "CG": "Congo",
    "CH": "Switzerland",
    "CI": "Côte d'Ivoire",
    // "CK": "Cook Islands",
    "CL": "Chile",
    "CM": "Cameroon",
    "CN": "China",
    "CO": "Colombia",
    "CR": "Costa Rica",
    "CU": "Cuba",
    "CV": "Cabo Verde",
    // "CW": "Curaçao",
    "CX": "Christmas Island",
    "CY": "Cyprus",
    "CZ": "Czechia",

    "DE": "Germany",
    "DJ": "Djibouti",
    "DK": "Denmark",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "DZ": "Algeria",

    "EC": "Ecuador",
    "EE": "Estonia",
    "EG": "Egypt",
    // "EH": "Western Sahara",
    "ER": "Eritrea",
    "ES": "Spain",
    "ET": "Ethiopia",
    "EU": "European Union",

    "FI": "Finland",
    "FJ": "Fiji",
    "FK": "Falkland Islands", // "FK": "Falkland Islands (Malvinas)",
    "FM": "Federated States of Micronesia",
    "FO": "Faroe Islands",
    "FR": "France",

    "GA": "Gabon",
    "GB": "United Kingdom",
    "GD": "Grenada",
    "GE": "Georgia",
    "GF": "French Guiana",
    "GG": "Guernsey",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GL": "Greenland",
    "GM": "Gambia",
    "GN": "Guinea",
    "GP": "Guadeloupe",
    "GQ": "Equatorial Guinea",
    "GR": "Greece",
    // "GS": "South Georgia and the South Sandwich Islands",
    "GT": "Guatemala",
    "GU": "Guam",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",

    "HK": "Hong Kong",
    "HM": "Heard Island and McDonald Islands",
    "HN": "Honduras",
    "HR": "Croatia",
    "HT": "Haiti",
    "HU": "Hungary",

    "ID": "Indonesia",
    "IE": "Ireland",
    "IL": "Israel",
    "IM": "Isle of Man",
    "IN": "India",
    // "IO": "British Indian Ocean Territory",
    "IQ": "Iraq",
    "IR": "Iran", // "IR": "Islamic Republic of Iran",
    "IS": "Iceland",
    "IT": "Italy",

    "JE": "Jersey",
    "JM": "Jamaica",
    "JO": "Jordan",
    "JP": "Japan",

    "KE": "Kenya",
    "KG": "Kyrgyzstan",
    "KH": "Cambodia",
    "KI": "Kiribati",
    "KM": "Comoros",
    "KN": "Saint Kitts and Nevis",
    "KP": "North Korea", // "KP": "Democratic People's Republic of Korea",
    "KR": "South Korea", // "KR": "Republic of Korea",
    "KW": "Kuwait",
    "KY": "Cayman Islands",
    "KZ": "Kazakhstan",

    "LA": "Laos", // "LA": "Lao People's Democratic Republic",
    "LB": "Lebanon",
    "LC": "Saint Lucia",
    "LI": "Liechtenstein",
    "LK": "Sri Lanka",
    "LR": "Liberia",
    "LS": "Lesotho",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "LV": "Latvia",
    "LY": "Libya",

    "MA": "Morocco",
    "MC": "Monaco",
    "MD": "Moldova", // "MD": "Republic of Moldova",
    "ME": "Montenegro",
    "MF": "Saint Martin", // "MF": "Collectivity of Saint Martin",
    "MG": "Madagascar",
    "MH": "Marshall Islands",
    "MK": "Macedonia", // "MK": "Republic of Macedonia",
    "ML": "Mali",
    "MM": "Myanmar",
    "MN": "Mongolia",
    "MO": "Macao",
    "MP": "Northern Mariana Islands",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MS": "Montserrat",
    "MT": "Malta",
    "MU": "Mauritius",
    "MV": "Maldives",
    "MW": "Malawi",
    "MX": "Mexico",
    "MY": "Malaysia",
    "MZ": "Mozambique",

    "NA": "Namibia",
    "NC": "New Caledonia",
    "NE": "Niger",
    "NF": "Norfolk Island",
    "NG": "Nigeria",
    "NI": "Nicaragua",
    "NL": "Netherlands",
    "NO": "Norway",
    "NP": "Nepal",
    "NR": "Nauru",
    "NU": "Niue",
    "NZ": "New Zealand",

    "OM": "Oman",

    "PA": "Panama",
    "PE": "Peru",
    "PF": "French Polynesia",
    "PG": "Papua New Guinea",
    "PH": "Philippines",
    "PK": "Pakistan",
    "PL": "Poland",
    "PM": "Saint Pierre and Miquelon",
    "PN": "Pitcairn",
    "PR": "Puerto Rico",
    "PS": "Palestine, State of",
    "PT": "Portugal",
    "PW": "Palau",
    "PY": "Paraguay",

    "QA": "Qatar",

    "RE": "Réunion",
    "RO": "Romania",
    "RS": "Serbia",
    "RU": "Russian Federation",
    "RW": "Rwanda",

    "SA": "Saudi Arabia",
    "SB": "Solomon Islands",
    "SC": "Seychelles",
    "SD": "Sudan",
    "SE": "Sweden",
    "SG": "Singapore",
    "SH": "Saint Helena, Ascension and Tristan da Cunha",
    "SI": "Slovenia",
    "SJ": "Svalbard and Jan Mayen",
    "SK": "Slovakia",
    "SL": "Sierra Leone",
    "SM": "San Marino",
    "SN": "Senegal",
    "SO": "Somalia",
    "SR": "Suriname",
    "SS": "South Sudan",
    "ST": "Sao Tome and Principe",
    "SV": "El Salvador",
    // "SX": "Sint Maarten",
    "SY": "Syrian Arab Republic",
    "SZ": "Swaziland",

    "TC": "Turks and Caicos Islands",
    "TD": "Chad",
    // "TF": "French Southern Territories",
    "TG": "Togo",
    "TH": "Thailand",
    "TJ": "Tajikistan",
    "TK": "Tokelau",
    "TL": "Timor-Leste",
    "TM": "Turkmenistan",
    "TN": "Tunisia",
    "TO": "Tonga",
    "TR": "Turkey",
    "TT": "Trinidad and Tobago",
    "TV": "Tuvalu",
    "TW": "Taiwan",
    "TZ": "United Republic of Tanzania", // "TZ": "Tanzania",

    "UA": "Ukraine",
    "UG": "Uganda",
    // "UM": "United States Minor Outlying Islands",
    "US": "United States",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",

    "VA": "Vatican City",
    "VC": "Saint Vincent and the Grenadines",
    "VE": "Venezuela",
    "VG": "British Virgin Islands",
    "VI": "United States Virgin Islands",
    "VN": "Vietnam",
    "VU": "Vanuatu",

    // "WF": "Wallis and Futuna",
    "WS": "Samoa",

    "XK": "Kosovo", // "XK": "Republic of Kosovo",

    "YE": "Yemen",
    "YT": "Mayotte",

    "ZA": "South Africa",
    "ZM": "Zambia",
    "ZW": "Zimbabwe",

    /* combined flags */
    "ARCO": "Argentina-Colombia",
    "BRCL": "Brazil-Chile",
    "CZPL": "Czechia-Poland",
    "DKNO": "Denmark-Norway",
    "ITNL": "Italy-Netherlands",
    "RUUA": "Russian Federation-Ukraine",
    "SVVE": "El Salvador-Venezuela",
    "__": "NO_FLAG"
  });
  const FLAG_CODES = Object.freeze(Object.keys(FLAGS));

  /* help events */
  function $btnHelp_click() {
    delete $diaHelp.dataset.hidden;
  }
  $btnHelp.addEventListener("click", $btnHelp_click);

  function $btnHelpClose_click() {
    $diaHelp.dataset.hidden = "";
  }
  $btnHelpClose.addEventListener("click", $btnHelpClose_click);

  /* config events */
  function $btnConfig_click() {
    delete $diaConfig.dataset.hidden;
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
    } else {
      $chkConfigOutputInput.checked = false;
      $chkConfigOutputInput.disabled = false;
    }
  }
  $chkConfigCountryAlt.addEventListener("change", $chkConfigCountryAlt_change);

  function $$config_change(e) {
    let targetName = e.target.dataset.checkbox;
    if (e.target.checked) {
      localStorage.setItem(targetName, "true");
    } else {
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
    $input.value = "# Example Tournament XXYY\n\n![World Cup XXYY](logo.jpg)\n\nThe Example Tournament XXYY (*ET XXYY*) is not a real tournament because this is an example. It is the first and last installment for flag-wiki-osu.\n\n## Tournament schedule\n\nTo be announced.\n\n## Organisation\n\nThe Example Tournament XXYY is ran by various community members by distributing the multitude of tasks into various fields of responsibility.\n\n### Tournament management\n\n-   ![][flag_DE] [Loctav](/users/71366)\n-   ![][flag_DE] [p3n](/users/123703)\n-   ![ES][flag_ES] [Deif](/users/318565)\n-   ![][flag_FR] [shARPII](/users/776257)\n\n### Map selectors\n\n-   ![][flag_JP] [Asahina Momoko](/users/3650145)\n-   ![][flag_DE] [Okorin](/users/1623405)\n-   ![][flag_HK] [Skystar](/users/873961)\n\n### Commentators\n\n-   ![][flag_AU] [Bauxe](/users/1881685)\n-   ![][flag_US] [Daikyi](/users/811832)\n-   ![][flag_NZ] [deadbeat](/users/128370)\n-   ![][flag_GB] [Doomsday](/users/18983)\n-   ![](/wiki/shared/flag/CA.gif) [Evrien](/users/791660)\n-   ![][flag_AR] [juankristal](/users/443656)\n-   ![](/wiki/shared/flag/AT.gif \"Austria\") [Omgforz](/users/578943)\n-   ![][flag_GB] [Rime](/users/1397232)\n-   ![][flag_FR] [Slainv](/users/4823843)\n-   ![][flag_US] [ztrot](/users/6347)\n\n### Statistician\n\n-   ![][flag_NZ] [deadbeat](/users/128370)\n-   ![][flag_DE] [Nwolf](/users/1910766)\n";
  }
  $btnExample.addEventListener("click", $btnExample_click);

  /* error events */
  function $btnErrors_click() {
    delete $diaErrors.dataset.hidden;
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

  $parse.addEventListener("click", () => {
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
            } else if (countryCode.length === 4) {
              ext = ".png";
            }
            let newKey = key[j].replace(key[j], getNewKey);
            if (!FLAG_CODES.includes(countryCode)) {
              invalid_flags.push([countryCode, (i + 1)]);
            }
            // parse with broken flags anyways
            if ($chkConfigCountryTitle.checked) {
              flags_unsort[newKey] = `/wiki/shared/flag/${countryCode}${ext} "${FLAGS[countryCode] ? FLAGS[countryCode] : "NOT_FOUND"}"`;
            } else {
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
            } else if (countryCode.length === 4) {
              ext = ".png";
            }
            let newKey = key[j].replace(key[j], getNewKey);
            if (!FLAG_CODES.includes(countryCode)) {
              invalid_flags.push([countryCode, (i + 1)]);
            }
            // parse with broken flags anyways
            if ($chkConfigCountryTitle.checked) {
              flags_unsort[newKey] = `/wiki/shared/flag/${countryCode}${ext} "${FLAGS[countryCode] ? FLAGS[countryCode] : "NOT_FOUND"}"`;
            } else {
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
        $diaErrorsList.insertAdjacentElement("beforeEnd", $_li);
      }
    } else {
      $errorsOutput.dataset.hidden = "";
      $btnErrors.textContent = "Errors (0)";
      $outputErrors.textContent = "";
    }

    if (invalid_flags.length > 0 && !$chkConfigIgnoreErrors.checked) {
      delete $diaErrors.dataset.hidden;
    } else {
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
      } else {
        $output.textContent = flags_output;
      }
      delete $diaOutput.dataset.hidden;
    }
  });
})();
