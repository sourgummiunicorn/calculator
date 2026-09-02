import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Everyday Calculator',
  description: 'A clean, keyboard-friendly calculator for everyday math.',
  openGraph: {
    title: 'Everyday Calculator',
    description: 'Simple math, beautifully done.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Everyday Calculator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Everyday Calculator',
    description: 'Simple math, beautifully done.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
