document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.product-action .btn-square').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            const userId = localStorage.getItem('userId');
            const productId = this.closest('.product-item').querySelector('.add-to-cart').dataset.productId;

            fetch('http://192.168.1.13/account.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    module: 'favorites',
                    action: 'create',
                    user_id: userId,
                    product_id: productId
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert('Ürün favorilere eklendi!');
                    } else {
                        alert(`Hata: ${data.message}`);
                    }
                })
                .catch(error => {
                    console.error('Favorilere ekleme sırasında hata:', error);
                });
        });
    });
});
