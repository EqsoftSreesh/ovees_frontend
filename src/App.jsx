import { BrowserRouter } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import Header from './components/Header'
import Cart from './components/cart'

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  // 👇 NEW: Global Cart State
  const [cartItems, setCartItems] = useState([])

  // 👇 NEW: Add to Cart Function
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  // 👇 NEW: Remove from Cart Function
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  // 👇 NEW: Update Quantity Function
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  return (
    <BrowserRouter>
      <div className="font-sans relative">
        <Header 
          setIsCartOpen={setIsCartOpen} 
          cartCount={cartItems.length} // 👈 Pass cart count
        />
        {isCartOpen && (
          <Cart 
            setIsCartOpen={setIsCartOpen}
            cartItems={cartItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
        )}
      <Home addToCart={addToCart} />  
      </div>
    </BrowserRouter>
  )
}

export default App