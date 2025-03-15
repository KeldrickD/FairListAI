import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export interface PropertyData {
  propertyType: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
  price: number
  location: string
  features: string[]
  additionalNotes: string
  template?: string
  style?: string
}

interface PropertyFormProps {
  onSubmit: (data: PropertyData) => void
  isLoading: boolean
}

const propertyTypes = [
  { value: 'single-family', label: 'Single-Family Home' },
  { value: 'condo', label: 'Condo/Apartment' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'multi-family', label: 'Multi-Family' },
  { value: 'land', label: 'Land/Lot' },
  { value: 'commercial', label: 'Commercial Property' },
]

const commonFeatures = [
  { id: 'updated-kitchen', label: 'Updated Kitchen' },
  { id: 'hardwood-floors', label: 'Hardwood Floors' },
  { id: 'open-floor-plan', label: 'Open Floor Plan' },
  { id: 'large-backyard', label: 'Large Backyard' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'garage', label: 'Garage' },
  { id: 'central-ac', label: 'Central A/C' },
  { id: 'fireplace', label: 'Fireplace' },
  { id: 'walk-in-closets', label: 'Walk-in Closets' },
  { id: 'smart-home', label: 'Smart Home Features' },
  { id: 'energy-efficient', label: 'Energy Efficient' },
  { id: 'waterfront', label: 'Waterfront' },
]

// Templates and styles
const templates = [
  { value: 'standard', label: 'Standard Listing (200-300 words)' },
  { value: 'short', label: 'Short Listing (100-150 words)' },
  { value: 'luxury', label: 'Luxury Home (300-350 words)' },
  { value: 'investment', label: 'Investment Property' },
  { value: 'new-construction', label: 'New Construction' },
  { value: 'senior', label: '55+ Community' },
  { value: 'vacation', label: 'Vacation Rental' },
  { value: 'fixer-upper', label: 'Fixer-Upper/Foreclosure' },
]

const styles = [
  { value: 'professional', label: 'Standard Professional' },
  { value: 'luxury', label: 'Luxury & High-End' },
  { value: 'investor', label: 'Investor-Friendly' },
  { value: 'casual', label: 'Casual & Friendly' },
  { value: 'seo', label: 'SEO-Optimized' },
  { value: 'storytelling', label: 'Storytelling / Lifestyle' },
  { value: 'social', label: 'Social Media Style' },
]

export function PropertyForm({ onSubmit, isLoading }: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyData>({
    propertyType: '',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    price: 350000,
    location: '',
    features: [],
    additionalNotes: '',
    template: 'standard',
    style: 'professional'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Property Details</h2>
        <p className="text-sm text-gray-500 mb-4">Enter the basic information about the property</p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="squareFeet">Square Feet</Label>
              <Input
                id="squareFeet"
                type="number"
                value={formData.squareFeet}
                onChange={(e) => setFormData(prev => ({ ...prev, squareFeet: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, State"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Features & Amenities</h2>
        <p className="text-sm text-gray-500 mb-4">Select the features that apply to this property</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {commonFeatures.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox
                id={feature.id}
                checked={formData.features.includes(feature.label)}
                onCheckedChange={() => toggleFeature(feature.label)}
              />
              <label
                htmlFor={feature.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {feature.label}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            placeholder="Add any additional details about the property"
            className="resize-none"
            value={formData.additionalNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
          />
          <p className="text-sm text-gray-500">
            Include any special features or selling points not covered above
          </p>
        </div>
      </div>

      <div className="p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Listing Style</h2>
        <p className="text-sm text-gray-500 mb-4">Choose how you want your listing to be written</p>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select
              value={formData.template}
              onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="style">Writing Style</Label>
            <Select
              value={formData.style}
              onValueChange={(value) => setFormData(prev => ({ ...prev, style: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select writing style" />
              </SelectTrigger>
              <SelectContent>
                {styles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Listing'}
      </Button>
    </form>
  )
} 