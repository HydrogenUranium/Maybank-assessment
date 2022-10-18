$(document).ready(() => {
  $('.animatedPagesHero__arrow').on('click', () => {
    let newTarget = $('.animatedPagesHero').offset().top + $('.animatedPagesHero').outerHeight();
    $('html, body').animate({
      scrollTop: newTarget
    }, 400);
  });

  $('.footer__backToTop').each(function(){
      $(this).click(function(){
          $('html,body').animate({ scrollTop: 0 }, 'slow');
          return false;
      });
  });
});

$(function($, win) {
  $.fn.inViewport = function(cb) {
     return this.each(function(i,el){
       function visPx(){
         var H = $(this).height(),
             r = el.getBoundingClientRect(), t=r.top, b=r.bottom;
         return cb.call(el, Math.max(0, t>0? H-t : (b<H?b:H)));
       } visPx();
       $(win).on("resize scroll", visPx);
     });
  };
}(jQuery, window));

$(".js-country-gif").inViewport(function(px){
    if(px >200) $(this).addClass("visible") ;
});


