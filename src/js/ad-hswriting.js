$(function() {
  $(".popup").click(function() {
    $.blockUI({
      message: '<img width="100%" src="' + $(this).data("popup") + '">',
      css: {
        background: "none",
        top: "150px",
        left: ($(window).width() - 695) / 2 + "px",
        border: "none",
        padding: "0px",
        width: "695px",
        cursor: "default"
      },
      overlayCSS: {
        backgroundColor: "#000",
        opacity: "0.4"
      },
      onOverlayClick: $.unblockUI
    });
  });
});