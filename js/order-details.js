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

            orderItem.innerHTML = `
                <div class="item-info">
                    <img src="img/favori-1.png" alt="Ürün Görseli">
                    <div>
                        <p class="item-name">${item.name}</p>
                        <p class="item-quantity">Adet: ${item.quantity}</p>
                    </div>
                </div>
                <div class="item-price">
                    <p>${(item.price* item.quantity).toFixed(2)}₺</p>
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
