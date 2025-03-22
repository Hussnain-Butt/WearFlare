import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import men from "../../public/image.png";
import women from "../../public/image-1.png";

const VirtualFittingRoomCreation = () => {
  return (
    <div className="w-full min-h-screen relative flex flex-col items-center justify-center">
      {/* Background Gradient Updated */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#B8860B] via-[#A37408] to-[#8C5F06] z-0" />

      {/* Main Content */}
      <div className="relative text-center z-10">
        <h1 className="text-4xl md:text-4xl text-white font-serif font-semibold mb-12">
          Please create your avatar first
        </h1>

        {/* Create Avatar Button */}
        <Link
          to="/customize-avatar"
          className="bg-white text-[#B8860B] text-lg font-medium px-8 py-4 rounded-full shadow-md transition-all"
        >
          Create Avatar
        </Link>
      </div>

      {/* Large Poster-Style Images */}
      <div className="absolute bottom-0 w-full flex justify-between px-0">
        <img
          src={women}
          alt="Women Avatar"
          className="h-[500px] w-auto rounded-md object-cover"
        />
        <img
          src={men}
          alt="Men Avatar"
          className="h-[500px] w-auto rounded-md object-cover"
        />
      </div>
    </div>
  );
};

export default VirtualFittingRoomCreation;
