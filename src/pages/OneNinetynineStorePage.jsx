import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Star, Award, TrendingDown, Sparkles, Zap, Gift, Crown } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductDetailModal from '../components/ProductDetailModal'
import { fetchOneNinetyNineStore } from '../services/api'

const OneNinetynineStorePage = ({ addToCart, cartItems = [] }) => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchOneNinetyNineStore(1, 100)
        const data = response.items || []
        setProducts(data)
        console.log(`✅ Loaded ${data.length} products from 199 Store`)
      } catch (err) {
        console.error('Error fetching 199 Store products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* <Header cartCount={cartItems.length} addToCart={addToCart} /> */}
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        
        {/* Animated Sparkle Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-cyan-300 rounded-full mix-blend-overlay filter blur-3xl animate-drift"></div>
          <div className="absolute top-32 right-1/4 w-80 h-80 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-drift animation-delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-overlay filter blur-3xl animate-drift animation-delay-2000"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-24 left-1/6 animate-float-slow">
            <Star className="w-10 h-10 text-yellow-300 opacity-40 animate-spin-slow" />
          </div>
          <div className="absolute top-48 right-1/5 animate-float-slow animation-delay-1000">
            <Gift className="w-12 h-12 text-cyan-200 opacity-40" />
          </div>
          <div className="absolute bottom-40 left-1/4 animate-float-slow animation-delay-2000">
            <Award className="w-14 h-14 text-blue-200 opacity-40" />
          </div>
          <div className="absolute top-36 right-1/3 animate-float-slow animation-delay-1500">
            <Sparkles className="w-8 h-8 text-yellow-200 opacity-40" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4 animate-fade-in">
              <div className="relative">
                <Crown className="w-8 h-8 text-yellow-300 animate-pulse" />
                <Sparkles className="w-4 h-4 text-yellow-200 absolute -top-1 -right-1 animate-ping" />
              </div>
              {/* <span className="text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-yellow-300 to-amber-300 text-indigo-900 px-4 py-1.5 rounded-full shadow-lg">
                Value
              </span> */}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 animate-slide-up">
              Under <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-cyan-300 to-blue-300 animate-gradient">₹199</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-indigo-50 mb-6 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
              Discover quality products at incredible prices. Exceptional value that doesn't compromise on quality.
            </p>
            
            <div className="flex flex-wrap gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {/* <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/30 hover:bg-white/30 transition-all">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-bold">   Quality</span>
              </div> */}
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/30 hover:bg-white/30 transition-all">
                <TrendingDown className="w-5 h-5 text-cyan-300" />
                <span className="text-sm font-bold">{products.length} Products</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-300 to-amber-400 text-indigo-900 px-4 py-2.5 rounded-full shadow-lg font-black hover:shadow-xl transition-all">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-sm">Best Deals</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12 sm:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-indigo-50"></path>
          </svg>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-indigo-100">
                  <div className="aspect-square bg-gradient-to-br from-indigo-100 to-blue-100"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-indigo-100 rounded w-3/4"></div>
                    <div className="h-6 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-lg w-1/2"></div>
                    <div className="h-10 bg-indigo-100 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-3xl shadow-xl border-2 border-indigo-100">
              <div className="relative mb-4">
                <Award className="w-20 h-20 text-indigo-300 mx-auto" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-400 opacity-20 blur-2xl"></div>
              </div>
              <p className="text-gray-600 text-xl font-semibold mb-2">No Products Available</p>
              <p className="text-gray-400 text-sm">Check back soon for premium deals!</p>
            </div>
          </div>
        ) : (
          <>
            {/* Value Proposition Banner */}
            {/* <div className="mb-8 relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
              
              <div className="relative p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-5 rounded-2xl shadow-xl animate-pulse-slow">
                        <Crown className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg animate-bounce-slow">
                        ₹
                      </div>
                    </div>
                    <div className="text-white">
                      <p className="text-3xl sm:text-4xl font-black mb-1">
                        Premium Under ₹199
                      </p>
                      <p className="text-indigo-100 text-sm sm:text-base">
                        Quality products • Unbeatable value • {products.length} items available
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-2">
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                        <Star className="w-5 h-5 text-yellow-300 fill-current inline mr-1" />
                        <span className="text-white font-bold text-sm">Top Rated</span>
                      </div>
                      <div className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded-lg font-black text-sm shadow-lg">
                        BEST VALUE
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-cyan-100 text-xs">
                      <Zap className="w-3 h-3 animate-pulse" />
                      <span>Updated today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up hover-lift"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Premium Badge Overlay */}
                  <div className="relative">
                    <div className="absolute -top-3 -right-3 z-10">
                      <div className="relative">
                        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white px-4 py-2 rounded-xl shadow-xl border-2 border-indigo-300">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-current text-yellow-300" />
                            <span className="text-xs font-black">₹199</span>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl blur-md opacity-50 -z-10"></div>
                      </div>
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

        @keyframes drift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.95);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(10deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
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

        .animate-drift {
          animation: drift 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1500 {
          animation-delay: 1.5s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
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

export default OneNinetynineStorePage