import React, { useState, useEffect } from 'react';
import { hasFeature } from '@/lib/utils';
import { ListingItem } from '@/lib/services/listingService';

interface SEOOptimizationProps {
  listing?: ListingItem;
}

interface SEOSuggestion {
  id: string;
  type: 'title' | 'description' | 'keywords' | 'content' | 'technical';
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  implemented: boolean;
}

const SEOOptimization: React.FC<SEOOptimizationProps> = ({ listing }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<SEOSuggestion[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('suggestions');

  useEffect(() => {
    // Check if user has premium SEO optimization feature
    if (typeof window !== 'undefined') {
      const savedSubscription = localStorage.getItem('userSubscription');
      if (savedSubscription) {
        const subscription = JSON.parse(savedSubscription);
        setHasAccess(hasFeature(subscription, 'Premium SEO optimization'));
      }
    }
  }, []);

  // Function to analyze SEO
  const analyzeSEO = () => {
    if (!listing) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate demo data
      const demoSuggestions: SEOSuggestion[] = [
        {
          id: '1',
          type: 'title',
          suggestion: 'Add location to title for better local SEO',
          impact: 'high',
          implemented: false
        },
        {
          id: '2',
          type: 'description',
          suggestion: 'Include more specific amenities in the description',
          impact: 'medium',
          implemented: false
        },
        {
          id: '3',
          type: 'keywords',
          suggestion: 'Add "luxury" and "modern" to keywords for targeting upscale buyers',
          impact: 'high',
          implemented: false
        },
        {
          id: '4',
          type: 'content',
          suggestion: 'Add more neighborhood information to appeal to relocating families',
          impact: 'medium',
          implemented: false
        },
        {
          id: '5',
          type: 'technical',
          suggestion: 'Optimize images with alt tags describing property features',
          impact: 'medium',
          implemented: false
        },
        {
          id: '6',
          type: 'content',
          suggestion: 'Include virtual tour availability in the listing',
          impact: 'high',
          implemented: false
        }
      ];
      
      // Demo keywords
      const demoKeywords = ['real estate', 'property', 'for sale', 'bedrooms', 'bathrooms'];
      
      // Demo score (between 50-75)
      const demoScore = Math.floor(Math.random() * 26) + 50;
      
      setSuggestions(demoSuggestions);
      setKeywords(demoKeywords);
      setSeoScore(demoScore);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Function to toggle implementation status of a suggestion
  const toggleImplemented = (id: string) => {
    setSuggestions(suggestions.map(suggestion => 
      suggestion.id === id 
        ? { ...suggestion, implemented: !suggestion.implemented } 
        : suggestion
    ));
    
    // Recalculate score - implemented suggestions improve score
    const implementedCount = suggestions.filter(s => s.implemented).length + 
      (suggestions.find(s => s.id === id)?.implemented ? -1 : 1);
    const totalSuggestions = suggestions.length;
    const implementationBonus = Math.floor((implementedCount / totalSuggestions) * 25);
    setSeoScore(Math.min(50 + implementationBonus, 100));
  };

  // Function to add a new keyword
  const addKeyword = () => {
    if (newKeyword.trim() !== '' && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  // Function to remove a keyword
  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  if (!hasAccess) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-100">
        <h3 className="text-xl font-semibold text-amber-900 mb-3">
          Premium SEO Optimization
        </h3>
        <p className="text-amber-800 mb-4">
          Upgrade to the Business plan to access premium SEO optimization tools that will help your listings rank higher in search results.
        </p>
        <a 
          href="/premium" 
          className="inline-block px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
        >
          Upgrade Now
        </a>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-3">Premium SEO Optimization</h3>
        <p className="text-gray-600 mb-4">
          Select a listing to analyze and optimize its SEO.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Premium SEO Optimization</h3>
      
      {/* SEO Score */}
      {seoScore !== null && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-medium">SEO Score</span>
            <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                seoScore >= 80 
                  ? 'bg-green-500' 
                  : seoScore >= 60 
                    ? 'bg-amber-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${seoScore}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-sm text-gray-600">
            <span>0</span>
            <span className="font-medium">{seoScore}/100</span>
            <span>100</span>
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        {seoScore === null ? (
          <button
            onClick={analyzeSEO}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze SEO'}
          </button>
        ) : (
          <button
            onClick={analyzeSEO}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : 'Re-analyze SEO'}
          </button>
        )}
        
        {seoScore !== null && (
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Export Report
          </button>
        )}
      </div>
      
      {/* Tabs */}
      {seoScore !== null && (
        <>
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6">
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`pb-3 px-1 ${
                  activeTab === 'suggestions'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Suggestions
              </button>
              <button
                onClick={() => setActiveTab('keywords')}
                className={`pb-3 px-1 ${
                  activeTab === 'keywords'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Keywords
              </button>
            </nav>
          </div>
          
          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Improvement Suggestions</h4>
              <div className="space-y-4">
                {suggestions.map(suggestion => (
                  <div 
                    key={suggestion.id} 
                    className={`p-4 rounded-lg border ${
                      suggestion.implemented 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium mb-2 ${
                          suggestion.impact === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : suggestion.impact === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {suggestion.impact.charAt(0).toUpperCase() + suggestion.impact.slice(1)} Impact
                        </span>
                        <span className="inline-block px-2 py-1 text-xs rounded-full font-medium mb-2 ml-2 bg-gray-100 text-gray-800">
                          {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                        </span>
                        <p className="text-gray-800">{suggestion.suggestion}</p>
                      </div>
                      <button
                        onClick={() => toggleImplemented(suggestion.id)}
                        className={`px-3 py-1 text-sm rounded ${
                          suggestion.implemented
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {suggestion.implemented ? 'Implemented' : 'Implement'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Keywords Tab */}
          {activeTab === 'keywords' && (
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Target Keywords</h4>
              <div className="mb-4">
                <div className="flex">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add a keyword..."
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                  >
                    <span className="text-gray-800">{keyword}</span>
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {keywords.length === 0 && (
                  <p className="text-gray-500 italic">No keywords added yet</p>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h5 className="font-medium text-blue-800 mb-2">Keyword Best Practices</h5>
                <ul className="list-disc text-sm text-blue-700 pl-5 space-y-1">
                  <li>Include location-specific keywords</li>
                  <li>Use property features as keywords (bedrooms, pool, etc.)</li>
                  <li>Consider buyer intent keywords (affordable homes, luxury condos)</li>
                  <li>Aim for 5-8 targeted keywords per listing</li>
                  <li>Balance competitive and long-tail keywords</li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SEOOptimization; 