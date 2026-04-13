import type { Metadata } from 'next'
import { Orbitron, Noto_Sans_TC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: '--font-orbitron',
  weight: ['400', '500', '600', '700', '800', '900']
});

const notoSansTC = Noto_Sans_TC({ 
  subsets: ["latin"],
  variable: '--font-noto-sans-tc',
  weight: ['400', '500', '700']
});

export const metadata: Metadata = {
  title: 'Abstract Server Web | 抽象伺服器',
  description: '在月色與海洋之間，探索無限可能的 Minecraft 世界',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${notoSansTC.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
