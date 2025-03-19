
import React from 'react';

interface BackgroundGradientProps {
  children: React.ReactNode;
}

const BackgroundGradient = ({ children }: BackgroundGradientProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#17112A]">
      {/* Main gradient background with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#17112A] via-[#321B5A] to-black animate-gradient-shift bg-[length:200%_200%] z-0"></div>
      
      {/* Top right darker corner */}
      <div className="absolute top-0 right-0 w-[30vw] h-[30vw] rounded-bl-full bg-black opacity-40 blur-[50px] z-0"></div>
      
      {/* Bottom left darker corner */}
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-tr-full bg-black opacity-40 blur-[50px] z-0"></div>
      
      {/* Radial glow effect */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-wearflare-purple opacity-20 blur-[120px] animate-pulse-subtle z-0"></div>
      
      {/* Secondary radial glow */}
      <div className="absolute left-[40%] top-[30%] w-[30vw] h-[30vw] rounded-full bg-wearflare-lightPurple opacity-10 blur-[100px] animate-pulse-subtle z-0"></div>
      
      {/* Content container */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default BackgroundGradient;
