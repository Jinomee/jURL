import React from 'react';

/**
 * Logo component for jURL - matches the favicon design
 */
const Logo = ({ width = 24, height = 24, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width={width} 
      height={height}
      {...props}
    >
      <defs>
        <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="5" fill="#ffffff" />
      <path 
        d="M10,16.5l1.5,1.5h4c0.8,0,1.5-0.7,1.5-1.5v-3c0-0.8-0.7-1.5-1.5-1.5h-1V10h1c1.7,0,3,1.3,3,3v3c0,1.7-1.3,3-3,3h-4
        c-0.8,0-1.5-0.3-2.1-0.9L8.5,17.1L10,16.5z M14,7.5l-1.5-1.5h-4C7.7,6,7,6.7,7,7.5v3C7,11.3,7.7,12,8.5,12h1v2h-1
        C6.8,14,5.5,12.7,5.5,11V8C5.5,6.3,6.8,5,8.5,5h4c0.8,0,1.5,0.3,2.1,0.9l0.9,0.9L14,7.5z" 
        fill="url(#linkGradient)" 
      />
    </svg>
  );
};

export default Logo;