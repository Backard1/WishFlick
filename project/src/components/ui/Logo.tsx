import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gift Box Base - Single container */}
          <rect
            x="20"
            y="40"
            width="60"
            height="45"
            rx="6"
            fill="url(#gradient1)"
            stroke="url(#gradient2)"
            strokeWidth="2"
          />
          
          {/* Gift Box Lid */}
          <rect
            x="15"
            y="30"
            width="70"
            height="15"
            rx="4"
            fill="url(#gradient2)"
          />
          
          {/* Bow Left Loop */}
          <path
            d="M35 15 Q25 10, 30 25 Q35 30, 45 25 Q40 20, 35 15 Z"
            fill="url(#gradient2)"
          />
          
          {/* Bow Right Loop */}
          <path
            d="M65 15 Q75 10, 70 25 Q65 30, 55 25 Q60 20, 65 15 Z"
            fill="url(#gradient2)"
          />
          
          {/* Bow Center Knot */}
          <ellipse
            cx="50"
            cy="22"
            rx="5"
            ry="7"
            fill="url(#gradient4)"
          />
          
          {/* Heart in Box - Centered without divider */}
          <path
            d="M50 55 C45 50, 35 50, 35 60 C35 65, 45 70, 50 75 C55 70, 65 65, 65 60 C65 50, 55 50, 50 55 Z"
            fill="url(#heartGradient)"
          />
          
          {/* Sparkles */}
          <circle cx="25" cy="15" r="1.5" fill="#B48DFE" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="75" cy="25" r="1" fill="#98E2D5" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="85" cy="10" r="1.2" fill="#B48DFE" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite" />
          </circle>
          
          {/* Gradients */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B48DFE" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#98E2D5" stopOpacity="0.2" />
            </linearGradient>
            
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B48DFE" />
              <stop offset="100%" stopColor="#6A49C8" />
            </linearGradient>
            
            <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6A49C8" />
              <stop offset="100%" stopColor="#B48DFE" />
            </linearGradient>
            
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#98E2D5" />
              <stop offset="100%" stopColor="#6A49C8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] bg-clip-text text-transparent`}>
          WishFlick
        </span>
      )}
    </div>
  );
};