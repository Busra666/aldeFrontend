document.addEventListener('DOMContentLoaded', function () {
    const categoryList = document.querySelector('.category-list'); // Kategorilerin yükleneceği alan

    // Kategorileri API'den çekme
    fetch('http://192.168.1.13/categories.php', {
        method: 'POST', // POST isteği
        headers: {
            'Content-Type': 'application/json' // JSON gönderimi için ayarlar
        },
        body: JSON.stringify({ action: "read_all" }) // API'ye gönderilecek veri
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ağ veya API hatası.');
            }
            return response.json(); // JSON olarak dönen veriyi ayrıştır
        })
        .then(data => {
            // Gelen verilerle kategori bağlantılarını oluştur
            data.forEach(category => {
                if (category.is_deleted === "0") { // Sadece silinmemiş kategoriler
                    const link = document.createElement('a');
                    link.href = `shop.html?category_id=${category.id}`; // `category_id` parametresiyle yönlendirme
                    link.className = 'nav-item nav-link';
                    link.textContent = category.name; // Kategori adı olarak `name` alanını kullan
                    categoryList.appendChild(link);
                }
            });
        })
        .catch(error => {
            console.error('Kategoriler yüklenirken hata oluştu:', error);
        });
});
