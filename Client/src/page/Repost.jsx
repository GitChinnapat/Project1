import React, { useState, useEffect } from 'react';
import Header from "../components/header";
import { repairAPI, movingAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import moveBG from "../assets/bg.png";

function RepairStatusPage() {
  const { isAuthenticated, user } = useAuth();
  const [allRequests, setAllRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllRequests();
  }, [user]);

  const RepairCard = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = "/login";
    } else {
      window.location.href = "/Repair";
    }
  };

  const MovingCard = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = "/login";
    } else {
      window.location.href = "/Moving";
    }
  };

  const HowtoCard = (e) => {
    e.preventDefault();
    window.location.href = "/Howtouse";
  };

  const fetchAllRequests = async () => {
    try {
      setIsLoading(true);
      setError("");
      // ฟังชั่นแปลงประเภทงานซ่อม
      const translateRepairType = (code) => {
        const repairTypes = {
          'electric': 'ไฟฟ้า',
          'plumbing': 'ประปา',
          'aircon': 'เครื่องปรับอากาศ',
          'furniture': 'เฟอร์นิเจอร์',
          'computer': 'คอมพิวเตอร์'
        };
        return repairTypes[code] || code;
      };

      // ฟังชั่นแปลงประเภทงานขนย้าย
      const translateMovingType = (code) => {
        const movingTypes = {
          'move': 'ขนย้ายอุปกรณ์',
          'arrange': 'จัดสถานที่',
          'setup': 'ติดตั้งอุปกรณ์'
        };
        return movingTypes[code] || code;
      };



      // ดึงข้อมูล repair
      const repairResponse = await repairAPI.getAllRepairs();
      const repairs = (repairResponse.data || []).map(item => ({
        ...item,
        type: 'repair',
        id: item.id,
        image: item.img ? `http://localhost:5000${item.img}` : "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop",
        building: item.location,
        jobType: translateRepairType(item.type_work),
        damagedPart: item.detail.split(' ')[0] || item.detail,
        details: item.detail,
        userName: item.user_name,
        createdAt: item.created_at,
        status: item.status || 'pending'
      }));

      // ดึงข้อมูล moving
      const movingResponse = await movingAPI.getAllMoving();
      const moving = (movingResponse.data || []).map(item => ({
        ...item,
        type: 'moving',
        id: item.move_id,
        image: item.img ? `http://localhost:5000${item.img}` : "https://images.unsplash.com/photo-1600993463592-0f390e71b63f?w=200&h=150&fit=crop",
        building: item.location,
        jobType: translateMovingType(item.type_work),
        damagedPart: item.detail.split(' ')[0] || item.detail,
        details: item.detail,
        userName: item.user_name,
        createdAt: item.created_at,
        status: item.status || 'pending'
      }));

      // รวมข้อมูล repair และ moving
      const combined = [...repairs, ...moving].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Filter ข้อมูลเฉพาะของผู้ใช้ที่ login อยู่
      const userRequests = user ? combined.filter(item => String(item.user_id) === String(user.id)) : [];

      setAllRequests(userRequests);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  // Helper functions for status display
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'complete': return 'bg-green-500 text-white'; // Support legacy
      case 'inProgress': return 'bg-yellow-400 text-[#4E2E16]';
      case 'cancelled': return 'bg-red-500 text-white';
      case 'pending':
      default: return 'bg-gray-400 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'เสร็จสิ้น';
      case 'complete': return 'เสร็จสิ้น'; // Support legacy
      case 'inProgress': return 'กำลังดำเนินการ';
      case 'cancelled': return 'ยกเลิก';
      case 'pending':
      default: return 'รอดำเนินการ';
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);

  // ... (keep useEffect and fetching logic same) ...

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

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={selectedImage}
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border-4 border-white object-contain"
              alt="Full size"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
            />
            <button className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all">
              ปิดขยายรูปภาพ
            </button>
          </div>
        </div>
      )}

      {/* Main Content - เพิ่ม pt ให้เนื้อหาดันลงมา */}
      <main className="pt-32 sm:pt-40 md:pt-44 lg:pt-52 xl:pt-56 pb-12 px-4 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Title - ปรับ Margin ให้ห่างขึ้น */}
          <h1 className="text-3xl sm:text-4xl font-semibold mb-8 pl-2 border-l-8 border-[#8B4513] ml-2" style={{ color: '#4E2E16' }}>บริการของเรา</h1>

          {/* Service Cards - ปรับ Grid ให้สวยงามขึ้น */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {/* Card 1: แจ้งซ่อม */}
            <div className="bg-[#F8E9D6]/90 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 group" onClick={RepairCard}>
              <div className="flex flex-col items-center text-center h-full justify-center">
                <div className="bg-white rounded-full p-6 mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#4E2E16]">แจ้งซ่อม</h3>
                <p className="text-sm text-[#8B6E47] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">แจ้งปัญหา/ซ่อมแซมอุปกรณ์</p>
              </div>
            </div>

            {/* Card 2: ขนย้าย/จัดสถานที่ */}
            <div className="bg-[#F8E9D6]/90 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 group" onClick={MovingCard}>
              <div className="flex flex-col items-center text-center h-full justify-center">
                <div className="bg-white rounded-full p-6 mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#8B4513]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#4E2E16]">ขนย้าย / จัดสถานที่</h3>
                <p className="text-sm text-[#8B6E47] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">บริการขนย้ายและจัดเตรียมสถานที่</p>
              </div>
            </div>

            {/* Card 3: คู่มือการใช้งาน */}
            <div className="bg-[#F8E9D6]/90 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 group" onClick={HowtoCard}>
              <div className="flex flex-col items-center text-center h-full justify-center">
                <div className="bg-white rounded-full p-6 mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <svg className="w-12 h-12 text-[#8B4513]" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v16h16V4H4zm2 2h12v2H6V6zm0 4h12v2H6v-2zm0 4h12v2H6v-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#4E2E16]">คู่มือการใช้งาน</h3>
                <p className="text-sm text-[#8B6E47] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">วิธีการใช้งานระบบเบื้องต้น</p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 pl-2 border-l-8 border-[#E59A5D] ml-2" style={{ color: '#4E2E16' }}>ติดตามสถานะ</h2>

          {/* Loading / Error / Content */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EFBF86]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
              <p className="font-semibold">เกิดข้อผิดพลาด</p>
              <p>{error}</p>
            </div>
          ) : allRequests.length === 0 ? (
            <div className="bg-[#F8E9D6]/90 rounded-3xl p-12 text-center shadow-lg border-2 border-[#E59A5D] border-dashed">
              <svg className="w-16 h-16 mx-auto text-[#8B6E47] mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p style={{ color: '#4E2E16' }} className="text-xl font-medium">ยังไม่มีรายการแจ้งซ่อมหรือขนย้าย</p>
              <p className="text-[#8B6E47] mt-2">เมื่อท่านทำรายการแล้ว ข้อมูลจะปรากฏที่นี่</p>
            </div>
          ) : (
            <div className="bg-[#F8E9D6]/90 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl overflow-hidden border border-[#E59A5D]">
              {/* Desktop Table - Add Scroll X and min-width */}
              <div className="hidden lg:block overflow-x-auto custom-scrollbar pb-2">
                <table className="w-full min-w-[1000px] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#4E2E16]/20">
                      <th className="px-6 py-4 text-left font-bold text-lg text-[#4E2E16] w-[140px]">รูปภาพ</th>
                      <th className="px-4 py-4 text-left font-bold text-lg text-[#4E2E16]">อาคาร/สถานที่</th>
                      <th className="px-4 py-4 text-left font-bold text-lg text-[#4E2E16]">ประเภท</th>
                      <th className="px-4 py-4 text-left font-bold text-lg text-[#4E2E16]">งาน</th>
                      <th className="px-4 py-4 text-left font-bold text-lg text-[#4E2E16] w-[25%]">รายละเอียด</th>
                      <th className="px-4 py-4 text-center font-bold text-lg text-[#4E2E16]">เวลาที่แจ้ง</th>
                      <th className="px-4 py-4 text-center font-bold text-lg text-[#4E2E16] w-[150px]">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRequests.map((item, index) => (
                      <tr key={`${item.type}-${item.id}`} className={`hover:bg-[#FDF6ED]/50 transition-colors ${index < allRequests.length - 1 ? 'border-b border-[#EFBF86]/50' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="relative group w-24 h-20 overflow-hidden rounded-xl shadow-md cursor-zoom-in" onClick={() => setSelectedImage(item.image)}>
                            <img
                              src={item.image}
                              alt="สถานที่"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div style={{ color: '#4E2E16' }} className="font-bold text-base mb-1">{item.building}</div>
                          <div className="flex items-center gap-1 text-sm bg-white/50 px-2 py-1 rounded inline-block">
                            <span className="text-[#8B6E47]">👤 {item.userName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.type === 'repair' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                            {item.type === 'repair' ? 'แจ้งซ่อม' : 'ขนย้าย'}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-top font-medium" style={{ color: '#4E2E16' }}>{item.jobType}</td>
                        <td className="px-4 py-4 align-top text-sm" style={{ color: '#4E2E16' }}>
                          <div className="line-clamp-2 hover:line-clamp-none transition-all cursor-pointer">{item.details}</div>
                        </td>
                        <td className="px-4 py-4 text-center align-top text-sm text-[#6B3E1E] whitespace-nowrap">{formatDate(item.createdAt)}</td>
                        <td className="px-4 py-4 text-center align-top">
                          <span className={`inline-block px-4 py-1.5 rounded-full font-bold text-xs shadow-sm uppercase tracking-wider ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {allRequests.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-[#E59A5D]/30 transition-all hover:shadow-xl">

                    {/* Image Header */}
                    <div
                      className="relative w-full h-48 rounded-xl overflow-hidden mb-4 group cursor-zoom-in shadow-md"
                      onClick={() => setSelectedImage(item.image)}
                    >
                      <img
                        src={item.image}
                        alt="สถานที่"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold shadow-sm ${item.type === 'repair' ? 'bg-orange-100/90 text-orange-700' : 'bg-blue-100/90 text-blue-700'}`}>
                          {item.type === 'repair' ? 'แจ้งซ่อม' : 'แจ้งขนย้าย'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-[#4E2E16]">{item.building}</h3>
                          <p className="text-sm text-[#8B6E47] font-medium">{item.jobType}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#FDF6ED] p-3 rounded-lg border border-[#F3D9B0]">
                        <p className="text-sm text-[#4E2E16]"><span className="font-semibold mr-1">รายละเอียด:</span>{item.details}</p>
                      </div>

                      <div className="flex justify-between items-center text-xs text-[#8B6E47] pt-2 border-t border-[#E59A5D]/20">
                        <div className="flex items-center gap-1">
                          <span>👤 {item.userName}</span>
                        </div>
                        <div>
                          🕒 {formatDate(item.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default RepairStatusPage;