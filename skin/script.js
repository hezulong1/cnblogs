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
  var $rawBlogInfo = $('#blog_post_info_block')
  var $rawPager = $('#post_next_prev')
  var $rawBlogPrev = $rawPager.children('a:eq(1)')
  var $rawBlogNext = $rawPager.children('a:eq(3)')

  var $window = $(window)
  var $body = $('body')

  var $bcLogo = $('.blackcat-logo')
  var $bcMenu = $('.blackcat-menu').first()
  var $bcSpinner = $('blackcat-spinner')
  var $bcPager = $('blackcat-pager')
  var $bcMe = $('blackcat-me')

  config.blog = $rawBlogNavigator.attr('href')
  if ($rawBlogPrev.length && $rawBlogNext.length) {
    config.blogPrev = { label: $rawBlogPrev.text(), date: $.trim($rawBlogPrev.attr('title').replace(/[\u4e00-\u9fa5]/g, '')), href: $rawBlogPrev.attr('href') }
    config.blogNext = { label: $rawBlogNext.text(), date: $.trim($rawBlogNext.attr('title').replace(/[\u4e00-\u9fa5]|[(^\s*)|(\s*$)]/g, '')), href: $rawBlogNext.attr('href') }
  }
  
  config.author = $rawBlogNavigator.text()
  config.avatar = $('#author_profile_info').find('.author_avatar').attr('src')
  config.about = $rawBlogAge.attr('href')
  config.signature = $('#blogTitle').find('h2').first().html()
  config.follow = $('#p_b_follow').children('a').length <= 0

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
    },
    open: function() {
      var $this = $(this)
      var url = $this.data('url')
      window.open(url)
    },
    copy: function() {

    }
  }

  var icons = {
    eye: '<svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"></path><path fill-rule="evenodd" d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" clip-rule="evenodd"></path></svg>',
    thumbUp: '<svg width="1em" height="1em" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M426.410667 772.096c0.170667-114.602667 0.597333-304.981333 0.597333-304.981333 0-12.544 3.754667-24.917333 10.837333-35.925334l109.312-169.045333c1.28-1.962667 0.938667-5.034667 3.328-5.034667 22.357333 0 13.482667 54.784-3.072 106.410667-13.056 29.354667-12.373333 62.634667 4.181334 90.709333 18.517333 31.488 38.314667 51.114667 75.605333 51.114667h125.013333c17.408 0 30.464 15.957333 27.050667 33.024l-37.376 185.514667c-7.338667 32-24.405333 48.042667-32 48.042666H426.410667v0.170667z" fill="#64EDAC" p-id="5914"></path><path d="M880.128 430.506667c-16.384-19.968-41.045333-31.402667-67.754667-31.402667H631.893333c22.784-70.058667 41.472-163.498667 3.328-216.32-12.288-16.981333-35.925333-37.205333-78.762666-37.205333-55.808 0-80.128 30.464-98.645334 58.965333L348.501333 373.418667c-5.290667 8.192-9.813333 16.810667-13.653333 25.6H232.362667c-35.669333 0-64.853333 28.330667-66.218667 63.658666l-39.936 300.970667-0.256 4.522667c0 60.842667 49.493333 110.336 110.336 110.336h473.6c63.744 0 118.357333-52.992 136.192-132.608l50.432-250.368c4.693333-22.954667-1.365333-46.677333-16.384-65.024z m-643.84 379.733333c-22.613333 0-41.045333-17.834667-42.069333-40.192l40.106666-302.592 85.589334-0.256v342.954667l-83.626667 0.085333z m593.322667-328.192l-50.346667 249.685333c-10.325333 46.250667-38.826667 78.506667-69.376 78.506667H388.266667c0.085333-103.424 0.597333-343.210667 0.597333-343.296 0-19.797333 5.888-39.338667 16.981333-56.490667l109.312-168.96c15.104-23.381333 21.674667-27.733333 41.301334-27.733333 16.896 0 21.504 6.314667 23.466666 8.96 15.530667 21.504 10.410667 83.541333-12.8 154.88a60.928 60.928 0 0 0 2.474667 57.429333c11.690667 19.882667 33.792 32.256 57.685333 32.256H812.373333c6.058667 0 11.690667 2.389333 14.933334 6.4 2.133333 2.645333 2.901333 5.461333 2.304 8.362667z" fill="#333C4F"></path></svg>',
    thumbDown: '<svg width="1em" height="1em" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M597.589333 251.904c-0.170667 114.602667-0.597333 304.98133299-0.597333 304.981333 0 12.544-3.754667 24.917333-10.837333 35.925334l-109.312 169.045333c-1.28 1.96266699-0.938667 5.034667-3.328 5.034667-22.35733299 0-13.48266699-54.784 3.072-106.410667 13.056-29.354667 12.373333-62.634667-4.181334-90.70933301-18.517333-31.488-38.314667-51.114667-75.605333-51.11466699l-125.013333 0c-17.408 0-30.464-15.957333-27.050667-33.024l37.376-185.514667c7.338667-32 24.405333-48.042667 32-48.042666L597.589333 252.074667l0-0.170667z" fill="#64EDAC" p-id="1265"></path><path d="M143.872 593.493333c16.384 19.968 41.045333 31.402667 67.754667 31.402667L392.106667 624.896c-22.784 70.058667-41.472 163.498667-3.32800001 216.32 12.288 16.981333 35.925333 37.205333 78.76266601 37.205333 55.80799999 0 80.128-30.464 98.645334-58.965333L675.498667 650.581333c5.290667-8.192 9.813333-16.810667 13.653333-25.6L791.637333 624.981333c35.66933299 0 64.853333-28.330667 66.218667-63.658666l39.936-300.970667 0.256-4.522667c0-60.842667-49.493333-110.336-110.336-110.336l-473.6 0c-63.744 0-118.357333 52.992-136.19199999 132.608l-50.43200001 250.368c-4.69333301 22.954667 1.365333 46.677333 16.384 65.024z m643.84-379.73333301c22.613333 0 41.045333 17.83466701 42.069333 40.19200001l-40.106666 302.592-85.589334 0.256 0-342.954667 83.626667-0.08533301z m-593.322667 328.19200001l50.346667-249.685333c10.325333-46.250667 38.826667-78.506667 69.376-78.50666701L635.733333 213.76c-0.085333 103.424-0.597333 343.21066701-0.597333 343.296 0 19.79733299-5.888 39.338667-16.981333 56.490667l-109.312 168.96c-15.104 23.381333-21.674667 27.73333299-41.301334 27.733333-16.89599999 0-21.504-6.314667-23.466666-8.96-15.530667-21.504-10.410667-83.541333 12.8-154.88a60.928 60.928 0 0 0-2.474667-57.429333c-11.690667-19.882667-33.792-32.25599999-57.685333-32.256L211.626667 556.714667c-6.058667 0-11.690667-2.389333-14.93333399-6.4-2.133333-2.645333-2.901333-5.461333-2.30400001-8.362667z" fill="#333C4F"></path></svg>'
  }

  function getHash(hash) {
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

    // 重新设计博客底部信息展示
    if (config.avatar) {
      $bcMe.find('.avatar>img').attr('src', config.avatar)
      $bcMe.find('.account').html(config.author)
      $bcMe.find('.signature').html(config.signature)
      // config.follow && $bcMe.find('.follow').addClass('disabled')
      $bcMe.find('.view').on('click.blackcat', function() {
        window.open(config.about)
      })
    } else {
      $bcMe.hide()
    }
    
    // $bcMe.find('.follow').on('click.blackcat', function() {
    //   var $this = $(this)
    //   var disabled = $this.hasClass('disabled')
    //   if (disabled) return
    //   $('#p_b_follow').children('a').trigger('click')
    // })

    if ($rawBlogPrev.length && $rawBlogNext.length) {
      var $pager = $bcPager.find('a');
      $pager.first().attr('href', config.blogPrev.href)
      $pager.last().attr('href', config.blogNext.href)
    } else {
      $bcPager.hide()
    }
    

    $('#mainContent').append($('#blackcat-blog-footer'))
    
    $('#author_profile').hide()
    $('#post_next_prev').hide()
    
    // 隐藏不需要的部分
    $rawHeader.hide()
    $rawSide.hide()
    

    var extraLink = [
      '<blackcat-extra>',
      '<svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg">',
      '<g transform="translate(0,1)">',
      '<rect class="bg" fill="#ddd" x="0" y="2" width="9" height="9" rx="1.5"></rect>',
      '<path class="arrow" d="M9.18198052,1 L6.5,1 L6.5,0 L11,0 L11,1 L11,4.5 L10,4.5 L10,1.59619408 L4.02512627,7.57106781 L3.31801948,6.86396103 L9.18198052,1 Z" fill="#18191b"></path>',
      '</g></svg></blackcat-extra>'
    ].join('')

    var iconCopy = '<svg height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></g></svg>'
    // $rawMarkdown.find('pre').each(function() {
    //   var $this = $(this)
    //   $this.append('<a blackcat-event="copy" aria-label="Copy">' + iconCopy + '</a>')
    // })

    var $rawMarkdownH2 = $rawMarkdown.find('h2')
    $rawMarkdownH2.each(function () {
      var $this = $(this)
      $this.append('<a href="#' + $this.attr('id') + '"><span>#</span></a>')
    })
    // $rawMarkdownH2.children('a').on('click', function (e) {
    //   e.preventDefault()
    //   var $this = $(this)
    //   $('html, body').animate({
    //     scrollTop: $this.offset().top
    //   }, 300)
    //   window.location.hash = $this.attr('href')
    // })
    $rawMarkdown.find('a[href^="#"]').on('click', function(e) {
      e.preventDefault()
      var $this = $(this)
      var $target = $rawMarkdown.find('[id="' + $this.attr('href').substr(1) + '"]')
      $('html, body').animate({
        scrollTop: $target.offset().top
      }, 300)
      $target.length > 0 && (window.location.hash = $this.attr('href'))
    })

    // 评论区
    var $comments = $('#blog-comments-placeholder').find('.feedbackItem')
    $('#blog-comments-placeholder').find('br').first().remove()
    $comments.each(function() {
      var $this = $(this)
      var commentId = $this.find('.layer').attr('href').substr(1)
      var $avatar = $this.find('#comment_' + commentId +'_avatar')
      var isLouzhu = $this.find('.louzhu').length > 0
      var avatarURL = $.trim($avatar.text())
      var anchorURL = $this.find('#a_comment_author_' + commentId).attr('href')
      var $actions = $this.find('.comment_actions a')
      $actions.addClass('blackcat-line-link')
      var $votes = $this.find('.feedbackCon .comment_vote a')
      $votes.addClass('blackcat-line-link')
      if (avatarURL) {
        $this.append('<a blackcat-event="open" data-url="' + anchorURL +'"><img class="blackcat-avatar' + (isLouzhu ? ' is-louzhu': '') +'" src="' + avatarURL + '"></a>')
      }
      $this.find('#a_comment_author_' + commentId).hide()
      $this.find('.feedbackListSubtitle').append('<strong>' + $this.find('#a_comment_author_' + commentId).text() +'</strong>')
    })

    $('#commentbox_opt').append('<span>[ Ctrl+Enter 快捷键提交 ]</span>')

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
      scrollTop: $target.offset().top
    }, 300)

    // 移除博客标题的链接
    var $markdownTitle = $('#cb_post_title_url')
    var originURL = $markdownTitle.attr('href')
    // 补充代码类型
    var $markdownCode = $rawMarkdown.find('pre')
    $markdownCode.each(function() {
      var $this = $(this)
      var $wrapper = $('<div class="blackcat-code-wrapper"></div>')
      var $code = $this.children('code').first()
      var classNames = $code.attr('class').split(' ')
      var type = ''
      for (var i = 0, l = classNames.length; i < l; i++) {
        if (/^language-/.test(classNames[i])) {
          type = classNames[i].replace('language-', '')
          break
        }
      }
      type && $wrapper.attr('blackcat-language', type)
      $this.before($wrapper)
      $wrapper
        .prepend('<a class="blackcat-btn-copy hint hint--top" blackcat-event aria-label="复制到剪贴板">' + iconCopy + '</a>')
        .prepend($this)

      $('.blackcat-btn-copy').on('mouseleave', function() {
        var $this = $(this)
        setTimeout(function(){
          $this.attr('aria-label', '复制到剪贴板')
        }, 300)
      })

      // 代码编号
      // var lineNumber = $code.text().split('\n').length - 1
      // var i = 0, html = ''
      // while (++i <= lineNumber) {
      //   html += '<li>' + i +'</li>'
      // }
      // html = '<ul class="blackcat-code-line-number">' + html + '</ul>'
      // $wrapper.append(html)

      // 复制
      var clipboard = new ClipboardJS('.blackcat-btn-copy', {
        target: function(trigger) {
          return $(trigger).parent().children('pre').get(0)
        }
      })

      $("a[href ^= 'http']").attr("target", "_blank")

      clipboard.on('success', function(e) {
        $(e.trigger).attr('aria-label', '复制成功')
        e.clearSelection()
      })

      clipboard.on('error', function(e) {
        var errTip = 'Press ' + (/Mac/i.test(navigator.userAgent) ? '⌘' : 'Ctrl-') + 'C to copy';
        $(e.trigger).attr('aria-label', errTip)
      })
    })

    $('[blackcat-event]').on('click.blackcat', function(e) {
      var $this = $(this)
      var eventName = $this.attr('blackcat-event')
      $.isFunction(events[eventName]) && events[eventName].call(this, e)
    })

    $markdownTitle
      .attr('data-href', originURL)
      .removeAttr('href')
      .after([
        '<div class="blackcat-time">',
        '<time><i class="blackcat-icon-time"></i>' + $('#post-date').text() +'</time>',
        '<span><i class="blackcat-icon-eye"></i>' + $('#post_view_count').text() +' 次浏览</span>',
        '</div>'
      ].join(''))

    // Copyright
    $rawFooter.html('&copy; ' + config.author + ' ' + config.startDate.y + ' - ' + new Date().getFullYear()) 
    // new Scrollbar({
    //   element: $rawMain[0],
    //   onScroll: function(scrollLeft, scrollTop) {
    //     if (scrollTop > 100) {
    //       $('blackcat-header, #main').addClass('down')
    //     } else {
    //       $('blackcat-header, #main').removeClass('down')
    //     }
    //   }
    // }).create()
    if ($('[blackcat-language]>pre>code').length) {
      new Scrollbar($('[blackcat-language]>pre>code')[0]).create()
    }

    

    $(window).on('scroll', function() {
      if ($(this).scrollTop() > 100) {
        $('blackcat-header').addClass('down')
      } else {
        $('blackcat-header').removeClass('down')
      }
    })

    // 首页的列表
    var $rawDays = $('#mainContent .day')
    $rawDays.each(function() {
      var $this = $(this)
      var $title = $this.children('.postTitle')
      var $content = $this.children('.postCon')
      var desc = $this.children('.postDesc').text().trim().split(' ').filter(function(item) { return !!item })
      var date = desc[2]
      var time = desc[3]
      var view = desc[$.inArray('阅读', desc) + 1].replace(/[()]/g, '')
      
      $title.append([
        '<div class="blackcat-time">',
        '<time><i class="blackcat-icon-time"></i>' + date + ' ' + time +'</time>',
        '<span><i class="blackcat-icon-eye"></i>' + view +' 次浏览</span>',
        '</div>'
      ].join(''))

      $content.find('a').wrap('<div></div>')
    })

    // 标签页
    var $rawTagWrapper = $('#taglist_main')
    var $rawTags = $rawTagWrapper.children('#taglist').find('td')
    var html = '<div class="blcakcat-tags">'
    $rawTags.each(function() {
      var $tag = $(this)
      var $link = $tag.children('a')

      if ($link.length <= 0) return
      
      var url = $link.attr('href')
      var label = $link.text().trim()
      var count = $tag.children('.small').text().trim()
      html += '<div class="blackcat-tag"><a href="' + url +'">' + label +'<em>' + count +'</em></a></div>'
    })
    html += '</div>'
    $rawTagWrapper.append(html)
    $rawTagWrapper.children('#taglist').hide()



    window.BLACKCAT_CONFIG = config
  }

  $(document).ready(init())

})(window, jQuery, document)
