import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from "@/components/Header/Header";
import AppProvider from "@/provider/AppProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Buy glasses or sunglasses - E-Shop',
  description: 'Buy glasses or sunglasses, E-Shop',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className={inter.className}>
      <AppProvider>
        <Header/>
      {children}
    </AppProvider>
      </body>
    </html>
  )
}
