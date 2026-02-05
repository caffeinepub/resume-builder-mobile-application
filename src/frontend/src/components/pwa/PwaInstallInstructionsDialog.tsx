import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Smartphone, Monitor, Share } from 'lucide-react';

interface PwaInstallInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PwaInstallInstructionsDialog({
  open,
  onOpenChange,
}: PwaInstallInstructionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Install Resume Builder</DialogTitle>
          <DialogDescription>
            Install this app on your device for quick access and offline use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* iOS Safari */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <Smartphone className="h-5 w-5 text-primary" />
              <span>iPhone / iPad (Safari)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground pl-7">
              <li>Tap the <Share className="inline h-3.5 w-3.5 mx-0.5" /> Share button</li>
              <li>Scroll down and tap "Add to Home Screen"</li>
              <li>Tap "Add" to confirm</li>
            </ol>
          </div>

          {/* Android Chrome */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <Smartphone className="h-5 w-5 text-primary" />
              <span>Android (Chrome)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground pl-7">
              <li>Tap the three dots menu (⋮)</li>
              <li>Select "Install app" or "Add to Home screen"</li>
              <li>Tap "Install" to confirm</li>
            </ol>
          </div>

          {/* Desktop */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <Monitor className="h-5 w-5 text-primary" />
              <span>Desktop (Chrome / Edge / Brave)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground pl-7">
              <li>Look for the install icon in the address bar</li>
              <li>Or open the browser menu and choose "Install Resume Builder"</li>
              <li>Click "Install" to confirm</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
