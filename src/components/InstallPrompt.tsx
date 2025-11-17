import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user has dismissed before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/20">
            <Download className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-1">Install MiningMitra</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Install our app for quick access and offline functionality
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleInstall}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
              >
                Install
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
              >
                Not Now
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-muted rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallPrompt;
