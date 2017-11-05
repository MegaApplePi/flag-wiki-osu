/* globals document */
(function () {
  'use strict';
  const $help = document.querySelectorAll('x-help')[0];
  const $example = document.querySelectorAll('x-example')[0];
  const $accordionHelp = document.querySelectorAll('x-accordion[data-help]')[0];
  const $patch = document.querySelectorAll('x-patch')[0];
  const $input_text = document.querySelectorAll('x-input > textarea')[0];
  const $output_text = document.querySelectorAll('x-output > textarea')[0];
  const $error = document.querySelectorAll('x-error')[0];
  const $accordionError = document.querySelectorAll('x-accordion[data-error]')[0];
  const $accordionErrorUl = document.querySelectorAll('x-accordion[data-error] > ul')[0];

  const valid_flags = Object.freeze([
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

  document.body.addEventListener('click', function (e) {
    if (!$accordionHelp.hasAttribute('data-hidden')) {
      if (!e.path.includes($help) && !e.path.includes($accordionHelp)) {
        $accordionHelp.setAttribute('data-hidden', '');
        document.cookie = 'help_visted=true';
      }
    }
  });
  if (document.cookie.replace(/(?:(?:^|.*;\s*)help_visted\s*\=\s*([^;]*).*$)|^.*$/, "$1") === 'true') {
    $accordionHelp.setAttribute('data-hidden', '');
  }

  let output = "";

  const regex = Object.freeze({
    'newKey': function (text) {
      let key_text1 = text.match(/_..(?:..)?\]/)[0];
      let key_text2 = key_text1.substring(1, (key_text1.length - 1));
      return "[flag_" + key_text2.toUpperCase() + "]";
    },
    'fixLink': function (text) {
      let link2 = text.match(/\/..(?:..)?\./)[0];
      let link3 = link2.substring(1, (link2.length - 1));
      let ext = text.substring(text.lastIndexOf("."), text.length);
      return "/flag/" + link3.toUpperCase() + ext;
    },
    'fixRef': function (text) {
      let ref2 = text.match(/_..(?:..)?\]/)[0];
      let ref3 = ref2.substring(1, (ref2.length - 1));
      return "[flag_" + ref3.toUpperCase() + "]";
    }
  });
  $help.addEventListener('click', function () {
    if ($accordionHelp.hasAttribute('data-hidden')) {
      $accordionHelp.removeAttribute('data-hidden');
    } else {
      $accordionHelp.setAttribute('data-hidden', '');
      if (document.cookie.replace(/(?:(?:^|.*;\s*)help_visted\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== 'true') {
        document.cookie = 'help_visted=true';
      }
    }
  });
  $patch.addEventListener('click', function () {
    let lines = $input_text.value.split("\n");
    let flags_unsort = {};
    let flags_output = "";
    let invalid_flags_found = [];
    for (let i = 0; i < lines.length; i++) {
      if (/\!\[\]\[flag_..(?:..)?\]/g.test(lines[i])) {
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
            let newKey = key[j].replace(key[j], regex.newKey);
            flags_unsort[newKey] = "/wiki/shared/flag/" + name2 + ext;
            if (!valid_flags.includes(name2)) {
              invalid_flags_found.push([name2, (i + 1)]);
            }
          }
        }
      }
      let link1 = lines[i].match(/\/flag\/..(?:..)?\.(gif|jpe?g|png)/g);
      if (link1) {
        for (let j = 0; j < link1.length; j++) {
          lines[i] = lines[i].replace(link1[j], regex.fixLink);
        }
      }
      let ref1 = lines[i].match(/\[flag_..(?:..)?\]/g);
      if (ref1) {
        for (let j = 0; j < ref1.length; j++) {
          lines[i] = lines[i].replace(ref1[j], regex.fixRef);
        }
      }
    }
    while ($accordionErrorUl.firstChild) {
      $accordionErrorUl.removeChild($accordionErrorUl.firstChild);
    }
    if (invalid_flags_found.length > 0) {
      $error.textContent = "Errors (" + invalid_flags_found.length + ")";
      $accordionError.removeAttribute('data-hidden');
      for (let i = 0; i < invalid_flags_found.length; i++) {
        let error_output = invalid_flags_found[i][0] + " (line: " + invalid_flags_found[i][1] + ")";
        $accordionErrorUl.insertAdjacentHTML('beforeEnd', "<li>" + error_output + "</li>");
      }
    } else {
      $error.textContent = "Errors (0)";
      $accordionError.setAttribute('data-hidden', '');
      $accordionErrorUl.insertAdjacentHTML('beforeEnd', "<li>No errors found!</li>");
    }
    lines = lines.join('\n');
    let flags_sort = {};
    Object.keys(flags_unsort).sort().forEach(function (key) {
      flags_sort[key] = flags_unsort[key];
    });
    for (let key in flags_sort) {
      if (flags_sort.hasOwnProperty(key)) {
        flags_output += key + ": " + flags_sort[key] + "\n";
      }
    }
    $output_text.value = lines + "\n" + flags_output;
    output = $output_text.value;
  });
  $input_text.addEventListener('scroll', function () {
    $output_text.scrollTop = $input_text.scrollTop;
    $output_text.scrollLeft = $input_text.scrollLeft;
  });
  $output_text.addEventListener('scroll', function () {
    $input_text.scrollTop = $output_text.scrollTop;
    $input_text.scrollLeft = $output_text.scrollLeft;
  });
  $output_text.addEventListener('input', function (e) {
    this.value = output;
    return false;
  });

  $example.addEventListener('click', function () {
    $input_text.value = '# Example Tournament XX17\n\n![osu! World Cup XX17](logo.jpg)\n\nThe **Example Tournament XX17 (_ET XX17_)** is not a real tournament because this is an example. It is the 1st installment and test for `flag-osu`.\n\n## Tournament Schedule\n\n| Event              | Timestamp              |\n|--------------------|------------------------|\n| Registration Phase | Yesterday              |\n| Drawings           | Today                  |\n| Group Stage        | Tomorrow               |\n| Round of 16        | Next week              |\n| Quarterfinals      | After Round of 16      |\n| Semifinals         | When there are only 4  |\n| Finals - Week 1    | When there is a winner |\n| Finals - Week 2    | lol jk                 |\n\n## Prizes\n\nNo prizes (we\'re all winners).\n\n## Organization\n\nThe Example Tournament XX17 is ran by various community members by distributing the multitude of tasks into various fields of responsibility.\n\n### Tournament Management\n\n- ![][flag_DE] [Loctav](https://osu.ppy.sh/u/71366 "Loctav")\n- ![][flag_DE] [p3n](https://osu.ppy.sh/u/123703 "p3n")\n- ![][flag_ES] [Deif](https://osu.ppy.sh/u/318565 "Deif")\n- ![][flag_FR] [shARPII](https://osu.ppy.sh/u/776257 "shARPII")\n\n### Map Selectors\n\n- ![][flag_JP] [Asahina Momoko](https://osu.ppy.sh/u/3650145 "Asahina Momoko")\n- ![][flag_DE] [Okorin](https://osu.ppy.sh/u/1623405 "Okorin")\n- ![][flag_HK] [Skystar](https://osu.ppy.sh/u/873961 "Skystar")\n\n### Commentators\n\n- ![][flag_AU] [Bauxe](https://osu.ppy.sh/u/1881685 "Bauxe")\n- ![][flag_US] [Daikyi](https://osu.ppy.sh/u/811832 "Daikyi")\n- ![][flag_NZ] [deadbeat](https://osu.ppy.sh/u/128370 "deadbeat")\n- ![][flag_GB] [Doomsday](https://osu.ppy.sh/u/18983 "Doomsday")\n- ![][flag_CA] [Evrien](https://osu.ppy.sh/u/791660 "Evrien")\n- ![][flag_AR] [juankristal](https://osu.ppy.sh/u/443656 "juankristal")\n- ![][flag_AT] [Omgforz](https://osu.ppy.sh/u/578943 "Omgforz")\n- ![][flag_GB] [Rime](https://osu.ppy.sh/u/1397232 "Rime")\n- ![][flag_FR] [Slainv](https://osu.ppy.sh/u/4823843 "Slainv")\n- ![][flag_US] [ztrot](https://osu.ppy.sh/u/6347 "ztrot")\n\n### Statistician\n\n- ![][flag_NZ] [deadbeat](https://osu.ppy.sh/u/128370 "deadbeat")\n- ![][flag_DE] [Nwolf](https://osu.ppy.sh/u/1910766 "Nwolf")\n';
  });
  $error.addEventListener('click', function () {
    if ($accordionError.hasAttribute('data-hidden')) {
      $accordionError.removeAttribute('data-hidden');
    } else {
      $accordionError.setAttribute('data-hidden', '');
    }
  });
})();
