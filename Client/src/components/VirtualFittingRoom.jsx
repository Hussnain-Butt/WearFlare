
// import React from 'react';
// import Navbar from '../components/Navbar';
// import { useNavigate } from 'react-router-dom';

// const Index = () => {
//   const navigate = useNavigate();

//   const handleCreateAvatar = () => {
//     navigate('/customize-avatar');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-purple-black overflow-hidden">
//       <Navbar />
//       <main className="relative w-full h-[calc(100vh-80px)]">
//         <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
//           <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-16">
//             Please create your avatar first
//           </h1>
//           <button 
//             onClick={handleCreateAvatar}
//             className="bg-[#463275] hover:bg-[#503a85] text-white font-bold py-4 px-12 rounded-full text-xl transition-colors duration-300"
//           >
//             Create avatar
//           </button>
//         </div>

//         {/* Mannequins */}
//         <div className="absolute bottom-0 left-0 h-[80%] w-[35%] z-0">
//           <div className="relative h-full">
//             <div className="absolute bottom-0 left-0 w-[48%] h-[95%] bg-[url('/public/lovable-uploads/38181f3d-6457-478f-bc79-efc1c02cee18.png')] bg-no-repeat bg-left-bottom bg-contain"></div>
//             <div className="absolute bottom-0 left-[40%] w-[48%] h-[95%] bg-[url('/public/lovable-uploads/38181f3d-6457-478f-bc79-efc1c02cee18.png')] bg-no-repeat bg-left-bottom bg-contain transform -scale-x-100"></div>
//           </div>
//         </div>

//         {/* Right Mannequins */}
//         <div className="absolute bottom-0 right-0 h-[80%] w-[35%] z-0">
//           <div className="relative h-full">
//             <div className="absolute bottom-0 right-[40%] w-[48%] h-[95%] bg-[url('/public/lovable-uploads/38181f3d-6457-478f-bc79-efc1c02cee18.png')] bg-no-repeat bg-right-bottom bg-contain transform"></div>
//             <div className="absolute bottom-0 right-0 w-[48%] h-[95%] bg-[url('/public/lovable-uploads/38181f3d-6457-478f-bc79-efc1c02cee18.png')] bg-no-repeat bg-right-bottom bg-contain transform -scale-x-100"></div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Index;



import React from 'react';
import { Link } from 'react-router-dom';

const VirtualFittingRoom = () => {
  return (
    <div className="min-h-screen bg-gradient-purple-black overflow-hidden">
        {/* Background and Glass Effect */}
        <div className="gradient-bg" />
      <div className="corner-dark-top" />
      <div className="corner-dark-bottom" />
      <div className="glow-effect" />
      {/* Navbar */}
      <nav className="w-full py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-12">
          {/* Logo */}
          <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] flex items-center justify-center relative">
            <div className="text-[#D4AF37] font-serif text-2xl font-bold">WF</div>
            <div className="absolute -top-1 -left-1 -right-1 -bottom-1 rounded-full border border-[#D4AF37] opacity-50"></div>
            <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-full border border-[#D4AF37] opacity-30"></div>
          </div>
          
          {/* Navigation links */}
          <ul className="hidden md:flex space-x-8">
            <li>
              <Link to="/" className="text-white font-semibold hover:text-[#D4AF37] transition-colors">
                HOME
              </Link>
            </li>
            <li>
              <Link to="/men" className="text-white font-semibold hover:text-[#D4AF37] transition-colors">
                MEN
              </Link>
            </li>
            <li>
              <Link to="/women" className="text-white font-semibold hover:text-[#D4AF37] transition-colors">
                WOMEN
              </Link>
            </li>
            <li>
              <Link to="/customize-avatar" className="text-white font-semibold hover:text-[#D4AF37] transition-colors">
                CUSTOMIZE 3D AVATAR
              </Link>
            </li>
            <li>
              <Link to="/virtual-fitting-room" className="text-white font-semibold hover:text-[#D4AF37] transition-colors">
                VIRTUAL FITTING ROOM
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Icons */}
        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-[#D4AF37] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="text-white hover:text-[#D4AF37] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="text-white hover:text-[#D4AF37] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          <button className="text-white hover:text-[#D4AF37] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="relative w-full h-[calc(100vh-80px)]">
        <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-16">
            Please create your avatar first
          </h1>
          <Link 
            to="/customize-avatar"
            className="bg-[#463275] hover:bg-[#503a85] text-white font-bold py-4 px-12 rounded-full text-xl transition-colors duration-300"
          >
            Create avatar
          </Link>
        </div>

        {/* Left Mannequins */}
        <div className="absolute bottom-0 left-0 h-[80%] w-[35%] z-0">
          <div className="relative h-full">
            <div className="absolute bottom-0 left-0 w-[48%] h-[95%] bg-[url('/public/lovable-uploads/7b8671be-d65c-4e7f-b5ed-77db19a1c7c7.png')] bg-no-repeat bg-left-bottom bg-contain"></div>
            <div className="absolute bottom-0 left-[40%] w-[48%] h-[95%] bg-[url('/public/lovable-uploads/7b8671be-d65c-4e7f-b5ed-77db19a1c7c7.png')] bg-no-repeat bg-left-bottom bg-contain transform -scale-x-100"></div>
          </div>
        </div>

        {/* Right Mannequins */}
        <div className="absolute bottom-0 right-0 h-[80%] w-[35%] z-0">
          <div className="relative h-full">
            <div className="absolute bottom-0 right-[40%] w-[48%] h-[95%] bg-[url('/public/lovable-uploads/7b8671be-d65c-4e7f-b5ed-77db19a1c7c7.png')] bg-no-repeat bg-right-bottom bg-contain transform"></div>
            <div className="absolute bottom-0 right-0 w-[48%] h-[95%] bg-[url('/public/lovable-uploads/7b8671be-d65c-4e7f-b5ed-77db19a1c7c7.png')] bg-no-repeat bg-right-bottom bg-contain transform -scale-x-100"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VirtualFittingRoom;