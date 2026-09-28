import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SkyFusion — Single-Pass UAV 3D Reconstruction Platform',
  description:
    'Turn a single UAV flight into an interactive spatial 3D reconstruction with dense neural point clouds, pose estimation, and real-time telemetry streaming.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-sf-canvas-light dark:bg-sf-canvas-dark text-slate-900 dark:text-[#F1F8F9] antialiased selection:bg-sf-sky-soft selection:text-sf-dark-primary font-sans transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
