import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BarChart2 } from 'lucide-react'

interface AnalyticsLinkProps {
  listingId: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function AnalyticsLink({ 
  listingId, 
  variant = 'default', 
  size = 'default',
  className 
}: AnalyticsLinkProps) {
  return (
    <Link href={`/analytics/${listingId}`} passHref legacyBehavior>
      <Button 
        variant={variant} 
        size={size}
        className={className}
        as="a"
      >
        <BarChart2 className="mr-2 h-4 w-4" />
        View Analytics
      </Button>
    </Link>
  )
} 