document.addEventListener('DOMContentLoaded', function () {
    const productList = document.getElementById('product-list');

    const apiUrl = 'http://192.168.1.13/cart.php'; // Sepet işlemleri API URL'si
    // URL'den `category_id` değerini al
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category_id');

    if (!categoryId) {
        productList.innerHTML = '<p>Kategori seçilmedi.</p>';
        return;
    }

    // Ürünleri API'den çekme
    fetch('http://192.168.1.13/products.php', {
        method: 'POST', // POST isteği
        headers: {
            'Content-Type': 'application/json' // JSON gönderimi için ayarlar
        }, body: JSON.stringify({action: "read_by_category", category_id: categoryId}) // Kategoriye göre ürünleri çek
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ağ veya API hatası.');
            }
            return response.json(); // JSON olarak dönen veriyi ayrıştır
        })
        .then(data => {
            if (data.length === 0) {
                productList.innerHTML = '<p>Bu kategoriye ait ürün bulunmamaktadır.</p>';
                return;
            }

            // Ürünleri listele
            data.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'col-lg-4 col-md-6 col-sm-6 pb-1';

                productCard.innerHTML = `
                <div class="product-item bg-light mb-4">
                    <div class="product-img position-relative overflow-hidden">
                        <img class="img-fluid w-100" src="img/yeni_gelenler_1.png" alt="${product.name}">
                        <div class="product-action">
                            <a class="btn btn-outline-dark btn-square" href="#"><i class="far fa-heart"></i></a>
                            <a class="btn btn-outline-dark btn-square" href="detail.html?id=${product.id}"><i class="fa fa-search"></i></a>
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
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small class="fa fa-star text-primary mr-1"></small>
                            <small>(99)</small>
                        </div>
                        
                        <div class="d-flex align-items-center justify-content-center mb-1">
                            <button class="btn btn-outline-dark btn btn-custom add-to-cart" data-product-id="${product.id}">SEPETE EKLE</a>
                        </div>
                    </div>
                </div>
            `;
                productList.appendChild(productCard);
            });
            // "SEPETE EKLE" butonlarına tıklama olayını dinle
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function () {
                    const userId = localStorage.getItem('userId');
                    const productId = this.dataset.productId;

                    fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            action: 'add_to_cart',
                            user_id: userId,
                            product_id: productId,
                            quantity: 1 // Varsayılan olarak 1 adet ekleniyor
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 'success') {
                                alert('Ürün sepete eklendi!');
                                getTotalProductsCount()
                            } else {
                                alert(`Hata: ${data.message}`);
                            }
                        })
                        .catch(error => {
                            console.error('Ürün sepete eklenirken bir hata oluştu:', error);
                        });
                });
            });
        })
        .catch(error => {
            console.error('Ürünler yüklenirken hata oluştu:', error);
            productList.innerHTML = '<p>Ürünler yüklenirken bir hata oluştu.</p>';
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
});
