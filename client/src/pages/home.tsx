import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertListingSchema, type InsertListing } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, AlertCircle, CheckCircle, Home as HomeIcon, Bath, Bed, Maximize2, Building2, Shield, Sparkles, Search, FileText, BarChart, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export default function Home() {
  const { toast } = useToast();
  const [generatedListing, setGeneratedListing] = useState<string | null>(null);
  const [compliance, setCompliance] = useState<{
    isCompliant: boolean;
    violations: string[];
    suggestions: string[];
  } | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">Listing Genie</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">Support</Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* 1️⃣ Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
                Magically Generate AI-Optimized Real Estate Listings in Seconds
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Save hours of writing. Get SEO-friendly, Fair Housing-compliant listings with AI-powered automation.
              </p>
              <Button size="lg" className="h-14 px-8 text-lg" asChild>
                <Link href="/register">✨ Generate My First Listing</Link>
              </Button>

              <div className="mt-12 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur-md"></div>
                <div className="relative bg-white rounded-lg border shadow-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1558036117-15d82a90b9b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    alt="AI-generated listing preview"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* 2️⃣ How It Works Section */}
          <div className="max-w-5xl mx-auto mb-24">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-xl border shadow-sm flex flex-col items-center text-center"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <HomeIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Step 1: Enter Property Details</h3>
                <p className="text-muted-foreground">
                  Just enter basic information: beds, baths, square footage, and key features.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-xl border shadow-sm flex flex-col items-center text-center"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Step 2: AI Generates Your Listing</h3>
                <p className="text-muted-foreground">
                  Our AI instantly creates SEO-friendly, Fair Housing-compliant listing copy.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-8 rounded-xl border shadow-sm flex flex-col items-center text-center"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Step 3: Copy, Customize & Post</h3>
                <p className="text-muted-foreground">
                  Copy your listing to MLS or customize it further to match your style.
                </p>
              </motion.div>
            </div>
          </div>

          {/* 3️⃣ Features Section */}
          <div className="bg-gradient-to-b from-gray-50 to-white py-16 rounded-2xl mb-24">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">Why Choose Listing Genie?</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
                Our AI technology gives you the competitive edge in real estate marketing
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Instant AI-Powered Listings</h3>
                    <p className="text-muted-foreground">No more writing from scratch. Generate compelling listings in seconds.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">SEO-Optimized Copy</h3>
                    <p className="text-muted-foreground">Rank higher on Zillow & Google with keyword-optimized descriptions.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Fair Housing Compliant</h3>
                    <p className="text-muted-foreground">Avoid legal issues with AI that automatically ensures compliance.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Social Media Captions</h3>
                    <p className="text-muted-foreground">Auto-generate engaging posts for Instagram, Facebook, and TikTok.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* 4️⃣ Testimonials Section */}
          <div className="max-w-5xl mx-auto mb-24">
            <h2 className="text-3xl font-bold text-center mb-12">What Real Estate Professionals Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-xl border shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold">John D.</h4>
                    <p className="text-sm text-muted-foreground">Realtor</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "This tool saves me hours every week! I used to struggle with writing compelling listings, but now it's done for me in seconds."
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-xl border shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Sarah K.</h4>
                    <p className="text-sm text-muted-foreground">Top Agent</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "My listings now rank higher on Zillow! The SEO optimization makes a real difference in visibility and engagement."
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-8 rounded-xl border shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Michael B.</h4>
                    <p className="text-sm text-muted-foreground">Broker</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "I listed and sold a home faster thanks to AI-optimized descriptions! The quality of writing is impressive."
                </p>
              </motion.div>
            </div>
          </div>

          {/* 5️⃣ Pricing Section */}
          <div className="bg-gradient-to-b from-gray-50 to-white py-16 rounded-2xl mb-24">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4">Pricing Plans</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
                Choose the plan that fits your business needseds
              </p>

              <div className="grid md:grid-cols-4 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-6 rounded-xl border shadow-sm"
                >
                  <h3 className="text-xl font-semibold mb-2">Pay-Per-Use</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$5</span>
                    <span className="text-muted-foreground">/listing</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Pay as you go</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">All standard features</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">No monthly commitment</span>
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href="/premium?plan=pay_per_use">Get Started</Link>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-xl border shadow-sm"
                >
                  <h3 className="text-xl font-semibold mb-2">Basic</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$29</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">10 listings per month</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">SEO optimization</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Fair Housing compliance</span>
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href="/premium?plan=basic">Get Started</Link>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white p-6 rounded-xl border shadow-sm relative"
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Pro</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$99</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">50 listings per month</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Social media captions</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">MLS-optimized format</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Custom tone & style</span>
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    asChild
                  >
                    <Link href="/premium?plan=pro">Get Started</Link>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white p-6 rounded-xl border shadow-sm"
                >
                  <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$499</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Unlimited listings</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">API access</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Team accounts</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Brand voice customization</span>
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href="/premium?plan=enterprise">Contact Sales</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* 6️⃣ FAQ Section */}
          <div className="max-w-4xl mx-auto mb-24">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-xl border shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-2">Is this compliant with Fair Housing laws?</h3>
                <p className="text-muted-foreground">
                  Yes! Our AI is specifically trained to remove discriminatory wording automatically, helping you avoid Fair Housing Act violations.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl border shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-2">Can I edit the AI-generated descriptions?</h3>
                <p className="text-muted-foreground">
                  Absolutely! Listings are fully customizable - use our AI-generated content as a starting point and make any edits to fit your style.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-xl border shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-2">Do you integrate with MLS systems?</h3>
                <p className="text-muted-foreground">
                  Enterprise users get API access to sync with MLS platforms. Our listings are formatted to work seamlessly with most MLS systems.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-xl border shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-2">What happens if I run out of listings?</h3>
                <p className="text-muted-foreground">
                  You can upgrade to a higher tier plan or switch to our Pay-Per-Use option for additional listings without changing your subscription.
                </p>
              </motion.div>
            </div>
          </div>

          {/* 7️⃣ Final CTA Section */}
          <div className="max-w-4xl mx-auto mb-16 text-center bg-gradient-to-r from-primary/20 to-primary/5 py-16 px-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6">Ready to Automate Your Listings and Sell Faster?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join over 1,000+ real estate professionals already using Listing Genie to create engaging, compliant property descriptions.
            </p>
            <Button size="lg" className="h-14 px-8 text-lg" asChild>
              <Link href="/register">Start Now – Generate Your First Listing Instantly</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6 text-primary" />
                <span className="font-semibold text-xl">Listing Genie</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional real estate listings powered by artificial intelligence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Premium</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>Fair Housing Guide</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Contact</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Listing Genie. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}