document.addEventListener("DOMContentLoaded", async function () {
    const apiUrl = "http://localhost/account.php"; // API URL'si
    let userId = localStorage.getItem("userId");

    // İstek göndererek sipariş listesini çek
    const fetchOrders = async () => {
        const requestData = {
            module: "orders",
            action: "read",
            user_id: userId,
        };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                populateOrderOptions(data); // Sipariş listesini formda doldur
            } else {
                console.error("Sipariş bilgileri alınamadı:", response.statusText);
            }
        } catch (error) {
            console.error("Bir hata oluştu:", error);
        }
    };

    // Seçenekleri doldurmak için fonksiyon
    function populateOrderOptions(orders) {
        const orderNoSelect = document.getElementById("orderNo");
        orderNoSelect.innerHTML = ""; // Önce mevcut seçenekleri temizle

        if (!orders || orders.length === 0) {
            // Eğer sipariş yoksa
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Geçmiş sipariş bulunamadı";
            orderNoSelect.appendChild(option);
            return;
        }

        // Siparişleri seçeneklere ekle
        orders.forEach((order) => {
            const option = document.createElement("option");
            option.value = order.id; // Order ID
            option.textContent = `Tarih: ${order.order_date}, Fiyat: ${order.total_price}`; // Tarih ve adres bilgisi
            orderNoSelect.appendChild(option);
        });
    }

    await fetchOrders(); // Sipariş listesini sayfa yüklendiğinde çek
    const requestData = {
        module: "returns",
        action: "read",
        user_id: userId,
    };

    // İstek gönder
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Sunucudan bir hata döndü!");
            }
            return response.json(); // JSON formatına çevir
        })
        .then((data) => {
            // Listeyi doldur
            populateReturnsList(data);
        })
        .catch((error) => {
            console.error("Hata oluştu:", error);
        });
});

// Listeyi doldurmak için fonksiyon
function populateReturnsList(data) {
    const returnsList = document.getElementById("returns-list");

    if (!data || data.length === 0) {
        returnsList.innerHTML = "<div class=\"iade-box\" id=\"iade-box\">\n" +
            "                    <div class=\"ikon\">\n" +
            "                        <span style=\"color: #e80808;\">&#x21BB;</span>\n" +
            "                    </div>\n" +
            "                    <h2>Geçmiş İade Kaydı Bulunamadı</h2>\n" +
            "                    <p>Şu anda oluşturduğunuz iade kaydı bulunmamaktadır.</p>\n" +
            "                    <a href=\"index.html\"><button class=\"yeni-ekle-btn\">Alışverişe Başla</button></a>\n" +
            "                </div>";
        return;
    }

    // Listeyi oluştur
    let i = 1;
    data.forEach((item) => {
        const orderItem = document.createElement("div");
        orderItem.classList.add("favorite-item");

        orderItem.innerHTML = `
    <div style="width:100% ;border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 15px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
        <h3 class="item-title text-center" style="color: #4CAF50; font-size: 20px;">${i}. İade Bilgisi</h3>
        
        <!-- Tarih ve Saat -->
        <div class="order-date-time" style="margin-bottom: 15px; text-align: left;">
            <div style="margin-bottom: 8px;">
                <span style="font-weight: bold;">Tarih:</span> 
                <span>${formatDate(item.created_at.split(" ")[0])}</span>
            </div>
            <div>
                <span style="font-weight: bold;">Saat:</span> 
                <span>${item.created_at.split(" ")[1]}</span>
            </div>
        </div>

        <!-- İade Sebebi -->
        <div class="item-controls" style="margin-bottom: 15px;">
            <div style="margin-bottom: 5px; font-weight: bold; color: red;">İade Sebebi:</div>
            <div style="padding-left: 10px;">${item.reason}</div>
        </div>

        <!-- İade Açıklaması -->
        <div class="item-controls" style="margin-bottom: 15px;">
            <div style="margin-bottom: 5px; font-weight: bold; color: red;">İade Açıklaması:</div>
            <div style="padding-left: 10px;">${item.description}</div>
        </div>

        <!-- İade Durumu -->
        <div class="item-controls" style="margin-bottom: 15px;">
            <div style="margin-bottom: 5px; font-weight: bold; color: red;">İade Durumu:</div>
            <div style="padding-left: 10px;">${item.order_status}</div>
        </div>
    </div>
`;

        i++
        returnsList.appendChild(orderItem);
    });
    /*
        const listItem = document.createElement("li");
        listItem.textContent = `ID: ${item.id}, Durum: ${item.status}, Tarih: ${item.date}`;
        list.appendChild(listItem);
    });

     */

    //returnsList.appendChild(list);
}

function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
}

const createRequestBtn = document.getElementById('createRequestBtn');
const cancelBtn = document.getElementById('cancelBtn');
const iadeFormContainer = document.getElementById('iadeFormContainer');
const iadeBox = document.getElementById('returns-list');

// Yeni Talep Oluştur butonuna tıklanınca formu göster
createRequestBtn.addEventListener('click', () => {
    iadeFormContainer.style.display = 'block';
    createRequestBtn.style.display = 'none';
    iadeBox.style.display = 'none';

});

// Vazgeç butonuna tıklanınca formu gizle
cancelBtn.addEventListener('click', () => {
    iadeFormContainer.style.display = 'none';
    createRequestBtn.style.display = 'block';
    iadeBox.style.display = 'block';
});
document.getElementById("iadeForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Formun varsayılan olarak yeniden yüklenmesini engelle
    const apiUrl = "http://localhost/account.php"; // API URL'si
    let userId = localStorage.getItem("userId");

    iadeFormContainer.style.display = 'none';
    createRequestBtn.style.display = 'block';
    iadeBox.style.display = 'block';
    // Form verilerini topla
    const orderNo = document.getElementById("orderNo").value;
    const reason = document.getElementById("reason").value;
    const description = document.getElementById("description").value;

    // API isteği için gövdeyi hazırla
    const requestData = {
        "module": "returns",
        "action": "create",
        "user_id": userId,
        "order_id": orderNo,
        "reason": reason,
        "description": description
    }

    try {
        // İstek gönder
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        // Yanıtı kontrol et
        if (response.ok) {
            const responseData = await response.json();
            await fetchOrders();
            alert("İade talebiniz başarıyla gönderildi!");
            console.log("Response:", responseData);
        } else {
            alert("İade talebiniz gönderilirken bir hata oluştu.");
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        alert("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        console.error("Fetch error:", error);
    }
});

