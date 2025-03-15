import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { TemplateSelector } from './TemplateSelector'

export interface PropertyData {
  propertyType: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
  price: number
  location: string
  features: string[]
  additionalNotes: string
  template: string
  style: string
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

const formSchema = z.object({
  propertyType: z.string().min(1, { message: 'Please select a property type' }),
  bedrooms: z.coerce.number().min(0, { message: 'Bedrooms must be 0 or more' }),
  bathrooms: z.coerce.number().min(0, { message: 'Bathrooms must be 0 or more' }),
  squareFeet: z.coerce.number().min(1, { message: 'Square footage is required' }),
  price: z.coerce.number().min(1, { message: 'Price is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  features: z.array(z.string()).optional(),
  additionalNotes: z.string().optional(),
  template: z.string().default('standard'),
  style: z.string().default('professional')
})

export function PropertyForm({ onSubmit, isLoading }: PropertyFormProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit({
      ...values,
      features: selectedFeatures,
    })
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
    
    form.setValue('features', selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature]
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>
              Enter the basic information about the property
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="squareFeet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Square Feet</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features & Amenities</CardTitle>
            <CardDescription>
              Select the features that apply to this property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {commonFeatures.map((feature) => (
                <div key={feature.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature.id}
                    checked={selectedFeatures.includes(feature.label)}
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

            <div className="mt-6">
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional details about the property"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include any special features or selling points not covered above
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listing Style</CardTitle>
            <CardDescription>
              Choose how you want your listing to be written
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TemplateSelector
                      selectedTemplate={field.value}
                      setSelectedTemplate={field.onChange}
                      selectedStyle={form.getValues('style')}
                      setSelectedStyle={(value) => form.setValue('style', value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Listing'}
        </Button>
      </form>
    </Form>
  )
} 