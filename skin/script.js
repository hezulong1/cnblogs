(function(window, $, document, undefined) {
  if (typeof $ == undefined) return

  var page = {
    cache: function() {
      page.els = {}

      page.els.$window = $(window)
      page.els.$body = $('body')
      page.els.$top = $('.scroll-top')
    },

    init: function() {
      page.cache()
      page.on_resize()
      page.on_scroll()
      page.detectMobile()
      page.scrollToTop()
      page.collapseSidebar()
    },

    on_resize: function() {
      page.els.$window.on('resize', function() {
        page.detectMobile()
      }).resize()
    },

    on_scroll: function() {
      page.els.$window.on('scroll', function() {
        if (page.els.$window.scrollTop() > 120) {
          $('.scroll-top').fadeIn()
        } else {
          $('.scroll-top').fadeOut()
        }
      })
    },

    detectMobile: function() {
      page.els.$body.removeClass('is-side-open')
      $('.nav__toggle').removeClass('is-active')
    },

    collapseSidebar: function() {
      $('.nav__toggle').on('click', function() {
        $('.nav__toggle').toggleClass('is-active')

        if ($('.nav__toggle').hasClass('is-active')) {
          page.els.$body.addClass('is-side-open')
        } else {
          page.els.$body.removeClass('is-side-open')
        }
      })
    },

    scrollToTop: function() {
      $('#comment_nav').find('a[href^="#top"]').hide()
      $('.scroll-top').click(function(){
        $('html, body').animate({scrollTop : 0}, 300)
        return false
      })
    }
  }
  
  $(document).ready( page.init() )

})(window, jQuery, document)

// $("body, #sideBarMain").overlayScrollbars({
//   scrollbars: {
//       autoHide: "leave"
//   },
// scrollbars: {
//           autoHide: "leave"
//       }
// }, ["scroll-chain"]);