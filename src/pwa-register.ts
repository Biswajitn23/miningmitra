// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

// Handle app install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show install button or banner
  showInstallPromotion();
});

function showInstallPromotion() {
  // Create install button if not exists
  const installBtn = document.getElementById('install-btn');
  if (installBtn) {
    installBtn.style.display = 'block';
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // Clear the deferred prompt
        deferredPrompt = null;
        installBtn.style.display = 'none';
      }
    });
  }
}

// Track install success
window.addEventListener('appinstalled', () => {
  console.log('MiningMitra PWA was installed');
  deferredPrompt = null;
});

// Handle offline/online status
window.addEventListener('online', () => {
  console.log('App is online');
  // You can show a notification or update UI
});

window.addEventListener('offline', () => {
  console.log('App is offline');
  // You can show an offline indicator
});

// Request notification permission (optional)
if ('Notification' in window && navigator.serviceWorker) {
  if (Notification.permission === 'default') {
    // Can request permission when user performs an action
    // Notification.requestPermission();
  }
}

export {};
