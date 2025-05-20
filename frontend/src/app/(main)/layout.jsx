import { Geist, Geist_Mono } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';

const Toaster = dynamic(() => import('react-hot-toast').then((mod) => mod.Toaster), { ssr: false });
const PrelineScript = dynamic(() => import('@/components/PrelineScript').catch(() => () => null), { ssr: false });
const HydrationFixer = dynamic(() => import('@/components/HydrationFixer').catch(() => () => null), { ssr: false });
const Navbar = dynamic(() => import('@/components/navbar').catch(() => () => <div>Navbar failed to load</div>), { ssr: false });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'BuySmart',
  description: 'Compare prices across top Indian e-commerce sites',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-transparent">
        <Toaster position="top-right" />
        <HydrationFixer />
        <Navbar />
        <main>{children}</main>
        <PrelineScript />
      </body>
    </html>
  );
}