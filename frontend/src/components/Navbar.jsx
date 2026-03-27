import React from 'react';
import { Layers, Lock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavbarItem = ({ label, disabled }) => {
  if (disabled) {
    return (
      <div className="relative group flex items-center text-gray-600 cursor-not-allowed">
        <Lock className="w-3 h-3 mr-1 opacity-50" />
        {label}
        <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
          🚧 Module under development
        </div>
      </div>
    );
  }
  return null;
};

const Navbar = ({ activePage, setActivePage, hasAnomaly }) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <nav className="bg-[#281105] border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center space-x-2 cursor-pointer">
        <Layers className="text-[#f97316] w-6 h-6" />
        <span className="text-xl font-bold tracking-wider text-white">
          NEXUS<span className="text-[#9CA3AF] font-light">-Foundry</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
        <Link 
          to="/" 
          className={`transition ${!isDashboard ? 'text-[#f97316] border-b-2 border-[#f97316] pb-1' : 'text-[#9CA3AF] hover:text-white'}`}
        >
          Home
        </Link>
        <Link 
          to="/dashboard"
          onClick={() => setActivePage('dashboard')}
          className={`transition ${isDashboard ? 'text-[#f97316] border-b-2 border-[#f97316] pb-1' : 'text-[#9CA3AF] hover:text-white'}`}
        >
          Melting Twin
        </Link>
        
        <NavbarItem label="Molding" disabled={true} />
        <NavbarItem label="Pouring" disabled={true} />
        <NavbarItem label="Quality" disabled={true} />
      </div>

      {isDashboard && (
        <div className="flex items-center space-x-4">
          <div className="relative cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {hasAnomaly && (
              <>
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-[#ef4444] ring-2 ring-[#281105] pulse-red" />
                <div className="absolute top-10 right-0 bg-red-600 text-white text-[10px] p-2 rounded shadow-xl whitespace-nowrap z-50 animate-bounce">
                  ALERT: RECONFIGURE TEMP IN MELTING TWIN
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
