
$(function() {
  //wav by default
  $('.mp3').css('visibility', 'hidden');
  $('.mp3').css('display', 'none');

  //taille des fichiers affichés dans la playerListDownload
  $( '.playerListDownload li').each(function( index ) {
    //a voir si le faire à la main pour optimiser les requetes
    get_filesize(this, $('a', this).attr('href'), function(size, element) {
      $('a', element).html('<i class="fa fa-download" aria-hidden="true"></i> ' + formatSizeUnits(size));
    });
  });

  audiojs.events.ready(function() {

    //on injecte au même moment le qualitySelector et le container du player dans la div mainPlayer
    $('#mainPlayer').append('<div id="qualitySelector" >\
                                <div class="radio">\
                                  <label><input type="radio" name="qualityName" value="wav" checked>\
                                    <div class="btn btn-default btn-xs qualityItem">WAV</div>\
                                  </label>\
                                </div>\
                                <div class="radio">\
                                  <label class=""><input type="radio" name="qualityName" value="mp3">\
                                    <div class="btn btn-default btn-xs qualityItem">MP3</div>\
                                  </label>\
                                </div>\
                              </div>\
                              <audio preload="none"></audio>');

    //comportement du qualitySelector
    $('input[name=qualityName]').on('change', function() {
      // mp3 selectionné
      if($('input[name=qualityName]:checked').val()==='mp3'){
        //affichage des listes
        $('.mp3').css('visibility', 'visible');
        $('.wav').css('visibility', 'hidden');

        $('.mp3').css('display', 'block');
        $('.wav').css('display', 'none');

        //on recupère les correspondants par les index des listes
        if(audio.source.currentSrc!==""){
          var currentIndex = $('li.playing').index('.playerList.wav .playerElem');
          $('.playerElem').removeClass('playing');
          $('.playerList.mp3 .playerElem')[currentIndex].click();
        }
      }
      // wav selectionné
      if($('input[name=qualityName]:checked').val()==='wav'){
        //affichage des listes
        $('.wav').css('visibility', 'visible');
        $('.mp3').css('visibility', 'hidden');

        $('.wav').css('display', 'block');
        $('.mp3').css('display', 'none');

        //on recupère les correspondants par les index des listes
        if(audio.source.currentSrc!==""){
          var currentIndex = $('li.playing').index('.playerList.mp3 .playerElem');
          $('.playerElem').removeClass('playing');
          $('.playerList.wav .playerElem')[currentIndex].click();
        }
      }
    });

    var a = audiojs.createAll({
                trackEnded: function() {
                    var qualityName = $('input[name=qualityName]:checked').val();
                    var next = $('.playerList.' + qualityName + ' li.playing').next();
                    if (!next.length) next = $('.playerList.' + qualityName + ' li').first();
                    var nextsong = $('a', next).attr('data-src');
                    next.addClass('playing').siblings().removeClass('playing');
                    $('#playerText').html( ' playing ' + nextsong.substr(nextsong.lastIndexOf('/')+1));
                    audio.load(nextsong);
                    audio.play();

                    ga('send', 'event', 'Audio', 'play', nextsong.substr(nextsong.lastIndexOf('/')+1));
                }
            });

    var audio = a[0];

    $('.scrubber').append('<div id="playerText"></div>');

    $('.time').css('font-size', '0px');
    $('.duration').html('<button type="button" class="btn btn-default btn-xs">Player</button>');
    $('.played').html('');

    $('.time').click(function(e) {
      //on fait disparaitre le bouton player au premier coup
      if($('.duration').html()==='<button type="button" class="btn btn-default btn-xs">Player</button>'){
        $('.time').css('font-size', '12px');
        $('.played').html('00:00');
        $('.duration').html('00:00');
      }
      //on ouvre la modal
      $('#downloadModal').modal('show');
    });

    //modal
    $('#downloadModal').on('show.bs.modal', function (e) {
      //on injecte le player et le qualitySelector dans la modal
      $('.modalPlayer').append($('.audiojs'));
      $('.modalPlayer').append($('#qualitySelector'));

      //on garde la musique si ça joue en ouvrant
      if(audio.playing){
        //test navigateur
        audio.playPause();
        audio.playPause();
      }

      //pour les trés petits ecrans : affichage du qualitySelector uniquement dans la modal
      if( $(window).width() < 465 ){
        $('#qualitySelector').css('display', 'inline-block');
      }
    })

    $('#downloadModal').on('hidden.bs.modal', function (e) {
      //on remet le player et le qualitySelector dans la main window
      $('#mainPlayer').append($('#qualitySelector'));
      $('#mainPlayer').append($('.audiojs'));

      //on garde la musique si ça joue en fermant
      if(audio.playing){
        audio.playPause();
        audio.playPause();
      }

      //pour les trés petits ecrans : affichage du qualitySelector uniquement dans la modal
      if( $(window).width() < 465 ){
        $('#qualitySelector').removeAttr('style');
      }
    })
    //end modal


    $('.play').click(function(e) {
      //premier click sur le player
      if(audio.source.currentSrc===""){
        e.stopPropagation();
        //on click sur le premier element de la playerList affichée
        var qualityName = $('input[name=qualityName]:checked').val();
        $('.playerList.' + qualityName + ' li').first().click();
      }

    });

    $('.playerList .playerElem').click(function(e) {
        e.preventDefault();
        var current = $('a', this).attr('data-src');

        //si c'est la chanson en cours on fait playPause
        if(audio.source.currentSrc === audio.source.baseURI + current){
          audio.playPause();
        } else {

          $(this).addClass('playing').siblings().removeClass('playing');
          $('#playerText').html( ' playing ' + current.substr(current.lastIndexOf('/')+1));

          $('.time').css('font-size', '12px');

          audio.load(current);
          audio.play();

          var ios = (/(ipod|iphone|ipad)/i).test(navigator.userAgent);
          // On iOS double load !!!!.
          if (ios){
            audio.load(current);
            audio.play();
          }

          ga('send', 'event', 'Audio', 'play', current.substr(current.lastIndexOf('/')+1));
        }
    });

    $('.playerListDownload a').click(function(e) {
        var song = $(this).attr('href');
        ga('send', 'event', 'Audio', 'download', song.substr(song.lastIndexOf('/')+1));
    });

  });

});

function get_filesize(element, url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("HEAD", url, true);

  xhr.onreadystatechange = function() {
      if (this.readyState == this.DONE) {
          callback(parseInt(xhr.getResponseHeader("Content-Length")), element);
      }
  };
  xhr.send();
}

function formatSizeUnits(bytes){
        if      (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(1)+' Go';}
        else if (bytes>=1000000)    {bytes=(bytes/1000000).toFixed(1)+' Mo';}
        else if (bytes>=1000)       {bytes=(bytes/1000).toFixed(1)+' Ko';}
        else if (bytes>1)           {bytes=bytes+' bytes';}
        else if (bytes==1)          {bytes=bytes+' byte';}
        else                        {bytes='0 byte';}
        return bytes;
}




/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
function collapseNavbar() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
}

$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $(this).closest('.collapse').collapse('toggle');
});
