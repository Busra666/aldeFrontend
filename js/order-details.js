document.addEventListener("DOMContentLoaded", function () {
    const orderDetailsContainer = document.querySelector(".order-details");
    const orderSummaryContainer = document.querySelector(".order-summary");

    // URL'den 'id' parametresini al
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");

    if (!orderId) {
        orderDetailsContainer.innerHTML = "<p>Geçersiz sipariş ID'si.</p>";
        return;
    }

    // Sipariş detaylarını API'den çek ve görüntüle
    fetch("http://192.168.1.13/account.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "read_detail",
            module: "orders",
            order_id: orderId, // API'ye sipariş ID'sini gönder
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("API'den cevap alınamadı.");
            }
            console.warn(response)
            return response.json();
        })
        .then((data) => {
            console.warn(data);
            if (!data || data.length === 0) {
                orderDetailsContainer.innerHTML = "<p>Sipariş detayları bulunamadı.</p>";
                return;
            }

            displayOrderDetails(data);
        })
        .catch((error) => {
            console.error("Sipariş detayları alınamadı:", error);
            orderDetailsContainer.innerHTML =
                "<p>Sipariş detayları alınırken bir hata oluştu.</p>";
        });

    // Sipariş detaylarını ekrana yazdır
    function displayOrderDetails(orderDetails) {
        let totalAmount = 0;

        orderDetails.forEach((item) => {
            console.warn(item)
            totalAmount += item?.price * item.quantity;

            const orderItem = document.createElement("div");
            orderItem.classList.add("order-item");

            let replace = null;
            if (item.image_path != null) {
                replace = item.image_path.replace("C:\\xampp\\htdocs/", "");
            }

            let imageUrl= replace;
            if(replace != null) {
                imageUrl= replace.split(",")[0];
            }
            if (replace != null && !replace.includes("https")) {
                imageUrl = 'http://192.168.1.13/' + replace;
            }
            orderItem.innerHTML = `
                
            <!-- verilen sipariş -->
            <div class="favorite-item">
            <img src="${item.image_path ? imageUrl : 'img/yeni_gelenler_1.png'}" alt="" style="width: 90px;">
                    <a href="detail.html?id=${item.product_id}" class="item-name text-center">${item.name}</a>

                    <div class="item-controls">
                        <!-- Adet Kutusu -->
                        <label for="adet" class="item-quantity-label">Adet:</label>
                        <input type="text" id="adet" class="item-quantity" value="${item.quantity}" readonly>
                    </div>

                    <div class="order-details text-center">

                        <!-- Toplam Tutar -->
                        <div class="order-total item-controls">
                            <span class="total-label" style="color: red; font-weight: bold;">Toplam Tutar:</span>
                            <span class="total-amount">${(item.price* item.quantity).toFixed(2)}₺</span>
                        </div>
                    </div>




                    <div class="favorite-btn">

                        <!-- Yorum Yap Butonu -->
                        <button class="leave-review-btn" onclick="window.location.href='detail.html?id=${item.product_id}'">
                            <i class="fa fa-pencil"></i> Yorum Yap
                        </button>

                    </div>

            </div>
        </div>
            `;

            orderDetailsContainer.appendChild(orderItem);
        });

        // Sipariş toplamını yazdır
        orderSummaryContainer.innerHTML = `
            <p>Toplam Tutar: <span>${totalAmount.toFixed(2)} ₺</span></p>
        `;
    }
});
