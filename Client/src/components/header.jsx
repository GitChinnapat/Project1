import React, { useState, useEffect } from 'react';
import HeaderImage from "../assets/header.png"  // ← ลบ space ออก
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleLogout = () => {
    // Clear everything
    logout();
    sessionStorage.clear();
    localStorage.clear();
    // Hard redirect to login page
    window.location.href = '/login';
  };

  const Howtouse = (e) => {
    e.preventDefault();
    window.location.href = "/Howtouse";
  };
  const Moving = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = "/login";
    } else {
      window.location.href = "/Moving";
    }
  };
  const Repair = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = "/login";
    } else {
      window.location.href = "/Repair";
    }
  };
  const Repost = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = "/login";
    } else {
      window.location.href = "/Repost";
    }
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
        @import url('https://fonts.googleapis. com/css2?family=Kanit:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Kanit', sans-serif;
        }
        

        
        .mobile-menu-container {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }
        
        .mobile-menu-active {
          max-height: 600px;
        }
      `}</style>

      <div className="w-full px-4 sm:px-6 lg:px-24 py-4 lg:py-6 relative z-50">
        <div className="flex items-center justify-between lg:gap-12 min-h-[90px]">
          {/* Logo Section - ขยายให้ใหญ่ขึ้น */}
          <div className="flex items-center flex-shrink-0">
            <img
              src={HeaderImage}
              alt="RMUTI Logo"
              className="h-16 sm:h-20 md:h-24 lg:h-32 w-auto object-contain transition-transform duration-300 cursor-pointer drop-shadow-md hover:scale-105"
            />
          </div>

          {/* Desktop Navigation Menu - ปรับ padding/margin ให้ลอยสวยๆ */}
          <nav className="hidden lg:flex items-center bg-[#F8E9D6]/80 backdrop-blur-md rounded-2xl px-8 py-4 shadow-lg flex-shrink-0 border-2 border-[#E59A5D] mt-4 lg:mt-0">
            <div className="flex items-center gap-6 xl:gap-8 text-base font-medium text-[#4E2E16]">
              <a href="Repost" onClick={Repost} className="hover:text-[#6B3E1E] hover:scale-110 hover:font-bold transition-all duration-200 whitespace-nowrap">
                สถานะ
              </a>
              <a href="Repair" onClick={Repair} className="hover:text-[#6B3E1E] hover:scale-110 hover:font-bold transition-all duration-200 whitespace-nowrap">
                แจ้งปัญหา/แจ้งซ่อม
              </a>
              <a href="/Moving" onClick={Moving} className="hover:text-[#6B3E1E] hover:scale-110 hover:font-bold transition-all duration-200 whitespace-nowrap">
                ขนย้าย/จัดสถานที่
              </a>
              <a href="/Howtouse" onClick={Howtouse} className="hover:text-[#6B3E1E] hover:scale-110 hover:font-bold transition-all duration-200 whitespace-nowrap">
                คู่มือการใช้งาน
              </a>
              <a href="#" className="hover:text-[#6B3E1E] hover:scale-110 hover:font-bold transition-all duration-200 whitespace-nowrap">
                ติดต่อเรา
              </a>

              {isAuthenticated && user && user.position === 'admin' && (
                <a
                  href="/admin"
                  className="hover:text-[#6B3E1E] hover:scale-110 hover:font-semibold transition-all duration-200 whitespace-nowrap bg-[#8B4513] text-white px-3 py-1 rounded-lg"
                >
                  🛡️ Admin
                </a>
              )}

              {isAuthenticated && user ? (
                <div className="flex items-center gap-3 pl-3 border-l-2 border-[#E59A5D]">
                  <div className="flex flex-col items-end">
                    <span className="whitespace-nowrap">👤 {user.name}</span>
                    <span className="text-xs text-[#8B6E47] whitespace-nowrap">({user.position || 'ผู้ใช้งาน'})</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="hover:text-[#6B3E1E] hover:scale-110 transition-all duration-200 font-semibold whitespace-nowrap"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="hover:text-[#6B3E1E] hover:scale-110 transition-all duration-200 font-semibold whitespace-nowrap"
                >
                  เข้าสู่ระบบ
                </button>
              )}
            </div>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            // ปรับ sizing และลบ mt-6 ออก ให้มัน center เองตาม flex parent
            className="lg:hidden p-2 rounded-xl bg-[#F8E9D6] text-[#8B4513] hover:bg-[#F3D9B0] transition-all shadow-md border border-[#E59A5D] active:scale-95"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`mobile-menu-container lg:hidden ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
          <nav className="bg-[#F8E9D6]/90 backdrop-blur-md rounded-xl mt-3 shadow-lg border-2 border-[#E59A5D]">
            <div className="flex flex-col py-3">
              <a href="Repost" onClick={Repost} className="px-6 py-3 text-[#4E2E16] font-medium hover:bg-[#F3D9B0]/50 transition-colors">
                สถานะ
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

              {/* ลิงก์ Admin สำหรับ admin - Mobile */}
              {isAuthenticated && user && user.position === 'admin' && (
                <a
                  href="/admin"
                  className="px-6 py-3 text-white font-semibold bg-[#8B4513] hover:bg-[#6B3E1E] transition-colors"
                >
                  🛡️ Admin Dashboard
                </a>
              )}

              {/* แสดงชื่อผู้ใช้หรือปุ่มเข้าสู่ระบบ */}
              {isAuthenticated && user ? (
                <>
                  <div className="px-6 py-3 text-[#4E2E16] font-medium border-t border-[#E59A5D]">
                    <div>👤 {user.name}</div>
                    <div className="text-sm text-[#8B6E47]">ตำแหน่ง: {user.position || 'ผู้ใช้งาน'}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 text-[#4E2E16] font-semibold hover:bg-[#F3D9B0]/50 transition-colors text-left"
                  >
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-6 py-3 text-[#4E2E16] font-semibold hover:bg-[#F3D9B0]/50 transition-colors text-left"
                >
                  เข้าสู่ระบบ
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;