import React from 'react';
import { Button } from "@/components/ui/button";
import Navbar from './Navbar';
import boy1 from "../../public/img1-virtual-fitting-room.png";

const VirtualFittingRoom = () => {
  return (
    <div className="min-h-screen w-full relative background z-10">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#231539] via-[#3A2160] to-[#17112A] z-0" />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative flex flex-col items-end p-2">
        {/* Image on the most right with 20px padding */}
        <img 
          src={boy1} 
          alt="Model" 
          className="h-[300px] rounded-md shadow-xl mt-5 mr-5"
        />

        {/* Button centered below the image */}
        <div className="w-full flex justify-center mt-5">
          <Button className="bg-[#4B3B75] hover:bg-[#5D4D8A] text-white text-xl font-medium py-8 px-16 rounded-full shadow-lg">
            Try own
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VirtualFittingRoom;
