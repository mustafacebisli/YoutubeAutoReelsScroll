// YouTube Shorts otomatik kaydırma eklentisi
(function() {
  'use strict';

  let isEnabled = true;
  let lastVideoId = null;
  let hasTriggeredSwipe = false;
  let videoCheckInterval = null;
  let videoElement = null;

  console.log('🎬 YouTube Shorts Otomatik Kaydırma eklentisi yüklendi');

  // Video elementini bulur
  function getVideoElement() {
    return document.querySelector('video');
  }

  // Video event listener ekle
  function attachVideoListeners(video) {
    if (!video) {
      console.log('⚠️ Video elementi null');
      return;
    }
    
    console.log('📹 Video elementine listener eklendi, duration:', video.duration);
    
    // Aynı videoya tekrar listener ekleme
    if (video.hasEventListener) {
      console.log('⚠️ Listener zaten var, atlanıyor');
      return;
    }
    
    video.hasEventListener = true;

    // Video bitme eventini dinle
    video.addEventListener('ended', () => {
      console.log('🎬 ENDED event tetiklendi - isEnabled:', isEnabled, 'hasTriggeredSwipe:', hasTriggeredSwipe);
      
      if (!isEnabled || hasTriggeredSwipe) {
        console.log('⚠️ Kaydırma atlandı');
        return;
      }
      
      console.log('✅ Video bitti, bir sonraki videoya geçiliyor...');
      hasTriggeredSwipe = true;
      swipeToNextVideo();
      
      // 3 saniye sonra flag'i sıfırla
      setTimeout(() => {
        hasTriggeredSwipe = false;
        console.log('🔄 Flag sıfırlandı, hazır');
      }, 3000);
    });

    // Video ilerleme eventini de dinle (yedek kontrol)
    let lastProgress = 0;
    video.addEventListener('timeupdate', () => {
      if (!isEnabled || hasTriggeredSwipe) return;
      
      const progress = video.currentTime / video.duration;
      
      // Video %100 olduğunda geç (ended event yedek olarak)
      if (video.duration > 0 && progress >= 0.98 && lastProgress < 0.98) {
        console.log('✅ Video %100 tamamlandı, bir sonraki videoya geçiliyor...');
        hasTriggeredSwipe = true;
        swipeToNextVideo();
        
        setTimeout(() => {
          hasTriggeredSwipe = false;
          console.log('🔄 Flag sıfırlandı, hazır');
        }, 3000);
      }
      lastProgress = progress;
    });
  }

  // Video durumunu kontrol eder
  function checkVideoStatus() {
    videoElement = getVideoElement();
    
    if (!videoElement) {
      return;
    }

    const currentVideoId = window.location.pathname.split('/').pop();
    
    // Yeni video yüklendiğinde
    if (currentVideoId !== lastVideoId && currentVideoId) {
      lastVideoId = currentVideoId;
      console.log('🔄 Yeni video yüklendi:', currentVideoId);
      
      // hasTriggeredSwipe flag'ini sıfırla
      hasTriggeredSwipe = false;
      
      // Video elementini sıfırla ve yeniden listener ekle
      if (videoElement.hasEventListener) {
        videoElement.hasEventListener = false;
        console.log('🔄 Video element listener sıfırlandı');
      }
      attachVideoListeners(videoElement);
    }

    // Video duraklatıldıysa ve görünürse otomatik devam ettir
    if (videoElement.paused && !document.hidden && isEnabled && !hasTriggeredSwipe) {
      videoElement.play();
    }
  }

  // Bir sonraki videoya kaydır
  function swipeToNextVideo() {
    console.log('🚀 Kaydırma işlemi başlatılıyor...');
    
    // Yöntem 1: Sonraki video butonu (hemen dene)
    const nextButton = document.querySelector('button[aria-label*="Sonraki"], button[aria-label*="Next"], button[aria-label*="Skip"]');
    if (nextButton && nextButton.offsetParent !== null) {
      console.log('✅ Sonraki buton bulundu, tıklanıyor...');
      nextButton.click();
      return;
    }

    // Yöntem 2: ArrowDown klavye tuşu
    console.log('⌨️ Arrow Down tuşu deneniyor...');
    const keyboardEvent = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 40,
      which: 40,
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(keyboardEvent);
    
    // Yöntem 3: Page Down tuşu (yedek)
    setTimeout(() => {
      console.log('⌨️ Page Down tuşu deneniyor...');
      const pageDownEvent = new KeyboardEvent('keydown', {
        key: 'PageDown',
        code: 'PageDown',
        keyCode: 34,
        which: 34,
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(pageDownEvent);
    }, 100);
  }

  // Extension için kontrol fonksiyonları
  function startAutoScroll() {
    isEnabled = true;
    console.log('✅ Otomatik kaydırma ETKİNLEŞTİRİLDİ');
    
    // İlk video elementini hemen bul ve listener ekle
    videoElement = getVideoElement();
    const currentVideoId = window.location.pathname.split('/').pop();
    
    if (videoElement && currentVideoId) {
      lastVideoId = currentVideoId;
      console.log('🎬 İlk video ID set edildi:', currentVideoId);
      attachVideoListeners(videoElement);
    }
    
    if (!videoCheckInterval) {
      videoCheckInterval = setInterval(checkVideoStatus, 500);
    }
  }

  function stopAutoScroll() {
    isEnabled = false;
    console.log('⛔ Otomatik kaydırma DEVRE DIŞI');
    
    if (videoCheckInterval) {
      clearInterval(videoCheckInterval);
      videoCheckInterval = null;
    }
  }

  // Popup'dan gelen mesajları dinle
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
      if (request.action === 'toggle') {
        if (isEnabled) {
          stopAutoScroll();
        } else {
          startAutoScroll();
        }
        sendResponse({ enabled: isEnabled });
      } else if (request.action === 'getStatus') {
        sendResponse({ enabled: isEnabled });
      }
      return true;
    } catch (error) {
      console.error('❌ Message listener error:', error);
      sendResponse({ enabled: false });
      return true;
    }
  });

  // Sayfa yüklendiğinde başlat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('📄 DOM yüklendi, başlatılıyor...');
      startAutoScroll();
    });
  } else {
    console.log('⚡ DOM hazır, başlatılıyor...');
    startAutoScroll();
  }
})();
