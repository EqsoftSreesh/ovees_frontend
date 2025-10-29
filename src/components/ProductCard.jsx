// src/components/ProductCard.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Minus,
  Plus,
  ShoppingCart,
  Eye,
  Heart,
  Zap,
  Star,
  Check,
} from 'lucide-react'

const ProductCard = ({ product, onAddToCart, cartItems = [] }) => {
  const navigate = useNavigate()

  const [isClicked, setIsClicked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // -------------------------------------------------
  // 1. Image
  // -------------------------------------------------
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop'

  // -------------------------------------------------
  // 2. Cart state
  // -------------------------------------------------
  const cartItem = cartItems.find((i) => i.id === product.id)
  const quantityInCart = cartItem ? cartItem.quantity : 0

  // -------------------------------------------------
  // 3. Discount
  // -------------------------------------------------
  const discountPercent = product.offer_price
    ? Math.round(
        ((product.normal_price - product.offer_price) / product.normal_price) *
          100
      )
    : 0

  // -------------------------------------------------
  // 4. Click handlers
  // -------------------------------------------------
 const handleCardClick = () => {
  navigate(`/product/${product.id}`)  // Use product ID
}

  const stopProp = (e) => e.stopPropagation()

  const handleAddClick = (e) => {
    stopProp(e)
    if (product.stock_quantity === 0) return

    onAddToCart(product, 1)
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 500)
  }

  const handleIncrement = (e  ) => {
    stopProp(e)
    onAddToCart(product, 1)
  }

  const handleDecrement = (e) => {
    stopProp(e)
    if (quantityInCart > 0) onAddToCart(product, -1)
  }

  // -------------------------------------------------
  // 5. Render
  // -------------------------------------------------
  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-teal-200 ${
        isClicked ? 'scale-95' : ''
      } cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-yellow-50/0 group-hover:from-teal-50/50 group-hover:to-yellow-50/50 transition-all duration-500 pointer-events-none z-10" />

      {/* ---------- IMAGE ---------- */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="relative h-56 flex items-center justify-center p-4">
          {/* Skeleton spinner */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin" />
            </div>
          )}

          <img
            src={imageUrl}
            alt={product.name}
            className={`w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {product.stock_quantity > 0 ? (
            <span className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm animate-fade-in">
              <Check className="w-3 h-3" />
              In Stock
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              Out of Stock
            </span>
          )}

          {/* Uncomment if you want the discount badge back
          {discountPercent > 0 && (
            <span className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-black shadow-lg backdrop-blur-sm animate-bounce-slow">
              <Zap className="w-3 h-3 fill-current" />
              {discountPercent}% OFF
            </span>
          )}
          */}
        </div>

        {/* Quick‑action buttons (eye / heart) */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 z-20 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
        >
          {/* Eye button – opens the detail page (same as card click) */}
          <button
            onClick={handleCardClick}
            className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-teal-500 hover:text-white transition-all duration-300 group/btn"
          >
            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>

          <button className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-pink-500 hover:text-white transition-all duration-300 group/btn">
            <Heart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>

        {/* Hover shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="p-4 relative z-20">
        {/* Category */}
        {product.category && (
          <div className="mb-2">
            <span className="inline-flex items-center text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
              {product.category.name}
            </span>
          </div>
        )}

        {/* Name – clickable (same as card) */}
        <h3
          className="text-gray-800 font-semibold mb-3 h-12 line-clamp-2 cursor-pointer hover:text-teal-600 transition-colors leading-snug"
          onClick={handleCardClick}
        >
          {product.name}
        </h3>

        {/* ---- PRICE ---- */}
        <div className="mb-4 h-20 flex flex-col justify-start">
          {product.offer_price ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl font-black text-gray-900">
                  ₹{product.offer_price}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.normal_price}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-green-600">
                  You save ₹{product.normal_price - product.offer_price}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-2xl font-black text-gray-900">
              ₹{product.normal_price || product.price}
            </span>
          )}
        </div>

        {/* ---- ADD TO CART / QUANTITY ---- */}
        {quantityInCart > 0 ? (
          <div className="relative">
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-xl p-1.5 shadow-md">
              <button
                onClick={handleDecrement}
                className="bg-white hover:bg-emerald-100 text-emerald-600 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 group/btn"
              >
                <Minus className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>

              <div className="flex flex-col items-center px-2">
                <span className="font-black text-emerald-600 text-xl">
                  {quantityInCart}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  in cart
                </span>
              </div>

              <button
                onClick={handleIncrement}
                disabled={quantityInCart >= product.stock_quantity}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed group/btn"
              >
                <Plus className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>

            {/* Success ping */}
            {isClicked && (
              <div className="absolute inset-0 bg-emerald-500/20 rounded-xl flex items-center justify-center animate-ping">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleAddClick}
            disabled={product.stock_quantity === 0}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl active:scale-95 transition-all duration-300 font-bold text-sm shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn relative overflow-hidden"
          >
            {/* Shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />

            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform relative z-10" />
            <span className="relative z-10">
              {product.stock_quantity > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
            </span>
          </button>
        )}

        {/* Low‑stock warning */}
        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-orange-600 font-semibold">
            <Zap className="w-3 h-3 fill-current" />
            <span>Only {product.stock_quantity} left!</span>
          </div>
        )}
      </div>

      {/* ---------- ANIMATIONS ---------- */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default ProductCard