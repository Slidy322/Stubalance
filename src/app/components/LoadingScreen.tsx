import { useEffect, useState } from 'react';
import loadingImage from 'figma:asset/9926b2bc1bc48c2038a12c9a7f5e3bbf920205f4.png';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show loading screen for 2 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for fade animation to complete before calling onLoadingComplete
      setTimeout(() => {
        onLoadingComplete();
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#f5e0e8] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative w-full h-full max-w-2xl mx-auto flex items-center justify-center p-4">
        {/* Main image */}
        <img
          src={loadingImage}
          alt="Stu-Balance Loading"
          className="w-full h-auto object-contain animate-pulse"
          style={{ animationDuration: '2s' }}
        />
        
        {/* Loading dots */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
          <div
            className="w-3 h-3 bg-[#b4a0a8] rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-3 h-3 bg-[#b4a0a8] rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-3 h-3 bg-[#b4a0a8] rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}
