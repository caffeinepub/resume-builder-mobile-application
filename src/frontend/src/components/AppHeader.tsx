import { Link } from '@tanstack/react-router';
import { FileText } from 'lucide-react';
import AuthControls from './AuthControls';
import SyncStatusBadge from './SyncStatusBadge';
import PwaInstallControl from './pwa/PwaInstallControl';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
          <FileText className="h-6 w-6 text-primary" />
          <span>Resume Builder</span>
        </Link>
        <div className="flex items-center gap-4">
          <PwaInstallControl />
          <SyncStatusBadge />
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
