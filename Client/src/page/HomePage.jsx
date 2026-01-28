import React from 'react';
// import Header from '../components/header';
import HomeImg from '../assets/1.png'
import HomeBG from '../assets/bg.png'
import HomeCenterImg from '../assets/header.png'
function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src={HomeBG}  
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        {/* <Header /> */}
        <div className="text-center max-w-4xl w-full mt-20">
          {/* Logo */}
          <div className="flex items-center justify-center mb-12">
            <img 
              src={HomeCenterImg} 
              alt="RMUTI KKC" 
              className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl h-auto transition-all duration-500 "
            />
          </div>
          
          {/* Enter Button */}
          <button 
            className="px-16 py-4 text-2xl font-semibold text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:brightness-110" 
            style={{ backgroundColor: '#8B7355' }}
            onClick={() => window.location.href = '/login'}
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;