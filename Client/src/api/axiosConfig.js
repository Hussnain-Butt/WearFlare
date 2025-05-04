// src/api/axiosConfig.js
import axios from 'axios'

// Define your API base URL
const API_BASE_URL = 'http://localhost:5000/api' // Or just http://localhost:5000 if your routes don't include /api

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Add a request interceptor to automatically attach the token
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage (or wherever you store it)
    const token = localStorage.getItem('authToken')

    // If a token exists, add it to the Authorization header
    if (token) {
      // Make sure the header name 'Authorization' matches what your backend expects
      config.headers['Authorization'] = `Bearer ${token}`
    }
    // Important: return the config object so the request can proceed
    return config
  },
  (error) => {
    // Handle request errors here (optional)
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// Optional: Add a response interceptor to handle common responses like 401/403
apiClient.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx causes this function to trigger
    return response
  },
  (error) => {
    // Any status codes outside the range of 2xx cause this function to trigger
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error Status:', error.response.status)
      console.error('Response Error Data:', error.response.data)

      // Example: Handle unauthorized errors (e.g., redirect to login)
      if (error.response.status === 401 || error.response.status === 403) {
        console.warn('Unauthorized or Forbidden request. Clearing token and redirecting.')
        // Optionally clear token and redirect to login
        localStorage.removeItem('authToken')
        localStorage.removeItem('userRole')
        // Redirect logic depends on your routing setup
        // window.location.href = '/login'; // Simple redirect, might need useNavigate outside components
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error or No Response:', error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Axios Config Error:', error.message)
    }
    // Return the error so components can potentially handle it too
    return Promise.reject(error)
  },
)

export default apiClient // Export the configured instance
