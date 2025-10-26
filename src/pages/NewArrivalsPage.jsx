import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Sparkles, TrendingUp, Zap, Star } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductDetailModal from '../components/ProductDetailModal'
import { fetchNewArrivals } from '../services/api'

const NewArrivalsPage = ({ addToCart, cartItems = [] }) => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        const response = await fetchNewArrivals(1, 100, true)
        const data = response.items || []
        setProducts(data.map(item => item.product))
        console.log(`✅ Loaded ${data.length} new arrivals`)
      } catch (err) {
        console.error('Error fetching new arrivals:', err)
      } finally {
        setLoading(false)
      }
    }
    loadNewArrivals()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* <Header cartCount={cartItems.length} addToCart={addToCart} /> */}
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4 animate-fade-in">
              <div className="relative">
                <Zap className="w-7 h-7 text-yellow-300 animate-pulse" />
                <Sparkles className="w-4 h-4 text-yellow-200 absolute -top-1 -right-1 animate-ping" />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">
                Just Dropped
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
              New Arrivals
            </h1>
            
            <p className="text-lg sm:text-xl text-purple-50 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Discover the latest additions to our collection. Fresh styles, trending designs, and exclusive pieces just for you.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full">
                <TrendingUp className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-semibold">Trending Now</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-semibold">{products.length} Fresh Items</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-purple-50"></path>
          </svg>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-3xl shadow-xl">
              <div className="relative mb-4">
                <Sparkles className="w-20 h-20 text-gray-300 mx-auto" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-2xl"></div>
              </div>
              <p className="text-gray-600 text-xl font-semibold mb-2">No New Arrivals Yet</p>
              <p className="text-gray-400 text-sm">Check back soon for fresh additions!</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl shadow-md p-6 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  <p className="text-sm text-gray-500">New Products</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Updated Daily</span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* New Badge Overlay */}
                  <div className="relative">
                    <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce-slow">
                      NEW
                    </div>
                    <ProductCard 
                      product={product}
                      onProductClick={() => setSelectedProduct(product)}
                      onAddToCart={addToCart}
                      cartItems={cartItems}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
          animation-fill-mode: both;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-8px);
        }
      `}</style>
    </div>
  )
}

export default NewArrivalsPage