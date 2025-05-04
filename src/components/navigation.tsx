"use client"

import { Link, useLocation } from "react-router-dom"
import { Menu, User } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useEffect, useState } from "react"

export function Navigation() {
  // Use location to determine if we're on the home page
  const location = useLocation()
  const isHomePage = location.pathname === "/"

  // Show login/register buttons only on home page, otherwise assume logged in
  const isLoggedIn = !isHomePage

  // Track scroll position to change navbar appearance
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Check initial scroll position
    handleScroll()

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3 backdrop-blur-md bg-background/80 border-b border-border/40 shadow-sm" : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-black dark:bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-black dark:bg-white"></div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/services" className="text-sm uppercase tracking-wide hover:text-primary transition-colors">
            Services
          </Link>
          <Link to="/sell" className="text-sm uppercase tracking-wide hover:text-primary transition-colors">
            Sell
          </Link>
          <ThemeToggle />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="backdrop-blur-md bg-background/90">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/logout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-4">
          <ThemeToggle />

          {isLoggedIn ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          ) : (
            <Button size="sm" variant="ghost" asChild>
              <Link to="/login">
                <User className="h-5 w-5 mr-1" />
                Login
              </Link>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] backdrop-blur-md bg-background/90">
              <nav className="flex flex-col gap-6 mt-12">
                <Link to="/services" className="text-lg hover:text-primary transition-colors w-fit">
                  Services
                </Link>
                <Link to="/browse" className="text-lg hover:text-primary transition-colors w-fit">
                  Browse
                </Link>
                <Link to="/sell" className="text-lg hover:text-primary transition-colors w-fit">
                  Sell
                </Link>
                {isLoggedIn ? (
                  <>
                    <Link to="/profile" className="text-lg hover:text-primary transition-colors w-fit">
                      Profile
                    </Link>
                    <Link to="/orders" className="text-lg hover:text-primary transition-colors w-fit">
                      Orders
                    </Link>
                    <Link to="/settings" className="text-lg hover:text-primary transition-colors w-fit">
                      Settings
                    </Link>
                    <Link to="/logout" className="text-lg hover:text-primary transition-colors w-fit">
                      Logout
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col gap-4 mt-4">
                    <Button asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
