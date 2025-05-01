import { Button } from "@/components/ui/button"
import { Github, Twitter, DiscIcon as Discord } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-foreground/80 hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <a href="/team" className="text-sm text-foreground/80 hover:text-foreground">
                  Team
                </a>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-foreground/80 hover:text-foreground">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/docs" className="text-sm text-foreground/80 hover:text-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-foreground/80 hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-foreground/80 hover:text-foreground">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-foreground/80 hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-foreground/80 hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Discord className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6">
              <p className="text-sm font-medium">Subscribe to our newsletter</p>
              <div className="mt-2 flex gap-2">
                <Input placeholder="Enter your email" className="max-w-[200px]" />
                <Button variant="outline" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-sm text-foreground/80">© {new Date().getFullYear()} FreelanceHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
