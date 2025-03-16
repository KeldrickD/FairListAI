import React from 'react'
import Link from 'next/link'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            FairListAI
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-primary">
              Dashboard
            </Link>
            <Link href="/new-listing" className="text-gray-600 hover:text-primary">
              New Listing
            </Link>
            <Link href="/settings" className="text-gray-600 hover:text-primary">
              Settings
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="text-sm font-medium">KD</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} FairListAI. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-primary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 