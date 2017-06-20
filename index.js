/* globals document */
(function(){
  'use strict';
  const $button = document.querySelectorAll('x-button')[0];
  const $input_text = document.querySelectorAll('x-input > textarea')[0];
  const $output_text = document.querySelectorAll('x-output > textarea')[0];
  function _newKey(text){
    let key_text1 = text.match(/_...?.?\]/)[0];
    let key_text2 = key_text1.substring(1, (key_text1.length - 1));
    return "[flag_" + key_text2.toUpperCase() + "]";
  }
  function _fixLink(text){
    let link2 = text.match(/\/...?.?\./)[0];
    let link3 = link2.substring(1, (link2.length - 1));
    let ext = text.substring(text.lastIndexOf("."), text.length);
    return "/flag/" + link3.toUpperCase() + ext;
  }
  function _fixRef(text){
    let ref2 = text.match(/_...?.?\]/)[0];
    let ref3 = ref2.substring(1, (ref2.length - 1));
    return "[flag_" + ref3.toUpperCase() + "]";
  }
  $button.addEventListener('click', function(){
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
            let newKey = key[j].replace(key[j], _newKey);
            flags_unsort[newKey] = "/wiki/shared/flag/" + name2 + ext;
          }
        }
      }
      let link1 = lines[i].match(/\/flag\/...?.?\.(gif|jpe?g|png)/g);
      if( link1 ){
        for( let j = 0; j < link1.length; j++ ){
          lines[i] = lines[i].replace(link1[j], _fixLink);
        }
      }
      let ref1 = lines[i].match(/\[flag_...?.?\]/g);
      if( ref1 ){
        for( let j = 0; j < ref1.length; j++ ){
          lines[i] = lines[i].replace(ref1[j], _fixRef);
        }
      }
    }
    lines = lines.join('\n');
    //end
    let flags_sort = {};
    Object.keys(flags_unsort).sort().forEach(function(key){
      flags_sort[key] = flags_unsort[key];
    });
    for( let key in flags_sort ){
      if( flags_sort.hasOwnProperty(key) ){
        flags_output += key + ": " + flags_sort[key] + "\n";
      }
    }
    //console.log(flags_unsort, flags_sort);
    $output_text.value = lines + "\n" + flags_output;
  });
  $input_text.addEventListener('scroll', function(){
    $output_text.scrollTop = $input_text.scrollTop;
    $output_text.scrollLeft = $input_text.scrollLeft;
  });
  $output_text.addEventListener('scroll', function(){
    $input_text.scrollTop = $output_text.scrollTop;
    $input_text.scrollLeft = $output_text.scrollLeft;
  });
})();
