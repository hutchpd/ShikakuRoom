
// VS is coded into the chat interface already
go_app.vs = '';

jQuery(document).ready(function(){
  try {
    go_99only.init();
  } catch (err) {
    log(err);
  }
});



var go_99only = {

  init: function() {
  
    if( !go_defaults.mb_on99 ) { return; }
  
    // add 99 only html to the index page
    ///  -- don't know if this will work, if you need to, just code all the a2.swf into the index.html
    var ls_html = '<div style="visibility:hidden;">'
                +   '<object id="loon" type="application/x-shockwave-flash" width="0" height="0" data="null">'
                +     '<param name="movie" value="null" />'
                +     '<param name="allowScriptAcess" value="sameDomain" />'
                +     '<param name="quality" value="best" />'
                +     '<param name="FlashVars" value="playerMode=embedded" />'
                +     '<param name="autoplay" value="true" />'
                +     '<param name="loop" value="false" />'
                +   '</object>'
                +   '<object type="application/x-shockwave-flash" data="a2.swf" width="0" height="0" id="Playback" name="Flashmovie">'
                +     '<param name="movie" value="a2.swf" />'
                +     '<param name="allowScriptAcess" value="sameDomain" />'
                +     '<param name="quality" value="best" />'
                +     '<param name="bgcolor" value="#FFFFFF" />'
                +     '<param name="scale" value="Scale" />'
                +     '<param name="salign" value="TL" />'
                +   '</object>'
                + '</div>';

    jQuery(document.body).append( ls_html );

    this.getTS();
    go_app.PrivateMessageReceived.subscribe( this.onPM, this );
  },

  onPM: function( io_args ) {
    if( go_app.settings.mb_playLoonOnPM ) {
      this.playLoon();
    }
  },
  onPC: function( io_args ) {
    if( go_app.settings.mb_playLoonOnPC ) {
      this.playLoon();
    }
  },
  playLoon: function() {
    document.getElementById('loon').data = go_defaults.ms_loonURL + (new Date()).getTime();
  },
  getRoomLeftButtons: function() {
    return '<button class="app" onclick="go_99only.openUploader(event);">Upload</button>'+
    '<button class="app" onclick="go_99only.openVideoCall(event);">VideoCall</button>';
    //'<button class="app" onclick="go_99only.openCamMenu(event);">Webcams</button>' +
     
  },
  getRoomRightButtons: function() {
    return '<button class="app" onclick="go_99only.openLink(\'http://99.jj4.org/\');">Tag Creator</button>' //'<div id="translator{id}"></div>'
        // + '<button class="app" onclick="go_99only.openDoodleRoom(event);">Doodle</button>' +
        //'<img class="app globe" onclick="go_99only.openLink(\'http://htmlchat.org/99ers/\');" src="http://http://99.com/img/globe.png" />';
  },
  openCamMenu: function(io_e) {
    var lo_mouseCoords = go_browserUtils.getMouseXY(io_e);
    go_webcamMenu.open( lo_mouseCoords.left, lo_mouseCoords.top );
    go_browserUtils.stopProp(io_e);
  },
  openDoodleRoom: function() {
    go_doodleRoomPopup.open( go_app.getMainRoom().getName(), go_app.getUser().getName(), 5, 5 );
  },
  openVideoCall: function() {
    go_videocallPopup.open( 600, 30, set_UserID + go_app.getUser().getName() );
  },
  openVideoCallDirect: function( is_callee ) {
    go_videocallPopup.open( 600, 30, set_UserID + go_app.getUser().getName(), is_callee );
  },
  openCamRoom: function() {
    go_camRoomPopup.open( go_app.getMainRoom().getName(), go_app.getUser().getName(), 'FFFFFF', '000000', 5, 5 );
  },
  openLink: function( is_url ) {
    window.open( is_url );
  },
  openUploader: function() {
    go_uploaderPopup.open( 5, 5 );
  },
  getTS: function() {
    if(window.Flashmovie && window.Flashmovie.GetVariable ) {
      var TS = window.document["Flashmovie"].GetVariable("t");
      go_app.vs = TS;
    }
    if(document.Flashmovie && document.Flashmovie.GetVariable ) {
      var TS = document.Flashmovie.GetVariable("t");
      go_app.vs = TS;
    }
  	document.getElementById("Playback").style.visibility='hidden';

  }
};


