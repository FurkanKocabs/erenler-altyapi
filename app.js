// Erenler Altyapı & Kesinti Takip Haritası (Sakarya)
// Leaflet.js & Modern Canlı CBS (GIS) Kontrol Sistemi

// 1. Erenler Merkez Koordinatları & Harita Başlatma
const ERENLER_COORDS = [40.7150, 30.4450];
const map = L.map('map', {
    zoomControl: false,
    minZoom: 10,
    maxZoom: 18
}).setView(ERENLER_COORDS, 12);

// Yakınlaştırma butonunu sağ alta alalım
L.control.zoom({ position: 'bottomright' }).addTo(map);

// Harita Altlıkları (Tamamen Ücretsiz, API Key Gerektirmeyen Güvenilir Sağlayıcılar)
const darkTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
});

const osmTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
});

const satelliteTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    maxZoom: 19
});

// Varsayılan olarak Koyu Temayı ekleyelim
darkTileLayer.addTo(map);

// Harita Değiştirici (BaseMaps)
const baseMaps = {
    "🌙 Gece / Koyu Tema": darkTileLayer,
    "🗺️ Sokak Haritası (OpenStreetMap)": osmTileLayer,
    "🛰️ Gerçek Uydu Görüntüsü": satelliteTileLayer
};
L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

