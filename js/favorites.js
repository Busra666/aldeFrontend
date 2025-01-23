document.addEventListener('DOMContentLoaded', function () {
    const favList = document.getElementById('fav-list'); // Sepet ürünlerini listeleyeceğimiz alan
    const favTotal = document.getElementById('sepet-toplam'); // Sepet ürünlerini listeleyeceğimiz alan
    const favListDiv = document.getElementById('favorites'); // Sepet ürünlerini listeleyeceğimiz alan
    const emptyFavori = document.getElementById('favoriler-box');
    const favoritesUrl = 'http://192.168.1.13/account.php'; // Favori işlemleri API URL'si
    const userId = localStorage.getItem('userId');
    const apiUrl = 'http://192.168.1.13/cart.php'; // Backend API URL'si
    document.querySelectorAll('.product-action .btn-square').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            const userId = localStorage.getItem('userId');
            const productId = this.closest('.product-item').querySelector('.add-to-cart').dataset.productId;

            fetch('http://192.168.1.13/account.php', {
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
                    if (data.status === 'success') {
                        alert('Ürün favorilere eklendi!');
                    } else {
                        alert(`Hata: ${data.message}`);
                    }
                })
                .catch(error => {
                    console.error('Favorilere ekleme sırasında hata:', error);
                });
        });
    });

    // Favori ürünleri çek
    function fetchFavorites() {
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
                if(favList != null) {

                    favList.innerHTML = ''; // Önce mevcut listeyi temizle
                    console.warn(data)
                    if (data.length === 0) {
                        emptyFavori.style.display = 'block';
                        favListDiv.style.display = 'none';
                        return;
                    }
                    emptyFavori.style.display = 'none';
                    favListDiv.style.display = 'block';
                    // Ürünleri listele
                    data?.forEach(item => {
                        const cartItem = document.createElement('tr');

                        let replace = null;
                        if (item.product_image_path != null) {
                            replace = item.product_image_path.replace("C:\\xampp\\htdocs/", "");
                        }

                        let imageUrl= replace;
                        if(replace != null) {
                            imageUrl= replace.split(",")[0];
                        }
                        if (replace != null && !replace.includes("https")) {
                            imageUrl = 'http://192.168.1.13/' + replace;
                        }
                        cartItem.innerHTML = `
                    <td class="align-middle">
    <img src="${item.product_image_path ? imageUrl : 'img/yeni_gelenler_1.png'}" alt="" style="width: 90px;">
    <a href="detail.html?id=${item.product_id}" class="product-name">${item.product_name}</a>
</td>
                    <td class="align-middle">₺${item.product_price}</td>
                    <td class="align-middle">
                     <div class="favorite-btn">
                    <button class="go-to-product-btn" data-product-id="${item.product_id}" data-action="search">
                        <i class="fas fa-search" data-product-id="${item.product_id}" data-action="search"></i>
                    </button>
                    <button class="add-to-cart-btn" data-product-id="${item.product_id}" data-action="add-cart">
                        <i class="fas fa-cart-plus" data-product-id="${item.product_id}" data-action="add-cart"></i>
                    </button>
                    <button class="remove-btn" data-product-id="${item.product_id}" data-action="remove-fav">
                        <i class="fas fa-heart-broken" data-product-id="${item.product_id}" data-action="remove-fav"></i>
                    </button>
                </div>
                    </td>
                    `;

                        favList.appendChild(cartItem);
                    });

                    // Butonların click olaylarını dinle
                    favList.addEventListener('click', function (e) {
                        // Sadece butonların içindeki tıklamaları al
                        const button = e.target.closest('button');

                        if (button) {
                            const action = button.dataset.action; // data-action değerini al
                            const productId = button.dataset.productId; // data-product-id değerini al

                            // Console'a yaz
                            console.log(`Action: ${action}, Product ID: ${productId}`);

                            // Action'a göre işlem yapabilirsiniz
                            switch (action) {
                                case 'search':
                                    console.log('Ürün detayına gitme işlemi başlatıldı.');
                                    window.location.href = `detail.html?id=${productId}`;
                                    break;
                                case 'add-cart':
                                    console.log('Ürün sepete ekleme işlemi başlatıldı.');

                                    fetch(apiUrl, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            action: 'add_to_cart',
                                            user_id: userId,
                                            product_id: productId,
                                            quantity: 1
                                        })
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.status === 'success') {
                                                getTotalProductsCount()
                                            } else {
                                                console.error('Sepet güncellenirken bir hata oluştu:', data.message);
                                            }
                                        })
                                        .catch(error => console.error('Sepet güncellenirken bir hata oluştu:', error));
                                    break;
                                case 'remove-fav':
                                    console.log('Ürün favorilerden kaldırılıyor.');

                                    fetch('http://192.168.1.13/account.php', {
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
                                            console.warn(data)
                                            if (data.status === 'success') {
                                                alert('Ürün favorilere eklendi!');
                                            } else {
                                                getTotalFavCount()
                                                fetchFavorites()
                                                alert(`${data.message}`);
                                            }
                                        })
                                        .catch(error => {
                                            console.error('Favorilere ekleme sırasında hata:', error);
                                        });

                                    break;
                                default:
                                    console.log('Bilinmeyen bir işlem.');
                                    break;
                            }
                        }
                    });
                }
            })
            .catch(error => console.error('Favoriler alınırken hata oluştu:', error))
            .finally();

    }

    fetchFavorites()

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

});
