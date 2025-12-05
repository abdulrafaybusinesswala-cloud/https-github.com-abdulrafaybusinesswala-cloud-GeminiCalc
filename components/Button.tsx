import React from 'react';

interface ButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'accent' | 'function' | 'danger';
  className?: string;
  doubleWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'default', 
  className = '', 
  doubleWidth = false 
}) => {
  
  const baseStyles = "h-16 sm:h-20 rounded-2xl text-2xl sm:text-3xl font-medium transition-all active:scale-95 flex items-center justify-center shadow-lg";
  
  let variantStyles = "";
  switch (variant) {
    case 'accent': // Operations (+, -, *, /, =)
      variantStyles = "bg-calc-accent text-white hover:bg-calc-accentHover";
      break;
    case 'function': // AC, +/-, %
      variantStyles = "bg-calc-function text-calc-display hover:bg-calc-functionHover font-semibold";
      break;
    case 'danger':
        variantStyles = "bg-red-500 text-white hover:bg-red-600";
        break;
    default: // Numbers
      variantStyles = "bg-calc-btn text-calc-text hover:bg-calc-btnHover";
      break;
  }

  const widthStyle = doubleWidth ? "col-span-2 aspect-[2/1]" : "col-span-1 aspect-square";

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${widthStyle} ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};