import React, { useState } from 'react';
import { Download, FileText, Copy, CheckCheck, Share2 } from 'lucide-react';
import { hasFeature } from '@/lib/utils';
import { ListingItem } from '@/lib/services/listingService';

interface WhiteLabelExportProps {
  listing: ListingItem;
}

const WhiteLabelExport: React.FC<WhiteLabelExportProps> = ({ listing }) => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2F5DE3'); // Default to app blue
  const [secondaryColor, setSecondaryColor] = useState('#C7BAF5');
  const [isLoading, setIsLoading] = useState(false);
  const [isExported, setIsExported] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Check if user has access to White Label Exports
  const subscription = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('userSubscription') || 'null')
    : null;
  
  const hasAccess = hasFeature(subscription, 'White-label Exports');

  if (!hasAccess) {
    return (
      <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
        <h3 className="text-lg font-medium text-amber-800 mb-2">Business Plan Feature</h3>
        <p className="text-amber-700 mb-4">
          White Label Exports are available exclusively for Business plan subscribers.
        </p>
        <a
          href="/premium"
          className="inline-block px-4 py-2 bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700"
        >
          Upgrade to Business
        </a>
      </div>
    );
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = () => {
    setIsLoading(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      setIsLoading(false);
      setIsExported(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsExported(false);
      }, 3000);
    }, 2000);
  };

  const handleCopyToClipboard = () => {
    const listingText = `
${listing.title}
${listing.location}
${listing.bedrooms} bed, ${listing.bathrooms} bath
$${listing.price.toLocaleString()}

${listing.description}

Contact ${companyName}
${contactInfo}
    `.trim();
    
    navigator.clipboard.writeText(listingText);
    alert('Listing copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h2 className="text-xl font-bold flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          White Label Export
        </h2>
      </div>
      
      <div className="p-6">
        <p className="text-gray-600 mb-6">
          Customize and export this listing with your own branding for marketing materials.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 border rounded flex items-center justify-center bg-gray-50">
                {customLogo ? (
                  <img src={customLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-gray-400 text-xs text-center">No logo</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <label
                  htmlFor="logo"
                  className="inline-block px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm cursor-pointer hover:bg-gray-300"
                >
                  Upload Logo
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Your Real Estate Company"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Information
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="email@example.com | (555) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Brand Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 border-0 p-0 cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={generatePDF}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>Generating...</>
            ) : isExported ? (
              <>
                <CheckCheck className="h-5 w-5 mr-2" />
                Generated!
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Export PDF
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
          >
            <Copy className="h-5 w-5 mr-2" />
            Copy Text
          </button>
          
          <button
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </button>
        </div>
        
        {showPreview && (
          <div className="mt-8 border rounded-lg p-6" style={{ borderColor: primaryColor }}>
            <div className="flex justify-between items-center mb-6">
              {customLogo && (
                <img src={customLogo} alt="Company Logo" className="h-16 object-contain" />
              )}
              <div style={{ color: primaryColor }} className="text-right">
                <h3 className="font-bold text-lg">{companyName || 'Your Company'}</h3>
                <p>{contactInfo || 'Contact Information'}</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>
              {listing.title}
            </h2>
            <p className="text-gray-600 mb-4">{listing.location}</p>
            
            <div className="flex justify-between mb-6">
              <span>{listing.bedrooms} bed • {listing.bathrooms} bath</span>
              <span className="font-bold">${listing.price.toLocaleString()}</span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p>{listing.description}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t" style={{ borderColor: secondaryColor }}>
              <p className="text-sm text-gray-500">
                This listing is brought to you by {companyName || 'Your Company'}. 
                Contact us at {contactInfo || 'your contact info'} for more information.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhiteLabelExport; 