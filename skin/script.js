;(function (window, $, document, undefined) {
  if (typeof $ == undefined) return

  var page = {
    cache: function () {
      page.els = {}

      page.els.$window = $(window)
      page.els.$body = $('body')
      page.els.$top = $('.scroll-top')

      $('body').append(page.els.$sidemask = $('<div class="backmask nav__mask" style="display:none"/>'))
    },

    init: function () {
      page.cache()
      page.on_resize()
      page.on_scroll()
      page.detectMobile()
      page.scrollToTop()
      page.collapseSidebar()
    },

    on_resize: function () {
      page.els.$window.on('resize', function () {
        page.detectMobile()
      }).resize()
    },

    on_scroll: function () {
      page.els.$window.on('scroll', function () {
        if (page.els.$window.scrollTop() > 120) {
          $('.scroll-top').fadeIn()
        } else {
          $('.scroll-top').fadeOut()
        }
      })
    },

    detectMobile: function () {
      page.els.$body.removeClass('is-side-open')
      $('.nav__toggle').removeClass('is-active')
      page.els.$sidemask.hide();
    },

    collapseSidebar: function () {
      $('.nav__toggle').on('click', function () {
        $('.nav__toggle').toggleClass('is-active')

        if ($('.nav__toggle').hasClass('is-active')) {
          page.els.$body.addClass('is-side-open')
          page.els.$sidemask.show()
        } else {
          page.els.$body.removeClass('is-side-open')
          page.els.$sidemask.hide()
        }
      })

      page.els.$sidemask.on('click', function () {
        page.detectMobile()
      })
    },

    scrollToTop: function () {
      $('#comment_nav').find('a[href^="#top"]').hide()
      $('.scroll-top').click(function () {
        $('html, body').animate({
          scrollTop: 0
        }, 300)
        return false
      })
    }
  }

  $(document).ready(page.init())

  window.$_goto = function (id) {
    if (Object.prototype.toString.call(id) === '[object MouseEvent]') {
      id.preventDefault();
      id = arguments.length > 1 ? arguments[1] : ''
    }

    var $anchor = $('*[id="' + id + '"]');
    if ($anchor.length === 1) {
      $('html, body').animate({
        scrollTop: $anchor.offset().top
      }, 300)
    }
  }

})(window, jQuery, document)

;(function(window, $, document, undefined) {
  'use strict'

  if ($ == undefined) return

  var config = {}

  // jQueryDom
  var $rawAvatar = $('#author_profile_info').find('img')
  var $rawBlogNavigator = $('#Header1_HeaderTitle')

  var $bcLogo = $('black-cat-logo')
  var $bcSpinner = $('black-cat-spinner')
    

  config.avatar = $rawAvatar.attr('src')
  config.blog = $rawBlogNavigator.attr('href')
  config.author = $rawBlogNavigator.text()

  function init() {
    config.avatar && $bcLogo.find('img').attr('src', config.avatar)
    config.blog && $bcLogo.find('a').attr('href', config.blog)
    config.author && $bcLogo.find('span').html(config.author)
    $('title').after('<link rel="icon" href="https://cdn.jsdelivr.net/gh/hezulong1/my-lib/favicon.ico">')
    $bcSpinner.hide()
  }

  $(document).ready(init())

})(window, jQuery, document)