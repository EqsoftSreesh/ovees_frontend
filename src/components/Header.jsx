import React, { useState, useEffect } from 'react'
import { ShoppingCart, User, Search, Menu, ChevronDown, X } from 'lucide-react'
import { fetchCategories } from '../services/api'

const Header = ({ setIsCartOpen, cartCount= 0 }) => {
  const [categories, setCategories] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data.slice(0, 6)) // Show only first 6 categories in header
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    loadCategories()
  }, [])

  const handleCartClick = () => {
    setIsCartOpen((prev) => !prev)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-3">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">O</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold">
                <span className="text-teal-500">OVEES</span>{' '}
                <span className="text-orange-500">ELEGANZA</span>
              </h1>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-6">
            <button className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-teal-600 transition">
              <User className="w-5 h-5" />
              <span className="font-medium">Login</span>
            </button>
           <button
  onClick={handleCartClick}
  className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition relative"
>
  <ShoppingCart className="w-5 h-5" />
  <span className="hidden sm:inline font-medium">Cart</span>
  {cartCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {cartCount > 9 ? '9+' : cartCount}
    </span>
  )}
</button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8 text-sm overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="flex items-center gap-1 text-gray-700 hover:text-teal-600 transition whitespace-nowrap"
            >
              {cat.name} <ChevronDown className="w-4 h-4" />
            </button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-3 pb-3 border-t pt-3">
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className="flex items-center justify-between text-gray-700 hover:text-teal-600 transition py-2"
                >
                  <span>{cat.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              ))}
              <button className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition py-2 border-t pt-3">
                <User className="w-5 h-5" />
                <span>Login</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header