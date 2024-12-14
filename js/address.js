document.addEventListener("DOMContentLoaded", function () {
    const adresFormu = document.querySelector("#adres-formu");
    const adresBilgileri = document.querySelector("#adres-bilgileri");
    const adresListesi = document.querySelector('#adresler-listesi');

    const adresKutusu = document.querySelector('.adres-container');
    const yeniEkleBtn = document.querySelector('.yeni-ekle-btn');
    const yeniEkleBtn2 = document.querySelector('#new-address-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const userId = localStorage.getItem('userId');
    const sehirSelect = document.querySelector("#sehir");
    const ilceSelect = document.querySelector("#ilce");

    let cityId;

    // Şehirleri API'den çek
    fetch('http://192.168.1.13/account.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            module: "addresses", action: 'getCities'
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                sehirSelect.innerHTML = '<option value="">Şehir Seçiniz</option>';
                data.cities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city.name;
                    option.textContent = city.name;
                    option.setAttribute('data-city-id', city.city_id);
                    sehirSelect.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Şehirler yüklenirken hata oluştu:', error));

    // İlçe bilgilerini şehre göre doldur
    sehirSelect.addEventListener("change", function () {
        const selectedCityOption = this.options[this.selectedIndex]; // Seçili option öğesi
        cityId = selectedCityOption.getAttribute('data-city-id');
        if (cityId) {
            fetch('http://192.168.1.13/account.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    module: "addresses", action: 'getDistricts', city_id: cityId
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        ilceSelect.innerHTML = '<option value="">İlçe Seçiniz</option>';
                        data.districts.forEach(district => {
                            const option = document.createElement('option');
                            option.value = district.name;
                            option.textContent = district.name;
                            ilceSelect.appendChild(option);
                        });
                    } else {
                        ilceSelect.innerHTML = '<option value="">İlçe Bulunamadı</option>';
                    }
                })
                .catch(error => console.error('İlçeler yüklenirken hata oluştu:', error));
        } else {
            ilceSelect.innerHTML = '<option value="">İlçe Seçiniz</option>';
        }
    });

    fetchAddresses();

    /**
     * Adresleri API'den çeken ve sayfaya yükleyen metot.
     */
    function fetchAddresses() {
        const adresKutusu = document.querySelector('.adres-container');
        const adresListesi = document.querySelector('#adres-listesi-ul');

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
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ağ veya API hatası.');
                }
                return response.json();
            })
            .then(data => {
                adresListesi.innerHTML = "";
                if (data && data.length > 0) {
                    adresKutusu.style.display = "none";
                    yeniEkleBtn2.style.display = "block"
                    adresListesi.innerHTML = "";

                    // Adresleri listeye ekle
                    data.forEach(function (address) {
                        const addressItem = `
                        <div class="adres-box">
                            <li data-id="${address.id}">
                                <h4>${address.address_title}</h4>
                                <p>${address.name_surname}</p>
                                <p>${address.phone_number}</p>
                                <p>${address.address}</p>
                                <p>${address.city} - ${address.district}</p>
                                <div class="form-buttons">
                                    <button type="button" class="edit-btn" data-id="${address.id}">DÜZENLE</button>
                                    <button type="button" class="delete-btn cancel-btn" data-id="${address.id}">SİL</button>
                                </div>
                            </li>
                        </div>`;
                        adresListesi.innerHTML += addressItem;
                    });

                    // Sil ve düzenle butonlarına event listener ekle
                    addAddressListeners();
                } else {
                    adresKutusu.style.display = "block";
                    yeniEkleBtn2.style.display = "none";
                }
            })
            .catch(error => {
                console.error('Adresler yüklenirken hata oluştu:', error);
            });
    }

    /**
     * Adres düzenleme ve silme için event listener ekleme.
     */
    function addAddressListeners() {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const addressId = this.dataset.id;

                // API'ye silme isteği gönder
                fetch('http://192.168.1.13/account.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: "delete",
                        module: "addresses",
                        id: addressId
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Silme işlemi sonucu:', data);
                        fetchAddresses(); // Adresleri yeniden yükle
                    })
                    .catch(error => console.error('Silme işlemi sırasında hata oluştu:', error));
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function () {
                const addressId = this.dataset.id;
                fetch('http://192.168.1.13/account.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: "getAddressById",
                        module: "addresses",
                        id: addressId // Düzenlenecek adresin ID'si
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            const address = data.address;
                            document.querySelector("#address-id").value = address.id;
                            document.querySelector("#adres-baslik").value = address.address_title;
                            document.querySelector("#ad-soyad").value = address.name_surname;
                            document.querySelector("#telefon").value = address.phone_number;
                            document.querySelector("#sehir").value = address.city;
                            document.querySelector("#ilce").value = address.district;
                            document.querySelector("#adres").value = address.address;
                            fetch('http://192.168.1.13/account.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    module: "addresses", action: 'getDistrictsByName', city_name: address.city
                                })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.status === 'success') {
                                        ilceSelect.innerHTML = '<option value="">İlçe Seçiniz</option>';
                                        data.districts.forEach(district => {
                                            const option = document.createElement('option');
                                            option.value = district.name;
                                            option.textContent = district.name;
                                            ilceSelect.appendChild(option);

                                        });
                                        ilceSelect.value = address.district;
                                    } else {
                                        ilceSelect.innerHTML = '<option value="">İlçe Bulunamadı</option>';
                                    }
                                })
                                .catch(error => console.error('İlçeler yüklenirken hata oluştu:', error));
                            // Formu göster
                            document.querySelector("#adres-formu").style.display = 'block';
                            document.querySelector("#adres-formu").style.marginLeft = '30px';
                            adresListesi.style.display = 'none';
                            yeniEkleBtn2.style.display = 'none';
                        } else {
                            alert("Adres bulunamadı.");
                        }
                    })
                    .catch(error => console.error("Error:", error));
                // Adres bilgilerini düzenleme formunda göster (detayları ekle)
                // Örneğin, düzenleme işlemini açmak için bir modal ya da formu doldurabilirsiniz.
            });
        });
    }

    document.querySelectorAll('.form-buttons .save-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Form verilerini al
            const addressId = document.querySelector("#address-id").value;
            const addressTitle = document.querySelector("#adres-baslik").value;
            const nameSurname = document.querySelector("#ad-soyad").value;
            const phoneNumber = document.querySelector("#telefon").value;
            const city = sehirSelect.value;
            const district = ilceSelect.value;
            const address = document.querySelector("#adres").value;

            const actionType = addressId ? "update" : "create";
            // Postman servisinin backend API'ye form verilerini gönder
            fetch('http://192.168.1.13/account.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: actionType,
                    module: "addresses",
                    user_id: userId,  // Kullanıcı ID'sini buraya ekleyin
                    id: addressId, // Güncelleme için id gönder
                    addressTitle: addressTitle,
                    nameSurname: nameSurname,
                    phoneNumber: phoneNumber,
                    city: city,
                    district: district,
                    address: address
                })
            })
                .then(response => response.json())
                .then(data => {
                    adresFormu.style.display = "none";
                    fetchAddresses()
                    clearForm(adresFormu)
                    adresListesi.style.display = 'block';

                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Adres eklerken bir hata oluştu.");
                });

        });
        function clearForm(form) {
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.type === 'text' || input.type === 'textarea') {
                    input.value = ''; // Text ve textarea alanlarını sıfırla
                } else if (input.type === 'select-one') {
                    input.selectedIndex = 0; // Select kutusunu varsayılan seçime getir
                } else if (input.type === 'hidden') {
                    input.value = ''; // Hidden input'u sıfırla
                }
            });
        }

        // "Vazgeç" butonuna tıklama olayını tanımlama
        cancelBtn?.addEventListener('click', () => {
            if (adresKutusu && adresFormu) {
                adresKutusu.style.display = 'block'; // Adres kutusunu göster
                adresFormu.style.display = 'none'; // Adres formunu gizle
                adresListesi.style.display = 'block';
                fetchAddresses()
                clearForm(adresFormu)
            }
        });
        yeniEkleBtn?.addEventListener('click', () => {
            if (adresKutusu && adresFormu) {
                adresKutusu.style.display = 'none'; // Adres kutusunu gizle
                adresFormu.style.display = 'block'; // Adres formunu göster
            }
        });
        yeniEkleBtn2?.addEventListener('click', () => {
            if (adresKutusu && adresFormu) {
                adresFormu.style.display = 'block'; // Adres formunu göster
                adresListesi.style.display = 'none'
                yeniEkleBtn2.style.display = 'none';
            }
        });
    });
})