(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Scrollbar = factory());
}(this, (function () { 'use strict';

  function isFunction(fn) {
    return Object.prototype.toString.call(fn) === '[object Function]';
  }

  function isNode(node) {
    return node && node.nodeType === 1 && typeof node.nodeName === 'string';
  }
  var userAgent = navigator.userAgent.toLowerCase();

  var isFirefox = (userAgent.indexOf('firefox') >= 0);

  function merge() {
    var arguments$1 = arguments;

    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (arguments$1[i].hasOwnProperty(key)) {
          arguments$1[0][key] = arguments$1[i][key];
        }
      }
    }
    return arguments[0];
  }

  var scrollbarWidth;
  var getScrollbarWidth = function() {
    if (scrollbarWidth !== undefined) { return scrollbarWidth; }
    var e = document.createElement('div');
    e.style.position = 'absolute';
    e.style.top = '-9999px';
    e.style.width = '100px';
    e.style.height = '100px';
    e.style.overflow = 'scroll';
    document.body.appendChild(e);
    scrollbarWidth = e.offsetWidth - e.clientWidth;
    document.body.removeChild(e);
    return scrollbarWidth;
  };

  var cancelBubble = function(event) {
    if (!event) { event = window.event; }

    if (isFunction(event.stopPropagation)) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }

    if (event.cancelBubble === false) {
      event.cancelBubble = true;
    }
  };

  var trim = function (str) { return str.replace(/(^\s*)|(\s*$)/g, ''); };

  function hasClass(element, className) {
    if (!element || !className) { return false; }

    className = trim(className);

    if (element.classList) {
      return element.classList.contains(className);
    } else {
      return (" " + (element.className) + " ").indexOf((" " + className + " ")) > -1;
    }
  }

  function addClass(element, classNames) {
    if (!element || !classNames) { return; }

    var array = Array.isArray(classNames) ? classNames : trim(classNames).split(/\s/);
    var len = array.length;

    for (var i = 0; i < len; i++) {
      var className = array[i];

      if (className && !hasClass(element, className)) {
        if (element.classList) {
          element.classList.add(className);
        } else {
          element.className += ' ' + className;
        }
      }
    }
  }

  function removeClass(element, classNames) {
    if (!element || !classNames) { return; }

    var array = Array.isArray(classNames) ? classNames : trim(classNames).split(/\s/);
    var len = array.length;

    for (var i = 0; i < len; i++) {
      var className = array[i];

      if (className && hasClass(element, className)) {
        if (element.classList) {
          element.classList.remove(className);
        } else {
          element.className = (" " + (element.className) + " ").replace((" " + className + " "), ' ');
          element.className = trim(element.className);
        }
      }
    }
  }

  var raf;
  function requestAnimationFrame(callback) {
    if (!raf) {
      raf = (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
          return setTimeout(callback, 16);
        }
      ).bind(window);
    }
    return raf(callback);
  }

  var caf;
  function cancelAnimationFrame(id) {
    if (!caf) {
      caf = (
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        function(id) {
          clearTimeout(id);
        }
      ).bind(window);
    }
    caf(id);
  }

  function createStyles(styleText) {
    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = styleText;
    } else {
      style.appendChild(document.createTextNode(styleText));
    }
    (document.querySelector('head') || document.body).appendChild(style);
    return style;
  }

  function getComputedStyle(elem, prop, pseudo) {
    // for older versions of Firefox, `getComputedStyle` required
    // the second argument and may return `null` for some elements
    // when `display: none`
    var computedStyle = window.getComputedStyle(elem, pseudo || null) || {
      display: 'none'
    };

    return computedStyle[prop];
  }

  function getRenderInfo(elem) {
    if (!document.documentElement.contains(elem)) {
      return {
        detached: true,
        rendered: false
      };
    }

    var current = elem;
    while (current !== document) {
      if (getComputedStyle(current, 'display') === 'none') {
        return {
          detached: false,
          rendered: false
        };
      }
      current = current.parentNode;
    }

    return {
      detached: false,
      rendered: true
    };
  }

  // https://github.com/Justineo/resize-detector

  var css = '.resize-triggers{visibility:hidden;opacity:0}.resize-contract-trigger,.resize-contract-trigger:before,.resize-expand-trigger,.resize-triggers{content:"";position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden}.resize-contract-trigger,.resize-expand-trigger{background:#eee;overflow:auto}.resize-contract-trigger:before{width:200%;height:200%}';

  var total = 0;
  var style = null;

  function addListener(elem, callback) {
    if (!elem) { return; }

    if (!elem.__resize_mutation_handler__) {
      elem.__resize_mutation_handler__ = handleMutation.bind(elem);
    }

    var listeners = elem.__resize_listeners__;

    if (!listeners) {
      elem.__resize_listeners__ = [];
      if (window.ResizeObserver) {
        var offsetWidth = elem.offsetWidth;
        var offsetHeight = elem.offsetHeight;
        var ro = new ResizeObserver(function () {
          if (!elem.__resize_observer_triggered__) {
            elem.__resize_observer_triggered__ = true;
            if (elem.offsetWidth === offsetWidth && elem.offsetHeight === offsetHeight) {
              return;
            }
          }
          runCallbacks(elem);
        });

        // initially display none won't trigger ResizeObserver callback
        var ref = getRenderInfo(elem);
        var detached = ref.detached;
        var rendered = ref.rendered;
        elem.__resize_observer_triggered__ = detached === false && rendered === false;
        elem.__resize_observer__ = ro;
        ro.observe(elem);
      } else if (elem.attachEvent && elem.addEventListener) {
        // targeting IE9/10
        elem.__resize_legacy_resize_handler__ = function handleLegacyResize() {
          runCallbacks(elem);
        };
        elem.attachEvent('onresize', elem.__resize_legacy_resize_handler__);
        document.addEventListener('DOMSubtreeModified', elem.__resize_mutation_handler__);
      } else {
        if (!total) {
          style = createStyles(css);
        }
        initTriggers(elem);

        elem.__resize_rendered__ = getRenderInfo(elem).rendered;
        if (window.MutationObserver) {
          var mo = new MutationObserver(elem.__resize_mutation_handler__);
          mo.observe(document, {
            attributes   : true,
            childList    : true,
            characterData: true,
            subtree      : true
          });
          elem.__resize_mutation_observer__ = mo;
        }
      }
    }

    elem.__resize_listeners__.push(callback);
    total++;
  }

  function removeListener(elem, callback) {
    var listeners = elem && elem.__resize_listeners__;
    if (!listeners) {
      return;
    }

    if (callback) {
      listeners.splice(listeners.indexOf(callback), 1);
    }

    // no listeners exist, or removing all listeners
    if (!listeners.length || !callback) {
      // targeting IE9/10
      if (elem.detachEvent && elem.removeEventListener) {
        elem.detachEvent('onresize', elem.__resize_legacy_resize_handler__);
        document.removeEventListener('DOMSubtreeModified', elem.__resize_mutation_handler__);
        return;
      }

      if (elem.__resize_observer__) {
        elem.__resize_observer__.unobserve(elem);
        elem.__resize_observer__.disconnect();
        elem.__resize_observer__ = null;
      } else {
        if (elem.__resize_mutation_observer__) {
          elem.__resize_mutation_observer__.disconnect();
          elem.__resize_mutation_observer__ = null;
        }
        elem.removeEventListener('scroll', handleScroll);
        elem.removeChild(elem.__resize_triggers__.triggers);
        elem.__resize_triggers__ = null;
      }
      elem.__resize_listeners__ = null;
    }

    if (!--total && style) {
      style.parentNode.removeChild(style);
    }
  }

  function getUpdatedSize(elem) {
    var ref = elem.__resize_last__;
    var width = ref.width;
    var height = ref.height;
    var offsetWidth = elem.offsetWidth;
    var offsetHeight = elem.offsetHeight;
    if (offsetWidth !== width || offsetHeight !== height) {
      return {
        width : offsetWidth,
        height: offsetHeight
      };
    }
    return null;
  }

  function handleMutation() {
    // `this` denotes the scrolling element
    var ref = getRenderInfo(this);
    var rendered = ref.rendered;
    var detached = ref.detached;
    if (rendered !== this.__resize_rendered__) {
      if (!detached && this.__resize_triggers__) {
        resetTriggers(this);
        this.addEventListener('scroll', handleScroll, true);
      }
      this.__resize_rendered__ = rendered;
      runCallbacks(this);
    }
  }

  function handleScroll() {
    var this$1 = this;

    // `this` denotes the scrolling element
    resetTriggers(this);
    if (this.__resize_raf__) {
      cancelAnimationFrame(this.__resize_raf__);
    }
    this.__resize_raf__ = requestAnimationFrame(function () {
      var updated = getUpdatedSize(this$1);
      if (updated) {
        this$1.__resize_last__ = updated;
        runCallbacks(this$1);
      }
    });
  }

  function runCallbacks(elem) {
    if (!elem || !elem.__resize_listeners__) {
      return;
    }
    elem.__resize_listeners__.forEach(function (callback) {
      callback.call(elem, elem);
    });
  }

  function initTriggers(elem) {
    var position = getComputedStyle(elem, 'position');
    if (!position || position === 'static') {
      elem.style.position = 'relative';
    }

    elem.__resize_old_position__ = position;
    elem.__resize_last__ = {};

    var triggers = document.createElement('div');
    var expand = document.createElement('div');
    var expandChild = document.createElement('div');
    var contract = document.createElement('div');

    triggers.className = 'resize-triggers';
    expand.className = 'resize-expand-trigger';
    contract.className = 'resize-contract-trigger';

    expand.appendChild(expandChild);
    triggers.appendChild(expand);
    triggers.appendChild(contract);
    elem.appendChild(triggers);

    elem.__resize_triggers__ = {
      triggers: triggers,
      expand: expand,
      expandChild: expandChild,
      contract: contract
    };

    resetTriggers(elem);
    elem.addEventListener('scroll', handleScroll, true);

    elem.__resize_last__ = {
      width : elem.offsetWidth,
      height: elem.offsetHeight
    };
  }

  function resetTriggers(elem) {
    var ref = elem.__resize_triggers__;
    var expand = ref.expand;
    var expandChild = ref.expandChild;
    var contract = ref.contract;

    // batch read
    var csw = contract.scrollWidth;
    var csh = contract.scrollHeight;
    var eow = expand.offsetWidth;
    var eoh = expand.offsetHeight;
    var esw = expand.scrollWidth;
    var esh = expand.scrollHeight;

    // batch write
    contract.scrollLeft = csw;
    contract.scrollTop = csh;
    expandChild.style.width = eow + 1 + 'px';
    expandChild.style.height = eoh + 1 + 'px';
    expand.scrollLeft = esw;
    expand.scrollTop = esh;
  }

  var GlobalName = 'Scrollbar';

  var CLASSNAMES = {
    element            : 'scrollable-wrapper',
    view               : 'view',
    horizontalScrollbar: 'scrollbar is-horizontal',
    verticalScrollbar  : 'scrollbar is-vertical',
    thumb              : 'thumb',
    horizontalShadow   : 'shadow is-horizontal',
    verticalShadow     : 'shadow is-vertical',
    resizeObserver     : 'resize-observer',
    horizontal         : 'is-horizontal',
    unselect           : 'is-unselect',
    prevented          : 'is-default',
    visible            : 'is-visible',
    invisible          : 'is-invisible',
    active             : 'is-active',
    force              : 'is-force-render',
    hiddenDefault      : 'is-hidden-default',
    observed           : 'is-observed'
  };

  // reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js

  var WHEEL = 'onwheel' in document.body ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';

  var Scrollbar = function Scrollbar(options) {
    if (isNode(options)) {
      options = { element: options };
    }
    // 作用对象
    this.element = null;
    // 配置
    this.horizontal = false; // 启用滚动反转，默认关闭
    this.minThumbSize = 20; // 滚动滑块最小长度
    this.forceRenderTrack = true; // 启用强制渲染虚拟滚动条，原始滚动条宽度为 0，则不渲染虚拟滚动条，默认开启
    this.useRender = true; // 启用渲染模式，默认打开渲染默认，关闭需要手动渲染
    this.useResize = true; // 启用监听模式，默认值根据滚动条宽度是否大于0
    this.useShadow = false; // 启用阴影模式，默认关闭
    // 事件钩子
    this.beforeCreate = null;
    this.created = null;
    this.beforeDestroy = null;
    this.destroyed = null;
    this.onResize = null;
    this.onScroll = null;
    this.onUpdate = null;
    // 合并参数
    merge(this, options);
    // 记录值
    this._events = {};
    this._scrollbarWidth = getScrollbarWidth();
    this._preventRenderTrack = this._scrollbarWidth === 0 && this.forceRenderTrack === false;
    this._created = false;
    this._cursorDown = false;
    // 变化值
    this._prevPageX = 0;
    this._prevPageY = 0;
    this._scrollTopMax = 0;
    this._scrollLeftMax = 0;
    this._trackTopMax = 0;
    this._trackLeftMax = 0;
    // DomNode
    this.$view = this.element;
    this.$scrollbarY = null;
    this.$scrollbarX = null;
    this.$sliderY = null;
    this.$sliderX = null;
    this.$shadowY = null;
    this.$shadowX = null;
    this.$resizeObserver = null;

    // 处理是否需要监听器
    if ('useResize' in options) {
      this.useResize = options.useResize;
    } else if (this._preventRenderTrack) {
      this.useResize = isFunction(this.onResize);
    }
  };

  Scrollbar.prototype.create = function create () {
    if (this._created) {
      console.warn('calling on a already-created object');
      return this;
    }

    isFunction(this.beforeCreate) && this.beforeCreate();

    if (this.useRender) {
      this.$view = document.createElement('div');
      this.$resizeObserver = document.createElement('div');

      this.$view.className = CLASSNAMES.view;
      this.$resizeObserver.className = CLASSNAMES.resizeObserver;

      while (this.element.childNodes.length > 0) {
        this.$resizeObserver.appendChild(this.element.childNodes[0]);
      }
      this.$view.appendChild(this.$resizeObserver);
      this.element.appendChild(this.$view);

      if (this._preventRenderTrack === false) {
        this.$scrollbarX = document.createElement('div');
        this.$scrollbarY = document.createElement('div');
        this.$sliderX = document.createElement('div');
        this.$sliderY = document.createElement('div');

        this.$scrollbarX.className = CLASSNAMES.horizontalScrollbar;
        this.$scrollbarY.className = CLASSNAMES.verticalScrollbar;
        this.$sliderX.className = CLASSNAMES.thumb;
        this.$sliderY.className = CLASSNAMES.thumb;

        this.$scrollbarX.appendChild(this.$sliderX);
        this.$scrollbarY.appendChild(this.$sliderY);
        this.element.appendChild(this.$scrollbarX);
        this.element.appendChild(this.$scrollbarY);
      }
    } else {
      this.$view = this.element.querySelector('.' + CLASSNAMES.view);
      this.$resizeObserver = this.$view.querySelector('.' + CLASSNAMES.resizeObserver);
      this.$scrollbarX = this.element.querySelector('.' + CLASSNAMES.horizontalScrollbar.split(/\s/).join('.'));
      this.$scrollbarY = this.element.querySelector('.' + CLASSNAMES.verticalScrollbar.split(/\s/).join('.'));

      if (this.$scrollbarX) {
        this.$sliderX = this.$scrollbarX.querySelector('.' + CLASSNAMES.thumb);
      }

      if (this.$scrollbarY) {
        this.$sliderY = this.$scrollbarY.querySelector('.' + CLASSNAMES.thumb);
      }
    }

    addClass(this.element, CLASSNAMES.element);
    this.forceRenderTrack && addClass(this.element, CLASSNAMES.force);
    this._scrollbarWidth <= 0 && addClass(this.element, CLASSNAMES.hiddenDefault);
    this._preventRenderTrack && addClass(this.element, CLASSNAMES.prevented);

    if (this.horizontal === true) {
      // this.$view.style.overflowY = 'auto';
      addClass(this.element, CLASSNAMES.horizontal);
      addClass(this.$scrollbarY, CLASSNAMES.invisible);
    }

    if (this.useShadow) {
      this._createShadow();
    }

    if (this.useResize) {
      this._createResizeTrigger();
    }

    this._created = true;

    isFunction(this.created) && this.created();

    return this._bindEvents().update();
  };

  Scrollbar.prototype.update = function update () {
    if (this._preventRenderTrack) { return this; }

    if (this._created === false) {
      console.warn('calling on a not-yet-created object');
      return this;
    }

    if (this._scrollbarWidth > 0) {
      this.$view.style.width = "calc(100% + " + (this._scrollbarWidth) + "px)";
      this.$view.style.height = "calc(100% + " + (this._scrollbarWidth) + "px)";
    } else {
      this.$view.style.width = '';
      this.$view.style.height = '';
    }

    removeClass(this.$scrollbarY, CLASSNAMES.invisible);
    removeClass(this.$scrollbarX, CLASSNAMES.invisible);

    var naturalThumbSizeX = this.$view.clientWidth / this.$view.scrollWidth * this.$scrollbarX.offsetWidth;
    var naturalThumbSizeY = this.$view.clientHeight / this.$view.scrollHeight * this.$scrollbarY.offsetHeight;

    this._scrollTopMax = this.$view.scrollHeight - this.$view.clientHeight;
    this._scrollLeftMax = this.$view.scrollWidth - this.$view.clientWidth;

    var thumbSizeX = 0;
    var thumbSizeY = 0;

    if (this._scrollLeftMax <= 0) {
      addClass(this.$scrollbarX, CLASSNAMES.invisible);
    } else {
      thumbSizeX = Math.max(naturalThumbSizeX, this.minThumbSize);
    }
    this.$sliderX.style.width = thumbSizeX + 'px';

    if (this._scrollTopMax <= 0) {
      addClass(this.$scrollbarY, CLASSNAMES.invisible);
    } else {
      thumbSizeY = Math.max(naturalThumbSizeY, this.minThumbSize);
    }
    this.$sliderY.style.height = thumbSizeY + 'px';

    this._trackTopMax = this.$scrollbarY.clientHeight - this.$sliderY.offsetHeight;
    this._trackLeftMax = this.$scrollbarX.clientWidth - this.$sliderX.offsetWidth;

    isFunction(this.onUpdate) && this.onUpdate();

    this._scrollHandler();
    return this;
  };

  Scrollbar.prototype.destroy = function destroy () {
    if (this._created === false) {
      console.warn('calling on a not-yet-created object');
      return this;
    }

    removeClass(this.element, [
      CLASSNAMES.horizontal,
      CLASSNAMES.observed,
      CLASSNAMES.prevented,
      CLASSNAMES.hiddenDefault,
      CLASSNAMES.force,
      CLASSNAMES.element
    ]);

    this._unbindEvents();

    if (this.useResize) {
      removeListener(this.$resizeObserver, this._events.resizeHandler);
    }

    if (this.useShadow) {
      this.element.removeChild(this.$shadowY);
      this.element.removeChild(this.$shadowX);
      this.$shadowY = null;
      this.$shadowX = null;
    }

    if (this.useRender === true) {
      if (!this._preventRenderTrack) {
        this.element.removeChild(this.$scrollbarY);
        this.element.removeChild(this.$scrollbarX);

        this.$scrollbarY = null;
        this.$scrollbarX = null;
        this.$sliderY = null;
        this.$sliderX = null;
      }

      while (this.$resizeObserver.childNodes.length > 0) {
        this.element.appendChild(this.$resizeObserver.childNodes[0]);
      }

      this.element.removeChild(this.$view);
      this.$resizeObserver = null;
      this.$view = null;
    } else {
      this.$view.style.width = '';
      this.$view.style.height = '';

      if (this._preventRenderTrack === false) {
        removeClass(this.$scrollbarY, CLASSNAMES.invisible);
        removeClass(this.$scrollbarX, CLASSNAMES.invisible);
      } else {
        addClass(this.$scrollbarY, CLASSNAMES.invisible);
        addClass(this.$scrollbarX, CLASSNAMES.invisible);
      }
    }

    this._created = false;
    return null;
  };

  Scrollbar.prototype.getViewElement = function getViewElement () {
    return this.$view;
  };

  Scrollbar.prototype._createResizeTrigger = function _createResizeTrigger () {
    addClass(this.element, CLASSNAMES.observed);
    this._events.resizeHandler = this._resizeHandler.bind(this);
    addListener(this.$resizeObserver, this._events.resizeHandler);
  };

  Scrollbar.prototype._createShadow = function _createShadow () {
    this.$shadowX = document.createElement('div');
    this.$shadowY = document.createElement('div');
    this.element.appendChild(this.$shadowX);
    this.element.appendChild(this.$shadowY);
    this.$shadowX.className = CLASSNAMES.horizontalShadow + ' ' + CLASSNAMES.invisible;
    this.$shadowY.className = CLASSNAMES.verticalShadow + ' ' + CLASSNAMES.invisible;
  };

  Scrollbar.prototype._resizeHandler = function _resizeHandler () {
    // 浏览器缩放，需要重新计算
    // 无须考虑特殊情况，浏览器已经处理好了
    var ratio = window.devicePixelRatio || 1;
    if (ratio) {
      this._scrollbarWidth = getScrollbarWidth() / ratio;
    }
    this.update();
    isFunction(this.onResize) && this.onResize();
  };

  Scrollbar.prototype._bindEvents = function _bindEvents () {
    this._events.scrollHandler = this._scrollHandler.bind(this);
    this._events.clickHorizontalTrackHandler = this._clickTrackHandler(false).bind(this);
    this._events.clickVerticalTrackHandler = this._clickTrackHandler(true).bind(this);
    this._events.clickHorizontalThumbHandler = this._clickThumbHandler(false).bind(this);
    this._events.clickVerticalThumbHandler = this._clickThumbHandler(true).bind(this);
    this._events.mouseScrollTrackHandler = this._mouseScrollTrackHandler.bind(this);
    this._events.mouseUpDocumentHandler = this._mouseUpDocumentHandler.bind(this);
    this._events.mouseMoveDocumentHandler = this._mouseMoveDocumentHandler.bind(this);

    if (this.horizontal) {
      this.$view.addEventListener(WHEEL, this._events.mouseScrollTrackHandler);
    } else {
      this.$view.addEventListener('scroll', this._events.scrollHandler);
    }

    if (this._preventRenderTrack === false) {
      this.$scrollbarX.addEventListener('mousedown', this._events.clickHorizontalTrackHandler);
      this.$scrollbarY.addEventListener('mousedown', this._events.clickVerticalTrackHandler);
      this.$sliderX.addEventListener('mousedown', this._events.clickHorizontalThumbHandler);
      this.$sliderY.addEventListener('mousedown', this._events.clickVerticalThumbHandler);
      this.$scrollbarX.addEventListener(WHEEL, this._events.mouseScrollTrackHandler);
      this.$scrollbarY.addEventListener(WHEEL, this._events.mouseScrollTrackHandler);
      document.addEventListener('mouseup', this._events.mouseUpDocumentHandler);
    }

    return this;
  };

  Scrollbar.prototype._unbindEvents = function _unbindEvents () {
    this.$view.removeEventListener('scroll', this._events.scrollHandler);
    this.$view.removeEventListener(WHEEL, this._events.mouseScrollTrackHandler);

    if (this._preventRenderTrack === false) {
      this.$scrollbarY.removeEventListener('mousedown', this._events.clickVerticalTrackHandler);
      this.$scrollbarX.removeEventListener('mousedown', this._events.clickHorizontalTrackHandler);
      this.$sliderY.removeEventListener('mousedown', this._events.clickVerticalThumbHandler);
      this.$sliderX.removeEventListener('mousedown', this._events.clickHorizontalThumbHandler);
      this.$scrollbarY.removeEventListener(WHEEL, this._events.mouseScrollTrackHandler);
      this.$scrollbarX.removeEventListener(WHEEL, this._events.mouseScrollTrackHandler);
      document.removeEventListener('mouseup', this._events.mouseUpDocumentHandler);
      document.removeEventListener('mousemove', this._events.mouseMoveDocumentHandler);
    }

    return this;
  };

  Scrollbar.prototype._scrollHandler = function _scrollHandler () {
    var x = (this.$view.scrollLeft * this._trackLeftMax / this._scrollLeftMax) || 0;
    var y = (this.$view.scrollTop * this._trackTopMax / this._scrollTopMax) || 0;

    this.useShadow && this._setShadowStyle();

    if (this._preventRenderTrack === false) {
      this.$sliderX.style.msTransform = "translateX(" + x + "px)";
      this.$sliderX.style.webkitTransform = "translate3d(" + x + "px, 0, 0)";
      this.$sliderX.style.transform = "translate3d(" + x + "px, 0, 0)";

      this.$sliderY.style.msTransform = "translateY(" + y + "px)";
      this.$sliderY.style.webkitTransform = "translate3d(0, " + y + "px, 0)";
      this.$sliderY.style.transform = "translate3d(0, " + y + "px, 0)";
    }

    isFunction(this.onScroll) && this.onScroll(x, y);
  };

  Scrollbar.prototype._setShadowStyle = function _setShadowStyle () {
    if (this.$view.scrollTop === 0) {
      removeClass(this.$shadowY, CLASSNAMES.visible);
      addClass(this.$shadowY, CLASSNAMES.invisible);
    } else {
      addClass(this.$shadowY, CLASSNAMES.visible);
      removeClass(this.$shadowY, CLASSNAMES.invisible);
    }

    if (this.$view.scrollLeft === this.$view.scrollWidth - this.$view.clientWidth) {
      removeClass(this.$shadowX, CLASSNAMES.visible);
      addClass(this.$shadowX, CLASSNAMES.invisible);
    } else {
      addClass(this.$shadowX, CLASSNAMES.visible);
      removeClass(this.$shadowX, CLASSNAMES.invisible);
    }
  };

  Scrollbar.prototype._mouseScrollTrackHandler = function _mouseScrollTrackHandler (e) {
      var assign, assign$1;

    var deltaX = 0;
    var deltaY = 0;

    cancelBubble(e);
    isFunction(e.preventDefault) ? e.preventDefault() : e.returnValue = false; // 阻止默认滚动行为，防止父级滚动

    deltaY = e.deltaY || e.wheelDeltaY || -e.wheelDelta || 0;
    deltaX = e.deltaX || e.wheelDeltaX || 0;

    if (isFirefox) {
      deltaY *= 40;
      deltaX *= 40;
    }

    if (e.shiftKey) {
      (assign = [deltaY, deltaX], deltaX = assign[0], deltaY = assign[1]);
    }

    if (this.horizontal) {
      (assign$1 = [deltaY, deltaX], deltaX = assign$1[0], deltaY = assign$1[1]);
    }

    if (e.altKey) {
      deltaX *= deltaX;
      deltaY *= deltaY;
    }

    this.$view.scrollTop += deltaY;
    this.$view.scrollLeft += deltaX;
    this.horizontal && this._scrollHandler();
  };

  Scrollbar.prototype._clickTrackHandler = function _clickTrackHandler (vertical) {
      var this$1 = this;

    return function (e) {
      var offset;
      var thumbPositionPercentage;

      if (vertical) {
        offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY) - this$1.$sliderY.offsetHeight / 2;
        thumbPositionPercentage = offset * 100 / this$1.$scrollbarY.offsetHeight;
        this$1.$view.scrollTop = thumbPositionPercentage * this$1.$view.scrollHeight / 100;
      } else {
        offset = Math.abs(e.target.getBoundingClientRect().left - e.clientX) - this$1.$sliderX.offsetWidth / 2;
        thumbPositionPercentage = offset * 100 / this$1.$scrollbarX.offsetWidth;
        this$1.$view.scrollLeft = thumbPositionPercentage * this$1.$view.scrollWidth / 100;
      }

      this$1.horizontal === true && this$1._scrollHandler();
    };
  };

  Scrollbar.prototype._clickThumbHandler = function _clickThumbHandler (vertical) {
      var this$1 = this;

    return function (e) {
      cancelBubble(e);

      if (e.ctrlKey || e.button === 2) {
        return;
      }

      addClass(e.currentTarget, CLASSNAMES.active);

      this$1._startDrag(e);

      if (vertical) {
        this$1._prevPageY = e.currentTarget.offsetHeight - (e.clientY - e.currentTarget.getBoundingClientRect().top);
      } else {
        this$1._prevPageX = e.currentTarget.offsetWidth - (e.clientX - e.currentTarget.getBoundingClientRect().left);
      }
    };
  };

  Scrollbar.prototype._startDrag = function _startDrag (e) {
    e.stopImmediatePropagation();

    this._cursorDown = true;
    addClass(document.body, CLASSNAMES.unselect);

    document.addEventListener('mousemove', this._events.mouseMoveDocumentHandler);
    document.onselectstart = function () { return false; };
  };

  Scrollbar.prototype._mouseUpDocumentHandler = function _mouseUpDocumentHandler () {
    this._cursorDown = false;
    this._prevPageX = this._prevPageY = 0;

    removeClass(document.body, CLASSNAMES.unselect);
    removeClass(this.$sliderY, CLASSNAMES.active);
    removeClass(this.$sliderX, CLASSNAMES.active);

    document.removeEventListener('mousemove', this._events.mouseMoveDocumentHandler);
    document.onselectstart = null;
  };

  Scrollbar.prototype._mouseMoveDocumentHandler = function _mouseMoveDocumentHandler (e) {
    if (this._cursorDown === false) { return; }

    var offset, thumbClickPosition;

    if (this._prevPageY) {
      offset = e.clientY - this.$scrollbarY.getBoundingClientRect().top;
      thumbClickPosition = this.$sliderY.offsetHeight - this._prevPageY;
      this.$view.scrollTop = this._scrollTopMax * (offset - thumbClickPosition) / this._trackTopMax;
      this.horizontal === true && this._scrollHandler();
      return;
    }

    if (this._prevPageX) {
      offset = e.clientX - this.$scrollbarX.getBoundingClientRect().left;
      thumbClickPosition = this.$sliderX.offsetWidth - this._prevPageX;
      this.$view.scrollLeft = this._scrollLeftMax * (offset - thumbClickPosition) / this._trackLeftMax;

      this.horizontal === true && this._scrollHandler();
    }
  };

  return Scrollbar;

})));