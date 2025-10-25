// Cookie utility functions for cart persistence

const CART_COOKIE_NAME = 'ovees_cart'
const COOKIE_EXPIRY_DAYS = 30

/**
 * Set cart items in cookies
 * @param {Array} cartItems - Array of cart items to store
 */
export const saveCartToCookie = (cartItems) => {
  try {
    const cartJSON = JSON.stringify(cartItems)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS)
    
    document.cookie = `${CART_COOKIE_NAME}=${encodeURIComponent(cartJSON)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`
    console.log('✅ Cart saved to cookies:', cartItems.length, 'items')
  } catch (error) {
    console.error('❌ Error saving cart to cookies:', error)
  }
}

/**
 * Get cart items from cookies
 * @returns {Array} Array of cart items or empty array if not found
 */
export const getCartFromCookie = () => {
  try {
    const name = `${CART_COOKIE_NAME}=`
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookieArray = decodedCookie.split(';')
    
    for (let cookie of cookieArray) {
      cookie = cookie.trim()
      if (cookie.indexOf(name) === 0) {
        const cartJSON = cookie.substring(name.length)
        const cartItems = JSON.parse(cartJSON)
        console.log('✅ Cart loaded from cookies:', cartItems.length, 'items')
        return cartItems
      }
    }
    console.log('ℹ️ No cart found in cookies')
    return []
  } catch (error) {
    console.error('❌ Error reading cart from cookies:', error)
    return []
  }
}

/**
 * Clear cart from cookies
 */
export const clearCartCookie = () => {
  try {
    document.cookie = `${CART_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`
    console.log('✅ Cart cleared from cookies')
  } catch (error) {
    console.error('❌ Error clearing cart from cookies:', error)
  }
}
