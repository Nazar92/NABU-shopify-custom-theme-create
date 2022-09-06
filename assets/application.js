
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
    $(".close-cart-popup").click(function(){
        $(".cart-modal").hide();
    });

    $('.buy-product').on('click', function () {
        $('.buy-product').addClass('isDisabled');
        let variant_id = $(this).data('variant-id');
        $.ajax({
            type: "POST",
            url: window.Shopify.routes.root + 'cart/add.js',
            data: {items: [{id: variant_id, quantity: 1}]},
            success: () => {
                window.location = window.location.origin + '/checkout'
            }
        });
    })


// Render cart onChange

    // const renderingCart = () => {
    //     fetch('/cart.js')
    //         .then(response => response.json())
    //         .then(cart => {
    //             window.getSectionsToRender(cart)
    //             window.refreshCart(cart)
    //         })
    // }
    //
    // fetch('/products/product-handle?section_id=product-template')



    //
    // getSectionsToRender() {
    //     return[
    //         {
    //             id: 'main-cart-items',
    //             section: document.getElementById('main-cart-items').dataset.id,
    //             selector: '.js-contents',
    //         }
    //     ];
    // }





    // updateQuantity(line, quantity, name){
    //     this.enableLoading(line);
    //
    //     const body = JSON.stringify({
    //         line,
    //         quantity,
    //         sections: this.getSectionsToRender().map((section) => section.section),
    //         sections_url: window.location.pathname
    //     });







});

// Multicarency
function currencyFormSubmit(event) {
    event.target.form.submit();
}
document.querySelectorAll('.shopify-currency-form select').forEach(function(element) {
    element.addEventListener('change', currencyFormSubmit);
});


$('.cartItemQuantity').on('change', function (){
    let body = JSON.stringify({"line":"1","quantity":"15","sections":["template--14636169756746__16623759011301efd7","cart-icon-bubble","cart-live-region-text","template--14636169756746__16620383389e944fb5"],"sections_url":"/cart"})

    fetch('/cart/change.js', {...fetchConfig(), ...{body}})
        .then((response) => {
            return response.text();
        })
        .then((state) => {
            const parsedState = JSON.parse(state);
            // console.log(parsedState);
            // console.log(parsedState.sections['template--14636169756746__16623759011301efd7']);
            document.getElementById('SRCC-container').innerHTML = parsedState.sections['template--14636169756746__16623759011301efd7'];
        });

});






