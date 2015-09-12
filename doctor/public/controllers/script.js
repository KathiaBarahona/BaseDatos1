$(".menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    if ($('#togglemenu').hasClass('outmenu')) {
        $('#togglemenu').removeClass('outmenu');
    } else {
        $('#togglemenu').addClass('outmenu');
    }
});
