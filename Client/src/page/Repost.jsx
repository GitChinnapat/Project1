import React, { useState } from 'react';
import Header from "../components/header";
import moveBG from "../assets/bg.png";
function RepairStatusPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Sample repair data
  const repairItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop",
      building: "13102",
      jobType: "ไฟฟ้า",
      damagedPart: "หลอดไฟ",
      details: "เปิดไม่ติด",
      status: "complete"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop",
      building: "13102",
      jobType: "ไฟฟ้า",
      damagedPart: "หลอดไฟ",
      details: "เปิดไม่ติด",
      status: "inProgress"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop",
      building: "13102",
      jobType: "ไฟฟ้า",
      damagedPart: "หลอดไฟ",
      details: "เปิดไม่ติด",
      status: "inProgress"
    }
  ];

  return (
    <div 
      className="min-h-screen bg-[#FDF6ED]"
      style={{
        fontFamily: "'Kanit', sans-serif",
        backgroundImage: `url(${moveBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative"
      }}
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-white/45 pointer-events-none"></div>
<Header />
      {/* Main Content */}
      <main className="pt-28 sm:pt-32 md:pt-36 lg:pt-48 xl:pt-36 pb-12 px-4 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-semibold mb-6" style={{ color: '#4E2E16' }}>บริการ</h1>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
            {/* Card 1: แจ้งซ่อม */}
            <div className="bg-[#F8E9D6]/90 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full p-6 mb-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" style={{ color: '#4E2E16' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: '#4E2E16' }}>แจ้งซ่อม</h3>
              </div>
            </div>

            {/* Card 2: ขนย้าย/จัดสถานที่ */}
            <div className="bg-[#F8E9D6]/90 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full p-6 mb-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" style={{ color: '#4E2E16' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: '#4E2E16' }}>ขนย้าย / จัดสถานที่</h3>
              </div>
            </div>

            {/* Card 3: คู่มือการใช้งาน */}
            <div className="bg-[#F8E9D6]/90 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105">
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full p-6 mb-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" style={{ color: '#4E2E16' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold" style={{ color: '#4E2E16' }}>คู่มือการใช้งาน</h3>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6" style={{ color: '#4E2E16' }}>สถานะแจ้งซ่อม</h2>

          {/* Status Table */}
          <div className="bg-[#F8E9D6]/90 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: '#4E2E16' }}>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#4E2E16' }}>รูป</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#4E2E16' }}>อาคาร/สถานที่</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#4E2E16' }}>ประเภทงาน</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#4E2E16' }}>ส่วนที่ชำรุด</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#4E2E16' }}>รายละเอียด</th>
                    <th className="px-4 py-3 text-center font-semibold" style={{ color: '#4E2E16' }}>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {repairItems.map((item, index) => (
                    <tr key={item.id} className={index < repairItems.length - 1 ? 'border-b border-[#EFBF86]' : ''}>
                      <td className="px-4 py-4">
                        <img src={item.image} alt="สถานที่" className="w-24 h-20 object-cover rounded-lg shadow" />
                      </td>
                      <td className="px-4 py-4" style={{ color: '#4E2E16' }}>{item.building}</td>
                      <td className="px-4 py-4" style={{ color: '#4E2E16' }}>{item.jobType}</td>
                      <td className="px-4 py-4" style={{ color: '#4E2E16' }}>{item.damagedPart}</td>
                      <td className="px-4 py-4" style={{ color: '#4E2E16' }}>{item.details}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block px-6 py-2 rounded-full font-semibold text-sm ${
                          item.status === 'complete' ? 'bg-green-500 text-white' : 'bg-yellow-400'
                        }`} style={item.status === 'inProgress' ? { color: '#4E2E16' } : {}}>
                          {item.status === 'complete' ? 'เสร็จสิ้น' : 'กำลังดำเนินการ'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {repairItems.map((item) => (
                <div key={item.id} className="bg-white/80 rounded-2xl p-4 shadow-lg">
                  <img src={item.image} alt="สถานที่" className="w-full h-40 object-cover rounded-lg mb-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium" style={{ color: '#6B3E1E' }}>อาคาร/สถานที่:</span>
                      <span style={{ color: '#4E2E16' }}>{item.building}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium" style={{ color: '#6B3E1E' }}>ประเภทงาน:</span>
                      <span style={{ color: '#4E2E16' }}>{item.jobType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium" style={{ color: '#6B3E1E' }}>ส่วนที่ชำรุด:</span>
                      <span style={{ color: '#4E2E16' }}>{item.damagedPart}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium" style={{ color: '#6B3E1E' }}>รายละเอียด:</span>
                      <span style={{ color: '#4E2E16' }}>{item.details}</span>
                    </div>
                    <div className="pt-2">
                      <span className={`inline-block px-6 py-2 rounded-full font-semibold text-sm w-full text-center ${
                        item.status === 'complete' ? 'bg-green-500 text-white' : 'bg-yellow-400'
                      }`} style={item.status === 'inProgress' ? { color: '#4E2E16' } : {}}>
                        {item.status === 'complete' ? 'เสร็จสิ้น' : 'กำลังดำเนินการ'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RepairStatusPage;