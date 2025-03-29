import { useState } from 'react'
import { useRouter } from 'next/router'
import { HelpCircle, Mail, MessageSquare, FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import Layout from '@/components/Layout'

interface FAQItem {
  question: string
  answer: string
}

export default function Support() {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const faqs: FAQItem[] = [
    {
      question: "How do I get started with Listing Genie?",
      answer: "Simply sign up for a free account, navigate to 'New Listing', and fill in your property details. Our AI will instantly generate professional property descriptions, headlines, social media content, and more."
    },
    {
      question: "Is Listing Genie Fair Housing compliant?",
      answer: "Yes! Our AI is specifically trained to follow Fair Housing guidelines. We automatically filter out potentially discriminatory language and provide compliance warnings if needed. However, we recommend always reviewing generated content before publishing."
    },
    {
      question: "How many listings can I create with the free trial?",
      answer: "The free trial includes 2 listings. After that, you can choose from our subscription plans starting at $29/month."
    },
    {
      question: "Can I customize the generated content?",
      answer: "Absolutely! All generated content can be edited to match your preferences and style. You can also select different templates and writing styles before generation."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your subscription anytime from your account settings. You'll still have access to your subscription until the end of your current billing period."
    },
    {
      question: "Does Listing Genie work for commercial properties?",
      answer: "Yes! Listing Genie works for all property types, including residential, commercial, land, and multi-family properties."
    }
  ]

  return (
    <Layout hideHeader={true}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Help & Support</h1>
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
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium">Support Options</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="flex items-center text-sm font-medium mb-3">
                      <Mail className="h-5 w-5 text-[#2F5DE3] mr-2" />
                      Email Support
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Get a response within 24 hours
                    </p>
                    <a 
                      href="mailto:support@listinggenie.ai"
                      className="inline-flex items-center text-[#2F5DE3] text-sm font-medium"
                    >
                      support@listinggenie.ai
                    </a>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="flex items-center text-sm font-medium mb-3">
                      <MessageSquare className="h-5 w-5 text-[#2F5DE3] mr-2" />
                      Live Chat
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Available Monday-Friday, 9am-5pm EST
                    </p>
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-[#2F5DE3] text-sm font-medium rounded-md text-[#2F5DE3] bg-white hover:bg-[#C7BAF5] hover:bg-opacity-10 focus:outline-none"
                    >
                      Start Chat
                    </button>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="flex items-center text-sm font-medium mb-3">
                      <FileText className="h-5 w-5 text-[#2F5DE3] mr-2" />
                      Documentation
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Detailed guides and tutorials
                    </p>
                    <a 
                      href="#"
                      className="inline-flex items-center text-[#2F5DE3] text-sm font-medium"
                    >
                      View Documentation
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#C7BAF5] bg-opacity-20 p-6 rounded-lg mt-6">
              <div className="flex items-start">
                <HelpCircle className="h-6 w-6 text-[#2F5DE3] mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Need personalized help?</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Schedule a 15-minute onboarding call with our team to get started
                  </p>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#2F5DE3] hover:bg-opacity-90 focus:outline-none"
                  >
                    Schedule Call
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium">Frequently Asked Questions</h2>
              </div>
              
              <div className="divide-y">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-6">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="flex w-full text-left justify-between items-center focus:outline-none"
                    >
                      <h3 className="font-medium">{faq.question}</h3>
                      {activeIndex === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {activeIndex === index && (
                      <div className="mt-3 text-gray-600">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium">Contact Form</h2>
              </div>
              
              <form className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="shadow-sm focus:ring-[#2F5DE3] focus:border-[#2F5DE3] block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="shadow-sm focus:ring-[#2F5DE3] focus:border-[#2F5DE3] block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      className="shadow-sm focus:ring-[#2F5DE3] focus:border-[#2F5DE3] block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      className="shadow-sm focus:ring-[#2F5DE3] focus:border-[#2F5DE3] block w-full sm:text-sm border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#2F5DE3] hover:bg-opacity-90 focus:outline-none"
                  >
                    Send Message
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