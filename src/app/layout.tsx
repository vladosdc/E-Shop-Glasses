import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from "@/components/Header/Header";
import AppProvider from "@/provider/AppProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Buy glasses or sunglasses - E-Shop',
  description: 'Buy glasses or sunglasses, E-Shop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
      <AppProvider>
        <Header/>
      {children}
    </AppProvider>
      </body>
    </html>
  )
}
