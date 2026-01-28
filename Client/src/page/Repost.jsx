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
      case 'complete': return 'bg-green-500 text-white';
      case 'inProgress': return 'bg-yellow-400 text-[#4E2E16]';
      case 'cancelled': return 'bg-red-500 text-white';
      case 'pending':
      default: return 'bg-gray-400 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'complete': return 'เสร็จสิ้น';
      case 'inProgress': return 'กำลังดำเนินการ';
      case 'cancelled': return 'ยกเลิก';
      case 'pending':
      default: return 'รอดำเนินการ';
    }
  };

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
            <div className="bg-[#F8E9D6]/90 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" onClick={RepairCard}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full p-6 mb-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" style={{ color: '#4E2E16' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold" style={{ color: '#4E2E16' }}>แจ้งซ่อม</h3>
              </div>
            </div>

            {/* Card 2: ขนย้าย/จัดสถานที่ */}
            <div className="bg-[#F8E9D6]/90 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" onClick={MovingCard}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full p-6 mb-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" style={{ color: '#4E2E16' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold" style={{ color: '#4E2E16' }}>ขนย้าย / จัดสถานที่</h3>
              </div>
            </div>

            {/* Card 3: คู่มือการใช้งาน */}
            <div className="bg-[#F8E9D6]/90 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105" onClick={HowtoCard}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full p-6 mb-4 shadow-md">
                  <svg className="w-12 h-12" style={{ color: '#4E2E16' }} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v16h16V4H4zm2 2h12v2H6V6zm0 4h12v2H6v-2zm0 4h12v2H6v-2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold" style={{ color: '#4E2E16' }}>คู่มือการใช้งาน</h3>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6" style={{ color: '#4E2E16' }}>สถานะ</h2>

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
            <div className="bg-[#F8E9D6]/90 rounded-3xl p-8 text-center shadow-lg">
              <p style={{ color: '#4E2E16' }} className="text-lg">ยังไม่มีข้อมูลร้องขอ</p>
            </div>
          ) : (
            <div className="bg-[#F8E9D6]/90 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2" style={{ borderColor: '#4E2E16' }}>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#4E2E16' }}>รูป</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#4E2E16' }}>อาคาร/สถานที่</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#4E2E16' }}>ประเภทการแจ้ง</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#4E2E16' }}>ประเภทงาน</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#4E2E16' }}>รายละเอียด</th>
                      <th className="px-4 py-3 text-center font-semibold" style={{ color: '#4E2E16' }}>เวลาที่แจ้ง</th>
                      <th className="px-4 py-3 text-center font-semibold" style={{ color: '#4E2E16' }}>สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRequests.map((item, index) => (
                      <tr key={`${item.type}-${item.id}`} className={index < allRequests.length - 1 ? 'border-b border-[#EFBF86]' : ''}>
                        <td className="px-4 py-4">
                          <img
                            src={item.image}
                            alt="สถานที่"
                            className="w-24 h-20 object-cover rounded-lg shadow"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop";
                            }}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div style={{ color: '#4E2E16' }} className="font-medium">{item.building}</div>
                          <div style={{ color: '#8B6E47' }} className="text-sm">ชื่อ  ผู้ใช้งาน: {item.userName}</div>
                        </td>
                        <td className="px-4 py-4" style={{ color: '#4E2E16' }}>
                          {item.type === 'repair' ? 'แจ้งปัญหา' : 'แจ้งขนย้าย'}
                        </td>
                        <td className="px-4 py-4" style={{ color: '#4E2E16' }}>{item.jobType}</td>
                        <td className="px-4 py-4" style={{ color: '#4E2E16' }}>{item.details}</td>
                        <td className="px-4 py-4 text-center" style={{ color: '#4E2E16' }}>{formatDate(item.createdAt)}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-block px-6 py-2 rounded-full font-semibold text-sm ${getStatusColor(item.status)}`}>
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
                  <div key={`${item.type}-${item.id}`} className="bg-white/80 rounded-2xl p-4 shadow-lg">
                    <img
                      src={item.image}
                      alt="สถานที่"
                      className="w-full h-40 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop";
                      }}
                    />
                    <div className="space-y-2 text-sm">

                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: '#6B3E1E' }}>อาคาร/สถานที่:</span>
                        <span style={{ color: '#4E2E16' }}>{item.building}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: '#6B3E1E' }}>ประเภทการแจ้ง:</span>
                        <span style={{ color: '#4E2E16' }}>{item.type === 'repair' ? 'แจ้งปัญหา' : 'แจ้งขนย้าย'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: '#6B3E1E' }}>ชื่อผู้ใช้งาน:</span>
                        <span style={{ color: '#4E2E16' }}>{item.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: '#6B3E1E' }}>ประเภทงาน:</span>
                        <span style={{ color: '#4E2E16' }}>{item.jobType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: '#6B3E1E' }}>รายละเอียด:</span>
                        <span style={{ color: '#4E2E16' }}>{item.details}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: '#6B3E1E' }}>เวลาที่แจ้ง:</span>
                        <span style={{ color: '#4E2E16' }}>{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="pt-2">
                        <span className={`inline-block px-6 py-2 rounded-full font-semibold text-sm w-full text-center ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
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