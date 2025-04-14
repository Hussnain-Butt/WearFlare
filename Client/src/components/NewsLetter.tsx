import React from 'react'

const NewsLetter = () => {
  return (
    <div className="bg-[#d3cac0] py-16 px-8 text-center border-t border-b border-gray-300">
      <h3 className="text-4xl md:text-5xl font-serif text-[#3a3a3a] mb-4 leading-tight">
        BE THE FIRST
      </h3>
      <p className="text-lg md:text-xl text-[#3a3a3a] mb-8 max-w-xl mx-auto">
        New arrivals. Exclusive previews. First access to sales. Sign up to stay in the know.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email address"
          className="bg-[#a68c76] border-0 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#a68c76]/50 h-12 rounded-full px-6 py-2 w-full md:w-auto"
        />

        <button className="bg-[#6b5745] hover:bg-[#5d4c3b] text-white font-semibold rounded-full px-8 py-2 h-12 transition-colors duration-200 w-full md:w-auto">
          SIGN UP
        </button>
      </div>
    </div>
  )
}

export default NewsLetter
