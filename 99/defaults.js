/*---------------------------------------------------------------------------*
 * -- Custom Defaults
 *---------------------------------------------------------------------------*/


// To make it easier to tell what you changed, create a go_customDefauts.[variable] instead of changing go_defaults

// These will override go_defaults or add onto it
// Please end each line with a comma

var go_customDefaults = {

  //ms_userName: 'mogwai',
  //mb_debug: true,
  //mb_on99: true,
  
dummy:false
};

/*---------------------------------------------------------------------------*
 * -- Defaults
 *---------------------------------------------------------------------------*/
var go_defaults = {

  mb_on99: true,

  mb_useSubdomainAsUserName: false, // never tested this
  mb_debug: false,

  mn_maxUserNameLength: 15,
  mn_maxRoomNameLength: 15,
  mn_maxWordLength: 100,     // characters before splitting long words
  mn_maxPostsDisplayed: 80,  // default max posts to display at once

  mb_showIdCells: false,
  mb_showSourceCells: false,

  mb_fadeInPosts: true,
  mb_disableHTML: false,
  mb_disableImages: false,
  mb_disableFormat: false,
  mb_disableMedia: false,
  mb_disableYoutube: false,
  mb_playLoonOnPM: true,

  mb_forceToUseCookies: false, // useful if testing on local computer

  ms_userName: 'fox',    // this user's name
  ms_userTag: ' $n$',    // this user's tag
  ms_roomName: '99',     // default room
  ms_domain: '99.com',   // default domain name
  ms_pfx: '9_',          // default chat application instance

  ms_inputChangedBGColor: 'yellow',
  ms_inputNormalBGColor: '#f9f9f9', // off-white
  ms_loonURL: 'http://99.com/firefox/loon2.swf?cache=',

  ms_defaultName: 'fox',  // default name for NPCs
  ms_defaultTag: '$n$',   // default tag for NPCs

  ms_appDataId: 'appData001',  // app data

  // Default Tag Properties -- for both user and NPC
  ms_fgColor: '#FF0AA0',
  ms_bgColor: '#000000',
  ms_nameColor: '#000000',
  ms_nameFontFamily: 'sans-serif',
  ms_textFontFamily: 'sans-serif',
  ms_nameFontSize: '2',
  ms_textFontSize: '2',
  mb_nameBold: false,
  mb_textBold: false,
  mb_nameItalic: false,
  mb_textItalic: false,
  ms_textPaddingLeft: '10px',
  ms_namePaddingRight: '10px',
  ms_textAlign: '0',
  ms_nameAlign: '0',
  ms_nameLetterSpacing: '0',
  ms_textLetterSpacing: '0',
  ms_nameCode: '$n$',
  ms_textCode: '$v$',
  mb_nameMarquee: false,
  mb_textMarquee: false,
  mb_textRainbow: false,


  dummy:false
};
