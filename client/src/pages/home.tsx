import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Check, Building, Shield, BarChart, Share2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">FairListAI</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Create Fair Housing Compliant Listings with AI
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Generate engaging property descriptions, social media captions, and get compliance checks — all in seconds.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/register">
                <Button size="lg" className="mt-4">
                  Start for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="mt-4">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Why Choose FairListAI?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground mt-2">
              Powerful features designed for real estate professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card shadow-sm">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Listings</h3>
              <p className="text-muted-foreground">
                Generate compelling property descriptions with a single click. 
                Our AI understands real estate terminology and creates engaging content.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card shadow-sm">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fair Housing Compliance</h3>
              <p className="text-muted-foreground">
                Automatically check your listings for potential Fair Housing violations 
                and get suggestions to maintain compliance.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card shadow-sm">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">SEO Optimization</h3>
              <p className="text-muted-foreground">
                Get suggestions to improve your listing's search engine visibility
                and attract more potential buyers or renters.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-card shadow-sm">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Social Media Integration</h3>
              <p className="text-muted-foreground">
                Generate platform-specific captions for Instagram, Facebook, and TikTok,
                with relevant hashtags to maximize your listing's reach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground mt-2">
              Choose the plan that's right for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free tier */}
            <div className="flex flex-col p-6 border rounded-lg bg-card shadow-sm">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Free</h3>
                <p className="text-muted-foreground">Get started with basic features</p>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-8 flex-1">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>5 listings per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Basic compliance checking</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Standard property descriptions</span>
                </li>
              </ul>
              <Link href="/register">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Pro tier */}
            <div className="flex flex-col p-6 border rounded-lg bg-card shadow-sm relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-md text-sm font-medium">
                Most Popular
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold">Pro</h3>
                <p className="text-muted-foreground">Everything you need for daily use</p>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">$49.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-8 flex-1">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Unlimited listings</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Advanced compliance checking</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>SEO optimization</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Social media captions</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Multiple tone options</span>
                </li>
              </ul>
              <Link href="/register">
                <Button className="w-full">Start 7-Day Trial</Button>
              </Link>
            </div>

            {/* Enterprise tier */}
            <div className="flex flex-col p-6 border rounded-lg bg-card shadow-sm">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Enterprise</h3>
                <p className="text-muted-foreground">For teams and businesses</p>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">$99.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-8 flex-1">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Video script generation</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Bulk listing creation</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/register">
                <Button className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section id="faq" className="py-20 bg-background">
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground mt-2">
              Have questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">What is Fair Housing compliance?</h3>
              <p className="text-muted-foreground">
                Fair Housing compliance refers to adhering to laws that prohibit discrimination in housing based on protected 
                characteristics such as race, color, religion, sex, disability, familial status, or national origin. 
                Our AI helps ensure your listings don't contain language that could be considered discriminatory.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">How does the AI generate listings?</h3>
              <p className="text-muted-foreground">
                Our AI uses advanced natural language processing to create compelling property descriptions based on the 
                information you provide. It understands real estate terminology and can generate content in different tones 
                while maintaining Fair Housing compliance.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Can I edit the generated content?</h3>
              <p className="text-muted-foreground">
                Absolutely! While our AI generates high-quality listings, you have full control to edit, refine, or 
                completely rewrite any content as needed. The compliance checker will analyze any edits to ensure they 
                remain Fair Housing compliant.
              </p>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Is there a limit to how many listings I can create?</h3>
              <p className="text-muted-foreground">
                Free accounts can create up to 5 listings per month. Pro and Enterprise plans offer unlimited listings.
                For specific needs, we also offer pay-per-use options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Ready to create better listings?
          </h2>
          <p className="mx-auto max-w-[700px] mt-4 mb-8 text-primary-foreground/80 md:text-xl">
            Join thousands of real estate professionals using FairListAI today.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <Building className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">FairListAI</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                AI-powered Fair Housing compliant listing generation for real estate professionals.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} FairListAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}