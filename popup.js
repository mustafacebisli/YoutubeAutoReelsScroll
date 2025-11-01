document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const status = document.getElementById('status');
  const refreshBtn = document.getElementById('refreshBtn');

  // Mevcut durumu al
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
      status.textContent = 'Hata: YouTube Shorts sayfası açık olmalı';
      return;
    }
    
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getStatus' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Send message error:', chrome.runtime.lastError);
        status.textContent = 'Hata: Sayfayı yenileyin';
        return;
      }
      
      if (response && response.enabled) {
        toggleSwitch.classList.add('active');
        status.textContent = 'Açık - Videolar otomatik kaydırılıyor';
      } else {
        toggleSwitch.classList.remove('active');
        status.textContent = 'Kapalı - Manuel kontrol';
      }
    });
  });

  // Toggle butonuna tıklandığında
  toggleSwitch.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error('Error:', chrome.runtime.lastError);
        return;
      }
      
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Send message error:', chrome.runtime.lastError);
          return;
        }
        
        if (response && response.enabled) {
          toggleSwitch.classList.add('active');
          status.textContent = 'Açık - Videolar otomatik kaydırılıyor';
        } else {
          toggleSwitch.classList.remove('active');
          status.textContent = 'Kapalı - Manuel kontrol';
        }
      });
    });
  });

  // Yenile butonuna tıklandığında
  refreshBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error('Error:', chrome.runtime.lastError);
        return;
      }
      
      chrome.tabs.reload(tabs[0].id);
      window.close(); // Popup'ı kapat
    });
  });
});

