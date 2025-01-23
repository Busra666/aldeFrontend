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
    getTotalFavCount();
    const productId = getProductIdFromURL();
    const container = document.getElementById("only-product-detail");

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
        body: JSON.stringify({action: "read", id: productId})
    })
        .then(response => response.json())
        .then(data => {
            console.warn(data)
            if (data.error) {
                container.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
                return;
            }


            let replace = null;
            if (data.image_path != null) {
                replace = data.image_path.replace("C:\\xampp\\htdocs/", "");
            }
            let imageUrl= replace;
            if (replace != null && !replace.includes("https")) {
                imageUrl = 'http://192.168.1.13/' + replace;
            }
            // Ürün detaylarını ekle
            container.innerHTML = `
                <div class="row px-xl-5">
                   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>

                    <div class="col-lg-5 mb-30"><div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
        ${imageUrl && imageUrl.length > 0 ? imageUrl.split(',').map((image, index) => {
                console.warn(image); // Her bir resim URL'sini konsola yazdır
                return `
            <div class="carousel-item">
                    <img src="${image.trim()}" class="img-fluid w-100" alt="Resim ${index + 1}">
            </div>
        `;
            }).join('') : `
    `}
    </div>
    <button class="carousel-control-prev" style="background-color: transparent" role="button" data-bs-slide="prev">
        <i class="fa-solid fa-chevron-left"></i>
    </button>
    <button class="carousel-control-next" style="background-color: transparent" role="button" data-bs-slide="next">
        <i class="fa-solid fa-chevron-right"></i>
    </button>
</div>

                    </div>

                    <div class="col-lg-7 h-auto mb-30">
                        <div class="h-100 bg-light p-30">
                            <h3>${data.name}</h3>
                            <h3 class="font-weight-semi-bold mb-4">₺${data.price}</h3>
                            <p class="mb-4">${data?.description}</p>
                            <div class="d-flex align-items-center mb-4 pt-2">
    <div class="input-group quantity mr-3" style="width: 130px;">
        <div class="input-group-btn">
            <button class="btn btn-primary btn-minus">
                <i class="fa fa-minus"></i>
            </button>
        </div>
        <input type="text" class="form-control form-control-ml bg-secondary border-0 text-center" value="1">
        <div class="input-group-btn">
            <button class="btn btn-primary btn-plus">
                <i class="fa fa-plus"></i>
            </button>
        </div>
    </div>
    <button id="add-to-cart-btn" class="btn btn-primary px-3">
        <i class="fa fa-shopping-cart mr-1"></i> SEPETE EKLE
    </button>
    <p id="stock-status" class="ml-3 text-danger" style="display: none;"></p> <!-- Stok durumu için alan -->
</div>
                        </div>
                    </div>
                </div>
            `;

            var addToCartButton = document.getElementById('add-to-cart-btn');
            var stockStatus = document.getElementById('stock-status');
            const carouselItems = document.querySelectorAll('.carousel-item');
            const prevButton = document.querySelector('.carousel-control-prev');
            const nextButton = document.querySelector('.carousel-control-next');

// İlk öğeye aktif sınıfı ekle
            if (carouselItems.length > 0) {
                carouselItems[0].classList.add('active');
            }

// Sol ve sağ oklar ile aktif öğeyi değiştirme
            let currentIndex = 0; // Başlangıçta aktif olan öğe

// Önceki butona tıklanması durumu
            prevButton.addEventListener('click', () => {
                // Önceki öğeyi bul
                const nextIndex = currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1;
                updateActiveItem(nextIndex);
            });

// Sonraki butona tıklanması durumu
            nextButton.addEventListener('click', () => {
                // Sonraki öğeyi bul
                const nextIndex = currentIndex === carouselItems.length - 1 ? 0 : currentIndex + 1;
                updateActiveItem(nextIndex);
            });

// Aktif öğeyi güncelleme fonksiyonu
            function updateActiveItem(nextIndex) {
                // Aktif olan öğeyi bul ve 'active' sınıfını kaldır
                carouselItems[currentIndex].classList.remove('active');

                // Yeni öğeyi bul ve 'active' sınıfını ekle
                carouselItems[nextIndex].classList.add('active');

                // Güncel index'i kaydet
                currentIndex = nextIndex;
            }
// Eğer ürün stokta yoksa
            if (data.is_deleted == 1) {
                console.warn(data)
                addToCartButton.disabled = true; // Sepete ekle butonunu devre dışı bırak
                stockStatus.style.display = 'block'; // Stok durumu mesajını göster
                stockStatus.textContent = 'Tükenmiştir'; // "Tükenmiştir" mesajını göster
            } else {
                addToCartButton.disabled = false;
                stockStatus.style.display = 'none'; // Stok durumu mesajını gizle
            }
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
        .then(response => response.json()).then(data => {
        console.warn(data)
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

document.querySelector('.clickable-stars').addEventListener('click', function () {
    // Yorum bölümüne kaydırma
    const commentsSection = document.querySelector('#tab-pane-2');
    commentsSection.scrollIntoView({behavior: 'smooth', block: 'start'});

});

let selectedRating = 0;
console.warn("a1")

document.addEventListener("DOMContentLoaded", function () {

console.warn(document.querySelectorAll('.stars'))
})
document.querySelectorAll('.stars .star').forEach(star => {
    console.warn("a2")
    console.warn(star)
    star.addEventListener('click', function () {
        console.warn("a3")
        selectedRating = this.getAttribute('data-value'); // Seçilen puanı sakla
        const stars = this.parentElement.querySelectorAll('.star');

        // Yıldızları doldur/temizle
        stars.forEach(s => {
            if (s.getAttribute('data-value') <= selectedRating) {
                s.classList.add('filled'); // Yıldızları altın rengiyle doldur
            } else {
                s.classList.remove('filled'); // Diğer yıldızları boş bırak
            }
        });
    });
});

renderComments()
function renderComments() {
    const commentsList = document.getElementById("comments-list");

    const productId = getProductIdFromURL();
    const requestData = {
        action: "read",
        product_id: productId,
    };

    // Fetch ile POST isteği yap
    fetch('http://192.168.1.13/product-review.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {

            commentsList.innerHTML = "";
            if (data.error) {
                alert(`Hata: ${data.error}`);
                return;
            }

            data.forEach(comment => {
                // Yıldızları oluştur
                const stars = generateStars(comment.rating);

                // Tarihi formatlama
                const formattedDate = new Date(comment.created_at).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                });

                // Adın ilk harfi büyük, kalan harfleri küçük
                const formattedName = comment.name.charAt(0).toUpperCase() + comment.name.slice(1).toLowerCase();

                // Soyadının ilk harfi
                const surnameInitial = comment.surname.charAt(0).toUpperCase();

                const commentTab = document.getElementById("comments-tab");
                const commentCount = data.length;

                // Yorum sayısını güncelle
                commentTab.textContent = `Yorumlar (${commentCount})`;
                const commentHTML = `
            <div class="comment-item" style="border-bottom: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
                <p style="color: #3a3d41; margin: 0;"><strong>${formattedName} ${surnameInitial}.</strong></p>
                <p style="color: #616469; margin: 5px 0;">${comment.comment}</p>
                <div class="star-rating" style="margin-bottom: 5px; color: lightgray">${stars}</div>
                <div style="text-align: right; color: #999; font-size: 12px;">${formattedDate}</div>
            </div>
        `;

                commentsList.innerHTML += commentHTML;
            });
        })
        .catch(error => {
            alert(`Bir hata oluştu: ${error.message}`);
        });

}
function generateStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? "⭐" : "☆"; // Dolu yıldız için '⭐', boş yıldız için '☆'
    }
    return stars;
}

