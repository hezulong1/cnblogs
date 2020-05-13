;
(function (window, $, document, undefined) {
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

;
(function (window, $, document, undefined) {
  'use strict'

  if ($ == undefined) return

  var config = {}

  // jQueryDom
  var $rawPageBegin = $('#page_begin_html')
  var $rawHome = $('#home')
  var $rawPageEnd = $('#page_end_html')
  var $rawBlogNavigator = $('#Header1_HeaderTitle')
  var $rawHeader = $('#header')
  var $rawSide = $('#sideBar')
  var $rawMain = $('#main')
  var $rawFooter = $('#footer')
  var $rawMarkdown = $('#cnblogs_post_body')
  var $rawBlogAge = $('#profile_block').children('a:eq(1)')

  var $window = $(window)
  var $body = $('body')

  var $bcLogo = $('.blackcat-logo')
  var $bcMenu = $('.blackcat-menu').first()
  var $bcSpinner = $('blackcat-spinner')
  var $bcButton = $('[blackcat-event]')

  config.blog = $rawBlogNavigator.attr('href')
  config.author = $rawBlogNavigator.text()
  config.about = $rawBlogAge.attr('href')

  config.menu = [{
      label: 'Home',
      value: config.blog
    },
    {
      label: 'Take Note',
      value: $('#blog_nav_newpost').attr('href')
    },
    {
      label: 'Setting',
      value: $('#blog_nav_admin').attr('href')
    },
    {
      label: 'About Me',
      value: config.about
    }
  ]
  var menuInner = '',
    i = 0,
    len = config.menu.length
  for (; i < len; i++) {
    var item = config.menu[i]
    menuInner += '<li><a href="' + item.value + '"><span>' + item.label + '</span></a></li>'
  }

  var blogStartDate = $rawBlogAge.attr('title') ? $rawBlogAge.attr('title').replace(/\D+/g, '') : ''
  config.startDate = { y: blogStartDate.slice(0, 4), m: blogStartDate.slice(4, 6), d: blogStartDate.slice(6, 8) }

  var events = config.event = {
    search: function() {
      var index = layer.open({
        type: 1,
        title: false,
        closeBtn: false,
        shade: [0.85, '#fff'],
        shadeClose: true,
        maxWidth: 'auto',
        offset: 'auto',
        id: 'blackcat-layer-search',
        skin: 'blackcat-layer-search',
        content: '<form><input class="blackcat-search-input" type="text" spellcheck="false" autocomplete="off" placeholder="搜索内容，查询（ENTER）/ 关闭（ESC）"></form>',
        success: function ($layer) {
          var $input = $layer.find('.blackcat-search-input')
          $input.focus()

          $(document).on('keydown.blackcat', function (e) {
            if (e.keyCode === 27) {
              layer.close(index)
              return
            }

            if (e.keyCode === 13) {
              e.preventDefault()

              if ($input.val()) {
                var word = encodeURIComponent('blog:' + (window.currentBlogApp || 'blackcat') + ' ' + $input.val())
                window.open('http://zzk.cnblogs.com/s?w=' + word)
                layer.close(index)
              }
            }
          })
        },
        end: function () {
          $(document).off('keydown.blackcat')
        }
      })
    }
  }

  var getHash = function (hash) {
    hash = hash || window.location.hash.substr(1)

    if (!hash) return ''

    hash = hash.split('#')
    return decodeURIComponent(hash[0])
  }

  function init() {
    config.avatar && $bcLogo.find('img').attr('src', config.avatar)
    config.blog && $bcLogo.find('a').attr('href', config.blog)
    config.author && $bcLogo.find('a').html(config.author)

    $('title').after('<link rel="icon" href="https://cdn.jsdelivr.net/gh/hezulong1/my-lib/favicon.ico">')
    $bcSpinner.hide()

    $bcMenu.html(menuInner)

    // 隐藏不需要的部分
    $rawHeader.hide()
    $rawSide.hide()
    $('#mainContent').addClass('blackcat-wrapper')
    

    var extraLink = [
      '<blackcat-extra>',
      '<svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg">',
      '<g transform="translate(0,1)">',
      '<rect class="bg" fill="#ddd" x="0" y="2" width="9" height="9" rx="1.5"></rect>',
      '<path class="arrow" d="M9.18198052,1 L6.5,1 L6.5,0 L11,0 L11,1 L11,4.5 L10,4.5 L10,1.59619408 L4.02512627,7.57106781 L3.31801948,6.86396103 L9.18198052,1 Z" fill="#18191b"></path>',
      '</g></svg></blackcat-extra>'
    ].join('')

    var $rawMarkdownH2 = $rawMarkdown.find('h2')
    $rawMarkdownH2.each(function () {
      var $this = $(this)
      $this.append('<a href="#' + $this.attr('id') + '"><span>#</span></a>')
    })
    $rawMarkdownH2.children('a').on('click', function (e) {
      e.preventDefault()
      var $this = $(this)
      $('html, body').animate({
        scrollTop: $this.offset().top
      }, 300)
      window.location.hash = $this.attr('href')
    })

    var $blankLinks = $('a')

    $blankLinks.each(function () {
      var $this = $(this)
      var $span = $this.children('span').first()
      var hasSpan = $span.length === 1
      var shouldExtra = $this.attr('target') === '_blank'
      var oldText = ''
      if (hasSpan) {
        if (shouldExtra) {
          oldText = $span.html()
          $span.html(oldText + extraLink)
        }
      } else {
        oldText = $this.html()
        $this.html('<span>' + oldText + (shouldExtra ? extraLink : '') + '</span>')
      }
    })

    // 初始化滚动
    var $target = $('[id="' + getHash() + '"]')
    $target.length > 0 && $('html, body').animate({
      scrollTop: $target.children('a').offset().top
    }, 300)

    $bcButton.on('click.blackcat', function(e) {
      var $this = $(this)
      var eventName = $this.attr('blackcat-event')
      $.isFunction(events[eventName]) && events[eventName].call(this, e)
    })

    $('#cb_post_title_url').after('<time class="blackcat-time">' + $('#post-date').val() +'</time>')

    // Copyright
    $rawFooter.html('&copy; ' + config.author + ' ' + config.startDate.y + ' - ' + new Date().getFullYear())

    window.BLACKCAT_CONFIG = config
  }

  $(document).ready(init())

})(window, jQuery, document)

DOMReady(function () {
  console.log(DOMReady)
})