var go_webcamMenu = {
  mo_popup: null,
  open: function( in_x, in_y ) {
    if( this.mo_popup ) { this.close(); }

    var ls_html = '';
    ls_html += this.getItemHTML( 'go_99only.openCamRoom();', 'WebCams' );
    ls_html += this.getItemHTML( 'go_99only.openLink(\'http://htmlchat.net/99/snapshot/\');', 'Snapshot' );
    ls_html += this.getItemHTML( 'go_99only.openLink(\'http://htmlchat.net/99/Liquefied/\');', 'Liquefied' );
    ls_html += this.getItemHTML( 'go_99only.openLink(\'http://htmlchat.net/99/99balloons.asp\');', '99 Balloons' );

    var lo_element = document.createElement('div');
    lo_element.className = 'usermenu';
    lo_element.innerHTML = ls_html;

    this.mo_popup = zPopup.create( lo_element,
                                   { mb_draggable: true,
                                     mb_showCloseButton: true,
                                     mb_showTitleBar: true,
                                     ms_title: '<div class="usermenutitle">Webcam Stuff</div>',
                                     mb_closeOnClick: false,
                                     mb_showBorder: true,
                                     mn_top: in_y || 1,
                                     mn_left: in_x || 1 } );
    this.mo_popup.show();
  },

  close: function() {
    if( this.mo_popup ) {
      this.mo_popup.close();
      this.mo_popup = null;
    }
  },

  getItemHTML: function( is_code, is_text ) {
    return '<div class="usermenuitem" onclick="' + is_code + ';go_webcamMenu.close();">' + is_text + '</div>';
  }
};



/*---------------------------------------------------------------------------*
 * -- Uploader Popup
 *---------------------------------------------------------------------------*
 *
 *---------------------------------------------------------------------------*/
var go_uploaderPopup = {

  mo_popup: null,

  open: function( x, y ) {

    if( this.mo_popup ) { this.close(); }

    var lo_div = document.createElement('div');
    lo_div.className = 'uploaderContainer';

    var ls_html = '<object type="application/x-shockwave-flash" data="uploader.swf?ie=0" width="505" height="420">'
                +   '<param name="movie" value="uploader.swf?ie=0" />'
                +   '<param name="allowScriptAcess" value="sameDomain" />'
                +   '<param name="quality" value="best" />'
                +   '<param name="bgcolor" value="#FFFFFF" />'
                +   '<param name="scale" value="Scale" />'
                +   '<param name="salign" value="TL" />'
                +   '<param name="FlashVars" value="playerMode=embedded" />'
                + '</object>';

    lo_div.innerHTML = ls_html;

    this.mo_popup = zPopup.create( lo_div,
                                   { mb_draggable: true,
                                     mb_showCloseButton: true,
                                     mb_showTitleBar: true,
                                     mb_closeOnClick: false,
                                     mb_showBorder: true,
                                     ms_title: 'Uploader',
                                     mn_top: y || 1,
                                     mn_left: x || 1 });
    this.mo_popup.show();

  },

  close: function() {
    if( this.mo_popup ) {
      this.mo_popup.close();
      this.mo_popup = null;
    }
  }
};


/*---------------------------------------------------------------------------*
 * -- VideoCall Popup
 *---------------------------------------------------------------------------*
 *
 *---------------------------------------------------------------------------*/
var go_videocallPopup = {

  mo_popup: null,

  open: function( x, y, is_name, is_calling ) {

    if( this.mo_popup ) { this.close(); }

    var lo_div = document.createElement('div');
    lo_div.className = 'videocallContainer';

    var ls_html = '<object type="application/x-shockwave-flash" data="http://' + go_defaults.ms_domain + '/VideoCall.swf?userid='+is_name+'&callid='+is_calling+'" width="320" height="465">'
                +   '<param name="movie" value="http://' + go_defaults.ms_domain + '/VideoCall.swf?userid='+is_name+'&callid='+is_calling+'" />'
                +   '<param name="allowScriptAccess" value="always" />'
                +   '<param name="quality" value="best" />'
                +   '<param name="bgcolor" value="#FFFFFF" />'
                +   '<param name="scale" value="Scale" />'
                +   '<param name="salign" value="TL" />'
                +   '<param name="FlashVars" value="playerMode=embedded" />'
                + '</object>';

    lo_div.innerHTML = ls_html;

    this.mo_popup = zPopup.create( lo_div,
                                   { mb_draggable: true,
                                     mb_showCloseButton: true,
                                     mb_showTitleBar: true,
                                     mb_closeOnClick: false,
                                     mb_showBorder: true,
                                     ms_title: 'Video Call',
                                     mn_top: y || 1,
                                     mn_left: x || 1 });
    this.mo_popup.show();

  },

  close: function() {
    if( this.mo_popup ) {
      inCall('0');
      this.mo_popup.close();
      this.mo_popup = null;
    }
  }
};








function sendUpPost( is_imgURL ) {
  go_app.sendPost( is_imgURL );
}


