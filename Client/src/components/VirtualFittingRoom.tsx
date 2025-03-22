import React from 'react';
import { Button } from "@/components/ui/button";
import Navbar from './Navbar';
import boy1 from "../../public/img1-virtual-fitting-room.png";

const VirtualFittingRoom = () => {
  return (
    <div className="min-h-screen w-full relative background z-10">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#B8860B] via-[#A37408] to-[#8C5F06] z-0" />
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
          <Button className="bg-white hover:bg-white text-[#B8860B] text-lg font-medium py-4 px-10 rounded-full">
            Try own
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VirtualFittingRoom;
