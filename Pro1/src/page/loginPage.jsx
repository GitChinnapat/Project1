import React, { useState } from "react";
import Header from "../components/header";
import RightImage from "../assets/1.png";
import loginBG from "../assets/bg.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ฟังก์ชันเข้าสู่ระบบ
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    if (!email.endsWith("@rmuti.ac.th")) {
      alert("กรุณาใช้อีเมลที่ลงท้ายด้วย rmuti.ac.th");
      return;
    }

    // ✅ ตัวอย่างเปลี่ยนหน้า
    window.location.href = "/register";
  };

  // ฟังก์ชันสมัครใช้งาน
  const handleRegister = (e) => {
    e.preventDefault();
    window.location.href = "/register";
  };

  return (
    <div
      className="min-h-screen bg-white object-cover bg-center relative"
      style={{
        fontFamily: "'Kanit', sans-serif",
        backgroundImage: `url(${loginBG})`,
      }}
    >
      <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative pt-20 pb-6 flex justify-center items-center px-4 h-screen overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden max-w-5xl w-full max-h-[100vh] z-10">
          {/* Left: ฟอร์มเข้าสู่ระบบ */}
          <div className="p-6 md:p-8 bg-[#FDF6ED] order-2 lg:order-1 flex flex-col justify-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-[#F3D9B0] rounded-full flex items-center justify-center shadow-md mb-4">
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-[#4E2E16] fill-[#4E2E16]"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#4E2E16] mb-6">
                เข้าสู่ระบบ
              </h2>
            </div>

            {/* ฟอร์ม */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[#4E2E16] font-medium mb-1 text-sm">
                  Email :
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรุณาใส่ Email ที่ลงท้ายด้วย rmuti.ac.th"
                  className="w-full px-4 py-2.5 text-sm rounded-full border border-[#F3D9B0] focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[#4E2E16] font-medium mb-1 text-sm">
                  Password :
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="กรุณากรอกรหัสผ่านให้ถูกต้อง"
                    className="w-full px-4 py-2.5 pr-12 text-sm rounded-full border border-[#F3D9B0] focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4E2E16]/60 hover:text-[#4E2E16] transition-colors"
                  >
                    {showPassword ? (
                      // icon ซ่อนรหัส
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      // icon แสดงรหัส
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* ปุ่มเข้าสู่ระบบ */}
              <button
                type="submit"
                className="w-full py-2.5 bg-[#EFBF86] text-[#4E2E16] font-semibold rounded-full shadow-md hover:bg-[#EFBF86]/90 transition mt-2"
              >
                เข้าสู่ระบบ
              </button>

              <p className="text-center text-[#4E2E16] mt-3 text-sm">
                <a
                  href="#"
                  onClick={handleRegister}
                  className="hover:underline font-medium"
                >
                  สมัครใช้งาน
                </a>
              </p>
            </form>
          </div>

        {/* Right: ภาพ */}
        <div className="relative flex justify-center items-center bg-[#FDF6ED]/70 rounded-3xl p-8 order-1 lg:order-2">
          <img
            src={RightImage}
            alt="ระบบขอใช้บริการ"
            className="object-contain w-[100%] sm:w-[110%] lg:w-[100%] max-w-none rounded-3xl "
          />
        </div>

        </div>
      </main>
    </div>
  );
}