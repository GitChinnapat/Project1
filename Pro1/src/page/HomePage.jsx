import React from 'react';

function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://media.discordapp.net/attachments/1130676495296254035/1431685256888582328/1.png?ex=68fe504c&is=68fcfecc&hm=d2e93a729deeea8229b376ab5cc482edaa93d35b83ceac8ae1bb975feb873355&=&format=webp&quality=lossless&width=1051&height=788" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="text-center max-w-4xl w-full">
          {/* Logo */}
          <div className="flex items-center justify-center mb-12">
            <img 
              src="https://media.discordapp.net/attachments/1130676495296254035/1431682919247904918/ac7717ec42d96d80.png?ex=68fe4e1f&is=68fcfc9f&hm=0a9bf472ed1729cc484d120079c44ce92ce8a3a5cb0c94d041fa396b60c8cdf7&=&format=webp&quality=lossless&width=1056&height=701" 
              alt="RMETI TGTK KKC 60th Anniversary" 
              className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl h-auto transition-all duration-500 hover:scale-110 hover:drop-shadow-2xl cursor-pointer"
            />
          </div>
          
          {/* Enter Button */}
          <button 
            className="px-16 py-4 text-2xl font-semibold text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:brightness-110" 
            style={{ backgroundColor: '#8B7355' }}
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;