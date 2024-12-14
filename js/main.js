(function ($) {
    "use strict";

    document.addEventListener('DOMContentLoaded', () => {
        console.warn("DomContentLoaded")
        getTotalProductsCount();
        getTotalFavCount();
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
        if (loggedIn === "true") {
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
                    cartCountElement.textContent = totalItems; // Sepet sayısını güncelle
                } else {
                    console.error('Sepet sayısı alınamadı:', data.message);
                    cartCountElement.textContent = '0'; // Hata durumunda 0 göster
                }
            })
            .catch(error => {
                console.error('Sepet sayısı alınırken bir hata oluştu:', error);
                cartCountElement.textContent = '0'; // Ağ hatasında 0 göster
            });
    }

    function getTotalFavCount() {
        const apiUrl = 'http://192.168.1.13/account.php'; // Backend API URL'si
        const userId = localStorage.getItem("userId");
        const favCountElement = document.getElementById('fav-count');

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
                favCountElement.textContent = totalItems; // Favori sayısını DOM'da güncelliyoruz
            } else {
                console.error('Favori sayısı alınamadı:', data.message);
                favCountElement.textContent = '0'; // Eğer hata varsa, 0 göster
            }
        })
            .catch(error => {
                console.error('Favori sayısı alınırken bir hata oluştu:', error);
                favCountElement.textContent = '0'; // Ağ hatasında, 0 göster
            });
    }

})(jQuery);

