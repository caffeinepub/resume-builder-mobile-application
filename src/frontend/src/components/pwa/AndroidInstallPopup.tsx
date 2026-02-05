import { useEffect, useState } from 'react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { useAndroidInstallPopupCooldown } from '../../hooks/useAndroidInstallPopupCooldown';
import { isAndroid } from '../../utils/platform';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

export default function AndroidInstallPopup() {
  const { canInstall, isInstalled, promptInstall } = usePwaInstall();
  const { isDismissed, dismiss, clearDismissal } = useAndroidInstallPopupCooldown();
  const [open, setOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Only show on Android
    if (!isAndroid()) {
      return;
    }

    // Show popup if:
    // - App is installable (canInstall is true)
    // - App is not already installed
    // - User hasn't dismissed it recently
    if (canInstall && !isInstalled && !isDismissed) {
      // Small delay to avoid showing immediately on page load
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [canInstall, isInstalled, isDismissed]);

  // Clear dismissal state when app becomes installed
  useEffect(() => {
    if (isInstalled) {
      clearDismissal();
      setOpen(false);
    }
  }, [isInstalled, clearDismissal]);

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await promptInstall();
    setIsInstalling(false);

    if (success) {
      // Installation accepted, close popup and clear dismissal
      setOpen(false);
      clearDismissal();
    } else {
      // User dismissed the native prompt, close our popup too
      setOpen(false);
    }
  };

  const handleDismiss = () => {
    dismiss();
    setOpen(false);
  };

  // Don't render on non-Android platforms
  if (!isAndroid()) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        handleDismiss();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Install Resume Builder
          </DialogTitle>
          <DialogDescription className="pt-2">
            Install this app on your device for quick access and a better experience. 
            It works offline and launches like a native app.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Not now
          </Button>
          <Button
            onClick={handleInstall}
            disabled={isInstalling}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            {isInstalling ? 'Installing...' : 'Install'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
