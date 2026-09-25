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
  title: 'SkyFusion — Autonomous UAV Swarms & Real-Time 3D Scene Reconstruction',
  description:
    'Turn multi-angle 4K drone video and images into dense 3D point clouds, neural meshes, and sub-centimeter digital twins with real-time telemetry streaming.',
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
      <body className="min-h-screen bg-sf-bg-light dark:bg-sf-bg-dark text-slate-900 dark:text-slate-100 antialiased selection:bg-sf-cyan selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
