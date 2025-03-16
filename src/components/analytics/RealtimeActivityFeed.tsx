import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface RealtimeActivityFeedProps {
  isConnected: boolean;
  lastEvent: any | null;
  eventCount: Record<string, number>;
}

export const RealtimeActivityFeed: React.FC<RealtimeActivityFeedProps> = ({
  isConnected,
  lastEvent,
  eventCount
}) => {
  const [events, setEvents] = useState<any[]>([]);
  
  // Add new events to the feed
  useEffect(() => {
    if (lastEvent) {
      setEvents(prev => [lastEvent, ...prev].slice(0, 20)); // Keep only the 20 most recent events
    }
  }, [lastEvent]);
  
  // Format event for display
  const formatEvent = (event: any): { icon: string; title: string; description: string } => {
    const time = format(new Date(event.timestamp), 'h:mm:ss a');
    
    switch (event.type) {
      case 'view':
        return {
          icon: '👁️',
          title: 'Page View',
          description: `New visitor at ${time}${event.referrer ? ` from ${event.referrer}` : ''}`
        };
      case 'lead':
        return {
          icon: '🔥',
          title: 'Lead Generated',
          description: `New lead (${event.leadId || 'unknown'}) at ${time}`
        };
      case 'share':
        return {
          icon: '🔄',
          title: 'Listing Shared',
          description: `Listing shared on ${event.platform || 'social media'} at ${time}`
        };
      case 'comment':
        return {
          icon: '💬',
          title: 'New Comment',
          description: `Comment added (${event.commentId || 'unknown'}) at ${time}`
        };
      case 'abtest_view':
        return {
          icon: '🧪',
          title: 'A/B Test View',
          description: `Variant ${event.variantId || 'unknown'} of test ${event.testId || 'unknown'} viewed at ${time}`
        };
      case 'abtest_conversion':
        return {
          icon: '✅',
          title: 'A/B Test Conversion',
          description: `Variant ${event.variantId || 'unknown'} of test ${event.testId || 'unknown'} converted at ${time}`
        };
      default:
        return {
          icon: '📊',
          title: 'Activity',
          description: `Unknown activity at ${time}`
        };
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Real-time Activity</h3>
        <div className="flex items-center">
          <span className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-sm text-gray-500">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Object.entries(eventCount).map(([type, count]) => (
          <div key={type} className="bg-gray-50 p-2 rounded-md">
            <div className="text-xs text-gray-500 capitalize">{type.replace('_', ' ')}</div>
            <div className="text-lg font-semibold">{count}</div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-50 rounded-md overflow-hidden">
        <div className="max-h-80 overflow-y-auto">
          {events.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {events.map((event, index) => {
                const { icon, title, description } = formatEvent(event);
                return (
                  <li key={index} className="p-3 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start">
                      <span className="text-xl mr-3">{icon}</span>
                      <div>
                        <h4 className="font-medium">{title}</h4>
                        <p className="text-sm text-gray-600">{description}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No activity yet. Events will appear here in real-time.
            </div>
          )}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 italic">
        Events are updated in real-time as users interact with your listing.
      </div>
    </div>
  );
}; 