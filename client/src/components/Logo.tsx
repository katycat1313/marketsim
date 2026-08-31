import React from "react";

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-primary/25">
        <div className="h-full w-full bg-background/90 backdrop-blur-sm rounded-[10px] flex items-center justify-center">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary animate-pulse"
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        </div>
      </div>
      <div>
        <div className="font-extrabold text-foreground text-xl tracking-tight flex items-center gap-1.5">
          <span>Krechet</span>
          <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
            ACADEMY
          </span>
        </div>
        <div className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
          AI Marketing Flight Simulator
        </div>
      </div>
    </div>
  );
};

export default Logo;