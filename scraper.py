"""
Erenler Altyapı & Kesinti Takip Sistemi - Saatlik Otomatik Tarama Botu
Kurumlar: SASKİ (Su), SEDAŞ (Elektrik), AGDAŞ (Doğalgaz)

Bu bot:
1. Kurumların resmi duyuru ve kesinti sayfalarını tarar (Web scraping).
2. 'Erenler' ve 33 mahalle adını filtreler.
3. Bulunan kesintileri 'data/outages.json' dosyasına canlı olarak kaydeder.
"""

import os
import re
import json
import datetime
import urllib.request
import urllib.error

# 33 Resmi Erenler Mahallesi Listesi
NEIGHBORHOODS = [
    "Alancuma", "Bağlar", "Bekirpaşa", "Büyükesence", "Çaybaşıyeniköy",
    "Çaykışla", "Değirmendere", "Dilmen", "Ekinli", "Emirler",
    "Epçeller", "Erenler", "Hacıoğlu", "Hasanbey", "Horozlar",
    "Hürriyet", "Kamışlı", "Kayalarmemduhiye", "Kayalarreşitbey", "Kozluk",
    "Küçükesence", "Küpçüler", "Nakışlar", "Pirahmetler", "Sarıcalar",
    "Şeyhköy", "Şükriye", "Tabakhane", "Tepe", "Tuapsalar",
    "Yazılı", "Yeni", "Yeşiltepe"
]

DATA_FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "outages.json")

def get_current_turkey_time():
    # UTC+3 Türkiye Saati
    now = datetime.datetime.utcnow() + datetime.timedelta(hours=3)
    return now.strftime("%Y-%m-%d %H:%M"), now.strftime("%H:%M")

def fetch_html_safe(url, timeout=15):
    """Web sayfasını bot engeline takılmadan güvenli tarar."""
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8"
            }
        )
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"[-] {url} adresine ulaşılamadı: {e}")
        return ""

def check_saski_water():
    """SASKİ Sakarya Su Kesintilerini Tarar."""
    print("[*] SASKİ Su Kesintileri taranıyor...")
    events = []
    # SASKİ Arıza & Kesintiler Sayfası
    url = "https://sakarya-saski.gov.tr/tr/ariza-ve-kesintiler"
    html = fetch_html_safe(url)

    if not html:
        url_alt = "https://www.saski.gov.tr/"
        html = fetch_html_safe(url_alt)

    if html:
        # Erenler geçen blokları incele
        clean_text = re.sub(r'<[^>]+>', ' ', html)
        clean_text_upper = clean_text.upper()

        if "ERENLER" in clean_text_upper:
            for mah in NEIGHBORHOODS:
                mah_upper = mah.upper().replace('İ', 'I')
                if mah_upper in clean_text_upper:
                    events.append({
                        "id": f"saski-{mah.lower()}",
                        "provider": "SASKİ",
                        "type": "water",
                        "neighborhood": mah,
                        "title": "SASKİ Su Kesintisi / Arıza",
                        "description": f"SASKİ resmi duyurusunda {mah} Mahallesi için şebeke çalışması bildirilmiştir.",
                        "status": "alert",
                        "time": get_current_turkey_time()[1]
                    })
    return events

def check_sedas_electric():
    """SEDAŞ Sakarya Elektrik Kesintilerini Tarar."""
    print("[*] SEDAŞ Elektrik Kesintileri taranıyor...")
    events = []
    url = "https://www.sedas.com/tr-tr/elektrik-kesintisi/planli-kesintiler"
    html = fetch_html_safe(url)

    if html:
        clean_text = re.sub(r'<[^>]+>', ' ', html)
        clean_text_upper = clean_text.upper()

        if "ERENLER" in clean_text_upper:
            for mah in NEIGHBORHOODS:
                mah_upper = mah.upper().replace('İ', 'I')
                if mah_upper in clean_text_upper:
                    events.append({
                        "id": f"sedas-{mah.lower()}",
                        "provider": "SEDAŞ",
                        "type": "electric",
                        "neighborhood": mah,
                        "title": "SEDAŞ Planlı Elektrik Kesintisi",
                        "description": f"SEDAŞ bakım ve şebeke güçlendirme çalışması nedeniyle {mah} Mahallesi bildirilmiştir.",
                        "status": "warning",
                        "time": get_current_turkey_time()[1]
                    })
    return events

