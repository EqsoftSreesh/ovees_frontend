



import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ShoppingCart, Search, Menu, X, Loader2, ChevronDown, Sparkles, TrendingUp } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchCategories, searchProducts, fetchProducts } from '../services/api'

const Header = ({ cartCount, addToCart, setSelectedProduct }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryProducts, setCategoryProducts] = useState({})
  const [loadingProducts, setLoadingProducts] = useState({})
  const [hasMoreProducts, setHasMoreProducts] = useState({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const observerRefs = useRef({})
  const lastScrollY = useRef(0)
  const navigate = useNavigate()
  const location = useLocation()
  const ITEMS_PER_PAGE = 10

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
        const initialProducts = {}
        const initialLoading = {}
        const initialHasMore = {}
        data.forEach((cat) => {
          initialProducts[cat.id] = []
          initialLoading[cat.id] = false
          initialHasMore[cat.id] = true
        })
        setCategoryProducts(initialProducts)
        setLoadingProducts(initialLoading)
        setHasMoreProducts(initialHasMore)
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    loadCategories()
  }, [])

  // Handle scroll to hide/show header with smooth transitions
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Add shadow when scrolled
      setIsScrolled(currentScrollY > 10)
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling down - hide header
        setIsHeaderVisible(false)
      } else {
        // Scrolling up - show header
        setIsHeaderVisible(true)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  // Fetch suggestions
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }
      try {
        const response = await searchProducts(query, 1, 5, true)
        setSuggestions(response.items || [])
      } catch (err) {
        console.error('Error fetching suggestions:', err)
      }
    }, 300),
    []
  )

  // Update suggestions on query change
  useEffect(() => {
    fetchSuggestions(searchQuery)
  }, [searchQuery, fetchSuggestions])

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setSuggestions([])
      setIsSearchFocused(false)
      setIsMenuOpen(false)
      setIsMobileSearchExpanded(false)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (product) => {
    navigate(`/search?q=${encodeURIComponent(product.name)}`)
    setSearchQuery('')
    setSuggestions([])
    setIsSearchFocused(false)
    setIsMenuOpen(false)
  }

  // Fetch products for a category
  const loadCategoryProducts = async (categoryId) => {
    if (loadingProducts[categoryId] || !hasMoreProducts[categoryId]) return

    setLoadingProducts((prev) => ({ ...prev, [categoryId]: true }))
    try {
      const currentPage = Math.floor(categoryProducts[categoryId].length / ITEMS_PER_PAGE) + 1
      const response = await fetchProducts(currentPage, ITEMS_PER_PAGE, true, categoryId)
      const data = response.items || []
      const meta = response.meta || {}
      console.log(`✅ Loaded ${data.length} products for category ${categoryId} (Page ${meta.page}/${meta.total_pages})`)

      if (!meta.has_next || data.length === 0) {
        setHasMoreProducts((prev) => ({ ...prev, [categoryId]: false }))
      }

      setCategoryProducts((prev) => ({
        ...prev,
        [categoryId]: [
          ...prev[categoryId],
          ...data.filter((newProduct) => !prev[categoryId].some((p) => p.id === newProduct.id)),
        ],
      }))
    } catch (err) {
      console.error(`Error fetching products for category ${categoryId}:`, err)
    } finally {
      setLoadingProducts((prev) => ({ ...prev, [categoryId]: false }))
    }
  }

  // Handle category click
  const handleCategoryClick = (category) => {
    navigate(`/category?id=${category.id}&name=${encodeURIComponent(category.name)}`)
    setIsMenuOpen(false)
  }

  // Intersection Observer for lazy loading products
  useEffect(() => {
    const observers = {}
    categories.forEach((cat) => {
      observers[cat.id] = new IntersectionObserver(
        (entries) => {
          const target = entries[0]
          if (target.isIntersecting && hasMoreProducts[cat.id] && !loadingProducts[cat.id]) {
            console.log(`📜 Loading more products for category ${cat.id}`)
            loadCategoryProducts(cat.id)
          }
        },
        { threshold: 0.1, rootMargin: '100px' }
      )
      if (observerRefs.current[cat.id]) {
        observers[cat.id].observe(observerRefs.current[cat.id])
      }
    })

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect())
    }
  }, [categories, hasMoreProducts, loadingProducts])

  return (
    <header className={`sticky top-0 z-40 transform transition-all duration-500 ease-out ${
      isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
    } ${isScrolled ? 'shadow-xl' : 'shadow-md'}`}>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-gray-900 py-2.5 px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4yIi8+PC9nPjwvc3ZnPg==')] opacity-50"></div>
        <div className="container mx-auto relative">
          <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer">
              <span>🚚</span>
              <span className="hidden sm:inline">Free Home Delivery</span>
              <span className="sm:hidden">Delivery</span>
            </div>
            <span className="text-gray-700">•</span>
            <div className="flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer">
              <span>📍</span>
              <span className="hidden sm:inline">Track Your Order</span>
              <span className="sm:hidden">Track</span>
            </div>
            <span className="text-gray-700">•</span>
            <div className="flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Special Offers</span>
              <span className="sm:hidden">Offers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 backdrop-blur-md">
        <div className={`container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${
          isMobileSearchExpanded ? 'sm:flex' : 'flex'
        }`}>
          {/* Logo */}
          <div className={`flex items-center gap-2 cursor-pointer group transition-all duration-300 ${
            isMobileSearchExpanded ? 'hidden sm:flex' : 'flex'
          }`} onClick={() => navigate('/')}>
            <div className="relative">
              <img src="/logoo.png" alt="Logo" className="h-10 sm:h-12 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-yellow-400 opacity-0 group-hover:opacity-20 rounded-full blur-xl transition-opacity duration-300"></div>
            </div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-300 drop-shadow-lg">
                OVEES
              </span>
              <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400 drop-shadow-lg ml-0 sm:ml-2">
                ELEGANZA
              </span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className={`relative transition-all duration-300 ${
            isMobileSearchExpanded 
              ? 'flex-1 mx-0 sm:flex-1 sm:max-w-2xl sm:mx-6' 
              : 'hidden sm:block sm:flex-1 sm:max-w-2xl sm:mx-6'
          }`}>
            <form onSubmit={handleSearch}>
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search for products, brands and more..."
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-full bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-400/20 text-sm sm:text-base transition-all duration-300 shadow-lg group-hover:shadow-xl"
                  autoFocus={isMobileSearchExpanded}
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-yellow-500 transition-colors" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
            
            {/* Search Suggestions Dropdown */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50 mt-2 border border-gray-100 animate-slide-down">
                <div className="p-2">
                  {suggestions.map((product, index) => (
                    <div
                      key={product.id}
                      onMouseDown={() => handleSuggestionClick(product)}
                      className="px-4 py-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-yellow-50 cursor-pointer rounded-xl transition-all duration-200 group flex items-center gap-3"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-700 transition-colors">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ₹{product.offer_price || product.normal_price || product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className={`flex items-center gap-1 sm:gap-3 transition-all duration-300 ${
            isMobileSearchExpanded ? 'hidden sm:flex' : 'flex'
          }`}>
            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsMobileSearchExpanded(true)}
              className="sm:hidden p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group"
            >
              <Search className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigate('/cart')}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-500 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
            >
              <ShoppingCart className="w-5 h-5 text-gray-900 group-hover:scale-110 transition-transform" />
              <span className="text-gray-900 text-sm font-bold hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-bounce-slow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>

          {/* Mobile Search Close Button */}
          {isMobileSearchExpanded && (
            <button
              onClick={() => {
                setIsMobileSearchExpanded(false)
                setSearchQuery('')
                setSuggestions([])
              }}
              className="sm:hidden p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 ml-2 group"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          )}
        </div>
      </div>

      {/* Desktop Category Bar */}
      <div className="hidden sm:block bg-white border-t border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-50/50 via-transparent to-yellow-50/50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between overflow-x-auto scrollbar-hide py-3 gap-2">
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="flex flex-col items-center justify-center min-w-[85px] px-3 py-2 cursor-pointer group hover:bg-gradient-to-br hover:from-teal-50 hover:to-yellow-50 rounded-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {cat.icon_url && (
                  <div className="relative w-14 h-14 mb-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-yellow-100 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                    <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 border-2 border-white">
                      <img 
                        src={cat.icon_url} 
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
                <span className="text-xs font-semibold text-gray-700 text-center line-clamp-2 group-hover:text-teal-600 transition-colors">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed left-0 top-0 right-0 bottom-0 z-30 sm:hidden transition-all duration-300 ${
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      </div>

 {/* Mobile Menu Overlay */}
<div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 sm:hidden transition-opacity duration-300 ${
  isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
}`} onClick={() => setIsMenuOpen(false)} />

{/* Mobile Sidebar */}
<div className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-white to-gray-50 shadow-2xl z-60 sm:hidden transform transition-all duration-500 ease-out overflow-y-auto ${
  isMenuOpen ? 'translate-x-0' : '-translate-x-full'
}`}>
  {/* Sidebar Header */}
  <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4 flex items-center justify-between shadow-lg z-10">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-yellow-400 rounded-full flex items-center justify-center">
        <Menu className="w-5 h-5 text-gray-900" />
      </div>
      <h2 className="text-lg font-bold">All Categories</h2>
    </div>
    <button
      onClick={() => setIsMenuOpen(false)}
      className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 group"
    >
      <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
    </button>
  </div>

  {/* Categories List */}
  <div className="p-4 space-y-2">
    {categories.map((cat, index) => (
      <button
        key={cat.id}
        onClick={() => {
          handleCategoryClick(cat)
          setIsMenuOpen(false)
        }}
        className="w-full text-left px-4 py-3.5 text-sm font-semibold text-gray-700 bg-white rounded-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-yellow-50 hover:text-teal-700 hover:shadow-md transition-all duration-300 flex items-center gap-3 border border-gray-100 hover:border-teal-200 group animate-slide-in"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        {cat.icon_url && (
          <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-yellow-100 rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
            <img 
              src={cat.icon_url} 
              alt={cat.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <span className="flex-1">{cat.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transform -rotate-90 transition-all duration-300" />
      </button>
    ))}
  </div>
</div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-3px) scale(1.05);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
          animation-fill-mode: both;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
          animation-fill-mode: both;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </header>
  )
}

export default Header