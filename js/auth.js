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
                localStorage.setItem("eposta", result?.eposta);
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
    const signup = async (name, surname, username, email, password, phoneNumber, gender, campaignEmail, memberCondition) => {
        gender = gender == "erkek" ? "male" : gender == "kadın" ? "female" : "other";
        try {
            const response = await fetch('http://192.168.1.13/signup.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, surname ,username, email, password, phoneNumber, gender, campaignEmail, memberCondition }),
            });

            console.warn(response)
            if (!response.ok) {
                throw new Error('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
            }

            const result = await response.json();
            console.warn(result)
            if (result.status == "success") {

                // Başarı mesajı göster ve giriş sayfasına yönlendir
                showSuccessMessage('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
                document.getElementById("formContainer").style.display = "none";
                document.getElementById("verificationContainer").style.display = "block";
                document.getElementById("verifyButton").addEventListener("click", function() {
                    let code = document.getElementById("verificationCode").value;
                    const data = {
                        module : "users",
                        action : "verification",
                        userId: result.userId,
                        verificationCode: code,
                    };

                    // AJAX isteği gönder
                    fetch("http://192.168.1.13/account.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    })
                        .then(response => response.json())
                        .then(result => {
                            if (result.message) {
                                alert(result.message); // Başarı mesajını göster
                                setTimeout(() => {
                                    window.location.href = 'giris.html';
                                }, 3000); // 3 saniye sonra yönlendirme
                            } else if (result.error) {
                                alert(result.error); // Hata mesajını göster
                            }
                        })
                        .catch(error => {
                            console.error("Hata:", error);
                            alert("Bir hata oluştu, lütfen tekrar deneyin.");
                        });
                });
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
            const name = formData.get('ad');
            const surname = formData.get('soyad');
            const username = formData.get('Kullanıcı Adı');
            const email = formData.get('email');
            const password = formData.get('sifre');
            const phoneNumber = formData.get('telefon');
            const gender = formData.get('cinsiyet');
            const campaignEmail = formData.get('kampanya_email');
            const memberCondition = formData.get('uyelik_sartlari');

            console.warn(name, surname, username, email, password, phoneNumber, gender, campaignEmail, memberCondition)
            signup(name, surname, username, email, password, phoneNumber, gender, campaignEmail, memberCondition);
        });
    }
});
