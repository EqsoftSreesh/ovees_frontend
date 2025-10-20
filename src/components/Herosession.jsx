import React from 'react'

const HeroSection = () => {
  return (
    <section className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
      <img
        src="public/header.png"
        alt="Hero"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">ovees</h2>
          <p className="text-white text-sm sm:text-base md:text-lg max-w-md">
            Discover elegant jewelry for every occasion
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroSection