
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="w-16 h-16 rounded-full border-2 border-wf-gold flex items-center justify-center relative">
      <div className="text-wf-gold font-playfair text-2xl font-bold">WF</div>
      <div className="absolute -top-1 -left-1 -right-1 -bottom-1 rounded-full border border-wf-gold opacity-50"></div>
      <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-full border border-wf-gold opacity-30"></div>
    </div>
  );
};

export default Logo;
