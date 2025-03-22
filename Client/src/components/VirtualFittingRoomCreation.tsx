import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import men from "../../public/image.png";
import women from "../../public/image-1.png";

const VirtualFittingRoomCreation = () => {
  return (
    <div className="w-full background min-h-screen relative">
      {/* Background Gradient */}
      <div className="bg-gradient-to-br absolute from-[#231539] inset-0 to-[#17112A] via-[#3A2160] z-0" />
      <Navbar />

      <div className="flex flex-col justify-center absolute inset-0 items-center z-10">
        <h1 className="text-5xl text-center text-white font-bold font-serif mb-16 md:text-6xl">
          Please create your avatar first
        </h1>
        <div>
          <Link
            to="/customize-avatar"
            className="bg-[#463275] rounded-full text-white text-xl font-bold hover:bg-[#503a85] px-12 py-4 transition-colors"
          >
            Create Avatar
          </Link>
        </div>
      </div>

      {/* Bottom Left Image */}
      <img   
           src={women}

        alt="Men Avatar"
        className="h-[300px] w-auto absolute bottom-0 left-0"
      />

      {/* Bottom Right Image */}
      <img     
         src={men}

        alt="Women Avatar"
        className="h-[300px] w-auto absolute bottom-0 right-0"
      />
    </div>
  );
};

export default VirtualFittingRoomCreation;
