// API URL
const apiUrl = "http://192.168.1.13/categories.php";

let eposta = localStorage.getItem("eposta");
console.warn(eposta)
if (eposta != null && eposta != "aldeogrencikafasi@gmail.com") {
    window.location.href = 'index.html';
}

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


document.getElementById('orderForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

    const formData = new FormData(this);
    const jsonData = {
        action: 'update', // Specify your action here
        module: 'orders'  // Specify your module here
    };

    // Convert FormData to JSON
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });


    // Send the JSON data using fetch
    fetch('http://192.168.1.13/account.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            document.getElementById('orderForm').reset();  // Formu sıfırla
            selectedFiles = [];
            renderImagePreviews()
            document.getElementById('update-order-form').style.display = 'none';
            fetchOrders()
        })
        .catch((error) => {
            console.error('Error:', error);
        });

})

document.getElementById('productForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

    // Formdan verileri al
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = document.getElementById('productPrice').value;
    const categoryId = document.getElementById('productCategory').value;
    const action = document.getElementById('submit-button').textContent == "Güncelle" ? "update" : "create"; // Action değerini kontrol et

    // Çoklu dosya seçimi

    const images = document.getElementById('productImage').files;
    const existingImages = document.getElementById('productImage').getAttribute('data-image');

    // Eğer existingImages bir string (dosya yolları) ise, virgülle ayırarak diziye dönüştür
    const existingImagesArray = existingImages ? existingImages.split(',') : [];

    // FormData oluştur
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category_id', categoryId);
    formData.append('action', action);

    // Çoklu dosyaları FormData'ya ekle

    formData.append('existing_images', JSON.stringify(existingImagesArray));

    // Yeni eklenen dosyaları ekle
    Array.from(images).forEach(image => {
        formData.append('images[]', image);
    });


    try {
        let url = 'http://192.168.1.13/products.php'; // Varsayılan servis URL

        if (action === 'update') {
            formData.append('id', localStorage.getItem('productId'));
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
            document.getElementById('productForm').reset();  // Formu sıfırla
            selectedFiles = [];
            renderImagePreviews()
            document.getElementById('add-product-form').style.display = 'none';
            // Modal'ı kapat
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
    const data = {action: 'read_all'}; // Gönderilecek parametre

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
        const imagePaths = product.image_path ? product.image_path.split(',') : [];  // Eğer image_path yoksa boş bir dizi kullan

        // Görselleri tablo hücresinde küçük resimler olarak göster
        const imageDiv = document.createElement('div');
        imagePaths.forEach((imagePath, index) => {
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = `Ürün Görseli ${index + 1}`;
            img.classList.add('img-thumbnail');
            img.style.width = '50px';  // Küçük resimler için genişlik
            img.style.height = '50px'; // Küçük resimler için yükseklik
            img.style.marginRight = '5px'; // Resimler arasında boşluk
            img.setAttribute('data-bs-toggle', 'modal');
            img.setAttribute('data-bs-target', `#imageModal${product.id}`); // Modal'a tıklanarak büyük görseli açma
            imageDiv.appendChild(img);
        });

        imageCell.appendChild(imageDiv);

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
        if (product.is_deleted == 0) {
            actionsCell.innerHTML = `
            <button class="btn" style="border: 2px solid #459125; background-color: #41af13; color: white;" onclick="editProduct(${product.id})">Düzenle</button>
            <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Pasif Et</button>
        `;
        } else {
            actionsCell.innerHTML = `
            <button class="btn" style="border: 2px solid #459125; background-color: #41af13; color: white;" onclick="editProduct(${product.id})">Düzenle</button>
            <button class="btn btn-blue" style="background-color: dodgerblue" onclick="deleteProduct(${product.id})">Aktif Et</button>`;
        }

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

        // Modal'ın içeriğini dinamik olarak ekle
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = `
            <div class="modal fade" id="imageModal${product.id}" tabindex="-1" aria-labelledby="imageModal${product.id}Label" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="imageModal${product.id}Label">${product.name} Görselleri</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div id="carouselExample${product.id}" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner" id="carouselInner${product.id}">
                                    <!-- Görseller burada eklenecek -->
                                </div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample${product.id}" data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Önceki</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#carouselExample${product.id}" data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Sonraki</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Modal'ı body'ye ekleyin
        document.body.appendChild(modalContainer);

        // Modal içeriğini doldur
        const carouselInner = document.getElementById(`carouselInner${product.id}`);

        if (imagePaths.length === 0) {
            // Görsel yoksa, varsayılan bir resim göster
            const defaultImage = document.createElement('div');
            defaultImage.classList.add('carousel-item', 'active');
            defaultImage.innerHTML = `<img src="img/yeni_gelenler_1.png" class="d-block w-100" alt="Ürün Görseli">`;
            carouselInner.appendChild(defaultImage);
        } else {
            imagePaths.forEach((imagePath, index) => {
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                if (index === 0) {
                    carouselItem.classList.add('active');
                }

                carouselItem.innerHTML = `<img src="${imagePath}" class="d-block w-100" alt="Ürün Görseli ${index + 1}">`;
                carouselInner.appendChild(carouselItem);
            });
        }
    });
}


// Ürün ID'sine göre ürün verisini alma
function getProductById(productId) {
    const url = 'http://192.168.1.13/products.php';  // API URL
    const data = {action: 'read', id: productId};  // Parametreler

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
let deletedImages = []; // Silinen görselleri tutacak dizi

function editProduct(productId) {
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

        const dropdown = document.getElementById('productCategory');
        dropdown.innerHTML = '<option value="">Kategori seçin</option>';  // İlk seçenek

        categoriesCache.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            dropdown.appendChild(option);
        });

        dropdown.value = product.category_id;

        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        imagePreviewContainer.innerHTML = '';  // Önizleme alanını temizle

        let currentImages = product.image_path ? product.image_path.split(',') : [];

        if (currentImages.length > 0) {
            currentImages.forEach(imagePath => {
                const previewWrapper = document.createElement('div');
                previewWrapper.style.position = "relative";
                previewWrapper.style.display = "inline-block";
                previewWrapper.style.marginRight = "10px";

                const imgElement = document.createElement('img');
                imgElement.src = imagePath.trim();
                imgElement.alt = "Ürün görseli";
                imgElement.style.width = "100px";
                imgElement.style.height = "100px";
                imgElement.style.objectFit = "cover";
                imgElement.style.border = "1px solid #ddd";
                imgElement.style.borderRadius = "5px";

                const closeButton = document.createElement('button');
                closeButton.textContent = "X";
                closeButton.style.position = "absolute";
                closeButton.style.top = "5px";
                closeButton.style.right = "5px";
                closeButton.style.backgroundColor = "#ff4d4f";
                closeButton.style.color = "#fff";
                closeButton.style.border = "none";
                closeButton.style.borderRadius = "50%";
                closeButton.style.width = "20px";
                closeButton.style.height = "20px";
                closeButton.style.cursor = "pointer";

                // Silme butonuna tıklanınca görseli kaldır
                closeButton.addEventListener('click', () => {
                    imagePreviewContainer.removeChild(previewWrapper);
                    deletedImages.push(imagePath.trim()); // Silinen görseli tut
                    // Görselleri güncelle
                    currentImages = currentImages.filter(path => path.trim() !== imagePath.trim());
                    document.getElementById('productImage').setAttribute('data-image', currentImages.join(','));
                });

                previewWrapper.appendChild(imgElement);
                previewWrapper.appendChild(closeButton);
                imagePreviewContainer.appendChild(previewWrapper);
            });
            document.getElementById('productImage').setAttribute('data-image', currentImages.join(','));
        }

        document.getElementById('form-title').textContent = "Ürün Düzenle";
        document.getElementById('submit-button').textContent = "Güncelle";
        document.getElementById('add-product-form').style.display = 'block';
    });
}


let categoriesCache = []; // Kategorileri önceden bir değişkende tutacağız
// Sil butonuna tıklandığında
function deleteProduct(productId) {
    console.log('Sil:', productId);

    // Silme işlemi için istek gönderiliyor
    fetch('http://localhost/products.php', {
        method: 'POST', // HTTP POST yöntemi kullanılıyor
        headers: {
            'Content-Type': 'application/json', // JSON içeriği belirtildi
        },
        body: JSON.stringify({
            action: 'delete',
            id: productId, // Ürün ID'si buradan gönderiliyor
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Silme işlemi başarısız oldu!');
            }
            return response.json();
        })
        .then(data => {
            console.log('Başarılı:', data);
            fetchProducts(); // Ürünleri tekrar yükle
            // Başarılı bir silme işlemi durumunda gerekli işlemleri yapabilirsiniz
        })
        .catch(error => {
            console.error('Hata:', error);
            // Hata durumunda işlemleri buraya ekleyebilirsiniz
        });
}

let selectedFiles = []; // Yüklenen dosyaları tutacak dizi

// Dosya yükleme işlemi
document.getElementById('productImage').addEventListener('change', function (e) {
    const files = e.target.files;
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    // Yeni dosyaları selectedFiles dizisine ekle
    Array.from(files).forEach(file => {
        selectedFiles.push(file);
    });

    // Eski görselleri (data-image'den) al
    const existingImages = document.getElementById('productImage').getAttribute('data-image');
    const existingImagesArray = existingImages ? existingImages.split(',') : [];

    // Görselleri yeniden render et (hem eski hem yeni)
    renderImagePreviews(existingImagesArray);
});

// Resim önizlemeleri ve X butonları için işlev
function renderImagePreviews(existingImagesArray) {
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    imagePreviewContainer.innerHTML = ''; // Önizleme alanını temizle

    // Eski görselleri önizleme alanına ekle
    existingImagesArray?.forEach(imagePath => {
        const imgElement = document.createElement('img');
        imgElement.src = imagePath;
        imgElement.classList.add('image-preview');
        imgElement.setAttribute('data-image', imagePath);  // Görsel yolunu veri olarak tut
        imgElement.innerHTML = `<span class="remove-img-btn">X</span>`;  // Kapatma butonu
        imagePreviewContainer.appendChild(imgElement);
    });

    // Yeni dosyaları önizlemeye ekle
    selectedFiles.forEach(file => {
        const imgElement = document.createElement('img');
        imgElement.src = URL.createObjectURL(file);
        imgElement.classList.add('image-preview');
        imgElement.setAttribute('data-image', file.name); // Dosya adını veri olarak tut
        imgElement.innerHTML = `<span class="remove-img-btn">X</span>`;  // Kapatma butonu
        imagePreviewContainer.appendChild(imgElement);
    });

    // Kapatma butonuna tıklama işlemi
    const removeButtons = document.querySelectorAll('.remove-img-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const parent = button.closest('img');
            const imagePath = parent.getAttribute('data-image');

            // Seçilen dosyayı diziden kaldır
            selectedFiles = selectedFiles.filter(file => file.name !== imagePath);
            parent.remove();  // Görseli DOM'dan kaldır
        });
    });
}

// API'den veri almak için fonksiyon
function fetchOrders() {

    const apiUrl = "http://192.168.1.13/account.php";
    // Siparişleri tabloya ekle
    const tableBody = document.querySelector('#ordersTable tbody');

    // Tabloyu temizle (önceki verileri sil)
    tableBody.innerHTML = '';
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            module: "orders",
            action: "read_all"
        })
    })
        .then(response => response.json())
        .then(data => {
            console.warn(data)
            data.forEach(order => {
                const row = document.createElement('tr');

                // Sipariş ID'si
                const orderId = document.createElement('td');
                orderId.textContent = order.order_id;
                row.appendChild(orderId);

                // Müşteri adı
                const customer = document.createElement('td');
                customer.textContent = order.customer_name + order.customer_surname;
                row.appendChild(customer);

                // Ürün
                const product = document.createElement('td');
                product.textContent = order.products;
                row.appendChild(product);

                // Durum
                const status = document.createElement('td');
                status.textContent = order.order_status;
                row.appendChild(status);

                // Kargo ID'si
                const shippingId = document.createElement('td');
                shippingId.textContent = order.shipping_id ? order.shipping_id : 'Kargo ID girilecek';
                row.appendChild(shippingId);

                // İşlemler butonları
                const actions = document.createElement('td');
                actions.innerHTML = `
                <button class="btn btn-info" onclick="showOrders(${order.order_id})">Görüntüle</button>
                <button onclick="showUpdateOrderForm(${order.order_id},'${order.order_status}',${order.shipping_id})" class="btn btn-warning">Düzenle</button>
                <button class="btn btn-danger" onclick="canceledUpdateOrder(${order.order_id})">İptal Et</button>
            `;
                row.appendChild(actions);

                // Satırı tabloya ekle
                tableBody.appendChild(row);
            });
        }).catch(error => console.error("Hata:", error));

}

function showUpdateOrderForm(orderId, currentStatus, currentShippingId) {
    console.warn(currentShippingId)
    console.warn(currentStatus)
    document.getElementById('update-order-form').style.display = 'block';
    document.getElementById('orderId').value = orderId; // Sipariş ID'yi doldur
    document.getElementById('orderStatus').value = currentStatus;
    document.getElementById('shipmentId').value = currentShippingId ? currentShippingId : '';

}

function canceledUpdateOrder(orderId) {

    const jsonData = {
        action: 'update', // Specify your action here
        module: 'orders',  // Specify your module here
        order_id: orderId,  // Specify your module here
        status: 'canceled',  // Specify your module here
        shipment_id : ''
    };


    // Send the JSON data using fetch
    fetch('http://192.168.1.13/account.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            document.getElementById('orderForm').reset();  // Formu sıfırla
            document.getElementById('update-order-form').style.display = 'none';
            fetchOrders()
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}

function showOrders(orderId) {
    window.location.href = "siparisdetay.html?id=" + orderId;
    document.getElementById('update-order-form').style.display = 'none';
}

// Sayfa Yüklendiğinde Kategorileri Getir
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    fetchCategories();
    fetchOrders();
});
