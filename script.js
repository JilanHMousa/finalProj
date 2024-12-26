$(document).ready(function () {
    const prices = [29.99, 49.99, 19.99, 39.99, 24.99, 34.99, 44.99, 54.99, 64.99, 500];
    const images = [
        "https://www.sephora.com/productimages/sku/s1237379-main-zoom.jpg?imwidth=250",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7lOiHcnlYesai5nMJ3mUKG0XG54Xtsa4pDA&s",
        "https://creedboutique.com/cdn/shop/files/windflowers-75ml-bottle_1_76f5478e-3d36-446e-b36a-c1dc28f92d79.jpg?v=1695132993&width=250",
        "https://shop-beauty.dior.om/cdn/shop/files/Y0998025_C099800170_E01_GHC.jpg?v=1725273027&width=250",
        "https://tasneemperfumes.com/cdn/shop/files/41gspMwOsEL._SL500.jpg?v=172372536&width=250",
        "https://myop.in/cdn/shop/files/venom_54e4bc67-fef7-4be6-945b-80550602a525.webp?v=1718870939&width=250",
        "https://phlur.com/cdn/shop/files/5-PHLR_PDP_StrawberryLetter_Editorial.jpg?v=1707204763&width=250",
        "https://www.sephora.com/productimages/sku/s2467371-main-zoom.jpg?imwidth=250",
        "https://carltonlondon.co.in/cdn/shop/files/2_cbbb36aa-4b9a-4d05-8945-0bbcebdaf7a0.jpg?v=1705483116&width=250",
        "https://klinq.com/media/catalog/product/cache/6355c4f21c1ab6e7222bb5837778e5d9/k/e/kenneth-cole-black-edt-a-buy-mena-s-perfume-in-kuwait-klinq-608940553893-20513361330339_w28fzmyulniyqrxr.jpg"
    ];

    let cart = [];

    function calculateTotal() {
    return cart.reduce((sum, item) => {
        const itemTotal = Math.round(item.price * item.quantity * 100) / 100;
        return sum + itemTotal;
    }, 0);
}

    function updateCart() {
        const cartItems = $("#cart-items");
        const totalDisplay = $("#total");
        const cartCount = $(".cart-count");
        cartItems.empty();

        let totalItems = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
            const itemTotal = Math.round(item.price * item.quantity * 100) / 100;
            cartItems.append(`
                <li class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="price">${item.price.toFixed(2)}</p>
                        <p class="quantity">Quantity: ${item.quantity}</p>
                        <p class="item-total">Total: ${itemTotal.toFixed(2)}</p>
                    </div>
                    <button class="remove-item" data-name="${item.name}">×</button>
                </li>
            `);
        });

        const total = calculateTotal();
        totalDisplay.html(`
        <div class="cart-summary">
            <div class="total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
            </div>
        </div>
    `);
    
    cartCount.text(totalItems);
        

        localStorage.setItem('cart', JSON.stringify(cart));

        if (cart.length > 0) {
            $("#checkout-btn").show();
        } else {
            $("#checkout-btn").hide();
        }
    }

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }

    $.ajax({
        url: "https://jsonplaceholder.typicode.com/posts",
        method: "GET",
        success: function (data) {
            let productList = $("#product-list");
            data.slice(0, 10).forEach((product, index) => {
                productList.append(`
                    <div class="product">
                        <img src="${images[index]}" alt="Product Image">
                        <h3>${product.title}</h3>
                        <p>${product.body}</p>
                        <p class="price">Price:$${prices[index]}</p>
                        <button class="add-to-cart" 
                            data-name="${product.title}" 
                            data-price="${prices[index]}"
                            data-image="${images[index]}">
                            Add to Cart
                        </button>
                    </div>
                `);
            });

            $(document).on("click", ".add-to-cart", function () {
                const name = $(this).data("name");
                const price = parseFloat($(this).data("price"));
                const image = $(this).data("image");

                const existingItem = cart.find(item => item.name === name);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ name, price, image, quantity: 1 });
                }
                
                updateCart();
                
                const toast = $('<div class="toast">Item added to cart!</div>');
                $('body').append(toast);
                setTimeout(() => toast.remove(), 2000);
            });
        },
        error: function () {
            alert("Failed to load products.");
        }
    });


    $(document).on("click", ".remove-item", function () {
        const name = $(this).data("name");
        cart = cart.filter(item => item.name !== name);
        updateCart();
    });

    $("#clear-cart").on("click", function () {
        cart = [];
        updateCart();
        localStorage.removeItem('cart');
    });

    $(".cart-icon").click(function(e) {
        e.stopPropagation();
        $("#cart-dropdown").toggle('show');
    });

    $(document).click(function(e) {
        if (!$(e.target).closest('#cart-dropdown').length && 
            !$(e.target).closest('.cart-icon').length) {
            $("#cart-dropdown").removeClass('show');
        }
    });

    $("#cart-dropdown").click(function(e) {
        e.stopPropagation();
    });

    $("#checkout-btn").click(function() {
        const total = calculateTotal();
        alert("Proceeding to checkout with total: $" + total.toFixed(2));
    });
    $("#search-bar").on("input", function () {
                const searchTerm = $(this).val().toLowerCase();
                $(".product").each(function () {
                    const productName = $(this).find("h3").text().toLowerCase();
                    $(this).toggle(productName.includes(searchTerm));
                });
            });
        });

        $(document).ready(function () {
    const backToTop = $('<button id="back-to-top"><i class="fas fa-arrow-up"></i></button>');
    $('body').append(backToTop);

    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
   document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contact-form');
    const confirmationMessage = document.getElementById('confirmation-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault(); 

            const firstName = document.getElementById('first-name').value.trim();
            const lastName = document.getElementById('last-name').value.trim();
            const mobile = document.getElementById('mobile').value.trim();
            const address = document.getElementById('address').value.trim();
            const age = document.getElementById('age').value.trim();
            const hobbies = document.getElementById('hobbies').value.trim();
            const country = document.getElementById('country').value;

            let isValid = true;
            let errorMessage = '';

            if (firstName === '') {
                isValid = false;
                errorMessage += 'First name is required.\n';
            }

            if (lastName === '') {
                isValid = false;
                errorMessage += 'Last name is required.\n';
            }

            const mobilePattern = /^[0-9]{10}$/;
            if (!mobilePattern.test(mobile)) {
                isValid = false;
                errorMessage += 'Mobile number must be a 10-digit number.\n';
            }

            if (address === '') {
                isValid = false;
                errorMessage += 'Address is required.\n';
            }

            if (age === '' || isNaN(age) || age < 1 || age > 120) {
                isValid = false;
                errorMessage += 'Age must be a number between 1 and 120.\n';
            }

            if (hobbies === '') {
                isValid = false;
                errorMessage += 'Hobbies are required.\n';
            }

            if (country === '') {
                isValid = false;
                errorMessage += 'Please select a country.\n';
            }

            if (isValid) {
                confirmationMessage.style.display = 'block'; 
                confirmationMessage.textContent = 'Thank you for reaching out to us! We will get back to you shortly.';
                confirmationMessage.style.color = 'green';

                this.reset(); 
            } else {
                confirmationMessage.style.display = 'block'; 
                confirmationMessage.textContent = errorMessage;
                confirmationMessage.style.color = 'red';
            }
        });
    } else {
        console.error('Contact form not found in the DOM.');
    }
});


    $('#back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 600);
        return false;
    });

    $(document).on("click", ".add-to-cart", function () {
        const toast = $('<div class="toast">Item added to cart!</div>');
        $('body').append(toast);
        setTimeout(() => toast.addClass('hide'), 2000);
        setTimeout(() => toast.remove(), 2500);
    });

    const sections = $('section');
    $(window).on('scroll', function () {
        const scrollTop = $(this).scrollTop();
        sections.each(function () {
            const sectionTop = $(this).offset().top - $(window).height() / 1.2;
            if (scrollTop > sectionTop) {
                $(this).addClass('visible');
            }
        });
    });
});
