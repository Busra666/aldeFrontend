// URL'den "id" parametresini al
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // 'id' parametresini döner
}
// Ürün miktarını değiştirme butonlarına tıklama işlemi
function updateQuantity(action, inputElement) {
    let currentValue = parseInt(inputElement.value, 10) || 1;

    // Miktarı artır veya azalt
    if (action === "add") {
        currentValue++;
    } else if (action === "subtract" && currentValue > 1) {
        currentValue--;
    }

    // Yeni değeri input alanına yaz
    inputElement.value = currentValue;
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
function handleAddToCart() {
    const productId = getProductIdFromURL(); // URL'den ürün ID'sini al
    const quantityInput = document.querySelector('.quantity input'); // Miktar input öğesi
    const quantity = parseInt(quantityInput.value, 10); // Kullanıcının seçtiği miktar

    if (isNaN(quantity) || quantity <= 0) {
        alert('Lütfen geçerli bir miktar seçin.');
        return;
    }

    // Sepete ekleme servisini çağır
    addToCart(productId, quantity);
}

// Sayfa yüklendiğinde detayları yükle
function loadProductDetail() {
    const productId = getProductIdFromURL();
    const container = document.getElementById("product-detail-container");

    if (!productId) {
        container.innerHTML = `<div class="alert alert-danger">Ürün ID bulunamadı!</div>`;
        return;
    }

    // Ürün detaylarını API'den çek
    fetch('http://192.168.1.13/products.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: "read", id: productId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                container.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
                return;
            }

            // Ürün detaylarını ekle
            container.innerHTML = `
                <div class="row px-xl-5">
                    <div class="col-lg-5 mb-30">
                        <div id="product-carousel" class="carousel slide" data-ride="carousel">
                            <div class="carousel-inner bg-light">
                                <div class="carousel-item active">
                                    <img class="w-100 h-100" src="img/yeni_gelenler_1.png" alt="Image" style="max-width: 80%;">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-7 h-auto mb-30">
                        <div class="h-100 bg-light p-30">
                            <h3>${data.name}</h3>
                            <h3 class="font-weight-semi-bold mb-4">₺${data.price}</h3>
                            <p class="mb-4">${data?.features?.replace(/\n/g, "<br>")}</p>
                            <div class="d-flex align-items-center mb-4 pt-2">
                                <div class="input-group quantity mr-3" style="width: 130px;">
                                    <div class="input-group-btn">
                                        <button class="btn btn-primary btn-minus">
                                            <i class="fa fa-minus"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control bg-secondary border-0 text-center" value="1">
                                    <div class="input-group-btn">
                                        <button class="btn btn-primary btn-plus">
                                            <i class="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <button id="add-to-cart-btn" class="btn btn-primary px-3">
                                    <i class="fa fa-shopping-cart mr-1"></i> SEPETE EKLE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Miktar değişim butonları için olay dinleyicileri ekle
            document.querySelector('.btn-plus').addEventListener('click', function () {
                const quantityInput = document.querySelector('.quantity input');
                updateQuantity('add', quantityInput);
            });

            document.querySelector('.btn-minus').addEventListener('click', function () {
                const quantityInput = document.querySelector('.quantity input');
                updateQuantity('subtract', quantityInput);
            });

            // "Sepete Ekle" butonuna tıklama olayı
            document.getElementById('add-to-cart-btn').addEventListener('click', handleAddToCart);
        })
        .catch(error => {
            console.error("Hata:", error);
            container.innerHTML = `<div class="alert alert-danger">Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</div>`;
        });
}

// Sayfa yüklendiğinde detayları yükle
window.onload = loadProductDetail;

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

// Sayfa yüklendiğinde detayları yükle
window.onload = loadProductDetail;
