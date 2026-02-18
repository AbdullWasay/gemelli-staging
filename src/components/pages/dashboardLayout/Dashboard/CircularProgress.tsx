interface CircularProgressProps {
  percentage?: number
}

export default function CircularProgress({ percentage = 85 }: CircularProgressProps) {
  const radius = 50; // Reduced from 54 to accommodate thicker stroke
  const circumference = 2 * Math.PI * radius; 
  const dashOffset = circumference * (1 - percentage / 100);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="size-[103px]" viewBox="0 0 120 120">
        {/* Background circle - thinner */}
        <circle 
          cx="60" 
          cy="60" 
          r={radius} 
          fill="transparent" 
          stroke="#646464" 
          strokeWidth="12" 
          className="opacity-30" 
        />

        {/* Progress circle - thicker (strokeWidth="18") */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke="#40A9DE"
          strokeWidth="18" // Very thick stroke
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </svg>

      {/* Percentage text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-[20px] font-semibold text-[#0F0F0F] font-poppins">{percentage}%</span>
        <span className="text-[7px] text-[#646464] mt-[-2px] uppercase font-poppins">to goal</span>
      </div>
    </div>
  )
}