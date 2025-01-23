document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = 'http://192.168.1.13/cart.php'; // Backend API URL'si
    const userId = localStorage.getItem("userId");
    let selectedAddress = null
    let billingAddressId = null

    // Adresleri getir ve listele
    async function fetchOrderSummary() {
        try {
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'total_cart_price',
                    user_id: userId
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {

                        let shippingFee = 39.99;
                        let totalPrice = parseFloat(data.total_price || 0);
                        totalPrice == 0 || totalPrice > 200 ? shippingFee = 0 : shippingFee = 39.99;
                        const result_price = totalPrice + shippingFee;
                        try {
                            const summaryContainer = document.querySelector(".siparis-ozeti ul");
                            summaryContainer.innerHTML = `
        <li>Sipariş Tutarı <span>₺${totalPrice.toFixed(2)}</span></li>
        <li>Kargo Tutarı <span>₺${shippingFee !== 0 ? shippingFee : 0}</span></li>
        <li><strong>Genel Toplam <span>₺${result_price}</span></strong></li>
      `;
                        } catch (error) {
                            console.error("Sipariş özeti yüklenirken bir hata oluştu:", error);
                        }
                    } else {
                        console.error('Sepet toplamı alınamadı:', data.message);
                    }
                })
                .catch(error => console.error('Sepet toplamı alınırken bir hata oluştu:', error));
        } catch (error) {
          console.error('Sepet toplamı alınırken bir hata oluştu:', error)
        }
    }

    // Sipariş özeti bilgilerini getir ve güncelle
    async function fetchAddresses() {

        // API'den adresleri çek
        fetch('http://192.168.1.13/account.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: "read",
                module: "addresses",
                user_id: userId
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error('Ağ veya API hatası.');
            }
            return response.json();
        })
            .then(data => {
                const addressContainer2 = document.querySelector(".adres-detaylari");
                const selectDropdown = document.getElementById("adres-dropdown"); // Adres dropdown menüsü

                // Adresleri select listesine ekleyelim
                selectDropdown.innerHTML = "<option value='' disabled selected>Adres seçin</option>"; // Başlangıç seçeneği

                data.forEach((address, index) => {
                    // Adreslerin her biri için yeni bir option öğesi ekleyelim
                    const option = document.createElement("option");
                    option.value = address.id;
                    option.textContent = `${address.name_surname} - ${address.address} - ${address.district}, ${address.city}`;
                    selectDropdown.appendChild(option);

                    if (index === 0) {
                        selectedAddress = address; // İlk adresi seçili olarak ayarla
                    }
                });
                const addressContainer = document.querySelector(".adres-detaylari");
                addressContainer.innerHTML = "<h3>Teslimat Adresi</h3>";
                data.forEach((address, index) => {
                    const addressHtml = `
                         <div class="adres-secenek">
                           <input type="radio" style="width:2%" id="adres${index}" name="adres" ${index === 0 ? "checked" : ""}>
                           <label for="adres${index}">
                             <b>${address.address_title}</b>
                             <div class="adres-detay">
                               ${address.name_surname}<br>
                               ${address.address}<br>
                               ${address.district} ${address.city}<br>
                               Tel: ${address.phone_number}
                             </div>
                           </label>
                <div class="adres-islem">
                </div>
            `;
                    if (index === 0) {
                        selectedAddress = address; // İlk adresi seçili olarak ayarla
                    }
                    addressContainer.innerHTML += addressHtml;
                });

                addressContainer.innerHTML += `<button class="yeni-adres-ekle">+ Yeni Adres Ekle</button></div>`

                addressContainer.addEventListener("change", (event) => {
                    if (event.target.name === "adres") {
                        const selectedIndex = Array.from(addressContainer.querySelectorAll('input[name="adres"]')).indexOf(event.target);
                        selectedAddress = data[selectedIndex]; // Seçili adresi güncelle
                        console.log("Seçili adres güncellendi:", selectedAddress);
                    }
                });

                // Yeni adres ekleme butonuna tıklama
                addressContainer.addEventListener("click", (event) => {
                    if (event.target.classList.contains("yeni-adres-ekle")) {
                        window.location.href = "Adres-Defterim.html";
                    }
                });
            })
            .catch(error => {
                console.error('Adresler yüklenirken hata oluştu:', error);
            });
    }
    async function completeOrder() {
        if (!selectedAddress) {
            alert("Lütfen bir teslimat adresi seçin.");
            return;
        }

        const faturaTipi = document.getElementById("fatura-tipi").value;

        let faturaParams = ""; // Fatura bilgilerini URL'ye eklemek için kullanılacak
        let selectedBillingAddress = selectedAddress; // Varsayılan olarak teslimat adresi, fatura adresidir

        // Eğer fatura adresi farklı seçildiyse, fatura adresini alın
        const isBillingAddressDifferent = document.getElementById("fatura-adresi-farkli").checked;
        if (isBillingAddressDifferent) {
            billingAddressId = document.getElementById("adres-dropdown").value;
            if (!billingAddressId) {
                alert("Lütfen bir fatura adresi seçin.");
                return;
            }
            console.warn(billingAddressId)
        }

        if (faturaTipi === "kurumsal") {
            const unvan = document.getElementById("unvan").value.trim();
            const vergiNumarasi = document.getElementById("vergi-numarasi").value.trim();
            const vergiDairesi = document.getElementById("vergi-dairesi").value.trim();
            const eposta = document.getElementById("eposta").value.trim();
            const faturaTuru = document.querySelector('input[name="fatura-turu"]:checked');

            // Alanların doğruluğunu kontrol et
            if (!unvan || !vergiNumarasi || !vergiDairesi || !eposta || !faturaTuru) {
                alert("Kurumsal fatura seçeneği için tüm alanları doldurmanız gerekmektedir.");
                return false; // İşlemi durdur
            }

            // E-posta doğrulama kontrolü
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(eposta)) {
                alert("Lütfen geçerli bir e-posta adresi giriniz.");
                return false; // İşlemi durdur
            }

            // Fatura bilgilerini URL parametrelerine ekle
            faturaParams = `&faturaTipi=${faturaTipi}&unvan=${encodeURIComponent(unvan)}&vergiNumarasi=${encodeURIComponent(vergiNumarasi)}&vergiDairesi=${encodeURIComponent(vergiDairesi)}&eposta=${encodeURIComponent(eposta)}&faturaTuru=${encodeURIComponent(faturaTuru.value)}`;
        } else {
            // Bireysel fatura tipini ekle
            faturaParams = `&faturaTipi=${faturaTipi}`;
        }

        try {
            // Ödeme için gerekli bilgileri al
            const totalPriceElement = document.querySelector(".siparis-ozeti ul li:nth-child(3) strong span");
            const totalPrice = totalPriceElement.textContent.replace("₺", "").trim(); // Toplam fiyatı alın

            // Kullanıcıyı payment.html sayfasına yönlendir
            const paymentUrl = `payment.html?totalPrice=${totalPrice}&&addressId=${selectedAddress.id}&addressTitle=${encodeURIComponent(selectedAddress.address_title)}&billingAddressId=${billingAddressId}${faturaParams}`;
            window.location.href = paymentUrl;
        } catch (error) {
            console.error("Siparişi tamamlarken hata oluştu:", error);
        }
    }
    const faturaAdresiButton = document.getElementById("fatura-adresi-farkli");

    faturaAdresiButton.addEventListener("click", () => {
        const faturaAdresi = document.querySelector('.adres-defteri');
        const checkbox = document.getElementById('fatura-adresi-farkli');
        faturaAdresi.style.display = checkbox.checked ? 'block' : 'none';
    });
    document.querySelector(".tamamla").addEventListener("click", completeOrder);

    // İlk yükleme
    fetchOrderSummary();
    fetchAddresses();
});
