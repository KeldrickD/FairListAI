import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface PropertyFormProps {
  onSubmit: (data: PropertyData) => void
  isLoading?: boolean
}

export interface PropertyData {
  bedrooms: number
  bathrooms: number
  squareFeet: number
  propertyType: string
  features: string[]
  location: string
  price: number
  yearBuilt?: number
  lotSize?: string
  neighborhood?: string
  schools?: string
  stylePreference?: string
  targetAudience?: string
  additionalNotes: string
  includeFairHousingCompliance: boolean
  includeSeoOptimization: boolean
  includeSocialMedia: boolean
}

export function PropertyForm({ onSubmit, isLoading = false }: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyData>({
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 0,
    propertyType: '',
    features: [],
    location: '',
    price: 0,
    yearBuilt: undefined,
    lotSize: '',
    neighborhood: '',
    schools: '',
    stylePreference: 'professional',
    targetAudience: '',
    additionalNotes: '',
    includeFairHousingCompliance: true,
    includeSeoOptimization: true,
    includeSocialMedia: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleFeatureAdd = (feature: string) => {
    if (feature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            min="0"
            value={formData.bedrooms}
            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            type="number"
            min="0"
            step="0.5"
            value={formData.bathrooms}
            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseFloat(e.target.value) }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="squareFeet">Square Feet</Label>
          <Input
            id="squareFeet"
            type="number"
            min="0"
            value={formData.squareFeet}
            onChange={(e) => setFormData(prev => ({ ...prev, squareFeet: parseInt(e.target.value) }))}
            required
          />
        </div>
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
              <SelectItem value="single-family">Single Family</SelectItem>
              <SelectItem value="multi-family">Multi Family</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearBuilt">Year Built</Label>
          <Input
            id="yearBuilt"
            type="number"
            min="1800"
            max={new Date().getFullYear()}
            value={formData.yearBuilt || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              yearBuilt: e.target.value ? parseInt(e.target.value) : undefined 
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lotSize">Lot Size</Label>
          <Input
            id="lotSize"
            type="text"
            placeholder="e.g., 0.25 acres"
            value={formData.lotSize || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, lotSize: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="neighborhood">Neighborhood/Area</Label>
        <Input
          id="neighborhood"
          type="text"
          placeholder="e.g., Downtown, Westside, etc."
          value={formData.neighborhood || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schools">Nearby Schools</Label>
        <Input
          id="schools"
          type="text"
          placeholder="e.g., Lincoln Elementary, Washington High School"
          value={formData.schools || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, schools: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Key Features</Label>
        <div className="flex gap-2">
          <Input
            id="features"
            type="text"
            placeholder="Add a feature (e.g., 'Modern Kitchen')"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleFeatureAdd((e.target as HTMLInputElement).value)
                ;(e.target as HTMLInputElement).value = ''
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const input = document.getElementById('features') as HTMLInputElement
              handleFeatureAdd(input.value)
              input.value = ''
            }}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.features.map((feature, index) => (
            <div
              key={index}
              className="bg-secondary px-2 py-1 rounded-md flex items-center gap-1"
            >
              <span>{feature}</span>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    features: prev.features.filter((_, i) => i !== index)
                  }))
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stylePreference">Writing Style</Label>
        <Select
          value={formData.stylePreference}
          onValueChange={(value) => setFormData(prev => ({ ...prev, stylePreference: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select writing style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="casual">Casual & Friendly</SelectItem>
            <SelectItem value="luxury">Luxury & Upscale</SelectItem>
            <SelectItem value="minimalist">Concise & Minimal</SelectItem>
            <SelectItem value="enthusiastic">Enthusiastic & Engaging</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAudience">Target Audience</Label>
        <Input
          id="targetAudience"
          type="text"
          placeholder="e.g., First-time buyers, Investors, Luxury buyers"
          value={formData.targetAudience || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalNotes">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          value={formData.additionalNotes}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
          placeholder="Any additional details about the property..."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="font-medium">Generation Options</h3>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="fairHousing" 
            checked={formData.includeFairHousingCompliance}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ 
                ...prev, 
                includeFairHousingCompliance: checked === true 
              }))
            }
          />
          <Label htmlFor="fairHousing" className="font-normal">
            Fair Housing Compliance Check
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="seo" 
            checked={formData.includeSeoOptimization}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ 
                ...prev, 
                includeSeoOptimization: checked === true 
              }))
            }
          />
          <Label htmlFor="seo" className="font-normal">
            SEO Optimization
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="social" 
            checked={formData.includeSocialMedia}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ 
                ...prev, 
                includeSocialMedia: checked === true 
              }))
            }
          />
          <Label htmlFor="social" className="font-normal">
            Generate Social Media Captions
          </Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Listing'}
      </Button>
    </form>
  )
} 