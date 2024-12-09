document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Login işlemi
    const login = async (username, password) => {
        try {
            const response = await fetch('http://192.168.1.13/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
            }

            const result = await response.json();
            if (result.status == "success") {
                // Giriş başarılıysa yönlendirme
                console.warn("login")
                console.warn(result)
                localStorage.setItem("loggedIn", "true");
                localStorage.setItem("userId", result?.userId);
                localStorage.setItem("username", result?.username);
                window.location.href = 'index.html';
            } else {
                alert(result.message || 'Hatalı giriş bilgileri.');
            }
        } catch (error) {
            console.error('Login hatası:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    // Signup işlemi
    const signup = async (username, email, password) => {
        try {
            const response = await fetch('http://192.168.1.13/signup.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                throw new Error('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
            }

            const result = await response.json();
            if (result.status == "success") {
                // Başarı mesajı göster ve giriş sayfasına yönlendir
                showSuccessMessage('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
                setTimeout(() => {
                    window.location.href = 'giris.html';
                }, 3000); // 3 saniye sonra yönlendirme
            } else {
                alert(result.message || 'Kayıt işlemi başarısız.');
            }
        } catch (error) {
            console.error('Signup hatası:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    // Başarı mesajı gösterme fonksiyonu
    const showSuccessMessage = (message) => {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;

        document.body.appendChild(successDiv);

        // Mesajı 3 saniye sonra kaldır
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    };

    // Login form gönderimi
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');

            login(username, password);
        });
    }

    // Signup form gönderimi
    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(signupForm);
            const username = formData.get('username');
            const email = formData.get('email');
            const password = formData.get('password');

            signup(username, email, password);
        });
    }
});
