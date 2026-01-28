import React, { useState, useEffect } from "react";
import Header from "../components/header";
import { movingAPI } from "../services/api";
import moveBG from "../assets/bg.png";
import Swal from 'sweetalert2';

export default function MovingList() {
  // ... (skip lines) ...
  const handleDelete = async (moveId) => {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "คุณต้องการลบการขอย้ายนี้หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบข้อมูล',
      cancelButtonText: 'ยกเลิก'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await movingAPI.deleteMoving(moveId);

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'ลบสำเร็จ',
          text: 'ลบการขอย้ายสำเร็จแล้ว',
          showConfirmButton: false,
          timer: 1500
        });
        fetchMovingList();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: response.message || "ไม่สามารถลบได้"
        });
      }
    } catch (err) {
      console.error("Error deleting moving:", err);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.message || "เกิดข้อผิดพลาดในการลบ"
      });
    }
  };

  return (
    <div
      className="min-h-screen font-['Kanit',sans-serif] bg-[#FDF6ED]"
      style={{
        backgroundImage: `url(${moveBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      <Header />

      {/* Overlay */}
      <div className="fixed inset-0 bg-white/45 pointer-events-none"></div>

      {/* Message Display */}
      {message && (
        <div className={`fixed top-20 right-4 left-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 p-4 rounded-lg shadow-lg animate-pulse ${messageType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
          <p className="font-semibold">{message}</p>
        </div>
      )}

      {/* Main Content */}
      <main className="relative pt-32 sm:pt-36 md:pt-40 lg:pt-48 xl:pt-36 pb-12 px-4 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-[#F3D9B0] rounded-full p-4 sm:p-5 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 sm:w-12 sm:h-12 text-[#4E2E16]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#4E2E16]">
                รายการย้ายของ
              </h1>
            </div>
            <button
              onClick={fetchMovingList}
              className="px-6 py-3 bg-[#EFBF86] text-white font-semibold rounded-full hover:bg-[#DBA76B] transition-all shadow-md text-sm sm:text-base"
            >
              รีเฟรช
            </button>
          </div>

          {/* Content Section */}
          <div className="bg-white/90 rounded-3xl shadow-xl border-2 border-[#EFBF86] p-6 sm:p-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#EFBF86]"></div>
                <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                <p className="font-semibold">เกิดข้อผิดพลาด</p>
                <p>{error}</p>
              </div>
            ) : movingList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">ยังไม่มีข้อมูลการขอย้ายของ</p>
              </div>
            ) : (
              <div className="space-y-6">
                {movingList.map((moving, index) => (
                  <div
                    key={moving.move_id}
                    className="border-2 border-[#EFBF86] rounded-2xl p-6 hover:shadow-lg transition-all hover:bg-[#FDF6ED]"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Left Column */}
                      <div className="space-y-3 md:col-span-2">
                        <div className="flex items-start gap-2">
                          <span className="text-[#4E2E16] font-semibold min-w-32">รหัส:</span>
                          <span className="text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            #{moving.move_id}
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-[#4E2E16] font-semibold min-w-32">ชื่อผู้ขอ:</span>
                          <span className="text-gray-700">{moving.user_name}</span>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-[#4E2E16] font-semibold min-w-32">สถานที่:</span>
                          <span className="text-gray-700">{moving.location}</span>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-[#4E2E16] font-semibold min-w-32">ประเภทงาน:</span>
                          <span className="text-gray-700">{moving.type_work}</span>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-[#4E2E16] font-semibold min-w-32">รายละเอียด:</span>
                          <span className="text-gray-700">{moving.detail}</span>
                        </div>

                        {moving.img && (
                          <div className="flex items-start gap-2">
                            <span className="text-[#4E2E16] font-semibold min-w-32">รูปภาพ:</span>
                            <span className="text-gray-600 text-sm">{moving.img}</span>
                          </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="md:text-right space-y-3">
                        <div>
                          <span className="text-gray-500 text-sm block">วันที่ส่ง</span>
                          <span className="text-[#4E2E16] font-semibold">
                            {new Date(moving.created_at).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(moving.move_id)}
                          className="w-full md:w-auto px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-all text-sm"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
