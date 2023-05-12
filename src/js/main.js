var current_language = 'en_US';

(function ($) {

    current_language = jQuery.i18n.normaliseLanguageCode({}); //获取浏览器的语言     
    loadProperties(current_language);

    $.fn.countTo = function (options) {
        options = options || {};

        return $(this).each(function () {
            // set options for current element
            var settings = $.extend({}, $.fn.countTo.defaults, {
                from: $(this).data('from'),
                to: $(this).data('to'),
                speed: $(this).data('speed'),
                refreshInterval: $(this).data('refresh-interval'),
                decimals: $(this).data('decimals')
            }, options);

            // how many times to update the value, and how much to increment the value on each update
            var loops = Math.ceil(settings.speed / settings.refreshInterval),
                increment = (settings.to - settings.from) / loops;

            // references & variables that will change with each update
            var self = this,
                $self = $(this),
                loopCount = 0,
                value = settings.from,
                data = $self.data('countTo') || {};

            $self.data('countTo', data);

            // if an existing interval can be found, clear it first
            if (data.interval) {
                clearInterval(data.interval);
            }
            data.interval = setInterval(updateTimer, settings.refreshInterval);

            // initialize the element with the starting value
            render(value);

            function updateTimer() {
                value += increment;
                loopCount++;

                render(value);

                if (typeof (settings.onUpdate) == 'function') {
                    settings.onUpdate.call(self, value);
                }

                if (loopCount >= loops) {
                    // remove the interval
                    $self.removeData('countTo');
                    clearInterval(data.interval);
                    value = settings.to;

                    if (typeof (settings.onComplete) == 'function') {
                        settings.onComplete.call(self, value);
                    }
                }
            }

            function render(value) {
                var formattedValue = settings.formatter.call(self, value, settings);
                $self.html(formattedValue);
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0, // the number the element should start at
        to: 0, // the number the element should end at
        speed: 10000, // how long it should take to count between the target numbers
        refreshInterval: 100, // how often the element should be updated
        decimals: 0, // the number of decimal places to show
        formatter: formatter, // handler for formatting the value before rendering
        onUpdate: null, // callback method for every time the element is updated
        onComplete: null // callback method for when the element finishes updating
    };

    function formatter(value, settings) {
        return value.toFixed(settings.decimals);
    }
}(jQuery));

jQuery(function ($) {
    // custom formatting example
    $('.count-number').data('countToOptions', {
        formatter: function (value, options) {
            return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
        }
    });

    // start all the timers
    $('.timer').each(count);

    function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }
});

$(document).ready(function () {
    //AOS init
    AOS.init({
        duration: 1200,
    });
    //smart menu
    $('#main-menu').smartmenus({
        mainMenuSubOffsetX: -1,
        mainMenuSubOffsetY: 4,
        subMenusSubOffsetX: 6,
        subMenusSubOffsetY: -6
    });
    //start menu
    var $mainMenuState = $('#main-menu-state');
    if ($mainMenuState.length) {
        // animate mobile menu
        $mainMenuState.change(function (e) {
            var $menu = $('#main-menu');
            if (this.checked) {
                $menu.hide().slideDown(250, function () { $menu.css('display', ''); });
            } else {
                $menu.show().slideUp(250, function () { $menu.css('display', ''); });
            }
        });
        // hide mobile menu beforeunload
        $(window).bind('beforeunload unload', function () {
            if ($mainMenuState[0].checked) {
                $mainMenuState[0].click();
            }
        });
    }

    //home 1 js
    if ($('body').hasClass('home1')) {
        //home 1 testimonial swipper
        $(window).on('load', function () {
            var mySwiper = new Swiper('.testimonial-style-2 .swiper-container', {
                // Optional parameters
                direction: 'horizontal',
                loop: true,
                loopedSlides: 0,
                spaceBetween: 0,
                slidesPerView: 4,
                autoplay: {
                    delay: 1500,
                },

                // If we need pagination
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                    },

                    768: {
                        slidesPerView: 2,
                    },

                    1025: {
                        slidesPerView: 4,
                    },
                },

                // Navigation arrows
                navigation: {
                    nextEl: '.testimonial-style-2 .swiper-button-next',
                    prevEl: '.testimonial-style-2 .swiper-button-prev',
                },
            })
        });

        $('.testimonial-style-2 .swiper-container').on({
            mouseenter: function () {
                $('.testimonial-style-2 .ar-cursor').addClass('active');
            },
            mouseleave: function () {
                $('.testimonial-style-2 .ar-cursor').removeClass('active');
            }
        })

        var mouseX = 0,
            mouseY = 0,
            limitX = 2000,
            limitY = 2000;
        var stage = $(".centerdiv"),
            position = stage.position();
        $(window).on('mousemove', function (e) {
            var offset = $('.testimonial-style-2 .swiper-container').offset();
            mouseX = Math.min(e.pageX - offset.left, limitX);
            mouseY = Math.min(e.pageY - offset.top, limitY);
            if (mouseX < 0) mouseX = 0;
            if (mouseY < 0) mouseY = 0;
        });

        var follower = $(".testimonial-style-2 #cursor-ar");
        var xp = 0,
            yp = 0;
        var loop = setInterval(function () {
            // change 12 to alter damping higher is slower
            xp += (mouseX - xp) / 12;
            yp += (mouseY - yp) / 12;
            follower.css({
                left: xp,
                top: yp
            });
        }, 1);

        $('.video-item').lightGallery({
            thumbnail: false,
            download: false,
        })
    }
    //single service js
    var singleService = $('body').hasClass('service1') || $('body').hasClass('service2') || $('body').hasClass('service3');
    if (singleService) {
        var swiper = new Swiper('.service-testi-slide', {
            slidesPerView: 1,
            grabCursor: true,
            navigation: {
                nextEl: '.carousel-button-next',
                prevEl: '.carousel-button-prev',
            },
            breakpoints: {
                320: {
                    slidesPerView: 1
                },
                480: {
                    slidesPerView: 1
                },
                640: {
                    slidesPerView: 1
                }
            }
        });

        $('.head').on('click', function () {
            $(this).toggleClass('active').removeClass('inActive');
            $(this).parent().find('.arrow').toggleClass('arrow-animate');
            $(this).parent().find('.content').slideToggle(280);

            if ($('.head').not($(this))) {
                $('.head').not($(this)).removeClass('active').toggleClass('inActive')
                $('.head.inActive').parent().find('.content').slideUp(280)
            }
        });
        // icon from Font Awesome was used in accordion-1
    }
    //single project js
    if ($('body').hasClass('single-project')) {
        var swiper = new Swiper('.irhas-gallery-project .swiper-container', {
            slidesPerView: 1,
            grabCursor: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
            },
            breakpoints: {
                320: {
                    slidesPerView: 1
                },
                480: {
                    slidesPerView: 1
                },
                640: {
                    slidesPerView: 1
                }
            }
        });
        // icon from Font Awesome was used in accordion-1
    }
    //about1 js 
    if ($('body').hasClass('niobium about')) {
        var mySwiper = new Swiper('.slider-gallery .swiper-container', {
            // Optional parameters
            direction: 'horizontal',
            loop: true,
            autoplay: {
                delay: 5000,
            },
            // If we need pagination
            slidesPerView: 1,
            pagination: {
                el: '.slider-gallery .swiper-pagination',
                clickable: true
            },
            // Navigation arrows
            navigation: {
                nextEl: ' .slider-gallery .swiper-button-next',
                prevEl: '.slider-gallery .swiper-button-prev',
            },
            // And if we need scrollbar
            scrollbar: {
                el: '.slider-gallery .swiper-scrollbar',
            },
        });
        var mouseover = document.getElementById("mouseover"),
            inner1 = document.getElementById("inner1"),
            inner2 = document.getElementById("inner2"),
            inner3 = document.getElementById("inner3")

        mouseover.addEventListener("mousemove", function (e) {
            var xAxis = (window.innerWidth / 2 - e.pageX) / 65;
            var yAxis = (window.innerHeight / 2 - e.pageY) / 65;
            // console.log(xAxis + 5, yAxis + 5);
            inner1.style.transform = "translateX(" + (xAxis + 5) + "px) translateY(" + (yAxis + 5) + "px)";

            inner2.style.transform = "rotateX(" + xAxis + "deg) rotateY(" + yAxis + "deg)";

            inner3.style.transform = "translateX(" + -xAxis + "px) translateY(" + -yAxis + "px)";
        })
    }
    //about2 js
    if ($('body').hasClass('irhas2 about')) {
        var mySwiper = new Swiper('.testimonial-style-1 .swiper-container', {
            // Optional parameters
            direction: 'horizontal',
            loop: true,
            spaceBetween: 45,
            slidesPerView: 2,
            // If we need pagination
            pagination: {
                el: '.testimonial-style-1 .swiper-pagination',
                clickable: true
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 1,
                },
                1025: {
                    slidesPerView: 2,
                },
            },
            // Navigation arrows
            navigation: {
                nextEl: '.testimonial-style-1 .swiper-button-next',
                prevEl: '.testimonial-style-1 .swiper-button-prev',
            },
            // And if we need scrollbar
            scrollbar: {
                el: '.testimonial-style-1 .swiper-scrollbar',
            },
        });
        var mouseover = document.getElementById("mouseover"),
            inner1 = document.getElementById("inner1"),
            inner2 = document.getElementById("inner2"),
            inner3 = document.getElementById("inner3")

        mouseover.addEventListener("mousemove", function (e) {
            var xAxis = (window.innerWidth / 2 - e.pageX) / 100;
            var yAxis = (window.innerHeight / 2 - e.pageY) / 100;

            var x = xAxis / 15, y = yAxis / 15
            inner1.style.transform = "rotateX(" + y / 2 + "deg) rotateY(" + x / 2 + "deg)";

            inner2.style.transform = "rotateX(" + x / 2 + "deg) rotateY(" + y / 2 + "deg)";

            inner3.style.transform = "rotateX(" + -y + "deg) rotateY(" + -x + "deg)";
        })

        $('.smart-object').lightGallery({
            thumbnail: false,
            download: false,
        })
    }
    //about3 js
    if ($('body').hasClass('about3')) {
        $(window).on('load', function () {
            var mouseover = document.getElementById("mouseover"),
                inner1 = document.getElementById("inner1"),
                inner2 = document.getElementById("inner2"),
                inner3 = document.getElementById("inner3")

            mouseover.addEventListener("mousemove", function (e) {
                var xAxis = (window.innerWidth / 2 - e.pageX) / 100;
                var yAxis = (window.innerHeight / 2 - e.pageY) / 100;

                var x = xAxis / 15, y = yAxis / 15
                inner1.style.transform = "rotateX(" + -y / 2 + "deg) rotateY(" + -x / 2 + "deg)";

                inner2.style.transform = "rotateX(" + y / 2 + "deg) rotateY(" + x / 2 + "deg)";

                inner3.style.transform = "rotateX(" + y / 2 + "deg) rotateY(" + x / 2 + "deg)";
            })

            var mySwiper = new Swiper('.irhas3.about3 .testimonial-style-2 .swiper-container', {
                // Optional parameters
                direction: 'horizontal',
                loop: false,
                loopedSlides: 0,
                spaceBetween: 75,
                slidesPerView: 3,
                centeredSlides: true,

                // If we need pagination
                pagination: {
                    el: '.irhas3.about3 .testimonial-style-2 .swiper-pagination',
                    clickable: true
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                    },
                    768: {
                        slidesPerView: 1,
                    },
                    1025: {
                        slidesPerView: 2,
                    },
                },

                // Navigation arrows
                navigation: {
                    nextEl: '.irhas3.about3 .testimonial-style-2 .swiper-button-next',
                    prevEl: '.irhas3.about3 .testimonial-style-2 .swiper-button-prev',
                },
            })
        });

        $('.irhas3.about3 .testimonial-style-2 .swiper-container').on({
            mouseenter: function () {
                $('.irhas3.about3 .testimonial-style-2 .ar-cursor').addClass('active');
            },
            mouseleave: function () {
                $('.irhas3.about3 .testimonial-style-2 .ar-cursor').removeClass('active');
            }
        })

        var mouseX = 0,
            mouseY = 0,
            limitX = 2000,
            limitY = 2000;
        var stage = $(".centerdiv"),
            position = stage.position();
        $(window).on('mousemove', function (e) {
            var offset = $('.irhas3.about3 .testimonial-style-2 .swiper-container').offset();
            mouseX = Math.min(e.pageX - offset.left, limitX);
            mouseY = Math.min(e.pageY - offset.top, limitY);
            if (mouseX < 0) mouseX = 0;
            if (mouseY < 0) mouseY = 0;
        });

        var follower = $(".irhas3.about3 .testimonial-style-2 #cursor-ar");
        var xp = 0,
            yp = 0;
        var loop = setInterval(function () {
            // change 12 to alter damping higher is slower
            xp += (mouseX - xp) / 12;
            yp += (mouseY - yp) / 12;
            follower.css({
                left: xp,
                top: yp
            });

        }, 1);

        var mySwiper = new Swiper('.testimonial-style-1 .swiper-container', {
            // Optional parameters
            direction: 'horizontal',
            loop: true,
            spaceBetween: 45,
            slidesPerView: 2,
            // If we need pagination
            pagination: {
                el: '.testimonial-style-1 .swiper-pagination',
                clickable: true
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 1,
                },
                1025: {
                    slidesPerView: 2,
                },
            },
            // Navigation arrows
            navigation: {
                nextEl: '.testimonial-style-1 .swiper-button-next',
                prevEl: '.testimonial-style-1 .swiper-button-prev',
            },
            // And if we need scrollbar
            scrollbar: {
                el: '.testimonial-style-1 .swiper-scrollbar',
            },
        })

        $('.smart-object').lightGallery({
            thumbnail: false,
            download: false,
        })
    }
    //blog2 js
    if ($('body').hasClass('irhas2 blog')) {
        var blogLoopWrap = $('.blog-loop-wrap').imagesLoaded(function () {
            blogLoopWrap.masonry({
                itemSelector: '.blog-item-style-6',
                columnWidth: '.blog-item-style-6',
                transitionDuration: '0.65s',
                initialLayout: true,
                originTop: true,
                horizontalOrder: true
            })
        })
        $(window).on('resize', function () {
            blogLoopWrap.masonry('bindResize')
        })
    }

    

    $(".language_switch").on("click",() => {
        console.log()
        if (current_language.startsWith("zh")) {
            loadProperties("en");
            current_language = "en";
        }
        else {
            loadProperties("zh");
            current_language = "zh";
        }
    })
})


function loadProperties(type) {
    if (type.length >= 2) {
        type = type.substring(0, 2);
    }

    jQuery.i18n.properties({
        name: pageName, // 资源文件名称
        path: 'resources/', // 资源文件所在目录路径
        mode: 'map', // 模式：变量或 Map 
        language: type, // 对应的语言
        cache: false,
        encoding: 'UTF-8',
        callback: function () { // 回调方法    
            for (let i in $.i18n.map) {
                $('[data-lang="' + i + '"]').text($.i18n.map[i]);
            }
            document.title = $.i18n.map['title'];
        }
    });
}