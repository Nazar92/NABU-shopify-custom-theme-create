
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



});

// Multicarency
function currencyFormSubmit(event) {
    event.target.form.submit();
}
document.querySelectorAll('.shopify-currency-form select').forEach(function(element) {
    element.addEventListener('change', currencyFormSubmit);
});



updateQuantity(line, quantity, name) {
    this.enableLoading(line);

    const body = JSON.stringify({
        line,
        quantity,
        sections: this.getSectionsToRender().map((section) => section.section),
        sections_url: window.location.pathname
    });

    fetch(`${routes.cart_change_url}`, {...fetchConfig(), ...{ body }})
        .then((response) => {
            return response.text();
        })
        .then((state) => {
            const parsedState = JSON.parse(state);
            this.classList.toggle('is-empty', parsedState.item_count === 0);
            const cartDrawerWrapper = document.querySelector('cart-drawer');
            const cartFooter = document.getElementById('main-cart-footer');

            if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
            if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);

            this.getSectionsToRender().forEach((section => {
                const elementToReplace =
                    document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
                elementToReplace.innerHTML =
                    this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
            }));

            this.updateLiveRegions(line, parsedState.item_count);
            const lineItem =  document.getElementById(`CartItem-${line}`) || document.getElementById(`CartDrawer-Item-${line}`);
            if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
                cartDrawerWrapper ? trapFocus(cartDrawerWrapper, lineItem.querySelector(`[name="${name}"]`)) : lineItem.querySelector(`[name="${name}"]`).focus();
            } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
                trapFocus(cartDrawerWrapper.querySelector('.drawer__inner-empty'), cartDrawerWrapper.querySelector('a'))
            } else if (document.querySelector('.cart-item') && cartDrawerWrapper) {
                trapFocus(cartDrawerWrapper, document.querySelector('.cart-item__name'))
            }
            this.disableLoading();
        }).catch(() => {
        this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
        const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
        // errors.textContent = window.cartStrings.error;
        this.disableLoading();
    });
}

fetch('/cart/change.js', {...fetchConfig(), ...{ body }})
    .then((response) => {
        return response.text();
    })
    .then((state) => {
        const parsedState = JSON.parse(state);
        console.log(parsedState);
        document.getElementById('shopify-section-template--14636169756746__16623759011301efd7').innerHTML = parsedState.sections['main-cart-items'];
    });