/*
var go_translator = {

  ms_language: null,

  translate: function( is_text, if_callback ) {
    if( this.ms_language ) {
      google.language.translate( is_text, '', this.ms_language, function(result) { lf_callback( (result.translation) ? result.translation : is_text ); } );
    }
  },

  createSelection: function( io_container ){
  
    var ls_html = '<dl class="transdroplist">'
                +   '<dt><img class="flag" src="http://99.com/flags/null.png" title="none" /></dt>'
                +   '<dd style="z-index:1000">'
                +     '<ul>'
                +   		'<li><img class="flag" src="http://99.com/flags/null.png" title="none" /></li>'
                +       '<li><img class="flag" src="http://99.com/flags/gb.png" title="en" /></li>'
                +       '<li><img class="flag" src="http://99.com/flags/fr.png" title="fr" /></li>'
                +       '<li><img class="flag" src="http://99.com/flags/es.png" title="es" /></li>'
                +       '<li><img class="flag" src="http://99.com/flags/de.png" title="de" /></li>'
                +     '</ul>'
                +   '</dd>'
                + '</dl>';
  
    jQuery( io_container ).html( ls_html );
    jQuery( io_container ).find('ul').hide();

    log( jQuery( io_container ).find('dt img') );
  
    jQuery(io_container).find('dt').click( function(){ jQuery(io_container).find('ul').toggle(); } );
    jQuery(io_container).find('dd ul li').click(function() {
  		var text = jQuery(this).html();
  		jQuery(io_container).find("dt").html(text);
  		jQuery(io_container).find("dd ul").hide();
      go_translator.ms_language = jQuery(this).find("img").attr('title');
      if( go_translator.ms_language == 'none' ) {
        go_translator.ms_language = null;
      }
    });
  },
  
  init: function() {
		jQuery(document).bind('click', function(e) {
      var $clicked = jQuery(e.target);
      if (! $clicked.parents().hasClass('transdroplist')) {
        jQuery('.transdroplist dd ul').hide();
      }
    });
  }

};

*/


/*---------------------------------------------------------------------------*
 * -- Doodle Room Popup
 *---------------------------------------------------------------------------*
 *
 *---------------------------------------------------------------------------*/
var go_doodleRoomPopup = {

  mo_popup: null,

  open: function( is_room, is_name, in_x, in_y ) {

    if( this.mo_popup ) { this.close(); }

    var lo_div = document.createElement('div');
    lo_div.className = 'doodleroomcontainer';
    
    var ls_html = '<iframe id="doodle" src="http://htmlchat.net/99/doodle.asp?rm=' + is_room
                + '&username=' + is_name
                + '&t=' + go_app.vs
                + '&isflash=' + FlashDetect.installed
                + '&flash=' + FlashDetect.raw
                + '" class="doodleroom"></iframe>';

    lo_div.innerHTML = ls_html;

    this.mo_popup = zPopup.create( lo_div,
                                   { mb_draggable: true,
                                     mb_showCloseButton: true,
                                     mb_showTitleBar: true,
                                     mb_closeOnClick: false,
                                     mb_showBorder: true,
                                     ms_title: 'Doodle Room',
                                     mn_top: in_y || 1,
                                     mn_left: in_x || 1 });
    this.mo_popup.show();

  },

  close: function() {
    if( this.mo_popup ) {
      this.mo_popup.close();
      this.mo_popup = null;
    }
  }
};



/*---------------------------------------------------------------------------*
 * -- Cam Room Popup
 *---------------------------------------------------------------------------*
 *
 *---------------------------------------------------------------------------*/
var go_camRoomPopup = {

  mo_popup: null,

  open: function( is_room, is_name, is_bgc, is_fgc, in_x, in_y ) {

    if( this.mo_popup ) { this.close(); }

    var lo_div = document.createElement('div');
    lo_div.className = 'camroomcontainer';

    var ls_html = '<iframe id="cams" src="http://htmlchat.net/99/cams.asp?rm=' + is_room
                + '&username=' + is_name
                + '&bgc=' + is_bgc
                + '&fgc=' + is_fgc
                + '&t=' + go_app.vs
                + '&isflash=' + FlashDetect.installed
                + '&flash=' + FlashDetect.raw
                + '" class="camroom"></iframe>';

    lo_div.innerHTML = ls_html;

    this.mo_popup = zPopup.create( lo_div,
                                   { mb_draggable: true,
                                     mb_showCloseButton: true,
                                     mb_showTitleBar: true,
                                     mb_closeOnClick: false,
                                     mb_showBorder: true,
                                     ms_title: 'Cam Room',
                                     mn_top: in_y || 1,
                                     mn_left: in_x || 1 });
    this.mo_popup.show();

  },

  close: function() {
    if( this.mo_popup ) {
      this.mo_popup.close();
      this.mo_popup = null;
    }
  }
};
