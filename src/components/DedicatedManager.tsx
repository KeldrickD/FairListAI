import React, { useState } from 'react';
import { PhoneCall, Calendar, Mail, MessageSquare, User, Clock } from 'lucide-react';
import { hasFeature } from '@/lib/utils';

interface ManagerDetails {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  photoUrl: string;
  bio: string;
  availability: string[];
}

const DedicatedManager: React.FC = () => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [meetingTopic, setMeetingTopic] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Check if user has access to Dedicated Account Manager
  const subscription = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('userSubscription') || 'null')
    : null;
  
  const hasAccess = hasFeature(subscription, 'Dedicated Account Manager');

  // Demo manager details
  const manager: ManagerDetails = {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Account Manager',
    email: 'sarah.johnson@listinggenie.com',
    phone: '(555) 123-4567',
    photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Sarah has 7+ years of experience in real estate marketing and has helped over 200 agents optimize their property listings. She specializes in luxury properties and multi-family listings.',
    availability: [
      'Monday: 9AM - 5PM EST',
      'Tuesday: 9AM - 5PM EST',
      'Wednesday: 9AM - 5PM EST',
      'Thursday: 9AM - 5PM EST',
      'Friday: 9AM - 3PM EST'
    ]
  };

  if (!hasAccess) {
    return (
      <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
        <h3 className="text-lg font-medium text-amber-800 mb-2">Business Plan Feature</h3>
        <p className="text-amber-700 mb-4">
          Dedicated Account Manager is available exclusively for Business plan subscribers.
          Upgrade to get personalized support and guidance for your real estate listings.
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

  const handleScheduleMeeting = () => {
    if (!selectedDate || !selectedTime || !meetingTopic) {
      alert('Please fill in all fields');
      return;
    }
    
    // In a real app, this would make an API call to schedule the meeting
    setTimeout(() => {
      setSuccessMessage(`Meeting scheduled with ${manager.name} on ${selectedDate} at ${selectedTime}`);
      setShowSchedule(false);
      
      // Clear form
      setSelectedDate('');
      setSelectedTime('');
      setMeetingTopic('');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }, 1000);
  };

  const getAvailableTimes = () => {
    return [
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM',
    ];
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-50 p-6 border-b border-blue-100">
        <h2 className="text-xl font-bold text-blue-800 mb-1">Your Dedicated Account Manager</h2>
        <p className="text-blue-600">
          As a Business plan subscriber, you have a dedicated account manager to help you get the most out of Listing Genie.
        </p>
      </div>
      
      <div className="p-6">
        {successMessage && (
          <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
            <p className="font-medium">{successMessage}</p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="text-center">
              <img 
                src={manager.photoUrl} 
                alt={manager.name} 
                className="h-40 w-40 rounded-full mx-auto mb-4 border-4 border-blue-100"
              />
              <h3 className="text-xl font-bold">{manager.name}</h3>
              <p className="text-gray-600">{manager.title}</p>
              
              <div className="mt-4 space-y-2">
                <a 
                  href={`mailto:${manager.email}`} 
                  className="flex items-center justify-center text-blue-600 hover:text-blue-800"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  <span>{manager.email}</span>
                </a>
                <a 
                  href={`tel:${manager.phone}`} 
                  className="flex items-center justify-center text-blue-600 hover:text-blue-800"
                >
                  <PhoneCall className="h-5 w-5 mr-2" />
                  <span>{manager.phone}</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">About {manager.name.split(' ')[0]}</h4>
              <p className="text-gray-600">{manager.bio}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">Availability</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-1">
                  {manager.availability.map((day, index) => (
                    <li key={index} className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{day}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Schedule a Meeting
              </button>
              <a
                href={`mailto:${manager.email}`}
                className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                <Mail className="h-5 w-5 mr-2" />
                Send Email
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Chat feature coming soon!');
                }}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Start Chat
              </a>
            </div>
          </div>
        </div>
        
        {showSchedule && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Schedule a Meeting</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a time</option>
                  {getAvailableTimes().map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Topic</label>
                <input
                  type="text"
                  value={meetingTopic}
                  onChange={(e) => setMeetingTopic(e.target.value)}
                  placeholder="Brief description of what you'd like to discuss"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowSchedule(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleMeeting}
                disabled={!selectedDate || !selectedTime || !meetingTopic}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">How Your Account Manager Can Help</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <User className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <span>Personalized onboarding and training for you and your team</span>
            </li>
            <li className="flex items-start">
              <User className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <span>Regular strategy sessions to optimize your listing performance</span>
            </li>
            <li className="flex items-start">
              <User className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <span>Priority support for technical issues and feature requests</span>
            </li>
            <li className="flex items-start">
              <User className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <span>Customized tips based on your local market and property types</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DedicatedManager; 