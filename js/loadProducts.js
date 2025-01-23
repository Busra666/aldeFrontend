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

                data?.forEach(product => {
                    const isFavorite = favoriteProducts.map(Number).includes(product.id);
                    const productCard = document.createElement('div');
                    productCard.className = 'col-lg-4 col-md-6 col-sm-6 pb-1';


                    let imageUrl = null;
                    if(product.image_path != null) {
                        imageUrl = product.image_path.replaceAll("C:\\xampp\\htdocs/","http://192.168.1.13/");
                    }
                    console.warn(product)
                    let rating = product.average_rating ? parseFloat(product.average_rating) : 0;
                    let reviewCount = product.review_count || 0;
                    let fullStars = Math.floor(rating); // Tam yıldız sayısı
                    let halfStar = (rating - fullStars) >= 0.5 ? 1 : 0; // Yarı yıldız kontrolü
                    let emptyStars = 5 - fullStars - halfStar; // Boş yıldız sayısı
                    console.warn(imageUrl)
                    productCard.innerHTML = `
    <div class="product-item bg-light mb-4">
        <div class="product-img position-relative overflow-hidden">
            <div id="carouselExample${product.id}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
    ${imageUrl && imageUrl.length > 0 ? imageUrl.split(',').map((image, index) => {
                        console.warn(image); // Her bir resim URL'sini konsola yazdır
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
            <div class="product-action">
                <!-- İncele Butonu -->
                <a class="btn btn-outline-dark btn-square" href="detail.html?id=${product.id}" style="border-color: transparent !important; opacity: 0"><i class="fa fa-search"></i></a>
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
                <a  id="favorite-btn-${product.id}" class="btn btn-outline-dark btn2 favorite-btn" href="#">
                    <i class="${isFavorite ? 'fa fa-heart text-danger' : 'far fa-heart'}" style="margin-right: 5px;"></i>${isFavorite ? 'Favoriden Çıkar' : 'Favorilere Ekle'}
                </a>
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
                        //handleAddToCart(productId);
                    });
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
