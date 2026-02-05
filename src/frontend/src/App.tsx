import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/AppLayout';
import ResumesDashboard from './pages/ResumesDashboard';
import ResumeEditor from './pages/ResumeEditor';
import PrivacyPolicy from './pages/PrivacyPolicy';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ResumesDashboard,
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor/$resumeId',
  component: ResumeEditor,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPolicy,
});

const routeTree = rootRoute.addChildren([indexRoute, editorRoute, privacyRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
