import React from "react";

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        <rect width="40" height="40" rx="8" fill="hsl(228, 44%, 12%)" />
        <path
          d="M8 20C8 13.3726 13.3726 8 20 8C26.6274 8 32 13.3726 32 20C32 26.6274 26.6274 32 20 32C13.3726 32 8 26.6274 8 20Z"
          fill="hsl(216, 75%, 14%)"
        />
        <path
          d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20Z"
          fill="hsl(216, 39%, 48%)"
        />
        <path
          d="M16 20C16 17.7909 17.7909 16 20 16C22.2091 16 24 17.7909 24 20C24 22.2091 22.2091 24 20 24C17.7909 24 16 22.2091 16 20Z"
          fill="hsl(215, 40%, 59%)"
        />
        <path
          d="M32 12L36 8H28L32 12Z"
          fill="hsl(45, 100%, 50%)"
        />
      </svg>
      <div>
        <div className="font-bold text-primary text-xl tracking-tight">DIGITAL ZOOM</div>
        <div className="text-xs text-muted-foreground">Marketing Mastery Platform</div>
      </div>
    </div>
  );
};

export default Logo;