(function() {
  "use strict";
  /* DOM */
  const $btnHelp = document.querySelector("[data-button=\"help\"]");
  const $diaHelp = document.querySelector("[data-dialog=\"help\"]");
  const $btnHelpClose = document.querySelector("[data-button=\"help-close\"]");

  const $btnExample = document.querySelector("[data-button=\"example\"]");

  // const $config = document.querySelector("[data-button=\"config\"]");

  const $btnErrors = document.querySelector("[data-button=\"errors\"]");
  const $diaErrors = document.querySelector("[data-dialog=\"errors\"]");
  const $btnErrorsClose = document.querySelector("[data-button=\"errors-close\"]");
  const $diaErrorsList = document.querySelector("#errors-list");

  const $parse = document.querySelector("[data-button=\"parse\"]");

  const $input = document.querySelector("#input");

  const $output = document.querySelector("#output");
  const $diaOutput = document.querySelector("[data-dialog=\"output\"]");
  const $btnOutputClose = document.querySelector("[data-button=\"output-close\"]");

  /* flags list */
  const FLAGS = Object.freeze([
    "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AN", "AO", "AR", "AS", "AT", "AU", "AW", "AX", "AZ",
    "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BM", "BN", "BO", "BR", "BS", "BT", "BV", "BW", "BY", "BZ",
    "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CS", "CU", "CV", "CX", "CY", "CZ",
    "DE", "DJ", "DK", "DM", "DO", "DZ",
    "EC", "EE", "EG", "EH", "ER", "ES", "ET",
    "FI", "FJ", "FK", "FM", "FO", "FR",
    "GA", "GB", "GD", "GE", "GF", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY",
    "HK", "HM", "HN", "HR", "HT", "HU",
    "ID", "IE", "IL", "IN", "IO", "IQ", "IR", "IS", "IT",
    "JM", "JO", "JP",
    "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ",
    "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY",
    "MA", "MC", "MD", "ME", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ",
    "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ",
    "OM",
    "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY",
    "QA",
    "RE", "RO", "RS", "RU", "RW",
    "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "ST", "SV", "SY", "SZ",
    "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ",
    "UA", "UG", "UM", "US", "UY", "UZ",
    "VA", "VC", "VE", "VG", "VI", "VN", "VU",
    "WF", "WS",
    "YE", "YT",
    "ZA", "ZM", "ZW",
    "BRCL", "ITNL",
  ]);

  /* help events */
  function $btnHelp_click() {
    delete $diaHelp.dataset.hidden;
  }
  $btnHelp.addEventListener("click", $btnHelp_click);

  function $btnHelpClose_click() {
    $diaHelp.dataset.hidden = "";
  }
  $btnHelpClose.addEventListener("click", $btnHelpClose_click);

  /* example events */
  function $btnExample_click() {
    $input.value = "# Example Tournament XXYY\n\n![World Cup XXYY](logo.jpg)\n\nThe Example Tournament XXYY (*ET XXYY*) is not a real tournament because this is an example. It is the first and last installment for `flag-wiki-osu`.\n\n## Tournament schedule\n\nTo be announced.\n\n## Organisation\n\nThe Example Tournament XXYY is ran by various community members by distributing the multitude of tasks into various fields of responsibility.\n\n### Tournament management\n\n-   ![][flag_DE] [Loctav](/users/71366)\n-   ![][flag_DE] [p3n](/users/123703)\n-   ![][flag_ES] [Deif](/users/318565)\n-   ![][flag_FR] [shARPII](/users/776257)\n\n### Map selectors\n\n-   ![][flag_JP] [Asahina Momoko](/users/3650145)\n-   ![][flag_DE] [Okorin](/users/1623405)\n-   ![][flag_HK] [Skystar](/users/873961)\n\n### Commentators\n\n-   ![][flag_AU] [Bauxe](/users/1881685)\n-   ![][flag_US] [Daikyi](/users/811832)\n-   ![][flag_NZ] [deadbeat](/users/128370)\n-   ![][flag_GB] [Doomsday](/users/18983)\n-   ![][flag_CA] [Evrien](/users/791660)\n-   ![][flag_AR] [juankristal](/users/443656)\n-   ![][flag_AT] [Omgforz](/users/578943)\n-   ![][flag_GB] [Rime](/users/1397232)\n-   ![][flag_FR] [Slainv](/users/4823843)\n-   ![][flag_US] [ztrot](/users/6347)\n\n### Statistician\n\n-   ![][flag_NZ] [deadbeat](/users/128370)\n-   ![][flag_DE] [Nwolf](/users/1910766)\n";
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
  // TODO ParseFlags shouldn't be a class
  class ParseFlags {
    newKey(text) {
      let key_text1 = text.match(/_..(?:..)?\]/)[0];
      let key_text2 = key_text1.substring(1, (key_text1.length - 1));
      return `[flag_${key_text2.toUpperCase()}]`;
    }

    fixLink(text) {
      let link2 = text.match(/\/..(?:..)?\./)[0];
      let link3 = link2.substring(1, (link2.length - 1));
      let ext = text.substring(text.lastIndexOf("."), text.length);
      return `/flag/${link3.toUpperCase()}${ext}`;
    }

    fixRef(text) {
      let ref2 = text.match(/_..(?:..)?\]/)[0];
      let ref3 = ref2.substring(1, (ref2.length - 1));
      return `[flag_${ref3.toUpperCase()}]`;
    }
  }

  $parse.addEventListener("click", () => {
    while ($diaErrorsList.firstChild) {
      $diaErrorsList.firstChild.remove();
    }

    let patch = new ParseFlags();

    let lines = $input.value.split("\n");
    let flags_unsort = {};
    let flags_output = "";
    let invalid_flags = [];
    for (let i = 0; i < lines.length; i++) {
      if (/!\[\]\[flag_..(?:..)?\]/g.test(lines[i])) {
        let key = lines[i].match(/\[flag_..(?:..)?\]/g);
        if (key) {
          for (let j = 0; j < key.length; j++) {
            let name1 = key[j].match(/_..(?:..)?\]/g)[0];
            let name2 = name1.substring(1, (name1.length - 1)).toUpperCase();
            let ext;
            if (name2.length === 2) {
              ext = ".gif";
            } else if (name2.length === 4) {
              ext = ".png";
            }
            let newKey = key[j].replace(key[j], patch.newKey);
            flags_unsort[newKey] = `/wiki/shared/flag/${name2}${ext}`;
            if (!FLAGS.includes(name2)) {
              invalid_flags.push([name2, (i + 1)]);
            }
          }
        }
      }
      let link1 = lines[i].match(/\/flag\/..(?:..)?\.(gif|jpe?g|png)/g);
      if (link1) {
        for (let j = 0; j < link1.length; j++) {
          lines[i] = lines[i].replace(link1[j], patch.fixLink);
        }
      }
      let ref1 = lines[i].match(/\[flag_..(?:..)?\]/g);
      if (ref1) {
        for (let j = 0; j < ref1.length; j++) {
          lines[i] = lines[i].replace(ref1[j], patch.fixRef);
        }
      }
    }
    if (invalid_flags.length > 0) {
      $btnErrors.textContent = `Errors (${invalid_flags.length})`;
      for (let i = 0; i < invalid_flags.length; i++) {
        let $_li = document.createElement("li");
        $_li.textContent = `${invalid_flags[i][0]} (line: ${invalid_flags[i][1]})`;
        $diaErrorsList.insertAdjacentElement("beforeEnd", $_li);
      }
    } else {
      $btnErrors.textContent = "Errors (0)";
    }
    lines = lines.join("\n");
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
    // TEMP need to create a dialog to output results (just results)
    // $input.value = lines + "\n" + flags_output;
    $output.textContent = flags_output;
    delete $diaOutput.dataset.hidden;
  });
})();
