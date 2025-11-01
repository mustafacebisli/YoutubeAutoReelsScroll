# YouTube Shorts Otomatik Kaydırma Eklentisi

YouTube Shorts videolarında otomatik olarak bir sonraki videoya geçiş yapan Chrome eklentisi.

## Özellikler

- ✅ YouTube Shorts videoları bittiğinde otomatik olarak bir sonraki videoya geçer
- ✅ Açma/Kapama toggle butonu ile kontrol edilebilir
- ✅ Yan sekme başlığında durum göstergesi
- ✅ Basit ve kullanımı kolay arayüz

## Kurulum

### Chrome Web Store'dan Kurulum (Yakında)

Eklenti henüz Chrome Web Store'da yayınlanmadı. Manuel kurulum talimatları aşağıda.

### Manuel Kurulum

1. Bu projeyi bilgisayarınıza indirin veya klonlayın
2. Chrome tarayıcınızı açın
3. Adres çubuğuna `chrome://extensions/` yazın ve Enter tuşuna basın
4. Sağ üstteki "Geliştirici modu" anahtarını açın
5. "Paketlenmemiş eklenti yükle" butonuna tıklayın
6. Bu proje klasörünü seçin
7. Eklenti yüklenecek ve aktif olacaktır

## Kullanım

1. YouTube Shorts sayfasına gidin: `https://www.youtube.com/shorts`
2. Bir video izlemeye başlayın
3. Toolbar'daki eklenti ikonuna tıklayın
4. Açma/Kapama anahtarı ile otomatik kaydırmayı kontrol edin

## Nasıl Çalışır?

Eklenti, şu yöntemleri kullanarak bir sonraki videoya geçer:

1. **Video Bitme Eventi**: Video tamamen bittiğinde `ended` event'ini dinler
2. **Sonraki Buton**: YouTube'un "Sonraki" butonunu bulup tıklar
3. **Klavye Kısayolu**: ArrowDown tuşunu simüle eder
4. **Touch Event**: Mobil görünümde kaydırma hareketini simüle eder

## Teknik Detaylar

- **Manifest Version**: 3
- **Content Script**: YouTube Shorts sayfasında çalışır
- **Tarayıcı Desteği**: Chrome, Edge, Brave (Chromium tabanlı tarayıcılar)
- **Güncelleme Kontrolü**: Her 500ms'de bir video durumunu kontrol eder

## Geliştirme

Eklenti şu dosyalardan oluşur:

- `manifest.json`: Eklenti konfigürasyonu
- `content.js`: Ana otomatik kaydırma mantığı
- `popup.html`: Yan sekme HTML'i
- `popup.js`: Yan sekme JavaScript'i

## Katkıda Bulunma

Hata raporları ve özellik istekleri için GitHub Issues kullanabilirsiniz.

## Lisans

MIT License - Özgürce kullanabilirsiniz.

## Notlar

- Bu eklenti sadece eğitim amaçlıdır
- YouTube'un şartlarını ve hizmet şartlarını ihlal etmemek kullanıcının sorumluluğundadır
- YouTube, platformlarında otomatik kaydırma eklentilerine karşı önlemler alabilir

