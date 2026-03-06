$(window).scroll(function () {
        var scrollTopPosition = $(this).scrollTop();
        var section1Position = $("#section1").position();
		var brandPosition = $("#brand").position();

        if (scrollTopPosition > -200 + section1Position.top) {
        $("#bg2").removeClass("out");
		$("#bg2").addClass("show")
		$("#bg1").addClass("out");
		$("#bg1").removeClass("show");
		}
		
		if (scrollTopPosition < -200 + section1Position.top) {
        $("#bg2").addClass("out");
		$("#bg2").removeClass("show");
		$("#bg1").addClass("show");
		$("#bg1").removeClass("out");
		}

		if (scrollTopPosition > 100) {
		$("#brand").addClass("out")
		$("#brand").removeClass("show");
		}
		if (scrollTopPosition < 100) {
        $("#brand").removeClass("out");
		$("#brand").addClass("show")
		}
    }
);



/*$('.portfolio li').smoove({
	offset	: '20%',
    moveY	: '20px',
	});*/

$(window).load(function () {
    // Anima el loader
    $(".se-pre-con").fadeOut("slow");;
});