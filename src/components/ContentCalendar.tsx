import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, PlusCircle, Edit2, Trash2, MessageSquare, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
import { hasFeature } from '@/lib/utils';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  status: 'draft' | 'scheduled' | 'published';
  listingId?: string;
}

const ContentCalendar: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => {
    // Initialize with saved items from localStorage or empty array
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('contentCalendar');
      return savedItems ? JSON.parse(savedItems) : [];
    }
    return [];
  });
  
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<ContentItem, 'id'>>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    platform: 'instagram',
    status: 'draft',
  });
  
  // Check if user has access to Content Calendar
  const subscription = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('userSubscription') || 'null')
    : null;
  
  const hasAccess = hasFeature(subscription, 'Social media content calendar');

  if (!hasAccess) {
    return (
      <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
        <h3 className="text-lg font-medium text-amber-800 mb-2">Business Plan Feature</h3>
        <p className="text-amber-700 mb-4">
          Content Calendar is available exclusively for Business plan subscribers.
          Upgrade to schedule and manage your social media content.
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

  const handleAddContent = () => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const itemToAdd = editingItem ? { ...editingItem, ...newItem } : { id, ...newItem };
    
    let updatedItems;
    if (editingItem) {
      updatedItems = contentItems.map(item => item.id === editingItem.id ? itemToAdd : item);
    } else {
      updatedItems = [...contentItems, itemToAdd as ContentItem];
    }
    
    setContentItems(updatedItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentCalendar', JSON.stringify(updatedItems));
    }
    
    setNewItem({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      platform: 'instagram',
      status: 'draft',
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEditContent = (item: ContentItem) => {
    setEditingItem(item);
    setNewItem({
      title: item.title,
      content: item.content,
      date: item.date,
      time: item.time,
      platform: item.platform,
      status: item.status,
      listingId: item.listingId,
    });
    setShowForm(true);
  };

  const handleDeleteContent = (id: string) => {
    if (confirm('Are you sure you want to delete this content item?')) {
      const updatedItems = contentItems.filter(item => item.id !== id);
      setContentItems(updatedItems);
      if (typeof window !== 'undefined') {
        localStorage.setItem('contentCalendar', JSON.stringify(updatedItems));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const moveMonth = (step: number) => {
    let newMonth = currentMonth + step;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const getMonthName = (month: number) => {
    const date = new Date();
    date.setMonth(month);
    return date.toLocaleString('default', { month: 'long' });
  };

  // Get the number of days in the current month and year
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the first day of the month (0-6, where 0 is Sunday)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-28 border bg-gray-50"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
      const dayContent = contentItems.filter(item => item.date === date);
      
      days.push(
        <div key={day} className="h-28 border p-1 relative">
          <div className="text-xs font-medium mb-1">{day}</div>
          <div className="overflow-y-auto max-h-[85px]">
            {dayContent.map(item => (
              <div 
                key={item.id} 
                className={`p-1 mb-1 text-xs rounded flex items-center ${getStatusColor(item.status)}`}
                onClick={() => handleEditContent(item)}
              >
                <span className="mr-1">{getPlatformIcon(item.platform)}</span>
                <span className="truncate">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
          Content Calendar
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Content
        </button>
      </div>
      
      <div className="p-6">
        {showForm && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">
              {editingItem ? 'Edit Content' : 'Schedule New Content'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newItem.title}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Post title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  name="platform"
                  value={newItem.platform}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={newItem.date}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    name="time"
                    value={newItem.time}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  name="content"
                  value={newItem.content}
                  onChange={handleInputChange}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Write your post content here..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={newItem.status}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  setNewItem({
                    title: '',
                    content: '',
                    date: new Date().toISOString().split('T')[0],
                    time: '09:00',
                    platform: 'instagram',
                    status: 'draft',
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContent}
                disabled={!newItem.title || !newItem.content}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {editingItem ? 'Update' : 'Schedule'}
              </button>
            </div>
          </div>
        )}
        
        {/* Calendar navigation */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => moveMonth(-1)}
            className="px-3 py-1 border rounded hover:bg-gray-50"
          >
            Previous
          </button>
          <h3 className="text-lg font-medium">
            {getMonthName(currentMonth)} {currentYear}
          </h3>
          <button
            onClick={() => moveMonth(1)}
            className="px-3 py-1 border rounded hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px">
          {/* Week day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium p-2 bg-gray-100">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {renderCalendar()}
        </div>
        
        {/* Upcoming content list */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Upcoming Content</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contentItems
                  .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
                  .map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500 truncate">{item.content}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">{getPlatformIcon(item.platform)}</span>
                          <span className="capitalize">{item.platform}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>{formatDate(item.date)}</div>
                        <div className="text-sm text-gray-500">{item.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditContent(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteContent(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                
                {contentItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No content scheduled. Click "Add Content" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCalendar; 