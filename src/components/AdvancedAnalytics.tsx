import React, { useState, useEffect } from 'react';
import { hasFeature } from '@/lib/utils';

interface AdvancedAnalyticsProps {
  listingId?: string;
}

interface AnalyticsData {
  views: number[];
  inquiries: number[];
  favorites: number[];
  shares: number[];
  timeOnPage: number[];
}

interface DemographicData {
  age: Record<string, number>;
  income: Record<string, number>;
  interests: Record<string, number>;
  location: Record<string, number>;
}

interface CompetitorData {
  name: string;
  price: number;
  daysOnMarket: number;
  views: number;
  features: string[];
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ listingId }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [demographicData, setDemographicData] = useState<DemographicData | null>(null);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [activeTab, setActiveTab] = useState('performance');
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    // Check if user has advanced analytics feature
    if (typeof window !== 'undefined') {
      const savedSubscription = localStorage.getItem('userSubscription');
      if (savedSubscription) {
        const subscription = JSON.parse(savedSubscription);
        setHasAccess(hasFeature(subscription, 'Advanced analytics'));
      }
    }
  }, []);

  // Function to load analytics data
  const loadAnalyticsData = () => {
    if (!listingId) return;
    
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate demo performance data
      const demoAnalytics: AnalyticsData = {
        views: generateRandomData(30, 10, 50),
        inquiries: generateRandomData(30, 0, 5),
        favorites: generateRandomData(30, 1, 8),
        shares: generateRandomData(30, 0, 3),
        timeOnPage: generateRandomData(30, 30, 120)
      };
      
      // Generate demo demographic data
      const demoDemographics: DemographicData = {
        age: {
          '18-24': 15,
          '25-34': 35,
          '35-44': 25,
          '45-54': 15,
          '55+': 10
        },
        income: {
          'Under $50k': 10,
          '$50k-$75k': 20,
          '$75k-$100k': 30,
          '$100k-$150k': 25,
          'Over $150k': 15
        },
        interests: {
          'Family homes': 35,
          'Investment properties': 25,
          'Luxury properties': 20,
          'First-time buyers': 15,
          'Vacation homes': 5
        },
        location: {
          'Local (within 10mi)': 40,
          'Regional (within 50mi)': 30,
          'Out of state': 25,
          'International': 5
        }
      };
      
      // Generate demo competitor data
      const demoCompetitors: CompetitorData[] = [
        {
          name: '123 Maple Street',
          price: 425000,
          daysOnMarket: 12,
          views: 245,
          features: ['4 bed', '3 bath', 'Pool', 'Updated kitchen']
        },
        {
          name: '456 Oak Avenue',
          price: 399000,
          daysOnMarket: 24,
          views: 180,
          features: ['3 bed', '2 bath', 'Large yard', 'Garage']
        },
        {
          name: '789 Pine Lane',
          price: 450000,
          daysOnMarket: 8,
          views: 310,
          features: ['4 bed', '2.5 bath', 'Modern design', 'Fireplace']
        }
      ];
      
      setAnalyticsData(demoAnalytics);
      setDemographicData(demoDemographics);
      setCompetitors(demoCompetitors);
      setIsLoading(false);
    }, 1500);
  };

  // Function to generate random data for charts
  const generateRandomData = (length: number, min: number, max: number): number[] => {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  };

  // Function to format date for x-axis labels
  const formatDate = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Update date range and reload data
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    loadAnalyticsData();
  };

  if (!hasAccess) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-100">
        <h3 className="text-xl font-semibold text-purple-900 mb-3">
          Advanced Analytics
        </h3>
        <p className="text-purple-800 mb-4">
          Upgrade to the Business plan to access advanced analytics with detailed performance metrics, demographic insights, and competitor analysis.
        </p>
        <a 
          href="/premium" 
          className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Upgrade Now
        </a>
      </div>
    );
  }

  if (!listingId) {
    return (
      <div className="p-6 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
        <p className="text-gray-600 mb-4">
          Select a listing to view its detailed analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Advanced Analytics</h3>
      
      {/* Date Range Selector */}
      <div className="mb-6 flex justify-between items-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => handleDateRangeChange('7days')}
            className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg ${
              dateRange === '7days' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            7 Days
          </button>
          <button
            type="button"
            onClick={() => handleDateRangeChange('30days')}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-200 ${
              dateRange === '30days' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            30 Days
          </button>
          <button
            type="button"
            onClick={() => handleDateRangeChange('90days')}
            className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg ${
              dateRange === '90days' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            90 Days
          </button>
        </div>
        
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
        >
          Export Report
        </button>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('performance')}
            className={`pb-3 px-1 ${
              activeTab === 'performance'
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('demographics')}
            className={`pb-3 px-1 ${
              activeTab === 'demographics'
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Demographics
          </button>
          <button
            onClick={() => setActiveTab('competitors')}
            className={`pb-3 px-1 ${
              activeTab === 'competitors'
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Competitors
          </button>
        </nav>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="text-gray-500">Loading analytics data...</div>
        </div>
      ) : (
        <>
          {!analyticsData ? (
            <div className="text-center py-10">
              <p className="text-gray-600 mb-4">No analytics data available yet.</p>
              <button
                onClick={loadAnalyticsData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Load Analytics
              </button>
            </div>
          ) : (
            <>
              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-sm text-gray-500 mb-1">Total Views</h4>
                      <p className="text-3xl font-bold text-gray-800">
                        {analyticsData.views.reduce((sum, val) => sum + val, 0)}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        +12% from previous period
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-sm text-gray-500 mb-1">Inquiries</h4>
                      <p className="text-3xl font-bold text-gray-800">
                        {analyticsData.inquiries.reduce((sum, val) => sum + val, 0)}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        +5% from previous period
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-sm text-gray-500 mb-1">Favorites</h4>
                      <p className="text-3xl font-bold text-gray-800">
                        {analyticsData.favorites.reduce((sum, val) => sum + val, 0)}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        -3% from previous period
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-sm text-gray-500 mb-1">Avg. Time on Page</h4>
                      <p className="text-3xl font-bold text-gray-800">
                        {Math.round(analyticsData.timeOnPage.reduce((sum, val) => sum + val, 0) / analyticsData.timeOnPage.length)}s
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        +20% from previous period
                      </p>
                    </div>
                  </div>
                  
                  {/* Views Chart */}
                  <div className="mb-8">
                    <h4 className="font-medium text-gray-700 mb-4">Views Over Time</h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-64">
                      <div className="h-full flex items-end">
                        {analyticsData.views.slice(-14).map((value, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-blue-500" 
                              style={{ 
                                height: `${(value / 50) * 100}%`,
                                maxWidth: '20px',
                                margin: '0 auto'
                              }}
                            ></div>
                            <div className="text-xs text-gray-500 mt-2">
                              {formatDate(14 - index - 1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Engagement Metrics */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-4">Engagement Metrics</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Views
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Inquiries
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Favorites
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Shares
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {[...Array(7)].map((_, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(6 - index)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {analyticsData.views[index]}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {analyticsData.inquiries[index]}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {analyticsData.favorites[index]}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {analyticsData.shares[index]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Demographics Tab */}
              {activeTab === 'demographics' && demographicData && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Age Distribution */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-4">Age Distribution</h4>
                      {Object.entries(demographicData.age).map(([range, percentage]) => (
                        <div key={range} className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">{range}</span>
                            <span className="text-sm font-medium text-gray-800">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Income Distribution */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-4">Income Distribution</h4>
                      {Object.entries(demographicData.income).map(([range, percentage]) => (
                        <div key={range} className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">{range}</span>
                            <span className="text-sm font-medium text-gray-800">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-green-600 h-2.5 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Interests */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-4">Buyer Interests</h4>
                      {Object.entries(demographicData.interests).map(([interest, percentage]) => (
                        <div key={interest} className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">{interest}</span>
                            <span className="text-sm font-medium text-gray-800">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-purple-600 h-2.5 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Location */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-4">Viewer Location</h4>
                      {Object.entries(demographicData.location).map(([location, percentage]) => (
                        <div key={location} className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">{location}</span>
                            <span className="text-sm font-medium text-gray-800">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-orange-600 h-2.5 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Insights */}
                  <div className="mt-6 p-5 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-3">Audience Insights</h4>
                    <ul className="list-disc text-blue-700 pl-5 space-y-2">
                      <li>Your listing is most popular with buyers in the 25-34 age range with incomes of $75k-$100k</li>
                      <li>You're attracting more local interest (40%) than the market average (30%)</li>
                      <li>Consider highlighting family-friendly features as 35% of your audience is interested in family homes</li>
                      <li>Out-of-state interest is high (25%) - consider highlighting relocation benefits</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Competitors Tab */}
              {activeTab === 'competitors' && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Similar Listings in Your Area</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Days on Market
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Views
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Key Features
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {competitors.map((competitor, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {competitor.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${competitor.price.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {competitor.daysOnMarket}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {competitor.views}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="flex flex-wrap gap-1">
                                {competitor.features.map((feature, i) => (
                                  <span 
                                    key={i}
                                    className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-full"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Competitive Analysis */}
                  <div className="mt-6 p-5 bg-green-50 rounded-lg border border-green-100">
                    <h4 className="font-medium text-green-800 mb-3">Competitive Analysis</h4>
                    <ul className="list-disc text-green-700 pl-5 space-y-2">
                      <li>Your listing is priced 5% below similar properties in your area</li>
                      <li>Properties with updated kitchens in your area sell 15% faster</li>
                      <li>Listings that highlight "modern design" receive 30% more views</li>
                      <li>Recommendation: Add virtual staging photos to increase viewer engagement</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdvancedAnalytics; 