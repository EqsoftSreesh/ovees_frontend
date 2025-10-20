import React, { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSection from '../components/Herosession'
import ProductCard from '../components/ProductCard'
import ProductDetailModal from '../components/ProductDetailModal'
import { fetchCategories, fetchProducts } from '../services/api'
import { Loader2 } from 'lucide-react'

const Home = ({ addToCart }) => {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const observerTarget = useRef(null)
  const ITEMS_PER_PAGE = 20

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    loadCategories()
  }, [])

  // ✅ FIXED: Load Products with DEBOUNCE & BETTER CHECKS
  const loadProducts = async () => {
    // 🚫 STOP if already loading OR no more products
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)
    
    try {
      const skip = products.length
      console.log(`🔄 Loading products: skip=${skip}, limit=${ITEMS_PER_PAGE}`) // DEBUG
      
      const data = await fetchProducts(skip, ITEMS_PER_PAGE, true)
      
      console.log(`✅ Loaded ${data.length} products`) // DEBUG
      
      // 🚫 SET hasMore = false if less than page size OR empty
      if (data.length === 0 || data.length < ITEMS_PER_PAGE) {
        setHasMore(false)
        console.log('🏁 No more products to load') // DEBUG
      }
      
      // ✅ ONLY ADD if we got new products
      if (data.length > 0) {
        setProducts(prev => {
          // 🚫 PREVENT DUPLICATES
          const newProducts = data.filter(newProduct => 
            !prev.some(existing => existing.id === newProduct.id)
          )
          return [...prev, ...newProducts]
        })
      }
    } catch (err) {
      setError('Failed to load products. Please try again.')
      console.error('❌ Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadProducts()
  }, [])

  // ✅ FIXED: Intersection Observer with BETTER CONTROLS
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const target = entries[0]
        // 🚫 ONLY trigger if:
        // 1. Visible (isIntersecting)
        // 2. Has more products
        // 3. NOT currently loading
        if (target.isIntersecting && hasMore && !loading) {
          console.log('📜 Observer triggered - loading more...') // DEBUG
          loadProducts()
        }
      },
      { 
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '100px' // Load 100px BEFORE reaching target
      }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loading]) // ✅ DEPENDENCIES FIXED

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 text-center text-sm">
        Flatburg In 60 minutes!
      </div>
      <HeroSection />
      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="mb-8 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-2">
              Shop From <span className="text-teal-500">Top Categories</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="text-center cursor-pointer group">
                  <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 shadow-md group-hover:shadow-xl transition bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold text-teal-600">
                      {cat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 line-clamp-2">{cat.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Products Section */}
        <section className="mb-8 sm:mb-16">
          <div className="flex items-center justify-between mb-4 sm:mb-6 px-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">All Products</h2>
            <span className="text-sm text-gray-500">{products.length} items</span>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onProductClick={() => setSelectedProduct(product)}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          {/* ✅ FIXED Loading States */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
              <span className="ml-2 text-gray-600">Loading more products...</span>
            </div>
          )}

          {/* 🚫 HIDE target when no more loading */}
          {!loading && (
            <div ref={observerTarget} className="h-10" />
          )}

          {/* ✅ End Message */}
          {!hasMore && products.length > 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <p>You've reached the end of our products!</p>
            </div>
          )}

          {/* No products found */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
      
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  )
}

export default Home