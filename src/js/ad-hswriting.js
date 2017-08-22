$(function() {
  $(".popup").click(function() {
    var rootPath = $("#rootPath").data("value");
    var popupImage = $(this).data("popup");
    var popupImagePath = rootPath + popupImage.replace(".", "");
    console.log(popupImagePath);

    $.blockUI({
      message: '<img width="100%" src="' + popupImagePath + '">',
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
