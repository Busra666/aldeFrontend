(function ($) {
    "use strict";

    document.addEventListener('DOMContentLoaded', () => {
        console.warn("DomContentLoaded")
        getTotalProductsCount();
        getTotalFavCount();
        const productList = document.getElementById('product-list2');
        // Elemanları seçme
        const adresKutusu = document.querySelector('.adres-container');
        const adresListesi = document.querySelector('.adresler-listesi');
        const adresFormu = document.querySelector('#adres-formu');
        const yeniEkleBtn = document.querySelector('.yeni-ekle-btn');
        const cancelBtn = document.querySelector('.cancel-btn');
        const saveBtn = document.querySelector('.save-btn'); // Kaydet butonu
        const adresBaslikInput = document.getElementById('adres-baslik');
        const adSoyadInput = document.getElementById('ad-soyad');
        const telefonInput = document.getElementById('telefon');
        const adresInput = document.getElementById('adres');
        const sehirInput = document.getElementById('sehir');
        const ilceInput = document.getElementById('ilce');

        const adresBaslikGoster = document.getElementById('adres-baslik-goster');
        const adSoyadGoster = document.getElementById('ad-soyad-goster');
        const telefonGoster = document.getElementById('telefon-goster');
        const adresGoster = document.getElementById('adres-goster');
        const sehirIlceGoster = document.getElementById('sehir-ilce-goster');
        const adresBilgileri = document.getElementById('adres-bilgileri');

        const loggedIn = localStorage.getItem("loggedIn");
        const username = localStorage.getItem("username");
        const menu = document.getElementById("menu");

        const authLink = document.getElementById("authLink");
        const authText = document.getElementById("authText");

        if (loggedIn === "true") {
            if(authLink != null && authText != null) {
                authLink.href = "hesabim.html"; // Linki değiştir
                authText.textContent = username; // Kullanıcı adını yazdır
            }
            // Kullanıcı giriş yaptıysa, "HESABIM" menüsünü gösteriyoruz
            menu.innerHTML = `<button type="button" class="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">${username}</button>
        <div class="dropdown-menu dropdown-menu-right">
            <a href="hesabim.html" class="dropdown-item" role="button">Hesabım</a>
            <a href="Siparislerim.html" class="dropdown-item" role="button">Siparişlerim</a>
            <a href="Favorilerim.html" class="dropdown-item" role="button">Favorilerim</a>
            <a href="IadeTaleplerim.html" class="dropdown-item" role="button">İade Taleplerim</a>
            <a href="index.html" id="logoutButton" class="dropdown-item" role="button">Güvenli Çıkış</a>
        </div>
      `;
        } else {
            // Eğer giriş yapılmadıysa, "Üye Girişi veya Üye Ol" menüsünü gösteriyoruz
            if(menu == null) {
                return
            }

            if(authLink != null && authText != null) {
                authLink.href = "giris.html"; // Varsayılan link
                authText.textContent = "Giriş Yap veya Üye Ol"; // Varsayılan metin
            }
            menu.innerHTML = `
        <button type="button" class="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">Üye Girişi veya Üye Ol</button>
        <div class="dropdown-menu dropdown-menu-right">
            <a href="giris.html" class="dropdown-item" role="button">Üye Girişi</a>
            <a href="kayit.html" class="dropdown-item" role="button">Üye Ol</a>
        </div>
      `;
        }
            // Giriş yapıp yapmadığını kontrol ediyoruz



            // Güvenli çıkış işlemi
            document.addEventListener("click", function(event) {
            if (event.target.id === "logoutButton") {
            // Çıkış işlemi: localStorage'dan giriş bilgisini siliyoruz
            localStorage.removeItem("loggedIn");

            // Sayfayı yenileyerek giriş durumunu sıfırlıyoruz
            location.reload();
        }
        });

        //Arama Yap
        document.querySelector('.input-group').addEventListener('submit', (e) => {
            e.preventDefault();
            const query = e.target.querySelector('input').value;
            window.location.href = `search.html?q=${query}`;
        });



        document.addEventListener('DOMContentLoaded', () => {
            // Artı ve eksi butonlarını seçme
            const btnPlus = document.querySelector('.btn-plus');
            const btnMinus = document.querySelector('.btn-minus');
            const quantityInput = document.querySelector('.quantity-input');

            // Artı butonuna tıklama olayı
            btnPlus.addEventListener('click', () => {
                let currentValue = parseInt(quantityInput.value); // Mevcut değeri al
                quantityInput.value = currentValue + 1; // Değeri bir artır
            });

            // Eksi butonuna tıklama olayı
            btnMinus.addEventListener('click', () => {
                let currentValue = parseInt(quantityInput.value); // Mevcut değeri al
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1; // Değeri bir azalt
                }
            });
        });

        document.addEventListener('DOMContentLoaded', () => {
            // Elemanları seçme
            const createRequestBtn = document.querySelector('.create-request-btn');
            const iadeFormContainer = document.getElementById('iade-form-container');
            const cancelBtn = document.getElementById('cancelBtn');

            // "Yeni Talep Oluştur" butonuna tıklama
            createRequestBtn.addEventListener('click', () => {
                iadeFormContainer.style.display = 'block'; // İçeriği göster
            });

            // "Vazgeç" butonuna tıklama
            cancelBtn.addEventListener('click', () => {
                iadeFormContainer.style.display = 'none'; // İçeriği gizle
            });
        });

        document.addEventListener('DOMContentLoaded', () => {
            // Tutarları seçme
            const siparisTutarElement = document.getElementById('siparisTutar');
            const kargoUcretElement = document.getElementById('kargoUcret');
            const sepetToplamElement = document.getElementById('sepetToplam');

            console.log(siparisTutarElement.textContent); // Kontrol için
            console.log(kargoUcretElement.textContent); // Kontrol için

            // Tutarları metinden alıp sayıya çevirme
            const siparisTutar = parseFloat(siparisTutarElement.textContent.replace('₺', '').replace(',', '.'));
            const kargoUcret = parseFloat(kargoUcretElement.textContent.replace('₺', '').replace(',', '.'));

            // Toplamı hesaplama
            const toplam = (siparisTutar + kargoUcret).toFixed(2); // İki ondalık basamak

            // Toplamı ekrana yazdır
            sepetToplamElement.innerText = `₺${toplam}`;
        });
    });


    let favoriteProducts = [];
    const userId = localStorage.getItem("userId");
    const productList = document.getElementById('product-list2');
    const favoritesUrl = 'http://192.168.1.13/account.php'; // Favori işlemleri API URL'si
    fetch(favoritesUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            module: 'favorites',
            action: 'read',
            user_id: userId
        })
    })
        .then(response => response.json())
        .then(data => {
            favoriteProducts = data.map(fav => fav.product_id);
            console.log(favoriteProducts);
        })
        .catch(error => console.error('Favoriler alınırken hata oluştu:', error))
        .finally(() => loadProducts());

    function loadProducts() {
        const productListContainer = document.getElementById("product-list-container1");

        fetch('http://192.168.1.13/products.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: "read_by_category", category_id: -1 })
        })
            .then(response => response.json())
            .then(data => {
                console.warn(data);
                console.warn(favoriteProducts)
                if (data.length === 0) {
                    productListContainer.innerHTML = '<p>Bu kategoriye ait ürün bulunmamaktadır.</p>';
                    return;
                }

                data.forEach(product => {
                    const isFavorite = favoriteProducts.map(Number).includes(product.id);

                    const productCard = document.createElement("div");
                    productCard.className = "product-item1 bg-light1 mb-4";

                    let imageUrl = null;
                    if (product.image_path != null) {
                        imageUrl = product.image_path.replaceAll("C:\\xampp\\htdocs/", "http://192.168.1.13/");
                    }

                    let rating = product.average_rating ? parseFloat(product.average_rating) : 0;
                    let reviewCount = product.review_count || 0;
                    let fullStars = Math.floor(rating); // Tam yıldız sayısı
                    let halfStar = (rating - fullStars) >= 0.5 ? 1 : 0; // Yarı yıldız kontrolü
                    let emptyStars = 5 - fullStars - halfStar; // Boş yıldız sayısı

                    productCard.innerHTML = `
                    <div class="product-img position-relative overflow-hidden">
                        <div id="carouselExample${product.id}" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner">
                                ${imageUrl && imageUrl.length > 0 ? imageUrl.split(',').map((image, index) => {
                        return `
                                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                            <a href="detail.html?id=${product.id}" style="display: block; overflow: hidden;">
                                                <img src="${image.trim()}" class="img-fluid w-100" alt="Resim ${index + 1}">
                                            </a>
                                        </div>
                                    `;
                    }).join('') : `
                                    <div class="carousel-item active">
                                        <a href="detail.html?id=${product.id}" style="display: block; overflow: hidden;">
                                            <img src="img/default_image.png" class="img-fluid w-100" alt="Varsayılan Resim">
                                        </a>
                                    </div>
                                `}
                            </div>
                            <a class="carousel-control-prev" href="#carouselExample${product.id}" role="button" data-bs-slide="prev">
                                <i class="fa-solid fa-chevron-left"></i>
                            </a>
                            <a class="carousel-control-next" href="#carouselExample${product.id}" role="button" data-bs-slide="next">
                                <i class="fa-solid fa-chevron-right"></i>
                            </a>
                        </div>
                    </div>
                    <div class="text-center py-4">
                        <a class="h6 text-decoration-none text-truncate" href="detail.html?id=${product.id}" style="white-space: normal; word-wrap: break-word;">
                            ${product.name}
                        </a>
                        <div class="d-flex align-items-center justify-content-center mt-2">
                            <h5>₺${product.price}</h5>
                        </div>
                        <div class="d-flex align-items-center justify-content-center mb-1">
                            ${[...Array(fullStars)].map(() => '<small class="fa fa-star text-primary mr-1"></small>').join('')}
                            ${halfStar ? '<small class="fa fa-star-half-alt text-primary mr-1"></small>' : ''}
                            ${[...Array(emptyStars)].map(() => '<small class="fa fa-star text-muted mr-1"></small>').join('')}
                            <small>(${reviewCount})</small>
                        </div>
                        <div class="d-flex align-items-center justify-content-center mb-1">
                            <a class="btn btn-outline-dark btn btn-custom add-to-cart" href="#" data-product-id="${product.id}">
                                <i class="fas fa-shopping-cart" style="margin-right: 5px;"></i> SEPETE EKLE
                            </a>
                        </div>
                        <div class="d-flex align-items-center justify-content-center mb-1">
                            <a id="favorite-btn-${product.id}" class="btn btn-outline-dark btn2 favorite-btn" href="#">
                                <i class="${isFavorite ? 'fa fa-heart text-danger' : 'far fa-heart'}" style="margin-right: 5px;"></i>${isFavorite ? 'Favoriden Çıkar' : 'Favorilere Ekle'}
                            </a>
                        </div>
                    </div>
                `;

                    productListContainer?.appendChild(productCard);
                });
                const addToCartButtons = document.querySelectorAll(".add-to-cart");
                addToCartButtons.forEach(button => {
                    console.warn(button)
                    button.removeEventListener("click", handleClick); // Eski olayları kaldır
                    button.addEventListener("click", handleClick);    // Yeni olay ekle
                });

                bindFavoriteButtons();
            })
            .catch(error => {
                console.error("Ürünler yüklenirken hata oluştu:", error);
                productListContainer.innerHTML = '<p>Ürünler yüklenirken bir hata oluştu.</p>';
            });
    }

    function handleClick() {

        console.warn("a")
        const productId = this.getAttribute("data-product-id")
        handleAddToCart(productId);
    }
