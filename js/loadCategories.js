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

// Gruplar
            const groups = {
                "İLKOKUL": ["1.SINIF", "2.SINIF", "3.SINIF", "4.SINIF"],
                "ORTAOKUL": ["5.SINIF", "6.SINIF", "7.SINIF", "8.SINIF"],
                "LİSE": ["9.SINIF", "10.SINIF", "11.SINIF"],
            };

// Menü konteyneri
            const menuContainer = document.getElementById("navbar-menu-container");

// Dropdown oluşturma fonksiyonu
            const createDropdown = (title, items) => {
                const dropdown = document.createElement("div");
                dropdown.classList.add("nav-item", "dropdown");

                const dropdownToggle = document.createElement("a");
                dropdownToggle.classList.add("nav-link", "dropdown-toggle");
                dropdownToggle.href = "#";
                dropdownToggle.setAttribute("data-toggle", "dropdown");
                dropdownToggle.innerHTML = `${title} <span style="font-size: 0.8em;">▼</span>`; // Küçük ok ekleme
                dropdown.appendChild(dropdownToggle);

                const dropdownMenu = document.createElement("div");
                dropdownMenu.classList.add("dropdown-menu");

                items.forEach(item => {
                    const category = data.find(cat => cat.name === item);
                    if (category) {
                        const dropdownItem = document.createElement("a");
                        dropdownItem.classList.add("dropdown-item");
                        dropdownItem.href = `shop.html?category_id=${category.id}`;
                        dropdownItem.textContent = category.name;
                        dropdownMenu.appendChild(dropdownItem);
                    }
                });

                dropdown.appendChild(dropdownMenu);
                menuContainer.appendChild(dropdown);
            };

// İlkokul ve Ortaokul dropdownlarını oluştur
            Object.entries(groups).forEach(([groupName, groupItems]) => {
                createDropdown(groupName, groupItems);
            });

// Diğer kategoriler
            data.forEach(category => {
                const isInGroup = Object.values(groups).some(group =>
                    group.includes(category.name)
                );
                if (!isInGroup) {
                    const link = document.createElement("a");
                    link.classList.add("nav-item", "nav-link");
                    link.href = `shop.html?category_id=${category.id}`;
                    link.textContent = category.name;
                    menuContainer.appendChild(link);
                }
            });

        })
        .catch(error => {
            console.error('Kategoriler yüklenirken hata oluştu:', error);
        });
});