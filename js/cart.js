document.addEventListener('DOMContentLoaded', function () {
    const cartList = document.getElementById('cart-list'); // Sepet ürünlerini listeleyeceğimiz alan
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
                cartList.innerHTML = ''; // Önce mevcut listeyi temizle
                if (data.length === 0) {
                    cartList.innerHTML = '<p>Sepetiniz boş.</p>';
                    getTotalProductsCount(); // Sepet boşsa sayıyı 0 yap
                    return;
                }

                // Ürünleri listele
                data?.data?.forEach(item => {
                    const cartItem = document.createElement('tr');

                    cartItem.innerHTML = `
                    <td class="align-middle"><img src="img/yeni_gelenler_1.png" alt="" style="width: 90px;">
                        <p>${item.name}</p></td>
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
                    siparisTutar == 0 || siparisTutar > 1000 ? kargoUcreti = 0 : kargoUcreti = 39.99;
                    const sepetToplam = siparisTutar + kargoUcreti;

                    // DOM öğelerini güncelle
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
        console.warn(event)
        const action = event.target.dataset.action;
        console.log(`Tıklanan butonun aksiyonu: ${action}`); // Butonun aksiyonunu console'a basıyoruz

        const productId = event.target.dataset.productId;
        let quantity = event.target.dataset?.quantity * -1;
        if (action !== 'remove') {
            quantity = action === 'add' ? 1 : -1;
        }

        // Burada quantity ve action ile işlemi gerçekleştirebilirsiniz
        console.log(`Product ID: ${productId}, Quantity: ${quantity}`);
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

});
