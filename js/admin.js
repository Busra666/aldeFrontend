// API URL
const apiUrl = "http://192.168.1.13/categories.php";

// Kategorileri Çekme Fonksiyonu
function fetchCategories() {
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "read_all"
        })
    })
        .then(response => response.json())
        .then(data => {
            populateDropdown(data);
            categoriesCache = data;  // Kategorileri cache'liyoruz
        })
        .catch(error => console.error("Hata:", error));
}

// Kategorileri Görüntüleme Fonksiyonu
function populateDropdown(categories) {
    const dropdown = document.getElementById('productCategory');

    // Gelen kategorilerle <option> etiketlerini oluştur
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id; // id'yi value olarak ayarla
        option.textContent = category.name; // Kategori adını yazdır
        dropdown.appendChild(option);
    });
}
document.getElementById('productForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Sayfanın yeniden yüklenmesini engelle
    // Formu al ve FormData nesnesi oluştur

    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = document.getElementById('productPrice').value;
    const categoryId = document.getElementById('productCategory').value;
    const action = document.getElementById('submit-button').textContent == "Güncelle" ? "update" : "create"; // Action değerini kontrol et
    const image = document.getElementById('productImage').files[0]; // Dosya seçimi

    console.log(name, description, price, categoryId);
    console.log(image);
    // FormData oluştur
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category_id', categoryId);
    formData.append('action', action);
    console.warn(formData)

    try {
        let url = 'http://192.168.1.13/products.php'; // Varsayılan servis URL

        if (action === 'update') {
            formData.append('id',localStorage.getItem('productId'));
        } else {
            formData.append('image', image);
        }

        // AJAX POST isteği
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        // Yanıtı kontrol et
        if (response.ok) {
            const result = await response.json(); // JSON beklediğimizi varsayıyoruz
            alert(action === 'create' ? 'Ürün başarıyla kaydedildi!' : 'Ürün başarıyla güncellendi!');
            console.log('Sonuç:', result);
            fetchProducts(); // Ürünleri tekrar yükle
        } else {
            const error = await response.text();
            console.error('Hata:', error);
            alert('Ürün kaydedilemedi!');
        }
    } catch (err) {
        console.error('İstek sırasında hata oluştu:', err);
        alert('Bir hata meydana geldi!');
    }
});

function fetchProducts() {
    const url = 'http://192.168.1.13/products.php'; // Servis URL
    const data = { action: 'read_all' }; // Gönderilecek parametre

    // AJAX isteği (fetch kullanarak)
    fetch(url, {
        method: 'POST',  // POST isteği
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)  // JSON formatında parametre gönder
    })
        .then(response => response.json())  // JSON olarak yanıtı al
        .then(products => {
            updateTable(products);  // Tabloları güncelle
        })
        .catch(error => console.error('Veri çekme hatası:', error));
}
function updateTable(products) {
    const tableBody = document.getElementById('product-list');
    tableBody.innerHTML = ''; // Önceki veriyi temizle


    // Eğer gelen veri boşsa
    if (!products || products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">Ürün bulunamadı.</td></tr>';
        return;  // Döngüye girmemek için fonksiyonu sonlandır
    }

    // Gelen ürünlerle tabloyu doldur
    products.forEach(product => {
        const row = document.createElement('tr');

        // Ürün ID
        const idCell = document.createElement('td');
        idCell.textContent = product.id;

        // Ürün Görselleri
        const imageCell = document.createElement('td');
        imageCell.innerHTML = `
            <div class="product-images">
                <a href="#" data-bs-toggle="modal" data-bs-target="#imageModal${product.id}">
                    <img src="${product.image_path || 'img/yeni_gelenler_1.png'}" alt="Ürün Görseli" class="img-thumbnail" style="width: 50px; height: 50px;">
                </a>
            </div>
        `;

        // Ürün Adı
        const nameCell = document.createElement('td');
        nameCell.textContent = product.name;

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = product.description;

        // Kategori
        const categoryCell = document.createElement('td');
        categoryCell.textContent = product.category_name;

        // Fiyat
        const priceCell = document.createElement('td');
        priceCell.textContent = `₺${parseFloat(product.price).toFixed(2)}`;

        // İşlemler (Düzenle ve Sil butonları)
        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
            <button class="btn" style="border: 2px solid #459125; background-color: #41af13; color: white;" onclick="editProduct(${product.id})">Düzenle</button>
            <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Sil</button>
        `;

        // Satırı oluştur
        row.appendChild(idCell);
        row.appendChild(imageCell);
        row.appendChild(nameCell);
        row.appendChild(descriptionCell);
        row.appendChild(categoryCell);
        row.appendChild(priceCell);
        row.appendChild(actionsCell);

        // Satırı tabloya ekle
        tableBody.appendChild(row);
    });
}
// Ürün ID'sine göre ürün verisini alma
function getProductById(productId) {
    const url = 'http://192.168.1.13/products.php';  // API URL
    const data = { action: 'read', id: productId };  // Parametreler

    return fetch(url, {
        method: 'POST',  // POST isteği
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)  // JSON formatında veri gönder
    })
        .then(response => response.json())  // JSON olarak yanıtı al
        .then(product => {
            return product;  // Ürün verisini döndür
        })
        .catch(error => {
            console.error('Ürün bilgisi alırken hata oluştu:', error);
            return null;
        });
}

// Düzenle butonuna tıklandığında
function editProduct(productId) {
    // Ürünün detaylarını servisten alalım
    getProductById(productId).then(product => {
        if (!product) {
            console.error("Ürün bulunamadı!");
            return;
        }

        // Formdaki inputları güncelle
        localStorage.setItem('productId', product.id);
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;

        // Kategorileri güncelle
        const dropdown = document.getElementById('productCategory');
        dropdown.innerHTML = '<option value="">Kategori seçin</option>';  // İlk seçenek

        // Kategorileri dropdown'a ekleyelim
        categoriesCache.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            dropdown.appendChild(option);
        });

        // Mevcut kategoriyi seçili yap
        dropdown.value = product.category_id;
        // Görseli de mevcutsa göster
        if (product.image_path) {
            document.getElementById('productImage').setAttribute('data-image', product.image_path);
        }

        document.getElementById('form-title').textContent = "Ürün Düzenle";  // Başlık
        document.getElementById('submit-button').textContent = "Güncelle";
        // Formu görünür hale getir
        document.getElementById('add-product-form').style.display = 'block';

        // Formun action'ını "update" olarak değiştir
        //document.getElementById('productForm').action = 'process_product.php?action=update&id=' + product.id;
    });
}

// Kategorileri Dropdown'a Yükleme
function updateCategoryDropdown() {
    const dropdown = document.getElementById('productCategory');
    // Dropdown'u temizle
    dropdown.innerHTML = '<option value="">Kategori seçin</option>';
    fetchCategories()
}

let categoriesCache = []; // Kategorileri önceden bir değişkende tutacağız
// Sil butonuna tıklandığında
function deleteProduct(productId) {
    console.log('Sil:', productId);
    // Silme işlemi yapılacak
}
// Sayfa Yüklendiğinde Kategorileri Getir
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    fetchCategories();
});
