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
        console.warn(ordersContainer)
        if (ordersContainer != null) {

            ordersContainer.innerHTML = "<h2>Siparişlerim</h2>";

            var i = 1;
            orders.forEach((order) => {
                console.warn(order);
                // Sipariş detaylarını oluştur
                const orderItem = document.createElement("div");
                orderItem.classList.add("favorite-item");

                orderItem.innerHTML = `
                <span class="item-name text-center">${i})</span>
                
            <div class="order-date-time">
                <span class="order-date">Tarih: ${formatDate(order.order_date.split(" ")[0])}</span>
                <span class="order-time">Saat: ${order.order_date.split(" ")[1]}</span>
            </div>

                <div class="item-controls">
                <span class="item-name text-center" style="color: red">Toplam Tutar </span>
                    <span class="item-name text-center">${order.total_price || "Ürün Adı Belirtilmemiş"}₺</span>
                </div>

                <div class="favorite-btn">
                    <button class="go-to-product-btn">
                        <i class="fa fa-truck"></i> Kargo Takibi
                    </button>
                    <button class="details-btn" onclick="goToDetails(${order.id})">
                        <i class="fa fa-info-circle"></i> Detay
                    </button>
                </div>
            `;

                i++
                ordersContainer.appendChild(orderItem);
            });


        }
    }

    function formatDate(date) {
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    }
    // Detay sayfasına yönlendirme
    window.goToDetails = function (orderId) {
        window.location.href = `siparisdetay.html?id=${orderId}`;
    };

    // Sayfa yüklendiğinde siparişleri çek
    fetchOrders();
});
