import { useState } from 'react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { Button } from '@/components/ui/button';
import { Download, Info } from 'lucide-react';
import PwaInstallInstructionsDialog from './PwaInstallInstructionsDialog';

export default function PwaInstallControl() {
  const { canInstall, isInstalled, isReady, promptInstall } = usePwaInstall();
  const [showInstructions, setShowInstructions] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Don't render until ready to avoid flicker
  if (!isReady) {
    return null;
  }

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // If native prompt is available (Chromium browsers)
  if (canInstall) {
    const handleInstall = async () => {
      setIsInstalling(true);
      await promptInstall();
      setIsInstalling(false);
    };

    return (
      <Button
        onClick={handleInstall}
        disabled={isInstalling}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">{isInstalling ? 'Installing...' : 'Install'}</span>
      </Button>
    );
  }

  // For browsers without native prompt (iOS Safari, etc.)
  // Show instructions button
  return (
    <>
      <Button
        onClick={() => setShowInstructions(true)}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Info className="h-4 w-4" />
        <span className="hidden sm:inline">Install</span>
      </Button>

      <PwaInstallInstructionsDialog
        open={showInstructions}
        onOpenChange={setShowInstructions}
      />
    </>
  );
}
