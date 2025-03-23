import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const NewsLetter = () => {
  return (
    <div>
           {/* Newsletter Subscription */}
      <div className="bg-[#d3cac0] p-12 text-center border-t border-b border-gray-500">
        <h3 className="text-[40px] font-serif text-[#3a3a3a] mb-2 text-2xl font-bold">BE THE FIRST</h3>
        <p className="text-[#3a3a3a] mb-6 max-w-xl mx-auto text-xl font-semibold  ">
          New arrivals. Exclusive previews. First access to sales. Sign up to stay in the know.
        </p>
        
        <div className=" flex-col flex md:flex-row justify-center gap-2 max-w-md mx-auto ">
          <div className="relative flex-1">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-[#a68c76] border-0 text-white placeholder:text-white/70 h-12 rounded-full pl-6"
            />
          </div>

          <Button className="bg-[#6b5745] hover:bg-[#5d4c3b] text-white rounded-full px-6 h-12">
            SIGN UP
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewsLetter