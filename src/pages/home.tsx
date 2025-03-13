import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'

export default function Home() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate listing')
      }

      const data = await response.json()
      toast({
        title: 'Success!',
        description: 'Your listing has been generated.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate listing',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Generate Your Listing</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your property..."
          className="min-h-[200px] mb-4"
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Generating...' : 'Generate Listing'}
        </Button>
      </form>
    </div>
  )
} 