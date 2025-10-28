import React, { useState } from 'react';
import Header from '../components/header';
import HOWTObg from "../assets/bg.png";

export default function ManualPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div 
      className="min-h-screen font-['Kanit',sans-serif] bg-[#FDF6ED]" 
      style={{
        backgroundImage: `url(${HOWTObg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}
    >
      <Header />
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-white/45 pointer-events-none"></div>

      {/* Main Content */}
      <main className="relative pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-36 pb-12 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto w-full">
          {/* Title Section */}
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="bg-[#F3D9B0] rounded-full p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg flex-shrink-0">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#4E2E16]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-brown-700 leading-tight">
              คู่มือการใช้งาน
            </h1>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* Card 1: วิธีการแจ้งปัญหา/แจ้งซ่อม */}
            <div className="bg-white/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border-2 border-[#EFBF86] hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex flex-col items-center mb-6">
                <div className="bg-white rounded-full p-5 sm:p-6 md:p-7 lg:p-8 shadow-lg mb-4 sm:mb-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-[#4E2E16]" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M9 12h6m-3-3v6" 
                    />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#4E2E16] text-center mb-4 leading-tight">
                  วิธีการแจ้งปัญหา/แจ้งซ่อม
                </h2>
              </div>
              
              <div className="space-y-3 text-sm sm:text-base lg:text-lg text-[#6B3E1E] leading-relaxed">
                <p className="text-gray-600 font-medium">การแจ้งปัญหาการซ่อม</p>
                <p>
                  การแจ้งซ่อมควรมีรายละเอียดเกี่ยวกับระบบหรืออุปกรณ์ที่มีปัญหา เช่น อาการเสีย ตำแหน่งที่เกิดปัญหา และอุปกรณ์ที่เสียหาย
                </p>
                <p>
                  สามารถแนบรูปภาพ (ถ้ามี) เพื่อให้เจ้าหน้าที่สามารถตรวจสอบและดำเนินการซ่อมได้อย่างถูกต้องและรวดเร็ว
                </p>
                <p>
                  ควรแจ้งซ่อมโดยเร็วเมื่อพบปัญหา เพื่อให้การดำเนินการเป็นไปอย่างมีประสิทธิภาพ
                </p>
              </div>
            </div>

            {/* Card 2: วิธีการขอใช้บริการขนย้าย */}
            <div className="bg-white/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border-2 border-[#EFBF86] hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex flex-col items-center mb-6">
                <div className="bg-white rounded-full p-5 sm:p-6 md:p-7 lg:p-8 shadow-lg mb-4 sm:mb-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 text-[#4E2E16]" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#4E2E16] text-center mb-4 leading-tight">
                  วิธีการขอใช้บริการขนย้าย
                </h2>
              </div>
              
              <div className="space-y-3 text-sm sm:text-base lg:text-lg text-[#6B3E1E] leading-relaxed">
                <p className="text-gray-600 font-medium">การขอใช้บริการขนย้าย</p>
                <p>
                  การขอใช้บริการขนย้ายควรระบุรายละเอียด เช่น ประเภทของสิ่งของที่ต้องการขนย้าย จำนวน ตำแหน่งต้นทาง และปลายทาง
                </p>
                <p>
                  รวมถึงวันและเวลาที่ต้องการใช้บริการ เพื่อให้เจ้าหน้าที่สามารถจัดเตรียมอุปกรณ์และบุคลากรได้อย่างเหมาะสม
                </p>
                <p>
                  ควรแจ้งล่วงหน้าอย่างน้อย 3-5 วันทำการ เพื่อให้การดำเนินการเป็นไปอย่างราบรื่น
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  );
}