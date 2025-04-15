import React, { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import AnimatedSection from './AnimatedSection'
import axios from 'axios'

interface Product {
  _id: string
  title: string
  price: string
  image: string
  gender: string
  category: string
}

const PopularSection: React.FC = () => {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [popularProducts, setPopularProducts] = useState<Product[]>([])

  useEffect(() => {
    // Fetch products and filter 3 random ones (either men or women)
    axios
      .get(`https://backend-production-c8ff.up.railway.app/api/products`)
      .then((res) => {
        const allProducts: Product[] = res.data
        // Filter only men or women products (choose "men" here; you can change to "women")
        const filtered = allProducts.filter((p) => p.gender === 'men')
        // Pick top 3 (or random 3 if needed)
        setPopularProducts(filtered.slice(0, 3))
      })
      .catch((err) => console.error('Error fetching popular products:', err))
  }, [])

  return (
    <div>
      <section className="w-full py-10 px-6 md:px-12 bg-[#D3C5B8] mt-10">
        <h2 className="text-4xl font-medium text-center mb-8 text-[#725D45]">Most Popular</h2>
        <AnimatedSection direction="left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularProducts.map((product) => (
              <div key={product._id} className="flex flex-col items-center">
                <div className="bg-white p-4 w-full">
                  <img
                    src={`https://backend-production-c8ff.up.railway.app${product.image}`}
                    alt={product.title}
                    className="w-full h-[450px] object-cover"
                  />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-800 font-medium">{product.title}</p>
                  <p className="text-sm font-medium mt-1">{product.price} Rs</p>
                  <div className="flex justify-center items-center gap-3">
                    <button
                      className="mt-2 px-4 py-2 bg-[#6b5745] text-white rounded-full hover:bg-[#5d4c3b]"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="mt-2 ml-2 px-4 py-2 bg-[#8B4513] text-white rounded-full hover:bg-[#70421e]"
                      onClick={() => navigate(`/try-on/${product._id}`)}
                    >
                      Try Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}

export default PopularSection
