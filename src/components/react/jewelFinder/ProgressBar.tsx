import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="w-full flex items-center gap-3 mb-6">
      <div className="flex-1 h-1 bg-white/10 overflow-hidden">
        <div
          className="h-full bg-[#d4af37] transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[10px] text-[#A0A0A0] uppercase tracking-widest font-medium tabular-nums">
        {current} / {total}
      </span>
    </div>
  );
}
