"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <a href="#" className="text-2xl font-bold text-gray-800">
            <span className="text-emerald-600">Coin</span>tract
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="text-gray-600 hover:text-emerald-600 transition-colors">
            Testimonials
          </a>
          <a href="#faq" className="text-gray-600 hover:text-emerald-600 transition-colors">
            FAQ
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">
            Log in
          </a>
          <Link to="/register">
            <a className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors">
                Sign up
            </a>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a
              href="#features"
              className="text-gray-600 hover:text-emerald-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-emerald-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-emerald-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-gray-600 hover:text-emerald-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            <div className="flex flex-col space-y-2 pt-2 border-t">
              <a
                href="#"
                className="text-gray-600 hover:text-emerald-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </a>
              <a
                href="#"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
