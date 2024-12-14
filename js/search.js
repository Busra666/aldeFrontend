document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.querySelector("input[type='text'][placeholder='Arama Yap']");
    const dropdown = document.createElement('ul');
    dropdown.classList.add('dropdown-menu1');
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = '9999';
    searchInput.parentNode.appendChild(dropdown);

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.trim();

        // Eğer arama boşsa dropdown'u temizle
        if (query === "") {
            dropdown.innerHTML = "";
            return;
        }

        // AJAX isteği göndererek ürünleri ara (POST isteği kullanıyoruz)
        fetch('http://192.168.1.13/search.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "search_products",
                query: query
            })
        })
            .then(response => response.json())
            .then(data => {
                dropdown.innerHTML = ""; // Önceki sonuçları temizle

                console.warn(data)
                if (data.status === "success" && data.data.length > 0) {

                    data.data.forEach(product => {
                        const li = document.createElement('li');
                        li.classList.add('dropdown-item');
                        li.textContent = product.name;

                        // Arama sonucuna tıklanabilirlik ekle
                        li.addEventListener('click', function() {
                            // Detay sayfasına yönlendir
                            window.location.href = `detail.html?id=${product.id}`;
                        });

                        dropdown.appendChild(li);
                    });
                } else {
                    const li = document.createElement('li');
                    li.classList.add('dropdown-item');
                    li.textContent = "Hiç ürün bulunamadı";
                    dropdown.appendChild(li);
                }
            })
            .catch(error => console.error('Arama sırasında bir hata oluştu:', error));
    });
    searchInput.parentNode.appendChild(dropdown);
});
