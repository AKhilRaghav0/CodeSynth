import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CodeSynth - CP Progress Tracker',
  description: 'Track your competitive programming progress and get AI-powered problem recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        <main className="min-h-screen bg-base-100">
          {children}
        </main>
      </body>
    </html>
  )
} 