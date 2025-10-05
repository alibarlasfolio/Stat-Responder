import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppLayout from '@/components/layout/AppLayout';
import { UserDataProvider } from '@/context/UserDataContext';
import { FirebaseProvider } from '@/context/FirebaseContext';

export const metadata: Metadata = {
  title: 'Stat Responder',
  description: 'Your personal emergency assistant.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseProvider>
          <UserDataProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
          </UserDataProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