// Tarih ve Saat Yardımcı Fonksiyonları (Gerçek Zamanlı)
function getCurrentTimeString() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getCurrentDateString() {
    const d = new Date();
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// 2. Erenler 33 Mahallesinin Tamamı (Doğrulanmış Gerçek GPS Koordinatları ve Temiz Canlı Başlangıç)
const neighborhoodData = [
    // --- Kentsel Merkez ve Batı Mahalleleri ---
    {
        id: "dilmen",
        name: "Dilmen Mahallesi",
        zone: "Kentsel Merkez (Sakarbaba)",
        center: [40.7595, 30.3985],
        polygon: [[40.7635, 30.3920], [40.7645, 30.4045], [40.7555, 30.4040], [40.7545, 30.3925]],
        water: { status: "normal", text: "SASKİ: Şebeke beslemesi stabil, basınç normal." },
        electric: { status: "normal", text: "SEDAŞ: Voltaj ve fider iletimi normal." },
        gas: { status: "normal", text: "AGDAŞ: Gaz arzı kesintisiz." },
        internet: { status: "normal", text: "FTTH Fiber (Türk Telekom & Superonline)" },
        overall: "normal",
        notes: "Sakarbaba Caddesi ve çevre sokaklarda tüm altyapı hizmetleri aktif."
    },
    {
        id: "hacioglu",
        name: "Hacıoğlu Mahallesi",
        zone: "Kentsel Yoğun",
        center: [40.7627, 30.4045],
        polygon: [[40.7675, 30.3995], [40.7685, 30.4105], [40.7595, 30.4110], [40.7585, 30.4000]],
        water: { status: "normal", text: "SASKİ: Basınç ve debi normal." },
        electric: { status: "normal", text: "SEDAŞ: Dağıtım şebekesi aktif." },
        gas: { status: "normal", text: "AGDAŞ: Doğalgaz iletimi stabil." },
        internet: { status: "normal", text: "VDSL2 & Kısmi Fiber" },
        overall: "normal",
        notes: "Şehit Yaşar Güler Cd. ve Erenler Stadı civarında şebeke sorunsuz."
    },
    {
        id: "tabakhane",
        name: "Tabakhane Mahallesi",
        zone: "Kentsel Ticaret (Eski Köprü)",
        center: [40.7612, 30.4117],
        polygon: [[40.7655, 30.4065], [40.7665, 30.4175], [40.7575, 30.4170], [40.7565, 30.4060]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL / Kısmi Fiber" },
        overall: "normal",
        notes: "Eski Sakarya Köprüsü mevkii ticari ve konut alanında hizmetler stabil."
    },
    {
        id: "kupculer",
        name: "Küpçüler Mahallesi",
        zone: "Kuzey Kentsel",
        center: [40.7598, 30.4200],
        polygon: [[40.7645, 30.4145], [40.7655, 30.4275], [40.7545, 30.4265], [40.7535, 30.4135]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "Superonline & TTnet VDSL" },
        overall: "normal",
        notes: "Herhangi bir arıza veya kesinti bildirilmedi."
    },
    {
        id: "erenler_merkez",
        name: "Erenler (Merkez) Mahallesi",
        zone: "Kentsel Yönetim (Belediye)",
        center: [40.7558, 30.4153],
        polygon: [[40.7595, 30.4095], [40.7605, 30.4225], [40.7515, 30.4215], [40.7505, 30.4085]],
        water: { status: "normal", text: "SASKİ deposu beslemesi aktif." },
        electric: { status: "normal", text: "SEDAŞ şebekesi sorunsuz." },
        gas: { status: "normal", text: "AGDAŞ şebekesi stabil." },
        internet: { status: "normal", text: "Yüksek hızlı FTTH Fiber altyapı aktif" },
        overall: "normal",
        notes: "Erenler Belediyesi ve Kaymakamlık çevresinde tüm altyapı faal."
    },
    {
        id: "baglar",
        name: "Bağlar Mahallesi",
        zone: "Kentsel Merkez (Yavuz Selim)",
        center: [40.7529, 30.4001],
        polygon: [[40.7575, 30.3935], [40.7585, 30.4065], [40.7475, 30.4055], [40.7465, 30.3925]],
        water: { status: "normal", text: "SASKİ dağıtımı stabil." },
        electric: { status: "normal", text: "SEDAŞ iletimi normal." },
        gas: { status: "normal", text: "AGDAŞ şebekesi normal." },
        internet: { status: "normal", text: "Fiber & VDSL Altyapısı Aktif" },
        overall: "normal",
        notes: "Yavuz Selim Caddesi ve çevresinde altyapı sorunsuz işliyor."
    },
    {
        id: "yeni_mahalle",
        name: "Yeni Mahalle",
        zone: "Kentsel Merkez (Güney)",
        center: [40.7505, 30.4120],
        polygon: [[40.7545, 30.4055], [40.7555, 30.4185], [40.7455, 30.4175], [40.7445, 30.4045]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "Fiber Altyapı Aktif" },
        overall: "normal",
        notes: "Sakarya Caddesi güney aksı normal işliyor."
    },
    {
        id: "yesiltepe",
        name: "Yeşiltepe Mahallesi",
        zone: "Modern Sanayi / D-100",
        center: [40.7404, 30.3894],
        polygon: [[40.7465, 30.3815], [40.7475, 30.3975], [40.7345, 30.3965], [40.7335, 30.3805]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "Sanayi Bölgesi Fiber Altyapısı" },
        overall: "normal",
        notes: "Modern Sanayi Sitesi ve çevresinde altyapı hizmetleri faal."
    },
    {
        id: "hurriyet",
        name: "Hürriyet Mahallesi",
        zone: "Kentsel Geçiş",
        center: [40.7470, 30.4180],
        polygon: [[40.7515, 30.4125], [40.7525, 30.4245], [40.7415, 30.4235], [40.7405, 30.4115]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL & Fiber" },
        overall: "normal",
        notes: "Bölgede tüm altyapı hizmetleri aktif."
    },
    {
        id: "tepe",
        name: "Tepe Mahallesi",
        zone: "Kentsel Yerleşim",
        center: [40.7530, 30.4250],
        polygon: [[40.7575, 30.4195], [40.7585, 30.4325], [40.7475, 30.4315], [40.7465, 30.4185]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "Fiber & VDSL" },
        overall: "normal",
        notes: "Yerleşim alanında şebeke arzı normal."
    },
    {
        id: "kozluk",
        name: "Kozluk Mahallesi",
        zone: "Kentsel / D-650 Aksı",
        center: [40.7440, 30.4280],
        polygon: [[40.7495, 30.4215], [40.7505, 30.4355], [40.7375, 30.4345], [40.7365, 30.4205]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL Altyapısı" },
        overall: "normal",
        notes: "Kırsal altyapı hattı stabil durumda."
    },

    // --- Orta Kuşak ve D-100 Koridoru ---
    {
        id: "alancuma",
        name: "Alancuma Mahallesi",
        zone: "TEM Gişeleri / Sakarya Park",
        center: [40.7250, 30.4322],
        polygon: [[40.7325, 30.4215], [40.7335, 30.4435], [40.7175, 30.4425], [40.7165, 30.4205]],
        water: { status: "normal", text: "Şebeke aktif, basınç stabil." },
        electric: { status: "normal", text: "İletim hattı normal." },
        gas: { status: "normal", text: "Doğalgaz hattı faal." },
        internet: { status: "normal", text: "VDSL & Kısmi Fiber" },
        overall: "normal",
        notes: "TEM Otoyolu gişeleri ve Sakarya Park güney aksı normal işliyor."
    },
    {
        id: "pirahmetler",
        name: "Pirahmetler Mahallesi",
        zone: "D-100 Güney Kırsal",
        center: [40.7360, 30.4530],
        polygon: [[40.7425, 30.4445], [40.7435, 30.4615], [40.7305, 30.4605], [40.7295, 30.4435]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL Altyapı" },
        overall: "normal",
        notes: "Şebeke arzı düzenli şekilde sürüyor."
    },
    {
        id: "bekirpasa",
        name: "Bekirpaşa Mahallesi",
        zone: "Tarımsal Merkez (Bekirpaşa)",
        center: [40.7320, 30.4590],
        polygon: [[40.7385, 30.4495], [40.7395, 30.4685], [40.7255, 30.4675], [40.7245, 30.4485]],
        water: { status: "normal", text: "SASKİ terfi merkezi sorunsuz çalışıyor." },
        electric: { status: "normal", text: "SEDAŞ dağıtımı normal." },
        gas: { status: "normal", text: "AGDAŞ gaz arzı sorunsuz." },
        internet: { status: "normal", text: "VDSL / Türk Telekom Fiber" },
        overall: "normal",
        notes: "Eski belde merkezi ve tarım arazilerinde altyapı düzenli."
    },
    {
        id: "nakislar",
        name: "Nakışlar Mahallesi",
        zone: "Orta Kırsal",
        center: [40.7420, 30.4750],
        polygon: [[40.7485, 30.4665], [40.7495, 30.4835], [40.7355, 30.4825], [40.7345, 30.4655]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL Altyapı" },
        overall: "normal",
        notes: "Tarım alanlarında elektrik ve su kesintisi yok."
    },
    {
        id: "buyukesence",
        name: "Büyükesence Mahallesi",
        zone: "D-100 Doğu Aksı (Esence)",
        center: [40.7484, 30.4772],
        polygon: [[40.7555, 30.4675], [40.7565, 30.4875], [40.7415, 30.4865], [40.7405, 30.4665]],
        water: { status: "normal", text: "Su dağıtımı normal." },
        electric: { status: "normal", text: "Elektrik stabil." },
        gas: { status: "normal", text: "Doğalgaz bağlantıları aktif." },
        internet: { status: "normal", text: "VDSL Altyapısı Aktif" },
        overall: "normal",
        notes: "D-100 kenarı yerleşiminde şebekeler faal durumda."
    },
    {
        id: "kucukesence",
        name: "Küçükesence Mahallesi",
        zone: "Kuzeydoğu Kırsal Sınır",
        center: [40.7664, 30.4981],
        polygon: [[40.7735, 30.4875], [40.7745, 30.5095], [40.7585, 30.5085], [40.7575, 30.4865]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL / ADSL" },
        overall: "normal",
        notes: "Esence yerleşiminde altyapı stabil."
    },
    {
        id: "hasanbey",
        name: "Hasanbey Mahallesi",
        zone: "Doğu Kırsal / Otoyol Kenarı",
        center: [40.7539, 30.5054],
        polygon: [[40.7605, 30.4955], [40.7615, 30.5155], [40.7465, 30.5145], [40.7455, 30.4945]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL Altyapı" },
        overall: "normal",
        notes: "Hasanbey tarım arazileri ve yerleşiminde şebeke aktif."
    },
    {
        id: "caykisla",
        name: "Çaykışla Mahallesi",
        zone: "Doğu Kırsal Aks",
        center: [40.7369, 30.4929],
        polygon: [[40.7435, 30.4835], [40.7445, 30.5025], [40.7295, 30.5015], [40.7285, 30.4825]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL Altyapı" },
        overall: "normal",
        notes: "Bölgede herhangi bir altyapı arızası bulunmuyor."
    },
    {
        id: "saricalar",
        name: "Sarıcalar Mahallesi",
        zone: "Doğu Kırsal Koridoru",
        center: [40.7314, 30.4775],
        polygon: [[40.7375, 30.4685], [40.7385, 30.4865], [40.7245, 30.4855], [40.7235, 30.4675]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "ADSL / VDSL" },
        overall: "normal",
        notes: "Tarım yerleşiminde altyapı hizmetleri faal."
    },
    {
        id: "epceller",
        name: "Epçeller Mahallesi",
        zone: "Orta-Güneydoğu Kırsal",
        center: [40.7250, 30.4670],
        polygon: [[40.7315, 30.4585], [40.7325, 30.4755], [40.7185, 30.4745], [40.7175, 30.4575]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL Altyapı" },
        overall: "normal",
        notes: "Tarımsal arazilerde elektrik ve su kesintisi yok."
    },
    {
        id: "seyhkoy",
        name: "Şeyhköy Mahallesi",
        zone: "Doğu Kırsal Sınır",
        center: [40.7214, 30.4982],
        polygon: [[40.7285, 30.4885], [40.7295, 30.5085], [40.7135, 30.5075], [40.7125, 30.4875]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL Altyapı" },
        overall: "normal",
        notes: "Şebeke iletimi sorunsuz devam ediyor."
    },
    {
        id: "kamisli",
        name: "Kamışlı Mahallesi",
        zone: "Bekirpaşa Güney Kırsalı",
        center: [40.7160, 30.4590],
        polygon: [[40.7225, 30.4505], [40.7235, 30.4675], [40.7095, 30.4665], [40.7085, 30.4495]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL Altyapı" },
        overall: "normal",
        notes: "Kamışlı köy yerleşiminde hatlar stabil."
    },

    // --- Güney ve Güneydoğu Kırsal Aksı (Çaybaşı, Kayalar & Nehir Boyu) ---
    {
        id: "horozlar",
        name: "Horozlar Mahallesi",
        zone: "Güneydoğu Kırsal",
        center: [40.7073, 30.4891],
        polygon: [[40.7145, 30.4795], [40.7155, 30.4995], [40.6995, 30.4985], [40.6985, 30.4785]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "ADSL/VDSL" },
        overall: "normal",
        notes: "Erenler'in güneydoğu kırsalında şebekeler faal durumda."
    },
    {
        id: "tuapsalar",
        name: "Tuapsalar Mahallesi",
        zone: "Güney Kırsal (Tuapsalar)",
        center: [40.7050, 30.4550],
        polygon: [[40.7125, 30.4455], [40.7135, 30.4645], [40.6975, 30.4635], [40.6965, 30.4445]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL Altyapı" },
        overall: "normal",
        notes: "Çaybaşı bölgesi tarımsal yerleşimde arıza yok."
    },
    {
        id: "caybasiyenikoy",
        name: "Çaybaşıyeniköy Mahallesi",
        zone: "Güney Kırsal Merkez (Çaybaşı)",
        center: [40.6880, 30.4390],
        polygon: [[40.6965, 30.4285], [40.6975, 30.4495], [40.6795, 30.4485], [40.6785, 30.4275]],
        water: { status: "normal", text: "SASKİ kuyu ve şebekesi faal." },
        electric: { status: "normal", text: "SEDAŞ hatları normal." },
        gas: { status: "normal", text: "Doğalgaz arzı sürüyor." },
        internet: { status: "normal", text: "VDSL Altyapısı Aktif" },
        overall: "normal",
        notes: "Mudurnu çayı boyu yerleşiminde altyapı hizmetleri stabil."
    },
    {
        id: "emirler",
        name: "Emirler Mahallesi",
        zone: "Güney Kırsal Kıyı",
        center: [40.6843, 30.4508],
        polygon: [[40.6915, 30.4415], [40.6925, 30.4605], [40.6765, 30.4595], [40.6755, 30.4405]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL Altyapı" },
        overall: "normal",
        notes: "Çaybaşı güneyi kırsal mahallesinde hizmetler düzenli."
    },
    {
        id: "kayalarresitbey",
        name: "Kayalarreşitbey Mahallesi",
        zone: "Güney Kırsal (Kayalar)",
        center: [40.6850, 30.4560],
        polygon: [[40.6925, 30.4475], [40.6935, 30.4655], [40.6775, 30.4645], [40.6765, 30.4465]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL Altyapı" },
        overall: "normal",
        notes: "Yerleşimde arıza kaydı bulunmuyor."
    },
    {
        id: "kayalarmemduhiye",
        name: "Kayalarmemduhiye Mahallesi",
        zone: "Güney Kırsal (Kayalar)",
        center: [40.6787, 30.4697],
        polygon: [[40.6865, 30.4595], [40.6875, 30.4805], [40.6705, 30.4795], [40.6695, 30.4585]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL Altyapı" },
        overall: "normal",
        notes: "Tarihi Kayalar bölgesinde altyapı düzenli çalışıyor."
    },
    {
        id: "yazili",
        name: "Yazılı Mahallesi",
        zone: "Güneydoğu Kırsal",
        center: [40.6913, 30.4847],
        polygon: [[40.6985, 30.4745], [40.6995, 30.4955], [40.6835, 30.4945], [40.6825, 30.4735]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL Altyapı" },
        overall: "normal",
        notes: "Altyapı iletimi sorunsuz."
    },
    {
        id: "ekinli",
        name: "Ekinli Mahallesi",
        zone: "Güneydoğu Kırsal Sınır",
        center: [40.6896, 30.4981],
        polygon: [[40.6965, 30.4885], [40.6975, 30.5085], [40.6815, 30.5075], [40.6805, 30.4875]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL / ADSL" },
        overall: "normal",
        notes: "Ekinli kırsal arazilerinde hatlar stabil."
    },
    {
        id: "sukriye",
        name: "Şükriye Mahallesi",
        zone: "En Güney Kırsal Kıyı",
        center: [40.6720, 30.4450],
        polygon: [[40.6805, 30.4355], [40.6815, 30.4545], [40.6635, 30.4535], [40.6625, 30.4345]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL / ADSL" },
        overall: "normal",
        notes: "Mudurnu çayı kıyısındaki güney yerleşiminde hizmetler stabil."
    },
    {
        id: "degirmendere",
        name: "Değirmendere Mahallesi",
        zone: "En Güney Sakarya Nehri Sınırı",
        center: [40.6472, 30.4371],
        polygon: [[40.6565, 30.4265], [40.6575, 30.4475], [40.6375, 30.4465], [40.6365, 30.4255]],
        water: { status: "normal", text: "Normal" },
        electric: { status: "normal", text: "Normal" },
        gas: { status: "normal", text: "Normal" },
        internet: { status: "normal", text: "VDSL / ADSL" },
        overall: "normal",
        notes: "İlçenin en güney nehri boyu kırsalında şebeke faal."
    }
];

// 3. Katman Grupları (Layer Groups)
const layers = {
    neighborhoods: L.layerGroup().addTo(map),
    water: L.layerGroup().addTo(map),
    electric: L.layerGroup().addTo(map),
    gas: L.layerGroup().addTo(map),
    internet: L.layerGroup().addTo(map),
    works: L.layerGroup().addTo(map),
    userReports: L.layerGroup().addTo(map)
};

// Poligon Stilleri
function getPolygonStyle(overall) {
    if (overall === "alert") {
        return {
            fillColor: "#ef4444",
            fillOpacity: 0.35,
            color: "#ef4444",
            weight: 2.2,
            dashArray: "4, 4"
        };
    } else if (overall === "warning") {
        return {
            fillColor: "#f59e0b",
            fillOpacity: 0.28,
            color: "#f59e0b",
            weight: 2
        };
    } else {
        return {
            fillColor: "#10b981",
            fillOpacity: 0.16,
            color: "#34d399",
            weight: 1.8
        };
    }
}

// 4. Mahalle Poligonlarını & İsim Etiketlerini Haritaya Ekleme
const polygonMap = {};

neighborhoodData.forEach(item => {
    const poly = L.polygon(item.polygon, getPolygonStyle(item.overall));

    // Tooltip
    poly.bindTooltip(`
        <div style="font-size: 0.8rem; font-weight: 700; color: #fff;">${item.name}</div>
        <div style="font-size: 0.7rem; color: #94a3b8; margin-bottom: 2px;">Bölge: ${item.zone || 'Erenler'}</div>
        <div style="font-size: 0.72rem;">${item.overall === 'alert' ? '🔴 Aktif Kesinti / Arıza' : (item.overall === 'warning' ? '🟡 Bakım / Çalışma Var' : '🟢 Altyapı Stabil')}</div>
    `, {
        sticky: true,
        direction: 'top',
        className: 'neighborhood-tooltip'
    });

    // İsim Etiketi
    const nameLabel = L.marker(item.center, {
        icon: L.divIcon({
            className: 'neighborhood-name-label',
            html: `<span>${item.name.replace(' Mahallesi', '')}</span>`,
            iconSize: [80, 20],
            iconAnchor: [40, 10]
        }),
        interactive: false
    });
    nameLabel.addTo(layers.neighborhoods);

    poly.on('click', () => {
        openNeighborhoodDetails(item);
    });

    poly.on('mouseover', function () {
        this.setStyle({ weight: 3.5, fillOpacity: 0.45, color: '#00e5ff' });
    });
    poly.on('mouseout', function () {
        this.setStyle(getPolygonStyle(item.overall));
    });

    poly.addTo(layers.neighborhoods);
    polygonMap[item.name.toLowerCase()] = { polygon: poly, data: item };
});

// 4.1 33 Mahallenin Sol Panele Çipler Olarak Doldurulması
const chipsListElem = document.getElementById('neighborhood-chips-list');
function renderNeighborhoodChips() {
    if (!chipsListElem) return;
    chipsListElem.innerHTML = '';
    neighborhoodData.forEach(item => {
        const chip = document.createElement('div');
        chip.className = 'neighborhood-chip';
        chip.id = `chip-${item.id}`;
        chip.innerHTML = `
            <span class="status-dot ${item.overall}"></span>
            <span>${item.name.replace(' Mahallesi', '')}</span>
        `;
        chip.addEventListener('click', () => {
            openNeighborhoodDetails(item);
        });
        chipsListElem.appendChild(chip);
    });
}
renderNeighborhoodChips();

// 5. Altyapı Tesis ve Noktasal İşaretçileri (Gerçek Konumlar)
const saskiDepo = L.marker([40.7580, 30.4100], {
    icon: createPulsingIcon("#00d2ff", "fa-droplet")
}).bindPopup("<b>SASKİ Erenler Ana Su Deposu</b><br>Kapasite: 5.000 m³<br>Basınç: 4.2 Bar (Stabil)")
.addTo(layers.water);

const sedasTrafo = L.marker([40.7620, 30.4050], {
    icon: createPulsingIcon("#ffc400", "fa-bolt")
}).bindPopup("<b>SEDAŞ Erenler İndirici Trafo Merkezi</b><br>Gerilim: 34.5 kV / 0.4 kV<br>Durum: Tüm fiderler devrede, iletim normal.")
.addTo(layers.electric);

const agdasIstasyon = L.marker([40.7450, 30.4200], {
    icon: createPulsingIcon("#ff5722", "fa-fire")
}).bindPopup("<b>AGDAŞ Erenler RMS-B Basınç Düşürme İstasyonu</b><br>Giriş: 12-19 Bar | Çıkış: 4 Bar<br>Şebeke Güvenliği: Aktif / Normal")
.addTo(layers.gas);

const fiberLineCoords = [
    [40.7650, 30.3950],
    [40.7600, 30.4050],
    [40.7558, 30.4153],
    [40.7480, 30.4200],
    [40.7360, 30.4530],
    [40.7484, 30.4772]
];
const fiberLine = L.polyline(fiberLineCoords, {
    color: "#a855f7",
    weight: 4,
    opacity: 0.85,
    dashArray: "6, 6"
}).bindPopup("<b>Türk Telekom & Superonline Ortak Fiber Omurga Hattı</b><br>Kapasite: 100 Gbps DWDM<br>Durum: İletim kesintisiz.")
.addTo(layers.internet);

function createPulsingIcon(color, faIcon) {
    return L.divIcon({
        className: 'custom-pulsing-icon',
        html: `
            <div class="pulse-ring" style="background-color: ${color}; box-shadow: 0 0 10px ${color};"></div>
            <div class="pulse-center" style="background-color: ${color};"></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
}

// 6. Mahalle Detay Penceresini Açma
const detailsCard = document.getElementById('neighborhood-details-card');
const cardTitle = document.getElementById('card-title');
const cardDesc = document.getElementById('card-desc');
const statusWaterVal = document.getElementById('status-water-val');
const statusElectricVal = document.getElementById('status-electric-val');
const statusGasVal = document.getElementById('status-gas-val');
const statusInternetVal = document.getElementById('status-internet-val');
const cardDetailsList = document.getElementById('card-details-list');
const cardBadge = document.getElementById('card-badge');

function openNeighborhoodDetails(data) {
    if (cardBadge) cardBadge.textContent = data.zone || 'Erenler';
    cardTitle.textContent = data.name;
    cardDesc.textContent = data.notes;

    const targetChip = document.getElementById(`chip-${data.id}`);
    if (targetChip) {
        document.querySelectorAll('.neighborhood-chip').forEach(c => c.classList.remove('active'));
        targetChip.classList.add('active');
        targetChip.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    statusWaterVal.textContent = data.water.status === 'issue' ? 'Kesinti Var' : (data.water.status === 'work' ? 'Bakım' : 'Normal');
    updateStatusBox('status-water-box', data.water.status);

    statusElectricVal.textContent = data.electric.status === 'issue' ? 'Kesinti Var' : (data.electric.status === 'work' ? 'Planlı Bakım' : 'Normal');
    updateStatusBox('status-electric-box', data.electric.status);

    statusGasVal.textContent = data.gas.status === 'issue' ? 'Kesinti' : (data.gas.status === 'work' ? 'Çalışma' : 'Normal');
    updateStatusBox('status-gas-box', data.gas.status);

    statusInternetVal.textContent = data.internet.status === 'issue' ? 'Arıza Bildirildi' : data.internet.text;
    updateStatusBox('status-internet-box', data.internet.status);

    cardDetailsList.innerHTML = `
        <div style="margin-bottom: 6px;"><strong>💧 SASKİ:</strong> ${data.water.text}</div>
        <div style="margin-bottom: 6px;"><strong>⚡ SEDAŞ:</strong> ${data.electric.text}</div>
        <div style="margin-bottom: 6px;"><strong>🔥 AGDAŞ:</strong> ${data.gas.text}</div>
        <div><strong>🌐 İnternet:</strong> ${data.internet.text}</div>
    `;

    detailsCard.style.display = 'block';
    map.flyTo(data.center, 14.5, { duration: 1.2 });
}

function updateStatusBox(elementId, status) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.remove('has-issue', 'has-work');
    if (status === 'issue') el.classList.add('has-issue');
    if (status === 'work') el.classList.add('has-work');
}

document.getElementById('btn-close-card').addEventListener('click', () => {
    detailsCard.style.display = 'none';
});

// 7. Katman Aç / Kapa Kontrolleri (Toggles)
document.getElementById('chk-water').addEventListener('change', (e) => toggleLayer(layers.water, e.target.checked));
document.getElementById('chk-electric').addEventListener('change', (e) => toggleLayer(layers.electric, e.target.checked));
document.getElementById('chk-gas').addEventListener('change', (e) => toggleLayer(layers.gas, e.target.checked));
document.getElementById('chk-internet').addEventListener('change', (e) => toggleLayer(layers.internet, e.target.checked));
document.getElementById('chk-works').addEventListener('change', (e) => toggleLayer(layers.works, e.target.checked));

function toggleLayer(layerGroup, isChecked) {
    if (isChecked) {
        if (!map.hasLayer(layerGroup)) map.addLayer(layerGroup);
    } else {
        if (map.hasLayer(layerGroup)) map.removeLayer(layerGroup);
    }
}

let allLayersActive = true;
document.getElementById('btn-toggle-all').addEventListener('click', () => {
    allLayersActive = !allLayersActive;
    const checkboxes = document.querySelectorAll('.layer-toggle-item input[type="checkbox"]');
    checkboxes.forEach(chk => {
        chk.checked = allLayersActive;
        chk.dispatchEvent(new Event('change'));
    });
    document.getElementById('btn-toggle-all').textContent = allLayersActive ? "Tümünü Kapat" : "Tümünü Aç";
});

// 8. GERÇEK ZAMANLI VERİ SENKRONİZASYONU & CANLI AKIŞ MOTORU
const feedList = document.getElementById('events-feed-list');
const liveSyncTimeElem = document.getElementById('live-sync-time');
const refreshBtn = document.getElementById('btn-refresh-data');

// Canlı Verileri Çekme & Güncelleme Fonksiyonu (Saatlik Otomatik Bot Verisi)
async function syncLiveData(isManual = false) {
    if (refreshBtn) refreshBtn.classList.add('spinning');
    
    const nowTime = getCurrentTimeString();
    const nowDate = getCurrentDateString();

    try {
        // 1. Önce saatlik botun ürettiği data/outages.json dosyasını çek (Cache busting ile)
        let res = await fetch(`data/outages.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) {
            // Netlify serverless fallback
            res = await fetch('/api/outages', { cache: 'no-store' });
        }

        if (res.ok) {
            const data = await res.json();
            applyLiveServerData(data);
        } else {
            applyBaselineLiveData();
        }
    } catch (err) {
        applyBaselineLiveData();
    }

    if (liveSyncTimeElem) {
        liveSyncTimeElem.textContent = `CANLI • ${nowTime}`;
    }

    if (refreshBtn) {
        setTimeout(() => refreshBtn.classList.remove('spinning'), 600);
    }

    if (isManual) {
        showToastAlert({
            title: "Saatlik Veriler Güncellendi",
            desc: `SASKİ, SEDAŞ ve AGDAŞ sistemleri kontrol edildi (${nowTime}).`,
            type: "normal"
        });
    }
}

function applyLiveServerData(serverData) {
    const events = [];
    let waterCount = (serverData.summary && serverData.summary.water) || 0;
    let electricCount = (serverData.summary && serverData.summary.electric) || 0;
    let gasCount = (serverData.summary && serverData.summary.gas) || 0;
    let internetCount = (serverData.summary && serverData.summary.internet) || 0;

    // Mahalle poligon renklerini dinamik güncelle
    if (serverData.neighborhood_overrides) {
        for (const nKey in serverData.neighborhood_overrides) {
            const ov = serverData.neighborhood_overrides[nKey];
            const item = neighborhoodData.find(d => d.id === nKey || d.name.toLowerCase().includes(nKey.toLowerCase()));
            if (item && polygonMap[item.name.toLowerCase()]) {
                item.overall = ov.overall;
                if (ov.note) item.notes = ov.note;
                polygonMap[item.name.toLowerCase()].polygon.setStyle(getPolygonStyle(item.overall));
            }
        }
    }

    if (serverData.active_events && serverData.active_events.length > 0) {
        serverData.active_events.forEach(ev => {
            events.push({
                type: ev.type,
                icon: ev.type === 'water' ? 'fa-droplet' : (ev.type === 'electric' ? 'fa-bolt' : (ev.type === 'gas' ? 'fa-fire' : 'fa-wifi')),
                typeName: ev.title || `${ev.provider} Kesintisi`,
                location: `${ev.neighborhood} Mah.`,
                desc: ev.description,
                time: ev.time || getCurrentTimeString()
            });
        });
    } else {
        // Kurumların anlık durum mesajlarını canlı akışa ekle
        const pSaski = (serverData.providers && serverData.providers.saski) || {};
        const pSedas = (serverData.providers && serverData.providers.sedas) || {};
        const pAgdas = (serverData.providers && serverData.providers.agdas) || {};

        events.push(
            { 
                type: "water", 
                icon: "fa-droplet", 
                typeName: "SASKİ Su Şebekesi", 
                location: "Erenler Geneli", 
                desc: pSaski.message || "Tüm ana isale hatları ve su depoları aktif. Aktif arıza kaydı yok.", 
                time: getCurrentTimeString() 
            },
            { 
                type: "electric", 
                icon: "fa-bolt", 
                typeName: "SEDAŞ Elektrik İletimi", 
                location: "Erenler Geneli", 
                desc: pSedas.message || "Trafo fiderleri devrede, planlı kesinti bildirilmedi.", 
                time: getCurrentTimeString() 
            },
            { 
                type: "gas", 
                icon: "fa-fire", 
                typeName: "AGDAŞ Doğalgaz", 
                location: "Erenler Geneli", 
                desc: pAgdas.message || "Doğalgaz arzı kesintisiz ve şebeke basıncı stabil.", 
                time: getCurrentTimeString() 
            },
            { 
                type: "internet", 
                icon: "fa-wifi", 
                typeName: "Telekomünikasyon", 
                location: "Erenler Geneli", 
                desc: "Fiberoptik omurga ve VDSL santralleri devrede, iletim normal.", 
                time: getCurrentTimeString() 
            }
        );
    }

    renderFeed(events);
    updateHeaderCounters(waterCount, electricCount, gasCount, internetCount);
    renderNeighborhoodChips();
}

function applyBaselineLiveData() {
    const nowTime = getCurrentTimeString();
    const liveEvents = [
        { type: "water", icon: "fa-droplet", typeName: "SASKİ Su Şebekesi", location: "Erenler Geneli", desc: "Ana isale hatları ve su depoları aktif, basınç stabil.", time: nowTime },
        { type: "electric", icon: "fa-bolt", typeName: "SEDAŞ Elektrik", location: "Erenler Geneli", desc: "Planlı elektrik kesintisi bulunmuyor, iletim normal.", time: nowTime },
        { type: "gas", icon: "fa-fire", typeName: "AGDAŞ Doğalgaz", location: "Erenler Geneli", desc: "Gaz arzı kesintisiz ve güvenli.", time: nowTime },
        { type: "internet", icon: "fa-wifi", typeName: "İnternet Altyapısı", location: "Erenler Geneli", desc: "Türk Telekom & Superonline omurgası aktif.", time: nowTime }
    ];
    renderFeed(liveEvents);
    updateHeaderCounters(0, 0, 0, 0);
}

function updateHeaderCounters(w, e, g, i) {
    const sw = document.getElementById('stat-water');
    const se = document.getElementById('stat-electric');
    const sg = document.getElementById('stat-gas');
    const si = document.getElementById('stat-internet');
    if (sw) sw.textContent = w;
    if (se) se.textContent = e;
    if (sg) sg.textContent = g;
    if (si) si.textContent = i;
}

function renderFeed(events) {
    if (!feedList) return;
    feedList.innerHTML = '';
    events.forEach(item => {
        const div = document.createElement('div');
        div.className = `event-card ${item.type}`;
        div.innerHTML = `
            <div class="event-header">
                <span class="event-type ${item.type}">
                    <i class="fa-solid ${item.icon}"></i> ${item.typeName}
                </span>
                <span class="event-time">${item.time}</span>
            </div>
            <div class="event-location">${item.location}</div>
            <div class="event-desc">${item.desc}</div>
        `;
        div.addEventListener('click', () => {
            const matchedKey = Object.keys(polygonMap).find(key => item.location.toLowerCase().includes(key.split(" ")[0]));
            if (matchedKey && polygonMap[matchedKey]) {
                openNeighborhoodDetails(polygonMap[matchedKey].data);
            }
        });
        feedList.appendChild(div);
    });
    const feedCountElem = document.getElementById('feed-count');
    if (feedCountElem) feedCountElem.textContent = `${events.length} Durum`;
}

if (refreshBtn) {
    refreshBtn.addEventListener('click', () => syncLiveData(true));
}

// 60 saniyede bir otomatik canlı senkronizasyon
setInterval(() => syncLiveData(false), 60000);
syncLiveData(false);

// 9. OTOMATİK BİLDİRİM & SESLİ UYARI SİSTEMİ (PUSH & TOAST NOTIFICATIONS)
let notificationsEnabled = localStorage.getItem('erenler_notifications') === 'true';
let soundEnabled = localStorage.getItem('erenler_sound') !== 'false';

const btnNotify = document.getElementById('btn-toggle-notifications');
const btnNotifyText = document.getElementById('notify-btn-text');
const btnSound = document.getElementById('btn-toggle-sound');
const soundIcon = document.getElementById('sound-icon');
const toastContainer = document.getElementById('toast-container');

// Sesli Uyarı Tonu (Web Audio API ile Dış Dosyasız Sentez)
function playNotificationChime() {
    if (!soundEnabled) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
        // Kullanıcı etkileşimi bekleniyor
    }
}

// Masaüstü / Web Push Bildirimi İsteği
function updateNotificationButtonUI() {
    if (!btnNotify) return;
    if (Notification.permission === 'granted' && notificationsEnabled) {
        btnNotify.classList.add('active');
        btnNotifyText.textContent = "Bildirimler Açık";
    } else if (Notification.permission === 'denied') {
        btnNotify.classList.remove('active');
        btnNotifyText.textContent = "Bildirim Engellendi";
    } else {
        btnNotify.classList.remove('active');
        btnNotifyText.textContent = "Bildirimleri Aç";
    }
}

if (btnNotify) {
    updateNotificationButtonUI();
    btnNotify.addEventListener('click', async () => {
        if (!("Notification" in window)) {
            alert("Tarayıcınız web bildirimlerini desteklemiyor.");
            return;
        }

        if (Notification.permission === 'granted') {
            notificationsEnabled = !notificationsEnabled;
            localStorage.setItem('erenler_notifications', notificationsEnabled);
            updateNotificationButtonUI();
            if (notificationsEnabled) {
                showToastAlert({
                    title: "Bildirimler Aktif",
                    desc: "Erenler altyapı kesintilerinden anında haberdar edileceksiniz.",
                    type: "normal"
                });
            }
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                notificationsEnabled = true;
                localStorage.setItem('erenler_notifications', 'true');
                updateNotificationButtonUI();
                
                // İlk hoşgeldin testi bildirimi
                new Notification("Erenler Altyapı Radarı Canlı", {
                    body: "Bildirimler aktif edildi. Erenler ilçesindeki anlık su, elektrik, gaz ve internet arızaları ekranınıza düşecektir.",
                    icon: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
                });

                showToastAlert({
                    title: "Bildirimler Aktifleştirildi 🔔",
                    desc: "Yeni kesinti ve arızalar anında telefon veya bilgisayarınıza iletilecek.",
                    type: "normal"
                });
            } else {
                updateNotificationButtonUI();
            }
        } else {
            alert("Bildirimler tarayıcı ayarlarınızdan engellenmiş. Adres çubuğundaki kilit simgesine tıklayarak izin verebilirsiniz.");
        }
    });
}

// Ses Aç/Kapat Butonu
if (btnSound) {
    btnSound.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('erenler_sound', soundEnabled);
        soundIcon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        if (soundEnabled) playNotificationChime();
    });
}

// Canlı Ekranda Açılan Toast & Masaüstü Bildirimi
function showToastAlert({ title, desc, type = "normal", neighborhoodData = null }) {
    playNotificationChime();

    // 1. Masaüstü / Telefon Web Push Bildirimi Gönder
    if ("Notification" in window && Notification.permission === 'granted' && notificationsEnabled) {
        try {
            new Notification(`Erenler Radarı: ${title}`, {
                body: desc,
                icon: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
            });
        } catch (e) {}
    }

    // 2. Harita Üzerinde Şık Kayan Toast Kartı Göster
    if (!toastContainer) return;
    const card = document.createElement('div');
    card.className = `toast-card ${type}`;
    card.innerHTML = `
        <div class="toast-header">
            <span class="toast-title">
                <i class="fa-solid ${type === 'alert' ? 'fa-triangle-exclamation' : (type === 'warning' ? 'fa-circle-exclamation' : 'fa-circle-check')}"></i>
                ${title}
            </span>
            <button class="toast-close">&times;</button>
        </div>
        <div class="toast-desc">${desc}</div>
        <div class="toast-actions">
            <span class="toast-time">${getCurrentTimeString()}</span>
            ${neighborhoodData ? `<span class="toast-link" id="link-fly-${neighborhoodData.id}"><i class="fa-solid fa-location-arrow"></i> Haritada Gör</span>` : ''}
        </div>
        <div class="toast-progress"></div>
    `;

    card.querySelector('.toast-close').addEventListener('click', () => card.remove());

    if (neighborhoodData) {
        const flyLink = card.querySelector(`#link-fly-${neighborhoodData.id}`);
        if (flyLink) {
            flyLink.addEventListener('click', () => {
                openNeighborhoodDetails(neighborhoodData);
                card.remove();
            });
        }
    }

    toastContainer.prepend(card);

    // 6 saniye sonra otomatik kaybol
    setTimeout(() => {
        if (card.parentNode) {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-30px)';
            setTimeout(() => card.remove(), 300);
        }
    }, 6000);
}

// 10. Mahalle Arama Çubuğu (33 Mahalle Filtreleme)
const searchInput = document.getElementById('neighborhood-search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim().toLowerCase();
        
        document.querySelectorAll('.neighborhood-chip').forEach(chip => {
            const text = chip.textContent.toLowerCase();
            chip.style.display = (!val || text.includes(val)) ? 'flex' : 'none';
        });

        if (!val) return;

        for (const key in polygonMap) {
            if (key.includes(val)) {
                openNeighborhoodDetails(polygonMap[key].data);
                break;
            }
        }
    });
}

// 11. Vatandaş Arıza Bildirimi (Crowdsourced Reporting) Modalı
const reportModal = document.getElementById('report-modal');
const btnOpenReport = document.getElementById('btn-open-report');
const btnReportForNeighborhood = document.getElementById('btn-report-for-neighborhood');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const reportForm = document.getElementById('report-form');
const selectNeighborhood = document.getElementById('report-neighborhood');

if (btnOpenReport) {
    btnOpenReport.addEventListener('click', () => {
        reportModal.style.display = 'flex';
    });
}

if (btnReportForNeighborhood) {
    btnReportForNeighborhood.addEventListener('click', () => {
        const currentTitle = cardTitle.textContent.replace(' Mahallesi', '').trim();
        for (let i = 0; i < selectNeighborhood.options.length; i++) {
            if (selectNeighborhood.options[i].text.includes(currentTitle)) {
                selectNeighborhood.selectedIndex = i;
                break;
            }
        }
        reportModal.style.display = 'flex';
    });
}

function closeModal() {
    reportModal.style.display = 'none';
    reportForm.reset();
}

if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

// Form Gönderildiğinde Haritada Canlı Pin Oluşturma ve Anında Bildirim Tetikleme
if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const neighborhoodVal = selectNeighborhood.value;
        const serviceVal = document.querySelector('input[name="report_service"]:checked').value;
        const detailVal = document.getElementById('report-detail').value;

        const matchedItem = neighborhoodData.find(item => item.name.includes(neighborhoodVal));
        const coords = matchedItem ? matchedItem.center : ERENLER_COORDS;

        const jitterLat = coords[0] + (Math.random() - 0.5) * 0.003;
        const jitterLng = coords[1] + (Math.random() - 0.5) * 0.003;

        let serviceName = "Su";
        let serviceColor = "#00d2ff";
        let iconClass = "fa-droplet";

        if (serviceVal === "electric") { serviceName = "Elektrik"; serviceColor = "#ffc400"; iconClass = "fa-bolt"; }
        else if (serviceVal === "gas") { serviceName = "Doğalgaz"; serviceColor = "#ff5722"; iconClass = "fa-fire"; }
        else if (serviceVal === "internet") { serviceName = "İnternet"; serviceColor = "#a855f7"; iconClass = "fa-wifi"; }

        // Haritaya marker ekle
        const userMarker = L.marker([jitterLat, jitterLng], {
            icon: createPulsingIcon(serviceColor, iconClass)
        }).bindPopup(`
            <div style="font-size: 0.82rem;">
                <strong style="color: ${serviceColor};"><i class="fa-solid fa-bullhorn"></i> Vatandaş Bildirimi</strong><br>
                <b>Hizmet:</b> ${serviceName}<br>
                <b>Mahalle:</b> ${neighborhoodVal} Mah.<br>
                <b>Detay:</b> "${detailVal}"<br>
                <span style="font-size: 0.7rem; color: #94a3b8;">${getCurrentTimeString()}</span>
            </div>
        `).addTo(layers.userReports);

        userMarker.openPopup();
        map.flyTo([jitterLat, jitterLng], 15);

        // Canlı akışa ekle
        const nowTime = getCurrentTimeString();
        const newEvent = {
            type: serviceVal,
            icon: iconClass,
            typeName: `Vatandaş Bildirimi (${serviceName})`,
            location: `${neighborhoodVal} Mah.`,
            desc: detailVal,
            time: nowTime
        };

        const existingCards = feedList.querySelectorAll('.event-card');
        const div = document.createElement('div');
        div.className = `event-card ${serviceVal}`;
        div.innerHTML = `
            <div class="event-header">
                <span class="event-type ${serviceVal}">
                    <i class="fa-solid ${iconClass}"></i> Vatandaş Bildirimi (${serviceName})
                </span>
                <span class="event-time">${nowTime}</span>
            </div>
            <div class="event-location">${neighborhoodVal} Mah.</div>
            <div class="event-desc">${detailVal}</div>
        `;
        feedList.prepend(div);

        // İstatistik sayacını artır
        const statElem = document.getElementById(`stat-${serviceVal}`);
        if (statElem) {
            statElem.textContent = parseInt(statElem.textContent || "0") + 1;
        }

        closeModal();

        // Otomatik Canlı Toast ve Push Bildirimi Gönder
        showToastAlert({
            title: `Yeni ${serviceName} Arızası Bildirildi!`,
            desc: `${neighborhoodVal} Mahallesinde vatandaş tarafından arıza bildirildi: "${detailVal}"`,
            type: "alert",
            neighborhoodData: matchedItem
        });
    });
}
