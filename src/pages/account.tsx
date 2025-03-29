import { useState } from 'react'
import { useRouter } from 'next/router'
import { User, Mail, Key, CreditCard, Save } from 'lucide-react'
import Layout from '@/components/Layout'

export default function Account() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    company: 'Smith Realty',
    phone: '(555) 123-4567',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      // Show success toast or notification here
      alert('Profile updated successfully')
    }, 1500)
  }

  return (
    <Layout hideHeader={true}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <div className="flex items-center">
            <span className="font-medium mr-3">Trial - 2 listings remaining</span>
            <button 
              onClick={() => router.push('/premium')}
              className="px-3 py-1 rounded-md bg-[#2F5DE3] text-white text-sm"
            >
              Upgrade
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-[#C7BAF5] flex items-center justify-center text-[#2F5DE3] text-2xl font-bold mb-4">
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h2 className="text-xl font-semibold">{formData.name}</h2>
                <p className="text-gray-500">{formData.email}</p>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Subscription Plan</span>
                  <span className="text-sm bg-[#C7BAF5] bg-opacity-20 text-[#2F5DE3] px-2 py-1 rounded-full">
                    Free Trial
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Listings Remaining</span>
                  <span className="text-sm">2</span>
                </div>
                <div className="mt-4">
                  <button 
                    onClick={() => router.push('/premium')}
                    className="w-full bg-[#2F5DE3] text-white py-2 rounded-md hover:bg-opacity-90 transition"
                  >
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium">Personal Information</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 shadow-sm focus:ring-[#2F5DE3] focus:border-[#2F5DE3] block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 shadow-sm focus:ring-[#2F5DE3] focus:border-[#2F5DE3] block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company / Brokerage
                    </label>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-[#2F5DE3] focus:border-[#2F5DE3] block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-[#2F5DE3] focus:border-[#2F5DE3] block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Key className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="pl-10 shadow-sm focus:ring-[#2F5DE3] focus:border-[#2F5DE3] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#2F5DE3] focus:border-[#2F5DE3] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#2F5DE3] focus:border-[#2F5DE3] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Billing Information</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="flex items-center">
                      <CreditCard className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">No payment method on file</p>
                        <p className="text-sm text-gray-500">Add a payment method to upgrade your plan</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center px-4 py-2 border border-[#2F5DE3] text-sm font-medium rounded-md text-[#2F5DE3] bg-white hover:bg-[#C7BAF5] hover:bg-opacity-10 focus:outline-none"
                    >
                      Add Payment Method
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#2F5DE3] hover:bg-opacity-90 focus:outline-none"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 