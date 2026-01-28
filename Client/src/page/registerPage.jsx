import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/header";
import RightImage from "../assets/1.png";
import registerBG from "../assets/bg.png";
import { authAPI } from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    position: "นักศึกษา",
    phone: "",
    date: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.lastname ||
      !formData.email ||
      !formData.password
    ) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!formData.email.endsWith("@rmuti.ac.th")) {
      setError("กรุณาใช้อีเมลที่ลงท้ายด้วย @rmuti.ac.th");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (formData.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        position: formData.position || null,
        phone: formData.phone || null,
        date: formData.date || null,
      });

      if (response.success) {
        setSuccess("สมัครสมาชิกสำเร็จ!  กำลังไปหน้าเข้าสู่ระบบ...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen font-['Kanit',sans-serif] bg-[#FDF6ED]"
      style={{
        backgroundImage: `url(${registerBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Header />

      <div className="fixed inset-0 bg-white/45 pointer-events-none"></div>

      <main className="relative pt-28 sm:pt-32 pb-12 px-4 flex justify-center items-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden max-w-6xl w-full">

          {/* LEFT IMAGE */}
          <div className="flex justify-center items-center bg-[#FDF6ED]/70 p-8 order-2 lg:order-1">
            <img
              src={RightImage}
              alt="register img"
              className="object-contain w-full max-w-sm lg:max-w-md"
            />
          </div>

          {/* RIGHT FORM */}
          <div className="p-8 md:p-10 lg:p-12 bg-[#FDF6ED] order-1 lg:order-2 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 bg-[#F3D9B0] rounded-full flex items-center justify-center shadow-md mb-4">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#4E2E16]">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
              <h2 className="text-3xl text-[#4E2E16] font-semibold">
                สมัครสมาชิก
              </h2>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            {/* FORM GRID */}
            <form onSubmit={handleRegister} className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* ชื่อ */}
                <div>
                  <label className="block mb-1 text-sm text-[#4E2E16]">
                    ชื่อ :
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="กรุณากรอกชื่อจริง"
                    className="w-full px-4 py-2.5 rounded-full border border-gray-300 bg-white/90"
                  />
                </div>

                {/* นามสกุล */}
                <div>
                  <label className="block mb-1 text-sm text-[#4E2E16]">
                    นามสกุล :
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="กรุณากรอกนามสกุล"
                    className="w-full px-4 py-2.5 rounded-full border border-gray-300 bg-white/90"
                  />
                </div>

                {/* วันเดือนปีเกิด */}
                <div>
                  <label className="block mb-1 text-sm text-[#4E2E16]">
                    วันเดือนปีเกิด :
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-full border border-gray-300 bg-white/90"
                  />
                </div>



                {/* เบอร์โทร */}
                <div>
                  <label className="block mb-1 text-sm text-[#4E2E16]">
                    เบอร์โทร :
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="กรุณากรอกเบอร์โทรศัพท์"
                    className="w-full px-4 py-2.5 rounded-full border border-gray-300 bg-white/90"
                  />
                </div>

                {/* Email → FULL WIDTH */}
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm text-[#4E2E16]">
                    Email :
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ลงท้ายด้วย rmuti.ac.th"
                    className="w-full px-4 py-2.5 rounded-full border border-gray-300 bg-white/90"
                  />
                </div>

                {/* Password → FULL WIDTH */}
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm text-[#4E2E16]">
                    Password :
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="กรุณากรอก password"
                      className="w-full px-4 py-2.5 rounded-full border border-gray-300 bg-white/90 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E2E16]/60 hover:text-[#4E2E16] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm Password → FULL WIDTH */}
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm text-[#4E2E16]">
                    ยืนยัน Password :
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="กรุณากรอกยืนยัน password"
                      className="w-full px-4 py-2.5 rounded-full border border-gray-300 bg-white/90 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E2E16]/60 hover:text-[#4E2E16] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#EFBF86] text-[#4E2E16] font-semibold rounded-full shadow-md hover:bg-[#e7b67f]"
              >
                {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
              </button>

              <p className="text-center mt-4 text-sm text-[#4E2E16]">
                มีบัญชีอยู่แล้ว?{" "}
                <Link
                  to="/login"
                  className="text-[#6B3E1E] hover:underline font-medium"
                >
                  เข้าสู่ระบบ
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
