# 📍 Erenler Altyapı & Kesinti Takip Haritası (Sakarya)

Sakarya ili **Erenler ilçesi** için su (SASKİ), elektrik (SEDAŞ), doğalgaz (AGDAŞ), internet (Türk Telekom / Superonline) ve altyapı kazı çalışmalarını (AYKOME) tek bir canlı haritada birleştiren modern CBS (GIS) takip paneli.

---

## 🚀 Hızlı Başlangıç

Bu projeyi iki şekilde çalıştırabilirsiniz:

### Yöntem 1: Doğrudan Tarayıcıda Açma (Kurulum Gerektirmez)
Klasördeki `index.html` dosyasını çift tıklayarak herhangi bir modern tarayıcıda (Chrome, Edge, Firefox vb.) doğrudan açabilirsiniz.

### Yöntem 2: Yerel Python Sunucusu ile Çalıştırma
Terminal veya PowerShell üzerinden proje klasörüne gidip şu komutu verin:
```bash
python server.py
```
Ardından tarayıcınızdan `http://localhost:8080` adresine gidin.

---

## 🌟 Haritada Neler Var?

1. **Erenler Mahalle Sınırları & Durumları:**
   * **Dilmen Mahallesi:** SASKİ su borusu tamiratı (kırmızı uyarı).
   * **Hacıoğlu Mahallesi:** SEDAŞ planlı trafo bakımı (sarı uyarı).
   * **Bağlar Mahallesi:** Fiber kablo kopması uyarısı.
   * **Erenler (Merkez):** AGDAŞ servis bağlantısı çalışması.
   * **Yeşiltepe, Tabakhane, Kozluk, Küpçüler, Yeni Mahalle, Bekirpaşa vb.:** Genel durumları stabil.
2. **Katman Filtreleri (Aç / Kapa):**
   * 💧 **Su & Kanalizasyon (SASKİ):** Erenler su deposu ve şebeke durumu.
   * ⚡ **Elektrik (SEDAŞ):** İndirici trafo merkezi ve fider bakımları.
   * 🔥 **Doğalgaz (AGDAŞ):** RMS-B basınç düşürme istasyonu ve dağıtım hatları.
   * 🌐 **İnternet & Fiber:** Fiber omurga hattı güzergahı ve kesinti tespiti.
   * 🚧 **AYKOME Kazı İzinleri:** Devam eden kazı ve kablo döşeme çalışmaları.
3. **Canlı Akış & Bildirim Paneli:**
   * Kurumlardan gelen son olay duyuruları.
   * Tıklanan olay otomatik olarak ilgili mahalleye haritada odaklanır (fly-to).
4. **Vatandaş Arıza Bildirimi (Crowdsourced):**
   * Kullanıcılar mahalle seçip anlık "Su", "Elektrik", "Gaz" veya "İnternet" arızası bildirebilir.
   * Bildirilen arızalar anında haritada nabız atan (pulsing) yeni bir pin olarak belirir ve canlı akışa eklenir.

---

## ⚙️ Gerçek Veri Entegrasyonu Nasıl Yapılır?

* **SASKİ & SEDAŞ:** `server.py` içine BeautifulSoup veya Scrapy ile web scraping fonksiyonları eklenerek kurumların resmi duyuru sayfalarından Erenler için yeni arıza kayıtları otomatik çekilebilir.
* **Telegram / WhatsApp Botu:** Erenler sakinlerinin WhatsApp veya Telegram botu üzerinden fotoğraf veya konum atarak haritaya arıza pini bırakması sağlanabilir.
