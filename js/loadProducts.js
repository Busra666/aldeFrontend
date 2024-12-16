document.addEventListener('DOMContentLoaded', function () {
    const productList = document.getElementById('product-list');
    const apiUrl = 'http://192.168.1.13/cart.php'; // Sepet işlemleri API URL'si
    const favoritesUrl = 'http://192.168.1.13/account.php'; // Favori işlemleri API URL'si

    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category_id');
    const userId = localStorage.getItem('userId');

    if (!categoryId) {
        productList.innerHTML = '<p>Kategori seçilmedi.</p>';
        return;
    }

    // Favori ürünleri çek
    let favoriteProducts = [];
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
            console.warn("asdasd")
                console.warn(data)
                favoriteProducts = data.map(fav => fav.product_id);
                console.log(favoriteProducts);
        })
        .catch(error => console.error('Favoriler alınırken hata oluştu:', error))
        .finally(() => loadProducts());

    function loadProducts() {
        fetch('http://192.168.1.13/products.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: "read_by_category", category_id: categoryId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    productList.innerHTML = '<p>Bu kategoriye ait ürün bulunmamaktadır.</p>';
                    return;
                }

                data.forEach(product => {
                    const isFavorite = favoriteProducts.map(Number).includes(product.id);
                    const productCard = document.createElement('div');
                    productCard.className = 'col-lg-4 col-md-6 col-sm-6 pb-1';

                    productCard.innerHTML = `
                        <div class="product-item bg-light mb-4">
                            <div class="product-img position-relative overflow-hidden">
                                <img class="img-fluid w-100" src="img/yeni_gelenler_1.png" alt="${product.name}">
                                <div class="product-action">
                                    <a id="favorite-btn-${product.id}" class="btn btn-outline-dark btn-square favorite-btn" href="#">
                                        <i class="${isFavorite ? 'fa fa-heart text-danger' : 'far fa-heart'}"></i>
                                    </a>
                                    <a class="btn btn-outline-dark btn-square" href="detail.html?id=${product.id}">
                                        <i class="fa fa-search"></i>
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
                            <button id="add-to-cart-btn" class="btn btn-outline-dark btn btn-custom add-to-cart" data-product-id="${product.id}">SEPETE EKLE</a>
                        </div>
                            </div>
                        </div>
                        
                    `;
                    productList.appendChild(productCard);
                })

                const addToCartButtons = document.querySelectorAll(".add-to-cart");

                // Her butona tıklama olayı ekle
                addToCartButtons.forEach(button => {
                    button.addEventListener("click", function () {
                        const productId = this.getAttribute("data-product-id")
                        console.warn(productId)
                        handleAddToCart(productId);
                    });
                });
                console.warn("123123")
                bindFavoriteButtons();
            })
            .catch(error => {
                console.error('Ürünler yüklenirken hata oluştu:', error);
                productList.innerHTML = '<p>Ürünler yüklenirken bir hata oluştu.</p>';
            });
    }

    function bindFavoriteButtons() {
        console.warn("123123aaa")
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', function (e) {
                console.warn("123123123")
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
                        action: 'create',
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
                            updateFavoriteStatus(productId);
                            console.warn(data)
                    })
                    .catch(error => console.error('Favori işlemi sırasında hata oluştu:', error));
            });
        });
    }

    function updateFavoriteStatus(productId) {
        const favoriteBtn = document.getElementById(`favorite-btn-${productId}`);
        console.warn(favoriteBtn);
        // İkonu değiştir
        if (favoriteBtn) {
            const icon = favoriteBtn.querySelector('i');
            getTotalFavCount()
            if (icon.classList.contains('far')) {
                // Favori oldu: far fa-heart yerine fa fa-heart text-danger
                icon.classList.remove('fa', 'fa-heart', 'text-danger'); // Mevcut sınıfları kaldır
                icon.classList.add('far', 'fa-heart'); // Yeni sınıfları ekle

            } else {
                icon.classList.remove('far', 'fa-heart'); // Mevcut sınıfları kaldır
                icon.classList.add('fa', 'fa-heart', 'text-danger'); // Yeni sınıfları ekle
                // Favori kaldırıldı: fa fa-heart text-danger yerine far fa-heart
            }
        }
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

// Sepete ekleme butonuna tıklama olayını yönetme
    function handleAddToCart(productId) {
        const quantity = 1 // Kullanıcının seçtiği miktar

        if (isNaN(quantity) || quantity <= 0) {
            alert('Lütfen geçerli bir miktar seçin.');
            return;
        }

        // Sepete ekleme servisini çağır
        addToCart(productId, quantity);
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


});
