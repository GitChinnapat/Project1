import React, { useState } from 'react';
import Header from '../components/header';
import registerBG from '../assets/bg.png';
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    day: '',
    month: '',
    year: '',
    position: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('สมัครสมาชิกเรียบร้อย!');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen font-['Kanit',sans-serif] bg-[#FDF6ED]" style={{
      backgroundImage: "url(" + registerBG + ")",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative'
    }}>
      <Header />
      {/* Overlay */}
      <div className="fixed inset-0 bg-white/45 pointer-events-none"></div>
    
      {/* Main Content */}
      <main className="relative pt-28 sm:pt-32 md:pt-36 lg:pt-44 xl:pt-32 pb-8 flex justify-center items-center px-4 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white/90 rounded-3xl shadow-xl overflow-hidden max-w-6xl w-full">
          {/* Left Image Section */}
          <div className="relative flex justify-center items-center bg-[#FDF6ED]/70 rounded-3xl p-6 sm:p-8 order-1 lg:order-1">
            <img
              src="https://cdn.discordapp.com/attachments/1130676495296254035/1431561689500876800/1.png?ex=68fddd37&is=68fc8bb7&hm=3758e396c4f1e2b8d411965da3800b7470f6a00b82bfed7f2bb384cffa468702&"
              alt="ระบบขอใช้บริการ"
              className="object-contain w-full max-w-xs sm:max-w-sm lg:max-w-md rounded-3xl"
            />
          </div>

          {/* Right Register Section */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 bg-[#FDF6ED] order-2 lg:order-2">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#4E2E16] mb-2 font-semibold">สมัครสมาชิก</h2>
            </div>

            {/* Form */}
            <div className="space-y-3 sm:space-y-4">
              {/* ชื่อ */}
              <div>
                <label className="block text-[#4E2E16] font-medium mb-1 text-sm">ชื่อ :</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="กรุณากรอกชื่อจริง"
                  className="w-full px-4 py-2 text-sm rounded-full border border-gray-300 focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none bg-white/90"
                />
              </div>

              {/* นามสกุล */}
              <div>
                <label className="block text-[#4E2E16] font-medium mb-1 text-sm">นามสกุล :</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="กรุณากรอกนามสกุล"
                  className="w-full px-4 py-2 text-sm rounded-full border border-gray-300 focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none bg-white/90"
                />
              </div>

              {/* วัน เดือน ปี */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[#4E2E16] font-medium mb-1 text-sm">วัน :</label>
                  <input
                    type="text"
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    placeholder="วัน"
                    className="w-full px-3 py-2 text-sm rounded-full border border-gray-300 focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none bg-white/90"
                  />
                </div>
                <div>
                  <label className="block text-[#4E2E16] font-medium mb-1 text-sm">เดือน :</label>
                  <input
                    type="text"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    placeholder="เดือน"
                    className="w-full px-3 py-2 text-sm rounded-full border border-gray-300 focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none bg-white/90"
                  />
                </div>
                <div>
                  <label className="block text-[#4E2E16] font-medium mb-1 text-sm">ปี :</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="ปี"
                    className="w-full px-3 py-2 text-sm rounded-full border border-gray-300 focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none bg-white/90"
                  />
                </div>
              </div>

              {/* ตำแหน่ง */}
              <div>
                <label className="block text-[#4E2E16] font-medium mb-1 text-sm">ตำแหน่ง :</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="กรุณากรอกตำแหน่ง"
                  className="w-full px-4 py-2 text-sm rounded-full border border-gray-300 focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none bg-white/90"
                />
              </div>

              {/* เบอร์โทร */}
              <div>
                <label className="block text-[#4E2E16] font-medium mb-1 text-sm">เบอร์โทร :</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="กรุณากรอกเบอร์โทรศัพท์"
                  className="w-full px-4 py-2 text-sm rounded-full border border-gray-300 focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none bg-white/90"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#4E2E16] font-medium mb-1 text-sm">Email :</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ลงท้ายด้วย rmuti.ac.th"
                  className="w-full px-4 py-2 text-sm rounded-full border border-gray-300 focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none bg-white/90"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[#4E2E16] font-medium mb-1 text-sm">password :</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="กรุณากรอก password"
                    className="w-full px-4 py-2 pr-10 text-sm rounded-full border border-gray-300 focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none bg-white/90"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E2E16]/60 hover:text-[#4E2E16] transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* ยืนยัน Password */}
              <div>
                <label className="block text-[#4E2E16] font-medium mb-1 text-sm">ยืนยันpassword :</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="กรุณากรอกยืนยัน password"
                    className="w-full px-4 py-2 pr-10 text-sm rounded-full border border-gray-300 focus:border-[#EFBF86] focus:ring-2 focus:ring-[#F8E9D6] outline-none bg-white/90"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E2E16]/60 hover:text-[#4E2E16] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  className="w-full py-2.5 text-sm sm:text-base bg-[#EFBF86] text-[#4E2E16] font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-[#EFBF86]/90 transition"
                >
                  เข้าสู่ระบบ
                </button>
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