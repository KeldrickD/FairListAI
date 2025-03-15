import { useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Head>
        <title>Listing Genie - AI-Powered Listing Generator</title>
        <meta name="description" content="Create professional, engaging listings for your products and services with AI assistance." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-indigo-600">Listing Genie</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Create professional, engaging listings for your products and services with AI assistance.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <a
            href="/login"
            className="px-8 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Log In
          </a>
          <a
            href="/register"
            className="px-8 py-3 rounded-md bg-white text-indigo-600 font-medium border border-indigo-200 hover:bg-gray-50 transition-colors"
          >
            Sign Up
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">AI-Powered</h2>
            <p className="text-gray-600">Leverage advanced AI to generate compelling content for your listings.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Time-Saving</h2>
            <p className="text-gray-600">Create professional listings in minutes instead of hours.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Customizable</h2>
            <p className="text-gray-600">Tailor your listings to match your brand and target audience.</p>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 flex justify-center border-t border-gray-200 mt-12">
        <p className="text-gray-500">© {new Date().getFullYear()} Listing Genie. All rights reserved.</p>
      </footer>
    </div>
  );
} 