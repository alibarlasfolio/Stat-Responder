import type { ReactNode } from 'react';
import Header from './Header';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-100 dark:bg-gray-800 py-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Stat Responder. All rights reserved.</p>
      </footer>
    </div>
  );
}
