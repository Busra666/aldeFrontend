document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#password-change-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Sayfanın yeniden yüklenmesini engeller

        // Formdaki input değerlerini al
        const userId = localStorage.getItem("userId");
        const currentPassword = document.querySelector("#eski-sifre").value;
        const newPassword = document.querySelector("#yeni-sifre").value;
        const newPasswordAgain = document.querySelector("#yeni-sifre-tekrar").value;

        if (newPasswordAgain.trim() !== newPassword.trim()) {
            alert("Girdiğiniz şifreler aynı değil")
            return
        }
        // Verileri JSON formatında hazırlayın
        const data = {
            module : "users",
            action : "change_password",
            user_id: userId,
            current_password: currentPassword,
            new_password: newPassword
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
                    form.reset();
                    window.location.href = "index.html";
                } else if (result.error) {
                    alert(result.error); // Hata mesajını göster
                }
            })
            .catch(error => {
                console.error("Hata:", error);
                alert("Bir hata oluştu, lütfen tekrar deneyin.");
            });
    });
});
