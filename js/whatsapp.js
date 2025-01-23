function openWhatsApp() {
    const phoneNumber = "905423750561"; // Buraya WhatsApp numaranızı ülke koduyla birlikte yazın
    const message = encodeURIComponent("Merhaba, sizinle iletişime geçmek istiyorum!"); // Varsayılan mesaj
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    // Yeni bir sekmede WhatsApp bağlantısını aç
    window.open(whatsappUrl, "_blank");
}