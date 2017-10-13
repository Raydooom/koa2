// banner
var mySwiper = new Swiper('.swiper-container', {
    autoplay: 5000,
    speed: 600,
    pagination: '.swiper-pagination',
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
})

$(function() {
    // 瀑布流相册
    $('#gallery').flexImages({ rowHeight: 240, truncate: 10, maxRows: 100 });

    // 点赞
    $(".like-btn").click(function() {
        $(this).addClass("icon-xiangqufill").css({ 'color': '#f00' });
        event = event || window.event;
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    })

    // 详情页弹出层
    $("#gallery .item").click(function(event) {
        $(".album-popup").show().addClass("zoomIn").removeClass("zoomOut");

    })
    $(".album-popup .close-btn").click(function(){
        $(".album-popup").removeClass("zoomIn").addClass("zoomOut").fadeOut(500);
    })
    // 滚动条美化
    $("#scroll-container").niceScroll({cursorborder:"",cursorcolor:"#c0c0dd",boxzoom:false});

})
