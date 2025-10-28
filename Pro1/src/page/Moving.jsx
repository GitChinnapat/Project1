import React, { useState } from "react";
import Header from "../components/header";
import moveBG from "../assets/bg.png";

export default function MovePage() {
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
    alert("ส่งข้อมูลการขนย้าย / จัดสถานที่เรียบร้อย!");
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

      {/* Main Content */}
      <main className="relative pt-32 sm:pt-36 md:pt-40 lg:pt-48 xl:pt-36 pb-12 px-4 min-h-screen flex items-center justify-center">
        <div className="max-w-6xl w-full bg-white/90 rounded-3xl shadow-xl border-2 border-[#EFBF86] p-6 sm:p-8 lg:p-12">
          {/* Title */}
          <div className="flex items-center gap-4 mb-10">
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
              ขนย้าย / จัดสถานที่
            </h1>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Side */}
              <div className="space-y-6">
                {/* Location */}
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
                    className="w-full px-5 py-3 text-base rounded-full border-2 border-gray-300 focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none bg-white shadow-sm"
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-[#4E2E16] font-semibold mb-2 text-lg">
                    ประเภทงาน :
                  </label>
                  <div className="relative">
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      className="w-full px-5 py-3 text-base rounded-full border-2 border-gray-300 focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none bg-white shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="">กรุณาเลือกประเภทงาน</option>
                      <option value="move">ขนย้ายอุปกรณ์</option>
                      <option value="arrange">จัดสถานที่</option>
                      <option value="setup">ติดตั้งอุปกรณ์</option>
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

                {/* Details */}
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
                    className="w-full px-5 py-3 text-base rounded-full border-2 border-gray-300 focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none bg-white shadow-sm"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="reset"
                    onClick={() =>
                      setFormData({
                        location: "",
                        jobType: "",
                        details: "",
                        images: [],
                      })
                    }
                    className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
                  >
                    ยกเลิกการแจ้ง
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
                  >
                    แจ้งงาน
                  </button>
                </div>
              </div>

              {/* Right Side - Upload */}
              <div>
                <label className="block text-[#4E2E16] font-semibold mb-2 text-lg">
                  แนบรูปย้ายสถานที่
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-3xl p-8 h-80 flex items-center justify-center bg-white/50 hover:border-[#EFBF86] transition-colors cursor-pointer"
                  onClick={() =>
                    document.getElementById("fileUpload").click()
                  }
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
                      id="fileUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
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
      </main>
    </div>
  );
}
