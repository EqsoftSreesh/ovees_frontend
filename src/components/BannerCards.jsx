import React from 'react'
import { ChevronRight, Sparkles, Package, Zap, Star } from 'lucide-react'

const BannerCards = ({ onCardClick }) => {
  const cards = [
    {
      id: 'new-arrivals',
      title: 'New Arrivals',
      icon: Sparkles,
      description: 'Fresh Collection'
    },
    {
      id: 'combos',
      title: 'Combos',
      icon: Package,
      description: 'Bundle & Save'
    },
    {
      id: '199-store',
      title: '₹199 Store',
      icon: Zap,
      description: 'Premium Selection'
    },
    {
      id: '99-store',
      title: '₹99 Store',
      icon: Star,
      description: 'Best Value'
    }
  ]

  const handleCardClick = (cardId) => {
    if (onCardClick) onCardClick(cardId)
  }

  return (
    <div className="flex flex-wrap gap-3 mb-12 px-2">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className="flex items-center gap-2.5 px-5 py-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-gray-900 transition-all duration-200 group"
          >
            <div className="p-1.5 bg-gray-900 rounded-full">
              <Icon className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {card.title}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
          </button>
        )
      })}
    </div>
  )
}

export default BannerCards