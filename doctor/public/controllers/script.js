$(".menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    if ($('#togglemenu').hasClass('outmenu')) {
        $('#togglemenu').removeClass('outmenu');
    } else {
        $('#togglemenu').addClass('outmenu');
    }
});

$('#login-form-link').click(function(e) {
	console.log('Holii')
    $("#login-form").delay(100).fadeIn(100);
    $("#register-form").fadeOut(100);
    $('#register-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
});
$('#register-form-link').click(function(e) {
    console.log('Que pedos de que u')
    $("#register-form").delay(100).fadeIn(100);
    $("#login-form").fadeOut(100);
    $('#login-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
});
