
// import React from 'react';
// import { Search, Heart, User, ShoppingBag } from 'lucide-react';
// import Logo from './Logo';
// import { Link } from 'react-router-dom';

// const Navbar: React.FC = () => {
//   return (
//     <nav className="w-full py-4 px-6 flex justify-between items-center">
//         <div className="gradient-bg" />
//       <div className="corner-dark-top" />
//       <div className="corner-dark-bottom" />
//       <div className="glow-effect" />
//       <div className="flex items-center space-x-12">
//         <Logo />
//         <ul className="hidden md:flex space-x-8">
//           <li>
//             <Link to="/" className="text-white font-semibold hover:text-wf-gold transition-colors">
//               HOME
//             </Link>
//           </li>
//           <li>
//             <Link to="/men" className="text-white font-semibold hover:text-wf-gold transition-colors">
//               MEN
//             </Link>
//           </li>
//           <li>
//             <Link to="/women" className="text-white font-semibold hover:text-wf-gold transition-colors">
//               WOMEN
//             </Link>
//           </li>
//           <li>
//             <Link to="/customize-avatar" className="text-white font-semibold hover:text-wf-gold transition-colors">
//               CUSTOMIZE 3D AVATAR
//             </Link>
//           </li>
//           <li>
//             <Link to="/virtual-fitting-room" className="text-white font-semibold hover:text-wf-gold transition-colors">
//               VIRTUAL FITTING ROOM
//             </Link>
//           </li>
//         </ul>
//       </div>
//       <div className="flex items-center space-x-4">
//         <button className="text-white hover:text-wf-gold transition-colors">
//           <Search size={22} />
//         </button>
//         <button className="text-white hover:text-wf-gold transition-colors">
//           <Heart size={22} />
//         </button>
//         <button className="text-white hover:text-wf-gold transition-colors">
//           <User size={22} />
//         </button>
//         <button className="text-white hover:text-wf-gold transition-colors">
//           <ShoppingBag size={22} />
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React from 'react';
import { Search, Heart, User, ShoppingBag } from 'lucide-react';
// import Logo from './Logo';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-12">
        {/* <Logo /> */}
        <ul className="hidden md:flex space-x-8">
          <li>
            <Link to="/" className="text-white font-semibold hover:text-wf-gold transition-colors">
              HOME
            </Link>
          </li>
          <li>
            <Link to="/men" className="text-white font-semibold hover:text-wf-gold transition-colors">
              MEN
            </Link>
          </li>
          <li>
            <Link to="/women" className="text-white font-semibold hover:text-wf-gold transition-colors">
              WOMEN
            </Link>
          </li>
          <li>
            <Link to="/customize-avatar" className="text-white font-semibold hover:text-wf-gold transition-colors">
              CUSTOMIZE 3D AVATAR
            </Link>
          </li>
          <li>
            <Link to="/virtual-fitting-room" className="text-white font-semibold hover:text-wf-gold transition-colors">
              VIRTUAL FITTING ROOM
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-white hover:text-wf-gold transition-colors">
          <Search size={22} />
        </button>
        <button className="text-white hover:text-wf-gold transition-colors">
          <Heart size={22} />
        </button>
        <button className="text-white hover:text-wf-gold transition-colors">
          <User size={22} />
        </button>
        <button className="text-white hover:text-wf-gold transition-colors">
          <ShoppingBag size={22} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