document.querySelector('.add-comment-btn').addEventListener('click', function () {
    const comment = document.querySelector('.comment-input').value.trim();
    const feedbackMessage = document.querySelector('.feedback-message');
    const productId = getProductIdFromURL(); // URL'den ürün ID'sini al
    const userId = localStorage.getItem("userId");

    // Yorum ve puan kontrolü
    if (!comment || selectedRating === 0) {
        alert("Lütfen bir puan seçin ve yorumunuzu yazın.");
        return;
    }

    // POST isteği için veri oluştur
    const requestData = {
        action: "create",
        product_id: productId,
        user_id: userId,
        rating: selectedRating,
        comment: comment
    };

    // Fetch ile POST isteği yap
    fetch('http://192.168.1.13/product-review.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Hata: ${data.error}`);
                return;
            }

            // Yorum başarı mesajını göster
            feedbackMessage.style.display = 'block';
            feedbackMessage.textContent = "Yorum başarıyla yapıldı!";

            renderComments()
            // 3 saniye sonra mesajı gizle
            setTimeout(() => {
                feedbackMessage.style.display = 'none';
            }, 3000);

            // Yorum alanını temizle
            document.querySelector('.comment-input').value = '';
            selectedRating = 0;
            document.querySelectorAll('.stars .star').forEach(star => {
                star.classList.remove('filled');
            });
        })
        .catch(error => {
            alert(`Bir hata oluştu: ${error.message}`);
        });
});

// Sayfa yüklendiğinde detayları yükle
window.onload = loadProductDetail;
