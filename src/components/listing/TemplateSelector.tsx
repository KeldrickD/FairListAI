import React from 'react'

export interface TemplateOption {
  id: string
  name: string
  description: string
}

export interface StyleOption {
  id: string
  name: string
  description: string
  example: string
}

export interface TemplateSelectorProps {
  selectedTemplate: string
  setSelectedTemplate: (template: string) => void
  selectedStyle: string
  setSelectedStyle: (style: string) => void
}

// Listing templates
const templates: TemplateOption[] = [
  {
    id: 'standard',
    name: 'Standard Listing (200-300 words)',
    description: 'Perfect for Zillow, Realtor.com, and Redfin-style descriptions.'
  },
  {
    id: 'short',
    name: 'Short Listing (100-150 words)',
    description: 'Ideal for social media captions, MLS listings, and quick property overviews.'
  },
  {
    id: 'luxury',
    name: 'Luxury Home (300-350 words)',
    description: 'For high-end properties with premium features and amenities.'
  },
  {
    id: 'investment',
    name: 'Investment Property',
    description: 'Focuses on ROI, rental income, and investment potential.'
  },
  {
    id: 'new-construction',
    name: 'New Construction',
    description: 'Highlights builder features, warranties, and modern amenities.'
  },
  {
    id: 'senior',
    name: '55+ Community',
    description: 'Emphasizes lifestyle, amenities, and low-maintenance living.'
  },
  {
    id: 'vacation',
    name: 'Vacation Rental',
    description: 'Perfect for short-term rentals, highlighting getaway features.'
  },
  {
    id: 'fixer-upper',
    name: 'Fixer-Upper/Foreclosure',
    description: 'Focuses on potential, investment opportunity, and value.'
  }
]

// Writing styles
const styles: StyleOption[] = [
  {
    id: 'professional',
    name: 'Standard Professional',
    description: 'Clear, concise, informative, and engaging.',
    example: 'Welcome to this beautifully maintained 3-bedroom, 2-bath home in [City]! Featuring an open floor plan, gourmet kitchen, and a spacious backyard.'
  },
  {
    id: 'luxury',
    name: 'Luxury & High-End',
    description: 'Elegant, sophisticated, upscale language.',
    example: 'A true masterpiece of modern elegance, this 6-bedroom estate features soaring ceilings, a chef\'s kitchen with Sub-Zero appliances, and breathtaking city views.'
  },
  {
    id: 'investor',
    name: 'Investor-Friendly',
    description: 'Direct, ROI-focused, clear financial value.',
    example: 'Turnkey duplex with strong rental income! This 2-unit property generates $3,500/month in rent and features updated kitchens and separate utilities.'
  },
  {
    id: 'casual',
    name: 'Casual & Friendly',
    description: 'Conversational, engaging, warm tone.',
    example: 'Looking for a home that has it all? This cozy 3-bed, 2-bath gem is waiting for you! With a modern kitchen and huge backyard, it\'s perfect for families.'
  },
  {
    id: 'seo',
    name: 'SEO-Optimized',
    description: 'Keyword-rich, designed for ranking in searches.',
    example: 'Move-in ready 4-bedroom home with open floor plan, modern kitchen, and spacious backyard. This home for sale is close to shopping, dining, and top-rated schools.'
  },
  {
    id: 'storytelling',
    name: 'Storytelling / Lifestyle',
    description: 'Emotional, immersive, paints a picture.',
    example: 'Wake up to ocean breezes and breathtaking sunrise views at this coastal retreat. With floor-to-ceiling windows and a wraparound deck, this sanctuary is the perfect blend of luxury and relaxation.'
  },
  {
    id: 'social',
    name: 'Social Media Style',
    description: 'Short, punchy, high-energy, with emojis.',
    example: '🏡 New Listing Alert! ✨ 3-Bed, 2-Bath | Move-In Ready 🔥 Updated kitchen | Big backyard | Prime location'
  }
]

export function TemplateSelector({
  selectedTemplate,
  setSelectedTemplate,
  selectedStyle,
  setSelectedStyle
}: TemplateSelectorProps) {
  const [activeTab, setActiveTab] = React.useState<'templates' | 'styles'>('templates')

  return (
    <div className="w-full">
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'templates' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('templates')}
        >
          Listing Templates
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'styles' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('styles')}
        >
          Writing Styles
        </button>
      </div>
      
      {activeTab === 'templates' && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Choose a Listing Template</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select the template that best fits your property type
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="flex items-start space-x-2">
                <input
                  type="radio"
                  id={`template-${template.id}`}
                  name="template"
                  value={template.id}
                  checked={selectedTemplate === template.id}
                  onChange={() => setSelectedTemplate(template.id)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor={`template-${template.id}`} className="font-medium">
                    {template.name}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'styles' && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Choose a Writing Style</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select the tone and style for your listing
          </p>
          <div className="space-y-4">
            {styles.map((style) => (
              <div key={style.id} className="flex flex-col space-y-2 border rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id={`style-${style.id}`}
                    name="style"
                    value={style.id}
                    checked={selectedStyle === style.id}
                    onChange={() => setSelectedStyle(style.id)}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor={`style-${style.id}`} className="font-medium">
                      {style.name}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {style.description}
                    </p>
                  </div>
                </div>
                <div className="ml-6 mt-2 text-sm italic bg-muted p-3 rounded">
                  Example: "{style.example}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 