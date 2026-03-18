import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, User } from 'lucide-react';
import profileFrameImg from 'figma:asset/9c21346a6853840682e5b435948678a3fea04f12.png';

interface ProfileData {
  name: string;
  gradeLevel: string;
  school: string;
  email: string;
}

export function Profile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    gradeLevel: '',
    school: '',
    email: '',
  });

  useEffect(() => {
    // Load profile data from localStorage
    const saved = localStorage.getItem('stu-balance-profile');
    if (saved) {
      setProfileData(JSON.parse(saved));
    }
  }, []);

  const handleChange = (field: keyof ProfileData, value: string) => {
    const updated = { ...profileData, [field]: value };
    setProfileData(updated);
    localStorage.setItem('stu-balance-profile', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#fff5f5] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-[#e8d4e0] opacity-40"></div>
      <div className="absolute top-20 right-20 w-6 h-6 rounded-full bg-[#d4b5c9] opacity-30"></div>
      <div className="absolute top-40 left-1/4 w-10 h-10 opacity-20">
        <svg viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="8" stroke="#c4a5b9" strokeWidth="2" />
          <path d="M20 12v16M12 20h16" stroke="#c4a5b9" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute bottom-40 right-10 w-12 h-12 opacity-20">
        <svg viewBox="0 0 40 40" fill="none">
          <path d="M20 8l3 10h10l-8 6 3 10-8-6-8 6 3-10-8-6h10z" fill="#e8d4e0" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="w-12 h-12 rounded-full bg-[#c4a5b9] hover:bg-[#b495a9] flex items-center justify-center text-white transition-colors duration-200 shadow-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-right">
            <h1 className="text-4xl md:text-5xl font-bold text-[#b4a0a8]" style={{ fontFamily: 'Brush Script MT, cursive', fontStyle: 'italic' }}>
              Profile
            </h1>
            <p className="text-[#c4b0b8] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              Your information
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm p-6 md:p-10 relative" 
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 39px,
              #e8d4d9 39px,
              #e8d4d9 40px
            )`,
          }}
        >
          {/* Vertical line on the left like notebook paper */}
          <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-[#d4b5c9] opacity-50"></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8">
            {/* Form fields */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-[#b4a0a8] font-semibold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-5 py-4 rounded-2xl bg-[#f5e6ea]/60 border-2 border-transparent focus:border-[#d4b5c9] focus:outline-none text-[#7d6b73] placeholder:text-[#c4b0b8]"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
              </div>

              {/* Grade Level */}
              <div>
                <label className="block text-[#b4a0a8] font-semibold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  Grade Level
                </label>
                <input
                  type="text"
                  value={profileData.gradeLevel}
                  onChange={(e) => handleChange('gradeLevel', e.target.value)}
                  placeholder="e.g., Grade 12"
                  className="w-full px-5 py-4 rounded-2xl bg-[#f5e6ea]/60 border-2 border-transparent focus:border-[#d4b5c9] focus:outline-none text-[#7d6b73] placeholder:text-[#c4b0b8]"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
              </div>

              {/* School */}
              <div>
                <label className="block text-[#b4a0a8] font-semibold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  School
                </label>
                <input
                  type="text"
                  value={profileData.school}
                  onChange={(e) => handleChange('school', e.target.value)}
                  placeholder="Your school"
                  className="w-full px-5 py-4 rounded-2xl bg-[#f5e6ea]/60 border-2 border-transparent focus:border-[#d4b5c9] focus:outline-none text-[#7d6b73] placeholder:text-[#c4b0b8]"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#b4a0a8] font-semibold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="e.g., Richjulliann@gmail.com"
                  className="w-full px-5 py-4 rounded-2xl bg-[#f5e6ea]/60 border-2 border-transparent focus:border-[#d4b5c9] focus:outline-none text-[#7d6b73] placeholder:text-[#c4b0b8]"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
              </div>
            </div>

            {/* Decorative frame (profile picture area) */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <img 
                  src={profileFrameImg} 
                  alt="Profile frame" 
                  className="w-full max-w-sm"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-white/50 flex items-center justify-center">
                    <User className="w-20 h-20 text-[#c4b0b8]" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