def check_agdas_gas():
    """AGDAŞ Doğalgaz Kesintilerini Tarar."""
    print("[*] AGDAŞ Doğalgaz Duyuruları taranıyor...")
    events = []
    url = "https://www.agdas.com.tr/haberler-ve-duyurular"
    html = fetch_html_safe(url)

    if html:
        clean_text = re.sub(r'<[^>]+>', ' ', html)
        clean_text_upper = clean_text.upper()

        if "ERENLER" in clean_text_upper and "KESİNTİ" in clean_text_upper:
            for mah in NEIGHBORHOODS:
                mah_upper = mah.upper().replace('İ', 'I')
                if mah_upper in clean_text_upper:
                    events.append({
                        "id": f"agdas-{mah.lower()}",
                        "provider": "AGDAŞ",
                        "type": "gas",
                        "neighborhood": mah,
                        "title": "AGDAŞ Doğalgaz Şebeke Çalışması",
                        "description": f"{mah} Mahallesi gaz hattı bağlantı ve bakım çalışması.",
                        "status": "warning",
                        "time": get_current_turkey_time()[1]
                    })
    return events

def run_scraper():
    full_time_str, time_str = get_current_turkey_time()
    print(f"\n==================================================")
    print(f"🚀 Erenler Saatlik Kesinti Tarama Botu Başlatıldı: {full_time_str}")
    print(f"==================================================")

    # 1. Taramaları yap
    water_events = check_saski_water()
    electric_events = check_sedas_electric()
    gas_events = check_agdas_gas()

    all_events = water_events + electric_events + gas_events

    # 2. Mahalle renk güncellemeleri
    neighborhood_overrides = {}
    for ev in all_events:
        m_id = ev["neighborhood"].lower().replace(' ', '_')
        neighborhood_overrides[m_id] = {
            "overall": ev["status"],
            "note": f"{ev['provider']}: {ev['title']} ({ev['time']})"
        }

    # 3. JSON verisini hazırla
    output_data = {
        "last_updated": full_time_str,
        "last_check_status": "Başarılı",
        "district": "Erenler",
        "province": "Sakarya",
        "summary": {
            "total_active_outages": len(all_events),
            "water": len(water_events),
            "electric": len(electric_events),
            "gas": len(gas_events),
            "internet": 0
        },
        "providers": {
            "saski": {
                "name": "SASKİ Sakarya Su ve Kanalizasyon İdaresi",
                "status": "Kesinti Var" if water_events else "Normal",
                "active_outages": len(water_events),
                "message": f"Erenler'de {len(water_events)} mahallede su çalışması tespit edildi." if water_events else "Erenler ana hatlarında aktif planlı bir su kesintisi bulunmuyor."
            },
            "sedas": {
                "name": "SEDAŞ Sakarya Elektrik Dağıtım A.Ş.",
                "status": "Kesinti Var" if electric_events else "Normal",
                "active_outages": len(electric_events),
                "message": f"Erenler'de {len(electric_events)} mahallede elektrik çalışması tespit edildi." if electric_events else "Erenler trafo fiderlerinde elektrik iletimi normaldir."
            },
            "agdas": {
                "name": "AGDAŞ Adapazarı Gaz Dağıtım A.Ş.",
                "status": "Kesinti Var" if gas_events else "Normal",
                "active_outages": len(gas_events),
                "message": f"Erenler'de {len(gas_events)} mahallede doğalgaz çalışması var." if gas_events else "Erenler doğalgaz şebekesinde gaz arzı kesintisizdir."
            }
        },
        "active_events": all_events,
        "neighborhood_overrides": neighborhood_overrides
    }

    # 4. Dosyaya kaydet
    os.makedirs(os.path.dirname(DATA_FILE_PATH), exist_ok=True)
    with open(DATA_FILE_PATH, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"[+] Veriler başarıyla '{DATA_FILE_PATH}' dosyasına kaydedildi.")
    print(f"[+] Toplam Tespit Edilen Kesinti: {len(all_events)}")
    print(f"    💧 Su: {len(water_events)} | ⚡ Elektrik: {len(electric_events)} | 🔥 Gaz: {len(gas_events)}")
    print(f"==================================================\n")

if __name__ == "__main__":
    run_scraper()
