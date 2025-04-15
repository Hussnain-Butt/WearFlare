import React from 'react'
import sweater1 from '../assets/women sweatshirts/women-sweat-1.jpg'
import Jackets from '../assets/mens jackets/jacket-1.jpg'
import Shirts from '../assets/mens shirts/shirt-1.jpg'
import Pants from '../assets/men pents/pant-1.jpg'
import SweatShirt from '../assets/men sweatshirts/sweatshirt-1.jpg'
const NewCollection = () => {
  const products = [
    {
      id: 1,
      image: Jackets, // Replace with actual image paths
      name: 'BLACK BLANDED KURTA',
      price: '3,592.00',
    },
    {
      id: 2,
      image: Shirts,
      name: 'GRAY BLANDED FORMAL KURTA',
      price: '18,990.00',
    },
    {
      id: 3,
      image: Pants,
      name: 'NAVY BLUE COTTON KURTA',
      price: '3,192.00',
    },
  ]

  return (
    <div className="bg-[#eee8e3] py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl text-gray-700 font-serif">New Collection</h2>
      </div>
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-[#d3cac0] rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-fill object-center"
            />
            <div className="p-4">
              <p className="text-gray-800 text-sm font-medium">{product.name}</p>
              <p className="text-gray-600 text-sm mt-1">PKR {product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewCollection
