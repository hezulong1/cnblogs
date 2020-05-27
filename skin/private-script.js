$(function(){
  var storage = window.localStorage || window.sessionStorage
  var $load = $('<blackcat-spinner data-timestamp="' + new Date().getTime() + '" />')

  var util = {
    setStore: function setStore(name, content) {
      if (!name) return
      if (typeof content !== 'string') {
        content = JSON.stringify(content)
      }
      storage.setItem(name, content)
    },
    getStore: function getStore(name) {
      if (!name) return
      return storage.getItem(name)
    },
    removeStore: function removeStore(name) {
      if (!name) return
      storage.removeItem(name)
    },
    openWindow: function(url) {
      url = $.trim(url)
      // Note：博客园中不可直接使用 window.open 方法
      url && window['op' + 'en'](url)
    }
  }

  // 配置上下页
  function loadPrevNextMarkdown(config, callback) {
    var id = config.markdown.id
    var getInfo = function($link) {
      var ret = {
        href: null,
        label: null,
        date: null,
        time: null
      }
      if ($link.length > 0) {
        var array = $link.attr('title').split(' ')

        ret.href = $link.attr('href')
        ret.label = $.trim($link.text())
        ret.date = array.length > 1 ? array[1] : ''
        ret.time = array.length > 2 ? array[2] : ''
      }
      return ret
    }

    id && $.ajax({
      url: config.blog.base + 'post/prevnext',
      type: 'get',
      dataType: 'html',
      data: { postId: id },
      success: function(response) {
        var $res = $('<div>' + response + '</div>')
        var $prev = $res.find('a:eq(1)')
        var $next = $res.find('a:eq(3)')
        config.markdown.prev = getInfo($prev)
        config.markdown.next = getInfo($next)

        callback(config)
      }
    })
  }

  // 配置META
  function loadMeta(config) {
    $('link[rel*="icon"]').remove()
    var $favicon = $('<link rel="icon" href="' + config.blog.ico +'">')
    $('title').after($favicon)
  }

  // 配置首页
  function loadHomeList() {
    var $days = $('#mainContent').find('.day')
    $days.each(function(index, item) {
      var $this = $(this)
      var $title = $this.children('.postTitle')
      var $content = $this.children('.postCon')
      var $desc = $this.children('.postDesc')
      var text
      // 日期
      text = $.trim($desc.text())
      var datetime = text.slice(9, 19)
      // 阅读数
      text = $.trim($desc.children('.post-view-count').text())
      var viewcount = text.replace(/[^\d]/g, '')
      // 评论
      text = $.trim($desc.children('.post-comment-count').text())
      var commentcount = text.replace(/[^\d]/g, '')
      // 推荐
      text = $.trim($desc.children('.post-digg-count').text())
      var diggcount = text.replace(/[^\d]/g, '')

      text = ''

      // 重绘置顶图标
      var $postTitle = $title.children('.postTitle2')
      $postTitle.length > 0 && $postTitle.html($postTitle.text().replace(/\[置顶\]/, '<span class="blackcat-badge">置顶</span>'))

      // 重绘缩略信息
      $title.append(['<div class="blackcat-time">',
        '<time class="hint--bottom" aria-label="日期"><i class="blackcat-icon-time"></i>' + datetime +'</time>',
        '<span class="hint--bottom" aria-label="浏览"><i class="blackcat-icon-eye"></i>' + viewcount + '</span>',
        '<span class="hint--bottom" aria-label="评论"><i class="blackcat-icon-comment"></i>' + commentcount + '</span>',
        '<span class="hint--bottom" aria-label="推荐"><i class="blackcat-icon-thumb_up"></i>' + diggcount + '</span>',
      '</div>'].join(''))

      // 重绘阅读全文
      var $readmore = $content.find('.c_b_p_desc_readmore')
      $content.append('<div class="blackcat-readmore"><a class="blackcat-line-link" href="' + $readmore.attr('href') + '"><span>阅读全文</span></a></div>')
    })
    
  }

  // 加载头部
  function loadHeader(config) {
    var $wrap = $('blackcat-header')
    var $logo = $wrap.find('.blackcat-logo a')
    var $nav = $wrap.find('.blackcat-menu:eq(0)')
    var options = [
      { name: 'Home', href: config.blog.home },
      { name: 'Take Note', href: config.blog.takeNote },
      { name: 'Setting', href: config.blog.setting }
    ]
    $logo.html('<span>' + config.blog.title + '</span>').attr('href', config.blog.home)
    $nav.html(options.map(function(opt) {
      return '<li><a href="' + opt.href + '"><span>' + opt.name + '</span></a></li>'
    }))

    $('#home').prepend($wrap).prepend(document.createComment(' blackcat: header '))
  }

  // 加载主体
  function loadMain(config) {
    var $main = $('#home')
    var $win = $(window)
    var resize = function() {
      $main.width(window.innerWidth)
      $main.height(window.innerHeight)
    }
    resize()
    $win.on('resize', resize)

    // 渲染描述
    loadHomeList()

    if (config.markdown.id) {
      $('blackcat-header').addClass('static')
      $('#mainContent').addClass('static')
    } else {
      $('blackcat-header').removeClass('static')
      $('#mainContent').removeClass('static')
    }

    try {
      var scrollingElement
      var scrollbar = new Scrollbar({
        element: $main[0],
        onScroll: function(x, y) {
          if (scrollingElement) {
            if (!config.markdown.id) {
              $('blackcat-header').css('top', scrollingElement.scrollTop)
            }
            
            if (scrollingElement.scrollTop > 70) {
              $('blackcat-header').addClass('down')
              $('#mainContent').addClass('down')
            } else {
              $('blackcat-header').removeClass('down')
              $('#mainContent').removeClass('down')
            }
          }
        }
      }).create()

      scrollingElement = scrollbar.getViewElement()
    } catch (e) {
      $main.width('')
      $main.height('')
      $win.off('resize', resize)
      $win.on('scroll', function(e) {
        var scrollTop = document.scrollingElement.scrollTop || document.body.scrollTop || document.documentElement.scrollTop
        if (scrollTop > 70) {
          $('blackcat-header').addClass('down')
          $('blackcat-header').addClass('down')
        } else {
          $('blackcat-header').removeClass('down')
          $('#mainContent').removeClass('down')
        }
      })
    }
  }

  // 加载底部
  function loadFooter(config) {
    var $wrap = $('blackcat-footer')
    var $author = $wrap.children('.blackcat-author')
    var $pager = $wrap.children('.blackcat-pager')
    var $copyright = $wrap.find('.blackcat-copyright .blackcat-wrapper')

    if (config.markdown.id) {
      // 加载博主信息
      $author.find('.avatar img').attr('src', config.blogger.avatar)
      $author.find('.nickname').html(config.blogger.nickName)
      $author.find('.signature').html(config.blogger.signature)
      $author.removeClass('hide')
      // 加载分页
      loadPrevNextMarkdown(config, function() {
        var $prev = $pager.find('a:eq(0)')
        var $next = $pager.find('a:eq(1)')
        config.markdown.prev.href ? $prev.attr('href', config.markdown.prev.href) : $prev.remove()
        config.markdown.next.href ? $next.attr('href', config.markdown.next.href) : $next.remove()
        $pager.removeClass('hide')
      })
    }
    // 加载版权
    $copyright.html('&copy;<span style="padding:0 5px">' + config.blogger.nickName + '</span>' + config.blogger.blogAge.slice(0, 4) + ' - ' + new Date().getFullYear())
    $('#home').append(document.createComment(' blackcat: footer ')).append($wrap)
  }

  var page = {
    config: function() {
      // 侧边栏公告
      var $rawProfile = $('#profile_block')

      // 博主信息
      var blogger = {
        // 昵称
        nickName: $.trim($rawProfile.find('a:eq(0)').text()),
        // 签名
        signature: $.trim($('#blogTitle h2').text()),
        // 园龄
        blogAge: $rawProfile.find('a:eq(1)').attr('title').slice(-10),
        // 粉丝
        followers: $.trim($rawProfile.find('a:eq(2)').text()),
        // 关注
        followees: $.trim($rawProfile.find('a:eq(3)').text()),
        // 头像
        avatar: $('#author_profile_info > a > img').attr('src') || 'https://pic.cnblogs.com/avatar/1197507/20200511165706.png',
      }

      // 博客信息
      var blog = {
        // Baseurl
        base: getAjaxBaseUrl(),
        // 编号
        id: window.currentBlogId  || '',
        // App
        app: window.currentBlogApp || '',
        // 图标
        ico: 'https://blog-static.cnblogs.com/files/blackcat/favicon.ico',
        // 是否登录
        login: window.isLogin || false,
        // 标题
        title: $.trim($('#Header1_HeaderTitle').text()),
        // 首页
        home: $('#blog_nav_myhome').attr('href'),
        // 博客园
        siteHome: $('#blog_nav_sitehome').attr('href'),
        // 新随笔
        takeNote: $('#blog_nav_newpost').attr('href'),
        // 管理
        setting: $('#blog_nav_admin').attr('href'),
        // 联系作者
        contactAuthor: $('#blog_nav_contact').attr('href'),
      }

      // 文章信息
      var markdown = {
        // 编号
        id: window.cb_entryId, // 获取阅读数 loadViewCount()
        // 生成日期
        create: window.cb_entryCreatedDate || '',
        // 允许评论
        allowComment: window.allowComments || false,
        // 上一篇
        prev: {},
        // 下一篇
        next: {}
      }
      
      return window.BLACKCAT_CONFIG = {
        blogger: blogger,
        blog: blog,
        markdown: markdown
      }
    },

    bindEvents: function() {
      var config = page.config()

      var evts = {
        // 配置搜索
        search: function() {
          if (!window.layer) return

          layer.open({
            type: 1,
            title: false,
            closeBtn: false,
            shade: [0.6, '#fff'],
            shadeClose: true,
            maxWidth: 1000,
            skin: 'blackcat-layer-search',
            content: '<input autocomplete="off" placeholder="搜索内容，查询{ENTER}／关闭{ESC}" type="text" name="w">',
            success: function(layero, index){
              var input = layero.find('input')
              input.focus()
              $(document).on('keydown.blackcat', function(e) {
                var keyCode = e.keyCode || e.which
                if (keyCode === 13) {
                  var keyword = input.val()
                  if (keyword.replace(/\s/g, '') === '') {
                    return false
                  }
                  keyword = encodeURIComponent('blog: ' + config.blog.app + ' ' + keyword)
                  util.openWindow('http://zzk.cnblogs.com/s?w=' + keyword)
                }

                if (keyCode === 13 || keyCode === 27) {
                  layer.close(index)
                }
              })
            },
            end: function() {
              $(document).off('keydown.blackcat')
            }
          })
        }
      }

      $('[blackcat-event]').on('click.blackcat', function(e) {
        var $this = $(this)
        var type = $this.attr('blackcat-event')
        $.isFunction(evts[type]) && evts[type].call(this, e)
      })

      $('.blackcat-link-links a, a.blackcat-link-link').on('click', function(e) {
        e.preventDefault()
        var href = $(this).attr('href')
        var isBlank = $(this).attr('target') === '_blank' // || /^http(s*):\/\//.test(href)
        if (href) {
          isBlank ? util.openWindow(href) : (window.location = href)
        }
      })
    },

    cache: function() {
      page.els = {}

      page.els.$window = $(window)
      page.els.$body = $('body')
      page.els.$top = $('.scroll-top')

      $('body').append(page.els.$sidemask = $('<div class="backmask nav__mask" style="display:none"/>'))
    },

    init: function () {
      page.config()

      page.cache()
      page.on_resize()
      page.on_scroll()
      page.detectMobile()
      page.scrollToTop()
      page.collapseSidebar()

      loadMeta(window.BLACKCAT_CONFIG)
      loadHeader(window.BLACKCAT_CONFIG)
      loadFooter(window.BLACKCAT_CONFIG)
      loadMain(window.BLACKCAT_CONFIG)

      page.bindEvents()

      $load.addClass('hide')
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

  // 等待所有资源加载完毕
  var timer = -1
  var count = 4 // 3次轮询机会，超过就不在加载脚本
  
  var run = function() {
    var isSidebarLoaded = $('#profile_block').length > 0
    var isHeaderLoaded = $('blackcat-header').length > 0
    var isFooterLoaded = $('blackcat-footer').length > 0
    var isFaviconLoaded = $('link[rel*="icon"]').length > 0
    

    if (
      isSidebarLoaded &&
      isHeaderLoaded &&
      isFooterLoaded &&
      isFaviconLoaded
    ) {
      page.init()
      count = 0
    } else {
      timer = setTimeout(function() {
        clearTimeout(timer)
        count--

        if (count <= 0) {
          $load.addClass('hide')
        }

        count > 0 && run()
      }, 500 + (4 - count) * 100)
    }
  }

  // 启动
  $('body').append($load)
  run()
})