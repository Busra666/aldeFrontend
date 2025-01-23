document.addEventListener('DOMContentLoaded', function () {
    const cartList = document.getElementById('cart-list'); // Sepet ürünlerini listeleyeceğimiz alan
    const cartTotal = document.getElementById('sepet-toplam'); // Sepet ürünlerini listeleyeceğimiz alan
    const cartListDiv = document.getElementById('sepetim'); // Sepet ürünlerini listeleyeceğimiz alan
    const emptyCart = document.getElementById('sepet-box'); // Sepet ürünlerini listeleyeceğimiz alan
    const apiUrl = 'http://192.168.1.13/cart.php'; // Backend API URL'si

    const userId = localStorage.getItem("userId");

    // Sepeti Listeleme
    function fetchCart() {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'view_cart',
                user_id: userId
            })
        })
            .then(response => response.json())
            .then(data => {
                if(cartList == null) {
                    return;
                }
                cartList.innerHTML = ''; // Önce mevcut listeyi temizle
                if (data.status === "error") {
                    emptyCart.style.display = 'block';
                    cartListDiv.style.display = 'none';
                    cartTotal.style.display = 'none';
                    getTotalProductsCount(); // Sepet boşsa sayıyı 0 yap
                    return;
                }
                emptyCart.style.display = 'none';

                localStorage.setItem("cartItems",JSON.stringify(data.data));
                // Ürünleri listele
                data?.data?.forEach(item => {
                    const cartItem = document.createElement('tr');


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
                    cartItem.innerHTML = `
                    <td class="align-middle">
    <img src="${item.image_path ? imageUrl : 'img/yeni_gelenler_1.png'}" alt="" style="width: 90px;">
    <a href="detail.html?id=${item.product_id}" class="product-name">${item.name}</a>
</td>
<td class="align-middle">₺${item.price}</td>
                    <td class="align-middle">
                        <div class="input-group quantity mx-auto" style="width: 100px;">
                            <div class="input-group-btn">
                                <button class="btn btn-sm btn-primary btn-minus" data-product-id="${item.product_id}" data-action="subtract">
                                    <i class="fa fa-minus" data-product-id="${item.product_id}" data-action="subtract"></i>
                                </button>
                            </div>
                            <input type="text" class="form-control form-control-sm bg-secondary border-0 text-center" value=${item.quantity}>
                                <div class="input-group-btn">
                                    <button class="btn btn-sm btn-primary btn-plus" data-product-id="${item.product_id}" data-action="add">
                                        <i class="fa fa-plus" data-product-id="${item.product_id}" data-action="add"></i>
                                    </button>
                                </div>
                        </div>
                    </td>
                    <td class="align-middle">₺${(item.quantity * item.price).toFixed(2)}</td>
                    <td class="align-middle">
                    <div class="input-group-btn">
                     <button class="btn btn-sm btn-danger btn-remove" data-product-id="${item.product_id}" data-quantity="${item.quantity}" data-action="remove">
                            <i class="fa fa-times" data-product-id="${item.product_id}" data-quantity="${item.quantity}" data-action="remove"></i>
                        </button>
                        </div>
                    </td>
                    `;

                    cartList.appendChild(cartItem);
                });

                // Butonlara olay dinleyicisi ekle
                document.querySelectorAll('.input-group-btn button').forEach(button => {
                    button.addEventListener('click', handleCartUpdate);
                });
            })
            .catch(error => console.error('Sepet yüklenirken bir hata oluştu:', error));
    }

    function updateCartTotal() {
        const siparisTutarElement = document.getElementById('siparisTutar');
        const kargoUcretElement = document.getElementById('kargoUcret');
        const sepetToplamElement = document.getElementById('sepetToplam');

        const apiUrl = 'http://192.168.1.13/cart.php'; // Backend API URL'si
        const userId = localStorage.getItem("userId");

        // Kargo ücreti sabit
        let kargoUcreti = 39.99;
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
                    const siparisTutar = parseFloat(data.total_price || 0);
                    siparisTutar == 0 || siparisTutar > 200 ? kargoUcreti = 0 : kargoUcreti = 39.99;
                    const sepetToplam = siparisTutar + kargoUcreti;

                    // DOM öğelerini güncelle
                    if(siparisTutarElement == null || kargoUcretElement == null || sepetToplamElement == null) {
                        return
                    }
                    siparisTutarElement.textContent = `₺${siparisTutar.toFixed(2)}`;
                    kargoUcretElement.textContent = `₺${kargoUcreti.toFixed(2)}`;
                    sepetToplamElement.textContent = `₺${sepetToplam.toFixed(2)}`;
                    getTotalProductsCount()
                } else {
                    console.error('Sepet toplamı alınamadı:', data.message);
                }
            })
            .catch(error => console.error('Sepet toplamı alınırken bir hata oluştu:', error));
    }

    // Sayfa yüklendiğinde toplamı hesapla
    updateCartTotal();

    // Sepete Ekleme/Çıkarma İşlemi
    function handleCartUpdate(event) {
        const action = event.target.dataset.action;

        const productId = event.target.dataset.productId;
        let quantity = event.target.dataset?.quantity * -1;
        if (action !== 'remove') {
            quantity = action === 'add' ? 1 : -1;
        }

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'add_to_cart',
                user_id: userId,
                product_id: productId,
                quantity: quantity
            })
        })
            .then(response => response.json())
            .then(data => {
                updateCartTotal()
                if (data.status === 'success') {
                    fetchCart(); // Sepeti yeniden listele
                } else {
                    console.error('Sepet güncellenirken bir hata oluştu:', data.message);
                }
            })
            .catch(error => console.error('Sepet güncellenirken bir hata oluştu:', error));
    }

    // Sayfa yüklendiğinde sepeti listele
    fetchCart();
    function getTotalProductsCount() {
        const apiUrl = 'http://192.168.1.13/cart.php'; // Backend API URL'si
        const userId = localStorage.getItem("userId");
        const cartCountElement = document.getElementById('cart-count');

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'cart_count',
                user_id: userId
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const totalItems = data.total_items || 0; // Eğer sepet boşsa 0 döner
                    cartCountElement.textContent = totalItems; // Sepet sayısını güncelle
                } else {
                    console.error('Sepet sayısı alınamadı:', data.message);
                    cartCountElement.textContent = '0'; // Hata durumunda 0 göster
                }
            })
            .catch(error => {
                console.error('Sepet sayısı alınırken bir hata oluştu:', error);
                cartCountElement.textContent = '0'; // Ağ hatasında 0 göster
            });
    }
    let elementById = document.getElementById('complete-order-btn');
    if(elementById != null) {
        elementById.addEventListener('click', function(event) {
            // Eğer herhangi bir ekstra işlem yapmak isterseniz, burada kod ekleyebilirsiniz.

            // Sayfayı SiparişTamamla.html sayfasına yönlendiriyoruz.
            window.location.href = "SiparişTamamla.html";
        });
    }

});