// Sepete Ekle Servisini Çağır
    function addToCart(productId, quantity) {
        const apiUrl = 'http://192.168.1.13/cart.php'; // Backend API URL'si
        const userId = localStorage.getItem("userId");

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'add_to_cart',
                user_id: userId,
                product_id: productId,
                quantity: quantity
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Ürün sepete eklendi:', data.message);
                    getTotalProductsCount(); // Sepet sayısını güncelle
                } else {
                    console.error('Ürün eklenemedi:', data.message);
                }
            })
            .catch(error => console.error('Sepet ekleme sırasında bir hata oluştu:', error));
    }


// Sepete ekleme butonuna tıklama olayını yönetme
    function handleAddToCart(productId) {

        // Sepete ekleme servisini çağır
        addToCart(productId, 1);
    }
    function bindFavoriteButtons() {
        document.querySelectorAll('.favorite-btn').forEach(button => {

            const newButton = button.cloneNode(true); // Mevcut düğmeyi klonla
            button.replaceWith(newButton); // Eski düğmeyi yeni klon ile değiştir

            // Yeni düğmeye olay bağla
            newButton.addEventListener('click', function (e) {
                console.warn("Tıklama algılandı.");
                e.preventDefault();

                const productId = this.id.split('-')[2];
                const isFavorite = this.querySelector('i').classList.contains('text-danger');

                fetch(favoritesUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        module: 'favorites',
                        action: isFavorite ? 'delete' : 'create', // Favoriden çıkarma veya ekleme işlemi
                        user_id: userId,
                        product_id: productId
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        const icon = this.querySelector('i');
                        icon.classList.toggle('fa-heart');
                        icon.classList.toggle('far');
                        icon.classList.toggle('text-danger');
                        updateFavoriteStatus(productId); // Favori durumu güncelle
                    })
                    .catch(error => console.error('Favori işlemi sırasında hata oluştu:', error));
            });

        });
    }
    function updateFavoriteStatus(productId) {
        const favoriteBtn = document.getElementById(`favorite-btn-${productId}`);
        if (favoriteBtn) {
            const icon = favoriteBtn.querySelector('i');
            const isFavorite = icon.classList.contains('far');

            // Favori durumunu kontrol et ve metni ve ikonu güncelle
            if (isFavorite) {
                // Favoriden çıkar
                icon.classList.remove('fa', 'fa-heart', 'text-danger');
                icon.classList.add('far', 'fa-heart');
                favoriteBtn.innerHTML = `<i class="far fa-heart" style="margin-right: 5px;"></i> Favorilere Ekle`; // Metni güncelle
            } else {
                // Favoriye ekle
                icon.classList.remove('far', 'fa-heart');
                icon.classList.add('fa', 'fa-heart', 'text-danger');
                favoriteBtn.innerHTML = `<i class="fa fa-heart text-danger" style="margin-right: 5px;"></i> Favoriden Çıkar`; // Metni güncelle
            }

            // Favori sayısını güncelle
            getTotalFavCount();
        }
    }




    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });

    function getTotalProductsCount() {
        const apiUrl = 'http://192.168.1.13/cart.php'; // Backend API URL'si
        const userId = localStorage.getItem("userId");
        const cartCountElement = document.getElementById('cart-count');
        const cartCountElement1 = document.getElementById('cart-count-1');

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'cart_count',
                user_id: userId
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const totalItems = data.total_items || 0; // Eğer sepet boşsa 0 döner
                    if(cartCountElement != null) {
                        cartCountElement.textContent = totalItems; // Sepet sayısını güncelle
                    }
                    if(cartCountElement1 != null) {
                        cartCountElement1.textContent = totalItems; // Sepet sayısını güncelle
                    }
                } else {
                    console.error('Sepet sayısı alınamadı:', data.message);
                    if(cartCountElement != null) {
                        cartCountElement.textContent = '0'; // Hata durumunda 0 göster
                    }
                    if(cartCountElement1 != null) {
                        cartCountElement1.textContent = '0'; // Hata durumunda 0 göster
                    }
                }
            })
            .catch(error => {
                console.error('Sepet sayısı alınırken bir hata oluştu:', error);
                if(cartCountElement != null) {
                    cartCountElement.textContent = '0'; // Hata durumunda 0 göster
                }
                if(cartCountElement1 != null) {
                    cartCountElement1.textContent = '0'; // Hata durumunda 0 göster
                }
            });
    }

    function getTotalFavCount() {
        const apiUrl = 'http://192.168.1.13/account.php'; // Backend API URL'si
        const userId = localStorage.getItem("userId");
        const favCountElement = document.getElementById('fav-count');
        const favCountElement1 = document.getElementById('fav-count-1');

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "module": "favorites",
                "action": "count",
                "user_id": userId
            })
        })
            .then(response => response.json()) .then(data => {
            if (data.favorite_count !== undefined) { // Eğer favori sayısı gelirse
                const totalItems = data.favorite_count || 0; // Favori sayısı ya da 0
                if(favCountElement != null) {
                    favCountElement.textContent = totalItems; // Favori sayısını DOM'da güncelliyoruz // Favori sayısını DOM'da güncelliyoruz
                }
                if(favCountElement1 != null) {
                    favCountElement1.textContent = totalItems;
                }
            } else {
                console.error('Favori sayısı alınamadı:', data.message);
                if(favCountElement != null) {
                    favCountElement.textContent = '0'; // Eğer hata varsa, 0 göster
                }

                if(favCountElement1 != null) {
                    favCountElement1.textContent = '0';
                }
            }
        })
            .catch(error => {
                console.error('Favori sayısı alınırken bir hata oluştu:', error);
                if(favCountElement != null) {
                    favCountElement.textContent = '0'; // Eğer hata varsa, 0 göster
                }
            });
    }

})(jQuery);

