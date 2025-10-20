import { API_BASE_URL, API_ENDPOINTS } from '../config/api'

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`)
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export const fetchProducts = async (skip = 0, limit = 10, isActive = true) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}?skip=${skip}&limit=${limit}&is_active=${isActive}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}
