document.addEventListener("DOMContentLoaded", function () {
    const ordersContainer = document.querySelector(".favorites-container"); // Siparişlerin yükleneceği ana alan
    const userId = localStorage.getItem("userId"); // Kullanıcı ID'sini al (localStorage'den)

    // Orders verilerini çekmek için fetch isteği
    function fetchOrders() {
        fetch("http://192.168.1.13/account.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "read",
                module: "orders",
                user_id: userId, // Kullanıcı ID'si
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("API'den cevap alınamadı.");
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.length > 0) {
                    displayOrders(data); // Gelen verileri ekrana yazdır
                } else {
                    ordersContainer.innerHTML =
                        "<p>Henüz siparişiniz bulunmamaktadır.</p>";
                }
            })
            .catch((error) => {
                console.error("Siparişler alınırken hata oluştu:", error);
                ordersContainer.innerHTML =
                    "<p>Bir hata oluştu. Lütfen tekrar deneyiniz.</p>";
            });
    }

    // Siparişleri ekrana listeleme
    function displayOrders(orders) {
        // Mevcut içeriği temizle
        ordersContainer.innerHTML = "<h2>Siparişlerim</h2>";

        orders.forEach((order) => {
            // Sipariş detaylarını oluştur
            const orderItem = document.createElement("div");
            orderItem.classList.add("favorite-item");

            orderItem.innerHTML = `
                <img src="img/favori-1.png" alt="Sipariş Görseli" class="item-img">
                <span class="item-name text-center">${order.product_name || "Ürün Adı Belirtilmemiş"}</span>

                <div class="item-controls">
                    <!-- Adet Kutusu -->
                    <label for="adet" class="item-quantity-label">Adet:</label>
                    <input type="text" id="adet" class="item-quantity" value="${order.quantity || 1}" readonly>
                </div>

                <div class="favorite-btn">
                    <button class="go-to-product-btn">
                        <i class="fa fa-truck"></i> Kargo Takibi
                    </button>
                </div>
            `;

            ordersContainer.appendChild(orderItem);
        });
    }

    // Sayfa yüklendiğinde siparişleri çek
    fetchOrders();
});
