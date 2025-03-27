import React from 'react'

interface SearchProps {
  isOpen: boolean
  onClose: () => void
}

const Search: React.FC<SearchProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null // If not open, return nothing

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Popup Container */}
      <div
        className="relative w-full max-w-lg p-6 bg-white rounded shadow-md 
                      animate-[fadeIn_0.3s_ease_forwards]"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-black hover:text-red-500">
          ✕
        </button>

        <h2 className="mb-4 text-xl font-bold text-gray-800">Search</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-[#c8a98a]"
        />

        {/* Search by Image */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="imageSearch"
            className="px-4 py-2 font-semibold text-white rounded cursor-pointer bg-[#c8a98a] hover:bg-opacity-90"
          >
            Search by Image
          </label>
          <input
            id="imageSearch"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              // handle your image logic here
              console.log('Selected file:', e.target.files?.[0])
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Search
