import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  additionalNotes: string
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
    additionalNotes: '',
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features</Label>
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
        <Label htmlFor="additionalNotes">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          value={formData.additionalNotes}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
          placeholder="Any additional details about the property..."
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Listing'}
      </Button>
    </form>
  )
} 