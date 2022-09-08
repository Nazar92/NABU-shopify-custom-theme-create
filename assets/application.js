
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
});

// Multicarency
function currencyFormSubmit(event) {
    event.target.form.submit();
}
document.querySelectorAll('.shopify-currency-form select').forEach(function(element) {
    element.addEventListener('change', currencyFormSubmit);
});













function fetchConfig(type = 'json') {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
    };

}


class CartRemoveButton extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('click', (event) => {
            event.preventDefault();
            const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
            cartItems.updateQuantity(this.dataset.index, 0);
        });
    }
}

customElements.define('cart-remove-button', CartRemoveButton);




class CartItems extends HTMLElement {
    constructor() {
        super();

        this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');

        this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
            .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

        this.debouncedOnChange = debounce((event) => {
            this.onChange(event);
        }, 300);

        this.addEventListener('change', this.debouncedOnChange.bind(this));
    }

    onChange(event) {
        this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
    }

    getSectionsToRender() {
        return [
            {
                id: 'main-cart-items',
                section: document.getElementById('main-cart-items').dataset.id,
                selector: '.js-contents',
            },
            {
                id: 'cart-icon-bubble',
                section: 'cart-icon-bubble',
                selector: '.shopify-section'
            },
            {
                id: 'cart-live-region-text',
                section: 'cart-live-region-text',
                selector: '.shopify-section'
            },
            {
                id: 'main-cart-footer',
                section: document.getElementById('main-cart-footer').dataset.id,
                selector: '.js-contents',
            }
        ];
    }

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
            errors.textContent = window.cartStrings.error;
            this.disableLoading();
        });

        // fetch('/cart/change.js', {...fetchConfig(), ...{ body }})
        //     .then((response) => {
        //         return response.text();
        //     })
        //     .then((state) => {
        //         const parsedState = JSON.parse(state);
        //         console.log(parsedState);
        //         console.log(gsfgdgdfgdf);
        //         // console.log(parsedState.sections['template--14636169756746__16623759011301efd7']);
        //         document.getElementById('SRCC-container').innerHTML = parsedState.sections['template--14636169756746__16623759011301efd7'];
        //     });






        updateLiveRegions(line, itemCount) {
            if (this.currentItemCount === itemCount) {
                const lineItemError = document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
                const quantityElement = document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);

                lineItemError
                    .querySelector('.cart-item__error-text')
                    .innerHTML = window.cartStrings.quantityError.replace(
                    '[quantity]',
                    quantityElement.value
                );
            }

            this.currentItemCount = itemCount;
            this.lineItemStatusElement.setAttribute('aria-hidden', true);

            const cartStatus = document.getElementById('cart-live-region-text') || document.getElementById('CartDrawer-LiveRegionText');
            cartStatus.setAttribute('aria-hidden', false);

            setTimeout(() => {
                cartStatus.setAttribute('aria-hidden', true);
            }, 1000);
        }

        getSectionInnerHTML(html, selector) {
            return new DOMParser()
                .parseFromString(html, 'text/html')
                .querySelector(selector).innerHTML;
        }

        enableLoading(line) {
            const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
            mainCartItems.classList.add('cart__items--disabled');

            const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading-overlay`);
            const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading-overlay`);

            [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) => overlay.classList.remove('hidden'));

            document.activeElement.blur();
            this.lineItemStatusElement.setAttribute('aria-hidden', false);
        }

        disableLoading() {
            const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
            mainCartItems.classList.remove('cart__items--disabled');
        }

    }

}


// function getSectionsToRender() {
//
//     return [
//         {
//             id: 'main-cart-items',
//             section: document.getElementById('main-cart-items').dataset.id,
//             selector: '.js-contents',
//         },
//         {
//             id: 'cart-icon-bubble',
//             section: 'cart-icon-bubble',
//             selector: '.shopify-section'
//         },
//         {
//             id: 'cart-live-region-text',
//             section: 'cart-live-region-text',
//             selector: '.shopify-section'
//         },
//         {
//             id: 'main-cart-footer',
//             section: document.getElementById('main-cart-footer').dataset.id,
//             selector: '.js-contents',
//         }
//     ];
// }


//
// function updateQuantity(line, quantity, name) {
//     this.enableLoading(line);
//
//
//     let body = JSON.stringify({
//         line,
//         quantity,
//         sections: this.getSectionsToRender().map((section) => section.section),
//         sections_url: window.location.pathname
//     });
//
// }





$('.cartItemQuantity').on('change', function (){







    fetch('/cart/change.js', {...fetchConfig(), ...{ body }})
        .then((response) => {
            return response.text();
        })
        .then((state) => {
            const parsedState = JSON.parse(state);
            console.log(parsedState);
            // console.log(parsedState.sections['template--14636169756746__16623759011301efd7']);
            document.getElementById('SRCC-container').innerHTML = parsedState.sections['template--14636169756746__16623759011301efd7'];
        });






    // let body = JSON.stringify({"line":"1","quantity":"15","sections":["template--14636169756746__16623759011301efd7","cart-icon-bubble","cart-live-region-text","template--14636169756746__16620383389e944fb5"],"sections_url":"/cart"})


    // fetch('/cart/change.js', {...fetchConfig(), ...{body}})
    //     .then((response) => {
    //         return response.text();
    //     })
    //     .then((state) => {
    //         const parsedState = JSON.parse(state);
    //         // console.log(parsedState);
    //         // console.log(parsedState.sections['template--14636169756746__16623759011301efd7']);
    //         document.getElementById('SRCC-container').innerHTML = parsedState.sections['template--14636169756746__16623759011301efd7'];
    //     });



    // let variant_id = $('.cartItem').data('variant-id');
    // let item_quantity = $('.cartItemQuantity').val();
    // $.ajax({
    //     type: "POST",
    //     url: window.Shopify.routes.root + 'cart/add.js',
    //     data: {items: [{id: variant_id, quantity: item_quantity }]},
    //     success: () => {
    //
    //     }
    //
    // });

});


