$(function() {

  /*** initialisation de la liste du MUSIC PLAYER => MP3 Visible ***/

  $('.aac').css('visibility', 'hidden');
  $('.wav').css('visibility', 'hidden');
  //$('.mp3').css('visibility', 'hidden');

  $('.aac').css('display', 'none');
  $('.wav').css('display', 'none');
  //$('.mp3').css('display', 'none');

  var hideQuality = function() {
    $('.aac').css('visibility', 'hidden');
    $('.wav').css('visibility', 'hidden');
    $('.wav').css('visibility', 'hidden');

    $('.aac').css('display', 'none');
    $('.wav').css('display', 'none');
    $('.mp3').css('display', 'none');
  };

  //comportement du qualitySelector dans la panel - qualityName0
  $('input[name=qualityName0]').on('change', function() {
    var qualityName = $('input[name=qualityName0]:checked').val();

    hideQuality();
    $('.' + qualityName).css('visibility', 'visible');
    $('.' + qualityName).css('display', 'block');

    $("input[name=qualityName][value='"+qualityName+"']").prop("checked",true);
  });

  //comportement du qualitySelector dans la modal - qualityName
  $('input[name=qualityName]').on('change', function() {
    var qualityName = $('input[name=qualityName]:checked').val();

    hideQuality();
    $('.' + qualityName).css('visibility', 'visible');
    $('.' + qualityName).css('display', 'block');

    $("input[name=qualityName0][value='"+qualityName+"']").prop("checked",true);
  });

  /*** initialisation du MUSIC PLAYER => audiojs plugin ***/
  audiojs.events.ready(function() {
    var a = audiojs.create( $('audio'), {
      trackEnded: function() {
        //la chanson suivante sinon la première de la liste selectionnée
        var qualityName = $('input[name=qualityName]:checked').val();
        var next = $('.playerList.' + qualityName + ' li.playing').next();
        if (!next.length) next = $('.playerList.' + qualityName + ' li').first();
        next.click();
      }
    });
    var audio = a[0];

    $('.play').click(function(e) {
      //premier click sur le player
      if(audio.source.currentSrc===""){
        e.stopPropagation();
        //on click sur le premier element de la playerList affichée
        var qualityName = $('input[name=qualityName]:checked').val();
        $('.playerList.' + qualityName + ' li').first().click();
      }
    });

    $('.playerList li').click(function(e) {
        e.preventDefault();
        var current = $('a', this).attr('data-src');
        var songname = $('a', this).html();


        //si c'est la chanson en cours on fait playPause
        if(audio.source.currentSrc === audio.source.baseURI + current
                || audio.source.currentSrc === current){
          audio.playPause();
        } else {
          $('.playerList li').removeClass('playing');
          //check panel and modal the same time with current data-src
          $(".playerList li a[data-src='"+current+"']").parent().addClass('playing');

          $('#playerText').html( ' playing '  + songname ); //+ current.substr(current.lastIndexOf('/')+1));
          $('.time').css('font-size', '12px');

          audio.load(current);
          audio.play();

          var ios = (/(ipod|iphone|ipad)/i).test(navigator.userAgent);
          // On iOS double load !!!!.
          if (ios){
            audio.load(current);
            audio.play();
          }

          //GTM
          dataLayer.push({'currentPlaying': songname, 'event': 'play.click'});
        }
    });


    $('.scrubber').append('<div id="playerText"></div>');
    $('.time').css('font-size', '0px');
    $('.time').addClass('btn-default');
    $('.duration').html('<button type="button" style="width:90px" class="btn btn-default btn-xs">Player</button>');
    $('.played').html('');

    $('.time').click(function(e) {
      //on fait disparaitre le bouton player au premier coup
      if($('.duration').html()==='<button type="button" style="width:90px" class="btn btn-default btn-xs">Player</button>'){
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

      //on garde la musique si ça joue en ouvrant
      if(audio.playing){
        //test navigateur
        audio.playPause();
        audio.playPause();
      }
    })

    $('#downloadModal').on('hidden.bs.modal', function (e) {
      //on remet le player et le qualitySelector dans la main window
      $('#mainPlayer').append($('.audiojs'));

      //on garde la musique si ça joue en fermant
      if(audio.playing){
        audio.playPause();
        audio.playPause();
      }
    })
    //end modal


//autoplay !!!!!
    //var qualityName = $('input[name=qualityName]:checked').val();
    //$('.playerList.' + qualityName + ' li').first().click();
  });

});


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

//ekkoLightbox for photos albums
$(document).on('click', '[data-toggle="lightbox"]', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
});

//API Graph de facebook for photos albums
$(document).ready(function() {
  $.ajaxSetup({ cache: true });
  $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
    FB.init({
      appId: '1488047211287884',
      version: 'v2.10' // or v2.1, v2.2, v2.3, ...
    });
    var thumbs = $('#thumbs');
    FB.api('/923616837726736/photos', {fields: 'images', access_token:'1488047211287884|bb4a396785369c1216267485310e0394'}, function(response) {
          var imgs = response.data;
          for (var i = 0; i < imgs.length; i++) {
            $('<a href="' + imgs[i].images[0].source + '" data-toggle="lightbox" data-gallery="fb-albums-gallery"><img src="' + imgs[i].images[7].source + '" class="img-fluid"></a>').appendTo(thumbs);
          }
    });
    FB.api('/911085248979895/photos', {fields: 'images', access_token:'1488047211287884|bb4a396785369c1216267485310e0394'}, function(response) {
          var imgs = response.data;
          for (var i = 0; i < imgs.length; i++) {
            $('<a href="' + imgs[i].images[0].source + '" data-toggle="lightbox" data-gallery="fb-albums-gallery"><img src="' + imgs[i].images[7].source + '" class="img-fluid"></a>').appendTo(thumbs);
          }
    });
  });
});
