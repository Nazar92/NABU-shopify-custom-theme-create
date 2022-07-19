
$(document).ready(function () {
    let customPositionProductsSlider = new Swiper('.custom-products-slider', {
        slidesPerView: 1,
        loop: true,
        centeredSlides: true,
    });

    $('.custom-product-btn').on('click', function () {
        let slideIndex = $(this).data('index') - 1;
        customPositionProductsSlider.slideTo( slideIndex, 100);
    });

    let hpPopularProductsSlider = new Swiper('.popular-products-slider', {
        slidesPerView: 1,
        loop: true,
        spaceBetween: 0,
        breakpoints: {
            1200: {
                slidesPerView: 4,
            },
            991: {
                slidesPerView: 3,
            },
            500: {
                slidesPerView: 2,
            }
        }
    });

    let collectionProductSlider = new Swiper('.collection-products-slider', {
        slidesPerView: 1,
        loop: true,
        spaceBetween: 0,
        navigation: {
            nextEl: '.btn-pp-next',
            prevEl: '.btn-pp-prev'
        },
        breakpoints: {
            1200: {
                slidesPerView: 4,
            },
            991: {
                slidesPerView: 3,
            },
            500: {
                slidesPerView: 2,
            }
        }
    });

    let productSlider = new Swiper('.product-slider', {
        slidesPerView: 1,
        loop: true,
        spaceBetween: 0,
        navigation: {
            nextEl: '.btn-pp-next',
            prevEl: '.btn-pp-prev'
        }
    });

    $('.close-floating-cart').click(function() {
       $('.my-floating-cart ').hide();
    });
    $('#AddToCart').click(function() {
        setTimeout(function() {
            $('.my-floating-cart ').show();

        }, 1000);
    });
    $('.mega-menu .mega-menu-item').hover(function () {
        $(this).addClass('active');
    }, function() {
        $(this).removeClass('active');
    });

    $('.mobile-menu .fa-bars').click(function (){
        $('.mobile-menu').addClass('openMenu');
    })
    $('.mobile-menu-container .fa-times').click(function (){
        $('.mobile-menu').removeClass('openMenu');
    })

    $("#AddToCart").click(function(){
    setTimeout(function() {
        $('.cart-modal').show();
    }, 1500);
    });
});

// Multicarency
function currencyFormSubmit(event) {
    event.target.form.submit();
}
document.querySelectorAll('.shopify-currency-form select').forEach(function(element) {
    element.addEventListener('change', currencyFormSubmit);
});

let cartContent = $('.cart-modal-content');

function buildCartModalContent(products) {
    let htmlContent = '';
    // assign ozNumber = variant.title | split: " " | first;

    products.forEach(function (product) {
        htmlContent += '<div class="cart-modal-item">\n' +
            '<div class="item-image">\n' +
            '<img src="' + product.featured_image.url + '">\n' +
            '</div>\n' +
            '<div class="item-title">\n' +
            '<h2>' + product.product_title + '</h2>\n' +
            '</div>\n' +
            '<div class="product-price item-price">\n' +
            '<p>' + ' ' + Shopify.formatMoney(product.price) + '</p>\n' +
            '</div>\n' +
            '</div>\n';
    });
    return htmlContent;
}

$(document).on('cartUpdate', function() {

    $(".close-cart-popup").click(function(){
        $(".cart-modal").hide();
    });
    $.ajax({
        url: '/cart.js',
        dataType: 'json'
    }).done(function(data){
        if (data.items.length > 0) {
            cartContent.html(buildCartModalContent(data.items));
        }
    });
});




