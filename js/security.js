
    (function detectDevTools() {
    let open = false;
    const threshold = 160; // Geliştirici araçlarının genişliği/yüksekliği için eşik

    const checkDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if (widthThreshold || heightThreshold) {
    if (!open) {
    open = true;
    alert("Geliştirici araçları algılandı! İşleminize devam edemezsiniz.");
    window.location.href = "https://aldekitap.com"; // İstenilen sayfaya yönlendirme
}
} else {
    open = false;
}
};

    setInterval(checkDevTools, 1000); // Her 1 saniyede bir kontrol et
})();

    // Sağ Tık ve Kısayol Engelleme
    document.addEventListener("contextmenu", (e) => e.preventDefault()); // Sağ tık menüsünü engelle

    document.addEventListener("keydown", (e) => {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J ve Ctrl+U engelleniyor
    if (e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key)) ||
    (e.ctrlKey && e.key === "U")) {
    e.preventDefault();
}
});
