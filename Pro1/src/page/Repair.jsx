import React, { useState } from "react";
import Header from "../components/header";
import moveBG from "../assets/bg.png";
export default function RepairPage() {
  const [formData, setFormData] = useState({
    location: "",
    jobType: "",
    details: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("ส่งข้อมูลการแจ้งซ่อมเรียบร้อย!");
  };

  const handleReset = () => {
    setFormData({
      location: "",
      jobType: "",
      details: "",
      images: [],
    });
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
        <Header/>
      {/* Overlay */}
      <div className="fixed inset-0 bg-white/45 pointer-events-none"></div>

      {/* Main Content */}
      <main className="relative pt-32 sm:pt-36 md:pt-40 lg:pt-52 xl:pt-36 pb-12 px-4 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          {/* Title Section */}
          

          {/* Form Container */}
          <div className="bg-white/90 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl border-2 border-[#EFBF86]">
          <div className="flex items-center gap-4 mb-8 sm:mb-10">
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
                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#4E2E16]">
              แจ้งซ่อม
            </h1>
          </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Column - Form Fields */}
                <div className="space-y-6">
                  {/* สถานที่ */}
                  <div>
                    <label className="block text-[#4E2E16] font-semibold mb-2 text-lg">
                      สถานที่ :
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="กรุณากรอกสถานที่/อาคาร/ชั้น"
                      className="w-full px-5 py-3 text-base rounded-full border-2 border-indigo-300 focus:border-indigo-900 focus:ring-2 focus:ring-blue-200 outline-none bg-white shadow-sm"
                    />
                  </div>

                  {/* ประเภทงาน */}
                  <div>
                    <label className="block text-[#4E2E16] font-semibold mb-2 text-lg">
                      ประเภทงาน :
                    </label>
                    <div className="relative">
                      <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        className="w-full px-5 py-3 text-base rounded-full border-2 border-indigo-300 focus:border-indigo-900 focus:ring-2 focus:ring-blue-200 outline-none bg-white shadow-sm appearance-none cursor-pointer text-gray-700"
                      >
                        <option value="">กรุณาเลือกประเภทงานซ่อม</option>
                        <option value="electric">ไฟฟ้า</option>
                        <option value="plumbing">ประปา</option>
                        <option value="aircon">เครื่องปรับอากาศ</option>
                        <option value="furniture">เฟอร์นิเจอร์</option>
                        <option value="computer">คอมพิวเตอร์</option>
                        <option value="other">อื่นๆ</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#4E2E16]">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* รายละเอียด */}
                  <div>
                    <label className="block text-[#4E2E16] font-semibold mb-2 text-lg">
                      รายละเอียด :
                    </label>
                    <input
                      type="text"
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      placeholder="กรุณากรอกรายละเอียด"
                      className="w-full px-5 py-3 text-base rounded-full border-2 border-indigo-300 focus:border-indigo-900 focus:ring-2 focus:ring-blue-200 outline-none bg-white shadow-sm"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
                    >
                      ยกเลิกการแจ้ง
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
                    >
                      แจ้งซ่อม
                    </button>
                  </div>
                </div>

                {/* Right Column - Image Upload Area */}
                <div>
                  <label className="block text-[#4E2E16] font-semibold mb-2 text-lg">
                    แนบรูปย้ายสถานที่
                  </label>
                  <div
                    className="border-2 border-dashed border-indigo-300 rounded-3xl p-8 h-80 flex items-center justify-center bg-white/50 hover:border-indigo-900 transition-colors cursor-pointer"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-16 h-16 mx-auto text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-gray-500 text-sm mb-2">
                        คลิกเพื่ออัปโหลดรูปภาพ
                      </p>
                      <p className="text-gray-400 text-xs">
                        รองรับไฟล์ JPG, PNG, GIF
                      </p>
                      <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  {formData.images.length > 0 && (
                    <p className="text-sm text-gray-600 mt-3">
                      อัปโหลดแล้ว {formData.images.length} ไฟล์
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}