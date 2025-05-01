"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { ThemeToggle } from "./theme-toggle"
import { ConnectWalletButton } from "./connect-wallet-button"

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">FreelanceHub</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/services" className="transition-colors hover:text-foreground/80 text-foreground">
              Services
            </Link>
            <Link to="/create" className="transition-colors hover:text-foreground/80 text-foreground">
              Create Service
            </Link>
            <Link to="/orders" className="transition-colors hover:text-foreground/80 text-foreground">
              Orders
            </Link>
            <Link to="/profile" className="transition-colors hover:text-foreground/80 text-foreground">
              Profile
            </Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <nav className="grid gap-6 px-2 py-6">
              <Link to="/services" className="hover:text-foreground/80">
                Services
              </Link>
              <Link to="/create" className="hover:text-foreground/80">
                Create Service
              </Link>
              <Link to="/orders" className="hover:text-foreground/80">
                Orders
              </Link>
              <Link to="/profile" className="hover:text-foreground/80">
                Profile
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search services..." className="pl-8 md:w-[300px] lg:w-[400px]" />
            </div>
          </div>
          <ThemeToggle />
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  )
}
