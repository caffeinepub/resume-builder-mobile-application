import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';

export default function AuthControls() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      {isAuthenticated && userProfile && (
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{userProfile.name}</span>
        </div>
      )}
      {!isAuthenticated && (
        <span className="hidden sm:inline text-sm text-muted-foreground">Guest Mode</span>
      )}
      <Button
        onClick={handleAuth}
        disabled={disabled}
        variant={isAuthenticated ? 'outline' : 'default'}
        size="sm"
        className="gap-2"
      >
        {loginStatus === 'logging-in' ? (
          'Logging in...'
        ) : isAuthenticated ? (
          <>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Login</span>
          </>
        )}
      </Button>
    </div>
  );
}
