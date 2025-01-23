class userProfile {
    constructor() {
        this.apiUrl = 'http://192.168.1.13/account.php'; // API url adresini buraya ekleyin
        this.form = document.querySelector('form'); // Formu seç
        this.nameInput = document.getElementById('ad');
        this.surnameInput = document.getElementById('soyad');
        this.phoneInput = document.getElementById('telefon');
        this.emailInput = document.getElementById('email');
        this.genderInputs = document.getElementsByName('cinsiyet');
    }

    async getUserDetails() {
        const userId = localStorage.getItem("userId");
        try {
            const response = await fetch(this.apiUrl + '/get_me', {
                method: 'POST',
                body: JSON.stringify({
                    module: "users",
                    action: "get_me",
                    userId: userId
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.fillForm(data.user);
            } else {
                console.error('Kullanıcı verileri alınırken hata oluştu');
            }
        } catch (error) {
            console.error('Bir hata oluştu:', error);
        }
    }

    fillForm(user) {
        this.nameInput.value = user.name;
        this.surnameInput.value = user.surname;
        this.phoneInput.value = user.phone_number;
        this.emailInput.value = user.email;

        // Cinsiyet seçimini yap
        if (user.gender) {
            this.genderInputs.forEach(input => {
                if (input.value === user.gender) {
                    input.checked = true;
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-form');  // update-form id'sini kullanıyoruz


    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Formun varsayılan gönderimini engelle

        // Form verilerini al
        const name = document.getElementById('ad').value;
        const surname = document.getElementById('soyad').value;
        const phone_number = document.getElementById('telefon').value;
        const email = document.getElementById('email').value;
        const gender = document.querySelector('input[name="cinsiyet"]:checked') ? document.querySelector('input[name="cinsiyet"]:checked').value : null;

        const userId = localStorage.getItem("userId");
        // Gönderilecek veri
        const userData = {
        };

        console.warn(userData);
        // Veriyi update_me servisine gönder
        fetch('http://192.168.1.13/account.php' + '/update_me', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                module: "users",
                action: "update_me",
                userId: userId,
                name: name,
                surname: surname,
                phone_number: phone_number,
                email: email,
                gender: gender})
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Bilgileriniz başarıyla güncellendi!');
                } else {
                    alert('Bir hata oluştu.');
                }
            })
            .catch(error => {
                console.error('Hata:', error);
                alert('Bir hata oluştu.');
            });

    });
});

// Sayfa yüklendiğinde kullanıcı bilgilerini al ve formu doldur
document.addEventListener('DOMContentLoaded', () => {
    const newUserProfile = new userProfile();
    newUserProfile.getUserDetails();
});
