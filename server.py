"""
Erenler Altyapı & Kesinti Takip Sistemi - Yerel Geliştirme Sunucusu & Veri Toplayıcı İskeleti
Çalıştırmak için:
    python server.py
Ardından tarayıcınızda açın:
    http://localhost:8080
"""

import http.server
import socketserver
import os
import json

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Örnek API Ucu: Gerçek zamanlı SASKİ, SEDAŞ, AGDAŞ kesinti verilerini JSON olarak dönme
        if self.path == '/api/outages':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            sample_data = {
                "district": "Erenler",
                "province": "Sakarya",
                "providers": {
                    "saski": {"status": "ok", "active_outages": 1},
                    "sedas": {"status": "ok", "active_outages": 2},
                    "agdas": {"status": "ok", "active_outages": 1},
                    "telecom": {"status": "ok", "active_outages": 1}
                }
            }
            self.wfile.write(json.dumps(sample_data, ensure_ascii=False).encode('utf-8'))
        else:
            super().do_GET()

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"\n==================================================")
        print(f"🚀 Erenler Altyapı Haritası Başlatıldı!")
        print(f"🌐 Tarayıcınızda açın: http://localhost:{PORT}")
        print(f"📁 Konum: {DIRECTORY}")
        print(f"Durdurmak için Ctrl+C tuşlarına basın.")
        print(f"==================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nSunucu kapatıldı.")
