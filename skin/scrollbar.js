!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).Scrollbar=t()}(this,function(){"use strict";function n(e){return"[object Function]"===Object.prototype.toString.call(e)}var t,e=navigator.userAgent.toLowerCase(),l=0<=e.indexOf("firefox"),i=0<=e.indexOf("android"),s=/(iphone|ipad|ipod|ios)/.test(e),r=0<=e.indexOf("windows phone"),o=0<=e.indexOf("symbianos"),a=i||s||r||o;function h(){if(void 0!==t)return t;var e=document.createElement("div");return e.style.position="absolute",e.style.top="-9999px",e.style.width="100px",e.style.height="100px",e.style.overflow="scroll",document.body.appendChild(e),t=e.offsetWidth-e.clientWidth,document.body.removeChild(e),t}function c(e){n((e=e||window.event).stopPropagation)?e.stopPropagation():e.cancelBubble=!0,!1===e.cancelBubble&&(e.cancelBubble=!0)}var d,_,v=function(e){return e.replace(/(^\s*)|(\s*$)/g,"")};function u(e,t){return e&&t&&(t=v(t),e.classList?e.classList.contains(t):-1<(" "+e.className+" ").indexOf(" "+t+" "))}function m(e,t){if(e&&t)for(var i=Array.isArray(t)?t:v(t).split(/\s/),s=i.length,r=0;r<s;r++){var n=i[r];n&&!u(e,n)&&(e.classList?e.classList.add(n):e.className+=" "+n)}}function b(e,t){if(e&&t)for(var i=Array.isArray(t)?t:v(t).split(/\s/),s=i.length,r=0;r<s;r++){var n=i[r];n&&u(e,n)&&(e.classList?e.classList.remove(n):(e.className=(" "+e.className+" ").replace(" "+n+" "," "),e.className=v(e.className)))}}function f(e,t,i){return(window.getComputedStyle(e,i||null)||{display:"none"})[t]}function p(e){if(!document.documentElement.contains(e))return{detached:!0,rendered:!1};for(var t=e;t!==document;){if("none"===f(t,"display"))return{detached:!1,rendered:!1};t=t.parentNode}return{detached:!1,rendered:!0}}var w=0,$=null;function g(e,t){if(e){var i,s;if(e.__resize_mutation_handler__||(e.__resize_mutation_handler__=function(){var e=p(this),t=e.rendered,i=e.detached;t!==this.__resize_rendered__&&(!i&&this.__resize_triggers__&&(H(this),this.addEventListener("scroll",z,!0)),this.__resize_rendered__=t,y(this))}.bind(e)),!e.__resize_listeners__)if(e.__resize_listeners__=[],window.ResizeObserver){var r=e.offsetWidth,n=e.offsetHeight,l=new ResizeObserver(function(){!e.__resize_observer_triggered__&&(e.__resize_observer_triggered__=!0,e.offsetWidth===r&&e.offsetHeight===n)||y(e)}),o=p(e),a=o.detached,h=o.rendered;e.__resize_observer_triggered__=!1===a&&!1===h,(e.__resize_observer__=l).observe(e)}else if(e.attachEvent&&e.addEventListener)e.__resize_legacy_resize_handler__=function(){y(e)},e.attachEvent("onresize",e.__resize_legacy_resize_handler__),document.addEventListener("DOMSubtreeModified",e.__resize_mutation_handler__);else if(w||(i='.resize-triggers{visibility:hidden;opacity:0}.resize-contract-trigger,.resize-contract-trigger:before,.resize-expand-trigger,.resize-triggers{content:"";position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden}.resize-contract-trigger,.resize-expand-trigger{background:#eee;overflow:auto}.resize-contract-trigger:before{width:200%;height:200%}',(s=document.createElement("style")).type="text/css",s.styleSheet?s.styleSheet.cssText=i:s.appendChild(document.createTextNode(i)),(document.querySelector("head")||document.body).appendChild(s),$=s),function(e){var t=f(e,"position");t&&"static"!==t||(e.style.position="relative");e.__resize_old_position__=t,e.__resize_last__={};var i=document.createElement("div"),s=document.createElement("div"),r=document.createElement("div"),n=document.createElement("div");i.className="resize-triggers",s.className="resize-expand-trigger",n.className="resize-contract-trigger",s.appendChild(r),i.appendChild(s),i.appendChild(n),e.appendChild(i),e.__resize_triggers__={triggers:i,expand:s,expandChild:r,contract:n},H(e),e.addEventListener("scroll",z,!0),e.__resize_last__={width:e.offsetWidth,height:e.offsetHeight}}(e),e.__resize_rendered__=p(e).rendered,window.MutationObserver){var c=new MutationObserver(e.__resize_mutation_handler__);c.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0}),e.__resize_mutation_observer__=c}e.__resize_listeners__.push(t),w++}}function z(){var e,t,o=this;H(this),this.__resize_raf__&&(e=this.__resize_raf__,(_=_||(window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||function(e){clearTimeout(e)}).bind(window))(e)),this.__resize_raf__=(t=function(){var e,t,i,s,r,n,l=(t=(e=o).__resize_last__,i=t.width,s=t.height,r=e.offsetWidth,n=e.offsetHeight,r!==i||n!==s?{width:r,height:n}:null);l&&(o.__resize_last__=l,y(o))},(d=d||(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){return setTimeout(e,16)}).bind(window))(t))}function y(t){t&&t.__resize_listeners__&&t.__resize_listeners__.forEach(function(e){e.call(t,t)})}function H(e){var t=e.__resize_triggers__,i=t.expand,s=t.expandChild,r=t.contract,n=r.scrollWidth,l=r.scrollHeight,o=i.offsetWidth,a=i.offsetHeight,h=i.scrollWidth,c=i.scrollHeight;r.scrollLeft=n,r.scrollTop=l,s.style.width=o+1+"px",s.style.height=a+1+"px",i.scrollLeft=h,i.scrollTop=c}function T(e){var t;(t=e)&&1===t.nodeType&&"string"==typeof t.nodeName&&(e={element:e}),this.element=null,this.horizontal=!1,this.minThumbSize=20,this.forceRenderTrack=!0,this.useRender=!0,this.useResize=!0,this.useShadow=!1,this.beforeCreate=null,this.created=null,this.beforeDestroy=null,this.destroyed=null,this.onResize=null,this.onScroll=null,this.onUpdate=null,function(e){for(var t=arguments,i=1;i<arguments.length;i++)for(var s in arguments[i])t[i].hasOwnProperty(s)&&(t[0][s]=t[i][s])}(this,e),this._events={},this._scrollbarWidth=h(),this._preventRenderTrack=a||!1===this.forceRenderTrack&&0===this._scrollbarWidth,this._created=!1,this._cursorDown=!1,this._prevPageX=0,this._prevPageY=0,this._scrollTopMax=0,this._scrollLeftMax=0,this._trackTopMax=0,this._trackLeftMax=0,this.$view=this.element,this.$scrollbarY=null,this.$scrollbarX=null,this.$sliderY=null,this.$sliderX=null,this.$shadowY=null,this.$shadowX=null,this.$resizeObserver=null,"useResize"in e?this.useResize=e.useResize:this._preventRenderTrack&&(this.useResize=n(this.onResize))}var k="Scrollbar",Y={element:"scrollable-wrapper",view:"view",horizontalScrollbar:"scrollbar is-horizontal",verticalScrollbar:"scrollbar is-vertical",thumb:"thumb",horizontalShadow:"shadow is-horizontal",verticalShadow:"shadow is-vertical",resizeObserver:"resize-observer",horizontal:"is-horizontal",unselect:"is-unselect",prevented:"is-default",visible:"is-visible",invisible:"is-invisible",active:"is-active",force:"is-force-render",hiddenDefault:"is-hidden-default",observed:"is-observed"},X="onwheel"in document.body?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll";return T.prototype.create=function(){if(this._created)return console.warn("calling on a already-created object"),this;if(n(this.beforeCreate)&&this.beforeCreate(),this.useRender){for(this.$view=document.createElement("div"),this.$resizeObserver=document.createElement("div"),this.$view.className=Y.view,this.$resizeObserver.className=Y.resizeObserver;0<this.element.childNodes.length;)this.$resizeObserver.appendChild(this.element.childNodes[0]);this.$view.appendChild(this.$resizeObserver),this.element.appendChild(this.$view),!1===this._preventRenderTrack&&(this.$scrollbarX=document.createElement("div"),this.$scrollbarY=document.createElement("div"),this.$sliderX=document.createElement("div"),this.$sliderY=document.createElement("div"),this.$scrollbarX.className=Y.horizontalScrollbar,this.$scrollbarY.className=Y.verticalScrollbar,this.$sliderX.className=Y.thumb,this.$sliderY.className=Y.thumb,this.$scrollbarX.appendChild(this.$sliderX),this.$scrollbarY.appendChild(this.$sliderY),this.element.appendChild(this.$scrollbarX),this.element.appendChild(this.$scrollbarY))}else this.$view=this.element.querySelector("."+Y.view),this.$resizeObserver=this.$view.querySelector("."+Y.resizeObserver),this.$scrollbarX=this.element.querySelector("."+Y.horizontalScrollbar.split(/\s/).join(".")),this.$scrollbarY=this.element.querySelector("."+Y.verticalScrollbar.split(/\s/).join(".")),this.$scrollbarX&&(this.$sliderX=this.$scrollbarX.querySelector("."+Y.thumb)),this.$scrollbarY&&(this.$sliderY=this.$scrollbarY.querySelector("."+Y.thumb));return m(this.element,Y.element),this.forceRenderTrack&&m(this.element,Y.force),this._scrollbarWidth<=0&&m(this.element,Y.hiddenDefault),this._preventRenderTrack&&m(this.element,Y.prevented),!0===this.horizontal&&(m(this.element,Y.horizontal),m(this.$scrollbarY,Y.invisible)),this.useShadow&&this._createShadow(),this.useResize&&this._createResizeTrigger(),this._created=!0,n(this.created)&&this.created(),this._bindEvents().update()},T.prototype.update=function(){if(this._preventRenderTrack)return this;if(!1===this._created)return console.warn("calling on a not-yet-created object"),this;0<this._scrollbarWidth?(this.$view.style.width="calc(100% + "+this._scrollbarWidth+"px)",this.$view.style.height="calc(100% + "+this._scrollbarWidth+"px)"):(this.$view.style.width="",this.$view.style.height=""),b(this.$scrollbarY,Y.invisible),b(this.$scrollbarX,Y.invisible);var e=this.$view.clientWidth/this.$view.scrollWidth*this.$scrollbarX.offsetWidth,t=this.$view.clientHeight/this.$view.scrollHeight*this.$scrollbarY.offsetHeight;this._scrollTopMax=this.$view.scrollHeight-this.$view.clientHeight,this._scrollLeftMax=this.$view.scrollWidth-this.$view.clientWidth;var i=0,s=0;return this._scrollLeftMax<=0?m(this.$scrollbarX,Y.invisible):i=Math.max(e,this.minThumbSize),this.$sliderX.style.width=i+"px",this._scrollTopMax<=0?m(this.$scrollbarY,Y.invisible):s=Math.max(t,this.minThumbSize),this.$sliderY.style.height=s+"px",this._trackTopMax=this.$scrollbarY.clientHeight-this.$sliderY.offsetHeight,this._trackLeftMax=this.$scrollbarX.clientWidth-this.$sliderX.offsetWidth,n(this.onUpdate)&&this.onUpdate(),this._scrollHandler(),this},T.prototype.destroy=function(){if(!1===this._created)return console.warn("calling on a not-yet-created object"),this;if(b(this.element,[Y.horizontal,Y.observed,Y.prevented,Y.hiddenDefault,Y.force,Y.element]),this._unbindEvents(),this.useResize&&function(e,t){var i=e&&e.__resize_listeners__;if(i){if(t&&i.splice(i.indexOf(t),1),!i.length||!t){if(e.detachEvent&&e.removeEventListener)return e.detachEvent("onresize",e.__resize_legacy_resize_handler__),document.removeEventListener("DOMSubtreeModified",e.__resize_mutation_handler__);e.__resize_observer__?(e.__resize_observer__.unobserve(e),e.__resize_observer__.disconnect(),e.__resize_observer__=null):(e.__resize_mutation_observer__&&(e.__resize_mutation_observer__.disconnect(),e.__resize_mutation_observer__=null),e.removeEventListener("scroll",z),e.removeChild(e.__resize_triggers__.triggers),e.__resize_triggers__=null),e.__resize_listeners__=null}!--w&&$&&$.parentNode.removeChild($)}}(this.$resizeObserver,this._events.resizeHandler),this.useShadow&&(this.element.removeChild(this.$shadowY),this.element.removeChild(this.$shadowX),this.$shadowY=null,this.$shadowX=null),!0===this.useRender){for(this._preventRenderTrack||(this.element.removeChild(this.$scrollbarY),this.element.removeChild(this.$scrollbarX),this.$scrollbarY=null,this.$scrollbarX=null,this.$sliderY=null,this.$sliderX=null);0<this.$resizeObserver.childNodes.length;)this.element.appendChild(this.$resizeObserver.childNodes[0]);this.element.removeChild(this.$view),this.$resizeObserver=null,this.$view=null}else this.$view.style.width="",this.$view.style.height="",!1===this._preventRenderTrack?(b(this.$scrollbarY,Y.invisible),b(this.$scrollbarX,Y.invisible)):(m(this.$scrollbarY,Y.invisible),m(this.$scrollbarX,Y.invisible));return this._created=!1,null},T.prototype.getViewElement=function(){return this.$view},T.prototype._createResizeTrigger=function(){m(this.element,Y.observed),this._events.resizeHandler=this._resizeHandler.bind(this),g(this.$resizeObserver,this._events.resizeHandler)},T.prototype._createShadow=function(){this.$shadowX=document.createElement("div"),this.$shadowY=document.createElement("div"),this.element.appendChild(this.$shadowX),this.element.appendChild(this.$shadowY),this.$shadowX.className=Y.horizontalShadow+" "+Y.invisible,this.$shadowY.className=Y.verticalShadow+" "+Y.invisible},T.prototype._resizeHandler=function(){var e=window.devicePixelRatio||1;e&&(this._scrollbarWidth=h()/e),this.update(),n(this.onResize)&&this.onResize()},T.prototype._bindEvents=function(){return this._events.scrollHandler=this._scrollHandler.bind(this),this._events.clickHorizontalTrackHandler=this._clickTrackHandler(!1).bind(this),this._events.clickVerticalTrackHandler=this._clickTrackHandler(!0).bind(this),this._events.clickHorizontalThumbHandler=this._clickThumbHandler(!1).bind(this),this._events.clickVerticalThumbHandler=this._clickThumbHandler(!0).bind(this),this._events.mouseScrollTrackHandler=this._mouseScrollTrackHandler.bind(this),this._events.mouseUpDocumentHandler=this._mouseUpDocumentHandler.bind(this),this._events.mouseMoveDocumentHandler=this._mouseMoveDocumentHandler.bind(this),!a&&this.horizontal?this.$view.addEventListener(X,this._events.mouseScrollTrackHandler):this.$view.addEventListener("scroll",this._events.scrollHandler),!1===this._preventRenderTrack&&(this.$scrollbarX.addEventListener("mousedown",this._events.clickHorizontalTrackHandler),this.$scrollbarY.addEventListener("mousedown",this._events.clickVerticalTrackHandler),this.$sliderX.addEventListener("mousedown",this._events.clickHorizontalThumbHandler),this.$sliderY.addEventListener("mousedown",this._events.clickVerticalThumbHandler),this.$scrollbarX.addEventListener(X,this._events.mouseScrollTrackHandler),this.$scrollbarY.addEventListener(X,this._events.mouseScrollTrackHandler),document.addEventListener("mouseup",this._events.mouseUpDocumentHandler)),this},T.prototype._unbindEvents=function(){return this.$view.removeEventListener("scroll",this._events.scrollHandler),this.$view.removeEventListener(X,this._events.mouseScrollTrackHandler),!1===this._preventRenderTrack&&(this.$scrollbarY.removeEventListener("mousedown",this._events.clickVerticalTrackHandler),this.$scrollbarX.removeEventListener("mousedown",this._events.clickHorizontalTrackHandler),this.$sliderY.removeEventListener("mousedown",this._events.clickVerticalThumbHandler),this.$sliderX.removeEventListener("mousedown",this._events.clickHorizontalThumbHandler),this.$scrollbarY.removeEventListener(X,this._events.mouseScrollTrackHandler),this.$scrollbarX.removeEventListener(X,this._events.mouseScrollTrackHandler),document.removeEventListener("mouseup",this._events.mouseUpDocumentHandler),document.removeEventListener("mousemove",this._events.mouseMoveDocumentHandler)),this},T.prototype._scrollHandler=function(){var e=this.$view.scrollLeft*this._trackLeftMax/this._scrollLeftMax||0,t=this.$view.scrollTop*this._trackTopMax/this._scrollTopMax||0;this.useShadow&&this._setShadowStyle(),!1===this._preventRenderTrack&&(this.$sliderX.style.msTransform="translateX("+e+"px)",this.$sliderX.style.webkitTransform="translate3d("+e+"px, 0, 0)",this.$sliderX.style.transform="translate3d("+e+"px, 0, 0)",this.$sliderY.style.msTransform="translateY("+t+"px)",this.$sliderY.style.webkitTransform="translate3d(0, "+t+"px, 0)",this.$sliderY.style.transform="translate3d(0, "+t+"px, 0)"),n(this.onScroll)&&this.onScroll(e,t)},T.prototype._setShadowStyle=function(){this.$view.scrollTop<=0?(b(this.$shadowY,Y.visible),m(this.$shadowY,Y.invisible)):(m(this.$shadowY,Y.visible),b(this.$shadowY,Y.invisible)),this.$view.scrollLeft>=this.$view.scrollWidth-this.$view.clientWidth?(b(this.$shadowX,Y.visible),m(this.$shadowX,Y.invisible)):(m(this.$shadowX,Y.visible),b(this.$shadowX,Y.invisible))},T.prototype._mouseScrollTrackHandler=function(e){var t,i,s=0,r=0;c(e),n(e.preventDefault)?e.preventDefault():e.returnValue=!1,r=e.deltaY||e.wheelDeltaY||-e.wheelDelta||0,s=e.deltaX||e.wheelDeltaX||0,l&&(r*=40,s*=40),e.shiftKey&&(s=(t=[r,s])[0],r=t[1]),this.horizontal&&(s=(i=[r,s])[0],r=i[1]),e.altKey&&(s*=s,r*=r),this.$view.scrollTop+=r,this.$view.scrollLeft+=s,this.horizontal&&this._scrollHandler()},T.prototype._clickTrackHandler=function(i){var s=this;return function(e){var t;i?(t=100*(Math.abs(e.target.getBoundingClientRect().top-e.clientY)-s.$sliderY.offsetHeight/2)/s.$scrollbarY.offsetHeight,s.$view.scrollTop=t*s.$view.scrollHeight/100):(t=100*(Math.abs(e.target.getBoundingClientRect().left-e.clientX)-s.$sliderX.offsetWidth/2)/s.$scrollbarX.offsetWidth,s.$view.scrollLeft=t*s.$view.scrollWidth/100),!0===s.horizontal&&s._scrollHandler()}},T.prototype._clickThumbHandler=function(t){var i=this;return function(e){c(e),e.ctrlKey||2===e.button||(m(e.currentTarget,Y.active),i._startDrag(e),t?i._prevPageY=e.currentTarget.offsetHeight-(e.clientY-e.currentTarget.getBoundingClientRect().top):i._prevPageX=e.currentTarget.offsetWidth-(e.clientX-e.currentTarget.getBoundingClientRect().left))}},T.prototype._startDrag=function(e){e.stopImmediatePropagation(),this._cursorDown=!0,m(document.body,Y.unselect),document.addEventListener("mousemove",this._events.mouseMoveDocumentHandler),document.onselectstart=function(){return!1}},T.prototype._mouseUpDocumentHandler=function(){this._cursorDown=!1,this._prevPageX=this._prevPageY=0,b(document.body,Y.unselect),b(this.$sliderY,Y.active),b(this.$sliderX,Y.active),document.removeEventListener("mousemove",this._events.mouseMoveDocumentHandler),document.onselectstart=null},T.prototype._mouseMoveDocumentHandler=function(e){var t,i;if(!1!==this._cursorDown)return this._prevPageY?(t=e.clientY-this.$scrollbarY.getBoundingClientRect().top,i=this.$sliderY.offsetHeight-this._prevPageY,this.$view.scrollTop=this._scrollTopMax*(t-i)/this._trackTopMax,void(!0===this.horizontal&&this._scrollHandler())):void(this._prevPageX&&(t=e.clientX-this.$scrollbarX.getBoundingClientRect().left,i=this.$sliderX.offsetWidth-this._prevPageX,this.$view.scrollLeft=this._scrollLeftMax*(t-i)/this._trackLeftMax,!0===this.horizontal&&this._scrollHandler()))},window[k]||(window[k]=T),T});