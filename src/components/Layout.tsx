import { PropsWithChildren, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  Home, FileText, BarChart2, Settings, Menu, X, LogOut, 
  PlusCircle, User, CreditCard, Sparkles, MessageSquare
} from 'lucide-react'

interface LayoutProps extends PropsWithChildren {
  hideNav?: boolean
}

export default function Layout({ children, hideNav = false }: LayoutProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`)
  }
  
  // Placeholder for user auth - in a real app this would check auth state
  const isLoggedIn = router.pathname !== '/login' && router.pathname !== '/register'
  
  // If navigation is hidden (e.g., on login/register pages)
  if (hideNav) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-[#FAFAF9]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-screen w-64 transform bg-white shadow-lg transition-transform lg:translate-x-0 lg:static lg:z-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/" className="flex items-center">
            <Sparkles className="h-6 w-6 text-[#2F5DE3]" />
            <span className="ml-2 text-xl font-bold text-[#2F5DE3]">Listing Genie</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="px-4 py-6">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold uppercase text-gray-500">Dashboard</p>
            
            <Link
              href="/dashboard"
              className={`flex items-center px-3 py-2 rounded-lg ${
                isActive('/dashboard') 
                  ? 'bg-[#C7BAF5] bg-opacity-20 text-[#2F5DE3]' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              <span>Home</span>
            </Link>
            
            <Link
              href="/new-listing"
              className={`flex items-center px-3 py-2 rounded-lg ${
                isActive('/new-listing') 
                  ? 'bg-[#C7BAF5] bg-opacity-20 text-[#2F5DE3]' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <PlusCircle className="h-5 w-5 mr-3" />
              <span>New Listing</span>
            </Link>
            
            <Link
              href="/analytics"
              className={`flex items-center px-3 py-2 rounded-lg ${
                isActive('/analytics') 
                  ? 'bg-[#C7BAF5] bg-opacity-20 text-[#2F5DE3]' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart2 className="h-5 w-5 mr-3" />
              <span>Analytics</span>
            </Link>
          </div>
          
          <div className="mt-6 space-y-1">
            <p className="px-3 text-xs font-semibold uppercase text-gray-500">Account</p>
            
            <Link
              href="/account"
              className={`flex items-center px-3 py-2 rounded-lg ${
                isActive('/account') 
                  ? 'bg-[#C7BAF5] bg-opacity-20 text-[#2F5DE3]' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="h-5 w-5 mr-3" />
              <span>Profile</span>
            </Link>
            
            <Link
              href="/premium"
              className={`flex items-center px-3 py-2 rounded-lg ${
                isActive('/premium') 
                  ? 'bg-[#C7BAF5] bg-opacity-20 text-[#2F5DE3]' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CreditCard className="h-5 w-5 mr-3" />
              <span>Subscription</span>
            </Link>
            
            <Link
              href="/support"
              className={`flex items-center px-3 py-2 rounded-lg ${
                isActive('/support') 
                  ? 'bg-[#C7BAF5] bg-opacity-20 text-[#2F5DE3]' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              <span>Support</span>
            </Link>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button 
              onClick={() => router.push('/login')}
              className="flex w-full items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b h-16 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center">
                <span className="font-medium">Trial - 2 listings remaining</span>
                <Link href="/premium" className="ml-2 px-3 py-1 rounded-md bg-[#2F5DE3] text-white text-sm">
                  Upgrade
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
} 