document.addEventListener("DOMContentLoaded", function() {
    const adresFormu = document.querySelector("#adres-formu");
    const adresBilgileri = document.querySelector("#adres-bilgileri");
    const adresListesi = document.querySelector('#adresler-listesi');

    const adresKutusu = document.querySelector('.adres-container');
    const yeniEkleBtn = document.querySelector('.yeni-ekle-btn');
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
            module:"addresses",action: 'getCities' })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                sehirSelect.innerHTML = '<option value="">Şehir Seçiniz</option>';
                data.cities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city.name;
                    cityId = city.city_id;
                    option.textContent = city.name;
                    sehirSelect.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Şehirler yüklenirken hata oluştu:', error));

    // İlçe bilgilerini şehre göre doldur
    sehirSelect.addEventListener("change", function() {

        if (cityId) {
            fetch('http://192.168.1.13/account.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    module:"addresses", action: 'getDistricts', city_id: cityId })
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

    /*
    // İlçe seçeneklerini doldur
    sehirSelect.addEventListener("change", function() {
        const sehir = sehirSelect.value;
        let ilceOptions = "<option value=''>İlçe Seçiniz</option>";

        if (sehir === "istanbul") {
            ilceOptions += "<option value='kadikoy'>Kadıköy</option><option value='besiktas'>Beşiktaş</option>";
        } else if (sehir === "ankara") {
            ilceOptions += "<option value='cebeci'>Cebeci</option><option value='kocatepe'>Kocatepe</option>";
        }

        ilceSelect.innerHTML = ilceOptions;
    });


     */
    const addressList = document.querySelector('#adresler-listesi'); // Kategorilerin yükleneceği alan

    console.warn(addressList)
    // Kategorileri API'den çekme
    fetch('http://192.168.1.13/account.php', {
        method: 'POST', // POST isteği
        headers: {
            'Content-Type': 'application/json' // JSON gönderimi için ayarlar
        },
        body: JSON.stringify({
            action: "read",
            module:"addresses",
            user_id: userId  // Kullanıcı ID'sini buraya ekleyin
        }) // API'ye gönderilecek veri
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ağ veya API hatası.');
            }
            return response.json(); // JSON olarak dönen veriyi ayrıştır
        })
        .then(data => {

            if (data && data.length > 0) {
                // Clear the previous list
                $('#adres-listesi-ul').empty();
                // Loop through the addresses and append them as list items
                data.forEach(function(address) {
                    var addressItem = '<div class="adres-box">';
                    addressItem += '<li>'
                    addressItem += '<h4>' + address.address_title + '</h4>';
                    addressItem += '<p>' + address.name_surname + '</p>';
                    addressItem += '<p>' + address.phone_number + '</p>';
                    addressItem += '<p>' + address.address + '</p>';
                    addressItem += '<p>' + address.city + ' - ' + address.district + '</p>';
                    addressItem += '</li>';
                    addressItem += '</div>';

                    $('#adres-listesi-ul').append(addressItem);
                });
            } else {
                // Display a message if no addresses are found
                $('.adres-container').style.display = "block";
            }
        })
        .catch(error => {
            console.error('Adresler yüklenirken hata oluştu:', error);
        });
    // Formu kaydetme işlemi
    document.querySelectorAll('.form-buttons .save-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Form verilerini al
            const addressTitle = document.querySelector("#adres-baslik").value;
            const nameSurname = document.querySelector("#ad-soyad").value;
            const phoneNumber = document.querySelector("#telefon").value;
            const city = sehirSelect.value;
            const district = ilceSelect.value;
            const address = document.querySelector("#adres").value;

            console.warn(addressTitle, nameSurname, phoneNumber, city, district, address);
            // Postman servisinin backend API'ye form verilerini gönder
            fetch('http://192.168.1.13/account.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "create",
                    module:"addresses",
                    user_id: userId,  // Kullanıcı ID'sini buraya ekleyin
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

                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Adres eklerken bir hata oluştu.");
                });

        });

        // "Vazgeç" butonuna tıklama olayını tanımlama
        cancelBtn?.addEventListener('click', () => {
            if (adresKutusu && adresFormu) {
                adresKutusu.style.display = 'block'; // Adres kutusunu göster
                adresFormu.style.display = 'none'; // Adres formunu gizle
            }
        });
        yeniEkleBtn?.addEventListener('click', () => {
            if (adresKutusu && adresFormu) {
                adresKutusu.style.display = 'none'; // Adres kutusunu gizle
                adresFormu.style.display = 'block'; // Adres formunu göster
            }
        });
    })
});
