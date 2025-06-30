import React from 'react';

export const FleetProLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="160"
    height="36"
    viewBox="0 0 160 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="FleetPro Logo"
    {...props}
  >
    {/* Stylized Truck Icon Part */}
    {/* Cargo area (lighter - primary-500) */}
    <path
      d="M14.5 7H30C30 7 30 19 30 19H14.5V7Z"
      className="fill-primary-500"
    />
    {/* Cabin and Chassis (darker - primary-700) */}
    <path
      d="M3.5 14.5H14.5V25H3.5V14.5Z"
      className="fill-primary-700"
    />
     <path 
      d="M14.5 13.5L9 9H3.5V14.5H14.5V13.5Z" /* Slanted cabin front */
      className="fill-primary-700"
    />
    {/* Wheels (very dark gray) */}
    <circle cx="7" cy="25" r="3.5" className="fill-gray-950" />
    <circle cx="20" cy="25" r="3.5" className="fill-gray-950" />

    {/* Text Part "FleetPro" */}
    <text
      x="42" 
      y="27" 
      fontFamily="sans-serif" /* Inherits from body */
      fontSize="24"
      fontWeight="bold"
      className="fill-primary-400" 
    >
      Fleet
      <tspan
        className="fill-gray-100" 
      >
        Pro
      </tspan>
    </text>
  </svg>
);

export default FleetProLogo;