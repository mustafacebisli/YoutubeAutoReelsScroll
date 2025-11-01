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
    if (!video || video.hasEventListener) return;
    
    console.log('📹 Video elementine listener eklendi');
    video.hasEventListener = true;

    // Video bitme eventini dinle
    video.addEventListener('ended', () => {
      if (!isEnabled || hasTriggeredSwipe) return;
      
      console.log('✅ Video tamamen bitti, bir sonraki videoya geçiliyor...');
      hasTriggeredSwipe = true;
      swipeToNextVideo();
      
      // 2 saniye sonra flag'i sıfırla
      setTimeout(() => {
        hasTriggeredSwipe = false;
      }, 2000);
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
    if (currentVideoId !== lastVideoId) {
      lastVideoId = currentVideoId;
      console.log('🔄 Yeni video yüklendi:', currentVideoId);
      
      // Video elementini sıfırla ve yeniden listener ekle
      videoElement.hasEventListener = false;
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
    
    // Yöntem 1: Sonraki video butonu
    const nextButton = document.querySelector('button[aria-label*="Sonraki"], button[aria-label*="Next"]');
    if (nextButton && nextButton.offsetParent !== null) {
      console.log('✅ Sonraki buton bulundu, tıklanıyor...');
      nextButton.click();
      return;
    }

    // Yöntem 2: Klavye kısayolu (Arrow Down)
    console.log('⌨️ Klavye kısayolu deneniyor...');
    const videoContainer = document.querySelector('body');
    if (videoContainer) {
      const keyboardEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        code: 'ArrowDown',
        keyCode: 40,
        which: 40,
        bubbles: true,
        cancelable: true
      });
      videoContainer.dispatchEvent(keyboardEvent);
    }

    // Yöntem 3: Page Down tuşu
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

    // Yöntem 4: Scroll ile
    setTimeout(() => {
      console.log('📜 Scroll ile kaydırma deneniyor...');
      window.scrollBy({
        top: window.innerHeight * 0.8,
        behavior: 'smooth'
      });
    }, 200);

    // Yöntem 5: Shorts player container'a tıkla ve kaydır
    setTimeout(() => {
      console.log('🎯 Shorts container ile kaydırma deneniyor...');
      const shortsContainer = document.querySelector('[id*="shorts-player"], ytd-shorts-player');
      if (shortsContainer) {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2
        });
        shortsContainer.dispatchEvent(clickEvent);
        
        window.scrollBy({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
    }, 300);
  }

  // Extension için kontrol fonksiyonları
  function startAutoScroll() {
    isEnabled = true;
    console.log('✅ Otomatik kaydırma ETKİNLEŞTİRİLDİ');
    
    if (!videoCheckInterval) {
      videoCheckInterval = setInterval(checkVideoStatus, 500);
    }

    // İlk video elementini hemen bul ve listener ekle
    videoElement = getVideoElement();
    if (videoElement) {
      attachVideoListeners(videoElement);
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
