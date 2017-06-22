/* globals document */
(function(){
  'use strict';
  const $help = document.querySelectorAll('x-help')[0];
  const $example = document.querySelectorAll('x-example')[0];
  const $accordion = document.querySelectorAll('x-accordion')[0];
  const $patch = document.querySelectorAll('x-patch')[0];
  const $input_text = document.querySelectorAll('x-input > textarea')[0];
  const $output_text = document.querySelectorAll('x-output > textarea')[0];
  document.body.addEventListener('click', function(e){
    if( !$accordion.hasAttribute('data-hidden') ){
      if( !e.path.includes($help) && !e.path.includes($accordion) )
      {
        $accordion.setAttribute('data-hidden', '');
        document.cookie = 'help_visted=true';
      }
    }
  });
  if( document.cookie.replace(/(?:(?:^|.*;\s*)help_visted\s*\=\s*([^;]*).*$)|^.*$/, "$1") === 'true' ){
    $accordion.setAttribute('data-hidden', '');
  }

  let output = "";

  const regex = Object.freeze({
    'newKey':function(text){
      let key_text1 = text.match(/_...?.?\]/)[0];
      let key_text2 = key_text1.substring(1, (key_text1.length - 1));
      return "[flag_" + key_text2.toUpperCase() + "]";
    },
    'fixLink':function(text){
      let link2 = text.match(/\/...?.?\./)[0];
      let link3 = link2.substring(1, (link2.length - 1));
      let ext = text.substring(text.lastIndexOf("."), text.length);
      return "/flag/" + link3.toUpperCase() + ext;
    },
    'fixRef':function(text){
      let ref2 = text.match(/_...?.?\]/)[0];
      let ref3 = ref2.substring(1, (ref2.length - 1));
      return "[flag_" + ref3.toUpperCase() + "]";
    }
  });
  $help.addEventListener('click', function(){
    if( $accordion.hasAttribute('data-hidden') ){
      $accordion.removeAttribute('data-hidden');
    }else{
      $accordion.setAttribute('data-hidden', '');
      if( document.cookie.replace(/(?:(?:^|.*;\s*)help_visted\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== 'true' ){
        document.cookie = 'help_visted=true';
      }
    }
  });
  $patch.addEventListener('click', function(){
    let lines = $input_text.value.split("\n");
    let flags_unsort = {};
    let flags_output = "";
    for( let i = 0; i < lines.length; i++ ){
      if( /\!\[\]\[flag_...?.?\]/g.test(lines[i]) ){
        let key = lines[i].match(/\[flag_...?.?\]/g);
        if( key ){
          for( let j = 0; j < key.length; j++ ){
            let name1 = key[j].match(/_...?.?\]/g)[0];
            let name2 = name1.substring(1, (name1.length - 1)).toUpperCase();
            let ext;
            if( name2.length === 2 ){
              ext = ".gif";
            }else if( name2.length === 4 ){
              ext = ".png";
            }
            let newKey = key[j].replace(key[j], regex.newKey);
            flags_unsort[newKey] = "/wiki/shared/flag/" + name2 + ext;
          }
        }
      }
      let link1 = lines[i].match(/\/flag\/...?.?\.(gif|jpe?g|png)/g);
      if( link1 ){
        for( let j = 0; j < link1.length; j++ ){
          lines[i] = lines[i].replace(link1[j], regex.fixLink);
        }
      }
      let ref1 = lines[i].match(/\[flag_...?.?\]/g);
      if( ref1 ){
        for( let j = 0; j < ref1.length; j++ ){
          lines[i] = lines[i].replace(ref1[j], regex.fixRef);
        }
      }
    }
    lines = lines.join('\n');
    let flags_sort = {};
    Object.keys(flags_unsort).sort().forEach(function(key){
      flags_sort[key] = flags_unsort[key];
    });
    for( let key in flags_sort ){
      if( flags_sort.hasOwnProperty(key) ){
        flags_output += key + ": " + flags_sort[key] + "\n";
      }
    }
    $output_text.value = lines + "\n" + flags_output;
    output = $output_text.value;
  });
  $input_text.addEventListener('scroll', function(){
    $output_text.scrollTop = $input_text.scrollTop;
    $output_text.scrollLeft = $input_text.scrollLeft;
  });
  $output_text.addEventListener('scroll', function(){
    $input_text.scrollTop = $output_text.scrollTop;
    $input_text.scrollLeft = $output_text.scrollLeft;
  });
  $output_text.addEventListener('input', function(e){
    this.value = output;
    return false;
  });

  $example.addEventListener('click', function(){
    $input_text.value = '# Example Tournament 2017\n\n![osu! World Cup 2017](logo.jpg)\n\nThe **Example Tournament 2017 (_ET 2017_)** is not a real tournament because this is an example.\nIt is the 1st installment and test for `flag-osu`.\n\n## Tournament Schedule\n\n| Event              | Timestamp              |\n|--------------------|------------------------|\n| Registration Phase | Yesterday              |\n| Drawings           | Today                  |\n| Group Stage        | Tomorrow               |\n| Round of 16        | Next week              |\n| Quarterfinals      | After Round of 16      |\n| Semifinals         | When there are only 4  |\n| Finals - Week 1    | When there is a winner |\n| Finals - Week 2    | lol jk                 |\n\n## Prizes\n\nNo prizes (we\'re all winners).\n\n## Organization\n\nThe Example Tournament 2017 is ran by various community members by distributing the multitude of tasks into various fields of responsibility.\n\n### Tournament Management\n\n- ![][flag_De] [Loctav](https://osu.ppy.sh/u/71366 "Loctav")\n- ![][flag_De] [p3n](https://osu.ppy.sh/u/123703 "p3n")\n- ![][flag_Es] [Deif](https://osu.ppy.sh/u/318565 "Deif")\n- ![][flag_Fr] [shARPII](https://osu.ppy.sh/u/776257 "shARPII")\n\n### Map Selectors\n\n- ![][flag_Jp] [Asahina Momoko](https://osu.ppy.sh/u/3650145 "Asahina Momoko")\n- ![][flag_De] [Okorin](https://osu.ppy.sh/u/1623405 "Okorin")\n- ![][flag_Hk] [Skystar](https://osu.ppy.sh/u/873961 "Skystar")\n\n### Commentators\n\n- ![][flag_Au] [Bauxe](https://osu.ppy.sh/u/1881685 "Bauxe")\n- ![][flag_Us] [Daikyi](https://osu.ppy.sh/u/811832 "Daikyi")\n- ![][flag_Nz] [deadbeat](https://osu.ppy.sh/u/128370 "deadbeat")\n- ![][flag_Gb] [Doomsday](https://osu.ppy.sh/u/18983 "Doomsday")\n- ![][flag_Ca] [Evrien](https://osu.ppy.sh/u/791660 "Evrien")\n- ![][flag_Ar] [juankristal](https://osu.ppy.sh/u/443656 "juankristal")\n- ![][flag_At] [Omgforz](https://osu.ppy.sh/u/578943 "Omgforz")\n- ![][flag_Gb] [Rime](https://osu.ppy.sh/u/1397232 "Rime")\n- ![][flag_Fr] [Slainv](https://osu.ppy.sh/u/4823843 "Slainv")\n- ![][flag_Us] [ztrot](https://osu.ppy.sh/u/6347 "ztrot")\n\n### Statistician\n\n- ![][flag_Nz] [deadbeat](https://osu.ppy.sh/u/128370 "deadbeat")\n- ![][flag_De] [Nwolf](https://osu.ppy.sh/u/1910766 "Nwolf")\n';
  });
})();
