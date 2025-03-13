import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Home,
  Plus,
  ClipboardList,
  Settings,
  LogOut,
  Search,
  CheckSquare,
  User,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "My Listings",
    href: "/listings",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    title: "Create Listing",
    href: "/new-listing",
    icon: <Plus className="h-5 w-5" />,
  },
  {
    title: "SEO Analyzer",
    href: "/seo-analyzer",
    icon: <Search className="h-5 w-5" />,
  },
  {
    title: "Compliance Checker",
    href: "/compliance-checker",
    icon: <CheckSquare className="h-5 w-5" />,
  },
  {
    title: "Account",
    href: "/account",
    icon: <User className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
        <div className="flex flex-col flex-grow border-r border-border bg-card px-2">
          <div className="flex items-center h-16 px-4">
            <h1 className="text-xl font-bold">FairListAI</h1>
          </div>
          <div className="flex flex-col flex-1 py-4 px-2">
            <nav className="flex-1 space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                    router.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              ))}
            </nav>

            <div className="pt-6 mt-6 space-y-3 border-t">
              <div className="px-4 py-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">
                      {user?.username || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.isPremium ? "Premium" : "Free"} Account
                    </p>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                className="w-full justify-start px-3"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-card z-10 px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">FairListAI</h1>
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              {isMobileNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center h-16 px-6">
                <h1 className="text-xl font-bold">FairListAI</h1>
              </div>
              <Separator />
              <nav className="flex-1 px-2 py-4 space-y-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                      router.pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                ))}
              </nav>
              <div className="px-2 py-4 space-y-3 border-t">
                <div className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        {user?.username || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.isPremium ? "Premium" : "Free"} Account
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3"
                  onClick={() => {
                    handleSignOut();
                    setIsMobileNavOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <main className="py-6 px-4 md:px-8 max-w-7xl mx-auto md:mt-0 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
} 