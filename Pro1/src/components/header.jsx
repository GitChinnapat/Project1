import React, { useState, useEffect } from 'react';
import HeaderImage from "../assets/header.png"

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const LoginBTN = () => {
    window.location.href = '/login';
  };
  const Howtouse = (e) => {
    e.preventDefault();
    window.location.href = "/Howtouse";
  };
  const Moving = (e) => {
    e.preventDefault();
    window.location.href = "/Moving";
  };
  const Repair = (e) => {
    e.preventDefault();
    window.location.href = "/Repair";
  };
    const Repost = (e) => {
    e.preventDefault();
    window.location.href = "/Repost";
  };
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.querySelector('.mobile-menu-container');
      const hamburger = document.querySelector('.hamburger-button');
      
      if (menu && hamburger && !menu.contains(event.target) && !hamburger.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-md lg:bg-transparent lg:-mt-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Kanit', sans-serif;
        }
        
        .hamburger-line {
          display: block;
          width: 25px;
          height: 3px;
          background-color: #4E2E16;
          margin: 5px 0;
          transition: 0.3s;
        }
        
        .hamburger-active .hamburger-line:nth-child(1) {
          transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger-active .hamburger-line:nth-child(2) {
          opacity: 0;
        }
        
        .hamburger-active .hamburger-line:nth-child(3) {
          transform: rotate(45deg) translate(-5px, -6px);
        }
        
        .mobile-menu-container {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }
        
        .mobile-menu-active {
          max-height: 500px;
        }
      `}</style>

      <div className="w-full px-4 sm:px-6 lg:px-24 py-1.5 lg:py-0">
        <div className="flex items-center justify-between lg:gap-8">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <img 
              src={HeaderImage}
              alt="RMUTI Logo"
              className="h-12 sm:h-14 mt-6 md:h-16 lg:h-20 xl:h-32 w-auto object-contain transition-transform duration-300 cursor-pointer "
            />
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex bg-[#F8E9D6]/70 backdrop-blur-md rounded-2xl mt-8 px-4 xl:px-6 py-2 shadow-lg flex-shrink-0 border-2 border-[#E59A5D]">
            <div className="flex items-center gap-3 xl:gap-5 text-sm xl:text-base font-medium text-[#4E2E16]">
              <a href="Repost" onClick={Repost} className="hover:text-[#6B3E1E] hover:scale-110 hover:font-semibold transition-all duration-200 whitespace-nowrap">
                สถานะแจ้งซ่อม
              </a>
              <a href="Repair" onClick= {Repair} className="hover:text-[#6B3E1E] hover:scale-110 hover:font-semibold transition-all duration-200 whitespace-nowrap">
                แจ้งปัญหา/แจ้งซ่อม
              </a>
              <a href="/Moving" onClick={Moving} className="hover:text-[#6B3E1E] hover:scale-110 hover:font-semibold transition-all duration-200 whitespace-nowrap">
                ขนย้าย/จัดสถานที่
              </a>
              <a href="/Howtouse" onClick={Howtouse} className="hover:text-[#6B3E1E] hover:scale-110 hover:font-semibold transition-all duration-200 whitespace-nowrap">
                คู่มือการใช้งาน
              </a>
              <a href="#" className="hover:text-[#6B3E1E] hover:scale-110 hover:font-semibold transition-all duration-200 whitespace-nowrap">
                ติดต่อเรา
              </a>
              <button 
                onClick={LoginBTN}
                className="hover:text-[#6B3E1E] hover:scale-110 transition-all duration-200 font-semibold whitespace-nowrap"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </nav>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={toggleMobileMenu}
            className={`lg:hidden hamburger-button p-2 mt-1 rounded-lg hover:bg-[#F8E9D6]/50 transition-colors ${isMobileMenuOpen ? 'hamburger-active' : ''}`}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-menu-container lg:hidden ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
          <nav className="bg-[#F8E9D6]/90 backdrop-blur-md rounded-xl mt-3 shadow-lg border-2 border-[#E59A5D]">
            <div className="flex flex-col py-3">
              <a href="Repost" onClick={Repost} className="px-6 py-3 text-[#4E2E16] font-medium hover:bg-[#F3D9B0]/50 transition-colors">
                สถานะแจ้งซ่อม
              </a>
              <a href="/Repair" onClick={Repair} className="px-6 py-3 text-[#4E2E16] font-medium hover:bg-[#F3D9B0]/50 transition-colors">
                แจ้งปัญหา/แจ้งซ่อม
              </a>
              <a href="/Moving" onClick={Moving} className="px-6 py-3 text-[#4E2E16] font-medium hover:bg-[#F3D9B0]/50 transition-colors">
                ขนย้าย/จัดสถานที่
              </a>
              <a href="/Howtouse" onClick={Howtouse} className="px-6 py-3 text-[#4E2E16] font-medium hover:bg-[#F3D9B0]/50 transition-colors">
                คู่มือการใช้งาน
              </a>
              <a href="#" className="px-6 py-3 text-[#4E2E16] font-medium hover:bg-[#F3D9B0]/50 transition-colors">
                ติดต่อเรา
              </a>
              <button 
                onClick={LoginBTN}
                className="px-6 py-3 text-[#4E2E16] font-semibold hover:bg-[#F3D9B0]/50 transition-colors text-left"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;