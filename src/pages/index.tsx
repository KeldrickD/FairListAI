import { useEffect } from 'react';
import Head from 'next/head';
import { ArrowRight, Clock, Sparkles, RefreshCw, PenTool } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Head>
        <title>Listing Genie - Your Personal Listing Assistant</title>
        <meta name="description" content="Your personal listing assistant. Upload a listing → get automatic property descriptions, social captions, ad copy, email blasts, and neighborhood insights." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20">
        <div className="text-center max-w-4xl mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            <span className="text-[#2F5DE3]">Listing Genie</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-4">
            Your wish for better listings—granted.
          </p>
          
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload a listing → get automatic property descriptions, social captions, ad copy, email blasts, and neighborhood insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
            <a
              href="/register"
              className="px-8 py-3 rounded-md bg-[#2F5DE3] text-white font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="/premium"
              className="px-8 py-3 rounded-md bg-white text-[#2F5DE3] font-medium border border-indigo-200 hover:bg-gray-50 transition-colors"
            >
              View Pricing
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <Sparkles className="h-6 w-6 text-[#43D8B6] mr-2" />
              <h2 className="text-xl font-semibold">AI-Powered</h2>
            </div>
            <p className="text-gray-600">Say goodbye to writer's block. Get polished, professional listing copy in seconds.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-[#43D8B6] mr-2" />
              <h2 className="text-xl font-semibold">Time-Saving</h2>
            </div>
            <p className="text-gray-600">Save 5+ hours per week on listing descriptions and marketing content.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <RefreshCw className="h-6 w-6 text-[#43D8B6] mr-2" />
              <h2 className="text-xl font-semibold">Multi-Channel</h2>
            </div>
            <p className="text-gray-600">Create content for MLS, social media, emails, and ads—all at once.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <PenTool className="h-6 w-6 text-[#43D8B6] mr-2" />
              <h2 className="text-xl font-semibold">Customizable</h2>
            </div>
            <p className="text-gray-600">Descriptions that match your brand voice and highlight what matters.</p>
          </div>
        </div>
        
        <div className="max-w-4xl w-full bg-[#C7BAF5] bg-opacity-20 rounded-lg p-8 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Solve the Pain of Writing Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="mb-4">Writing compelling, unique property descriptions is time-consuming—and many agents default to overused words like "cozy," "spacious," or "must-see."</p>
              <p>This AI-powered tool generates polished, professional listing copy in seconds from a few bullet points (e.g., bed/bath count, home style, standout features).</p>
            </div>
            <div>
              <p className="mb-4">Perfect for MLS listings, social media, flyers, and email campaigns—helping agents stand out in a crowded market.</p>
              <p>More engaging listings = more showings and offers.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 flex justify-center border-t border-gray-200">
        <p className="text-gray-500">© {new Date().getFullYear()} Listing Genie. All rights reserved.</p>
      </footer>
    </div>
  );
} 