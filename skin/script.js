(function(window, jQuery, undefined) {
  var $ = jQuery;
  var document = window.document || document

  $(document).ready(function() {
    $(':text, :password, [type="date"], [type="url"], [type="email"]').addClass('cnblogs-input');
    $('button, :button, :submit').addClass('cnblogs-btn');
    $(':reset').addClass('cnblogs-btn is-ghost');
  });
})(window, jQuery, undefined)