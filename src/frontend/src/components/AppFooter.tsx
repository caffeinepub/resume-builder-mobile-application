import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';

export default function AppFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30 py-8 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            © 2026. Built with <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors underline underline-offset-4"
            >
              caffeine.ai
            </a>
          </p>
          <nav className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
