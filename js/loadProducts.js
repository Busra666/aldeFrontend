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
                    const isFavorite = favoriteProducts.includes(product.id.toString());
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
                            </div>
                        </div>
                    `;
                    productList.appendChild(productCard);
                });

                bindFavoriteButtons();
            })
            .catch(error => {
                console.error('Ürünler yüklenirken hata oluştu:', error);
                productList.innerHTML = '<p>Ürünler yüklenirken bir hata oluştu.</p>';
            });
    }

    function bindFavoriteButtons() {
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', function (e) {
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

});
