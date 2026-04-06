import type { Metadata, Viewport } from 'next'
import { Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const notoSans = Noto_Sans_SC({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

const notoSerif = Noto_Serif_SC({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
})

export const metadata: Metadata = {
  title: {
    default: '量角器 — 设计引领 精准落地',
    template: '%s | 量角器',
  },
  description: '设计师主导的全流程装饰交付体系。设计即承诺，标准即底线，透明即信任。',
  keywords: ['装修', '设计', '家装', '量角器', '西安装修', '标准化施工'],
  authors: [{ name: '量角器 Protractor Design & Build' }],
  openGraph: {
    title: '量角器 — 设计引领 精准落地',
    description: '设计师主导的全流程装饰交付体系',
    type: 'website',
    locale: 'zh_CN',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1a1a1a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="min-h-dvh bg-neutral-50 font-sans text-neutral-900 antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
