import { useState, useEffect } from 'react';
import { ListingAnalytics } from '../types/analytics';
import { toast } from 'react-hot-toast';

// Basic analytics event type
export interface AnalyticsEvent {
  type: 'view' | 'lead' | 'share' | 'comment' | 'abtest_view' | 'abtest_conversion';
  timestamp: number;
  listingId?: string;
  userId?: string;
  // Additional properties based on event type
  referrer?: string;        // for view events
  leadId?: string;          // for lead events
  platform?: string;        // for share events
  commentId?: string;       // for comment events
  testId?: string;          // for A/B test events
  variantId?: string;       // for A/B test events
}

// Mock WebSocket class for simulating real-time connections
class MockWebSocket {
  private listeners: Record<string, Function[]> = {};
  private connected: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  
  constructor(url: string) {
    // Simulate connection delay
    setTimeout(() => {
      this.connected = true;
      this.emit('open', {});
      
      // Start sending mock events
      this.startMockEvents();
    }, 1000);
  }
  
  addEventListener(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  removeEventListener(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
  
  close() {
    this.connected = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emit('close', {});
  }
  
  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
  
  private startMockEvents() {
    // Generate random events every 2-5 seconds
    this.intervalId = setInterval(() => {
      if (!this.connected) return;
      
      const event = this.generateRandomEvent();
      this.emit('message', { data: JSON.stringify(event) });
    }, Math.random() * 3000 + 2000);
  }
  
  private generateRandomEvent(): AnalyticsEvent {
    const eventTypes: AnalyticsEvent['type'][] = [
      'view', 'lead', 'share', 'comment', 'abtest_view', 'abtest_conversion'
    ];
    
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const baseEvent: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      listingId: `listing-${Math.floor(Math.random() * 1000)}`,
      userId: `user-${Math.floor(Math.random() * 100)}`
    };
    
    // Add type-specific properties
    switch (type) {
      case 'view':
        baseEvent.referrer = ['google', 'facebook', 'direct', 'email'][Math.floor(Math.random() * 4)];
        break;
      case 'lead':
        baseEvent.leadId = `lead-${Math.floor(Math.random() * 500)}`;
        break;
      case 'share':
        baseEvent.platform = ['facebook', 'twitter', 'instagram', 'email'][Math.floor(Math.random() * 4)];
        break;
      case 'comment':
        baseEvent.commentId = `comment-${Math.floor(Math.random() * 200)}`;
        break;
      case 'abtest_view':
      case 'abtest_conversion':
        baseEvent.testId = `test-${Math.floor(Math.random() * 5)}`;
        baseEvent.variantId = `variant-${Math.floor(Math.random() * 2 + 1)}`;
        break;
    }
    
    return baseEvent;
  }
}

// Hook for using real-time analytics
export function useRealtimeAnalytics() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<AnalyticsEvent | null>(null);
  const [eventCount, setEventCount] = useState<Record<string, number>>({
    view: 0,
    lead: 0,
    share: 0,
    comment: 0,
    abtest_view: 0,
    abtest_conversion: 0
  });
  
  useEffect(() => {
    // Create mock WebSocket connection
    const socket = new MockWebSocket('wss://api.example.com/analytics');
    
    const handleOpen = () => {
      setIsConnected(true);
    };
    
    const handleClose = () => {
      setIsConnected(false);
    };
    
    const handleMessage = (event: any) => {
      try {
        const analyticsEvent = JSON.parse(event.data) as AnalyticsEvent;
        setLastEvent(analyticsEvent);
        
        // Update event count
        setEventCount(prev => ({
          ...prev,
          [analyticsEvent.type]: (prev[analyticsEvent.type] || 0) + 1
        }));
      } catch (error) {
        console.error('Error parsing analytics event:', error);
      }
    };
    
    socket.addEventListener('open', handleOpen);
    socket.addEventListener('close', handleClose);
    socket.addEventListener('message', handleMessage);
    
    return () => {
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('close', handleClose);
      socket.removeEventListener('message', handleMessage);
      socket.close();
    };
  }, []);
  
  return { isConnected, lastEvent, eventCount };
}

// Function to update analytics data with real-time events
const updateAnalyticsWithEvent = (analytics: ListingAnalytics, event: AnalyticsEvent): ListingAnalytics => {
  if (!analytics) return analytics;
  
  const updatedAnalytics = { ...analytics };
  const today = new Date().toISOString().split('T')[0];
  
  // Find today's engagement data or create it
  let todayEngagement = updatedAnalytics.performanceData.engagementByDay.find(day => day.date === today);
  
  if (!todayEngagement) {
    todayEngagement = {
      date: today,
      views: 0,
      leads: 0,
      shares: 0,
      comments: 0
    };
    updatedAnalytics.performanceData.engagementByDay.push(todayEngagement);
  }
  
  // Update the appropriate metrics based on event type
  switch (event.type) {
    case 'view':
      updatedAnalytics.performanceData.views += 1;
      updatedAnalytics.performanceData.uniqueVisitors += 0.7; // Approximate, assuming 70% of views are unique
      todayEngagement.views += 1;
      break;
    case 'lead':
      todayEngagement.leads += 1;
      // In a real implementation, we would add the lead to the leads array
      break;
    case 'share':
      todayEngagement.shares += 1;
      break;
    case 'comment':
      todayEngagement.comments += 1;
      break;
    case 'abtest_view':
    case 'abtest_conversion':
      // Update A/B test data
      const test = updatedAnalytics.abTests.find(t => t.id === event.testId);
      if (test) {
        const variant = test.variants.find(v => v.id === event.variantId);
        if (variant) {
          if (event.type === 'abtest_view') {
            variant.views += 1;
          } else {
            variant.conversions += 1;
            variant.conversionRate = (variant.conversions / variant.views) * 100;
          }
        }
      }
      break;
  }
  
  // Update conversion rate
  const totalLeads = updatedAnalytics.leads.length;
  updatedAnalytics.performanceData.conversionRate = 
    (totalLeads / updatedAnalytics.performanceData.views) * 100;
  
  return updatedAnalytics;
}; 