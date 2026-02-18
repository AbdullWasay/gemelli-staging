"use client";

import { useState, useRef, useEffect } from "react";

const chartData = {
  "2023": [
    { month: "Jan", sales: 4100, target: 5800 },
    { month: "Feb", sales: 5800, target: 9800 },
    { month: "Mar", sales: 5900, target: 8100 },
    { month: "Apr", sales: 3000, target: 4100 },
    { month: "May", sales: 7100, target: 9800 },
    { month: "Jun", sales: 4200, target: 5900 },
    { month: "Jul", sales: 3100, target: 4400 },
    { month: "Aug", sales: 4100, target: 5800 },
    { month: "Sep", sales: 4100, target: 5800 },
    { month: "Oct", sales: 2900, target: 4100 },
    { month: "Nov", sales: 4200, target: 5800 },
    { month: "Dec", sales: 4100, target: 5800 },
  ],
  "2022": [
    { month: "Jan", sales: 3800, target: 5500 },
    { month: "Feb", sales: 5200, target: 8900 },
    { month: "Mar", sales: 5500, target: 7800 },
    { month: "Apr", sales: 2800, target: 3900 },
    { month: "May", sales: 6800, target: 9200 },
    { month: "Jun", sales: 3900, target: 5600 },
    { month: "Jul", sales: 2900, target: 4100 },
    { month: "Aug", sales: 3800, target: 5500 },
    { month: "Sep", sales: 3900, target: 5600 },
    { month: "Oct", sales: 2700, target: 3900 },
    { month: "Nov", sales: 3900, target: 5500 },
    { month: "Dec", sales: 3800, target: 5500 },
  ],
  "2021": [
    { month: "Jan", sales: 3500, target: 5200 },
    { month: "Feb", sales: 4900, target: 8500 },
    { month: "Mar", sales: 5200, target: 7500 },
    { month: "Apr", sales: 2600, target: 3700 },
    { month: "May", sales: 6500, target: 8900 },
    { month: "Jun", sales: 3700, target: 5300 },
    { month: "Jul", sales: 2700, target: 3900 },
    { month: "Aug", sales: 3600, target: 5200 },
    { month: "Sep", sales: 3700, target: 5300 },
    { month: "Oct", sales: 2500, target: 3700 },
    { month: "Nov", sales: 3700, target: 5200 },
    { month: "Dec", sales: 3600, target: 5200 },
  ],
};

const years = ["2023", "2022", "2021"];

export default function SalesAndTarget() {
  const [selectedYear, setSelectedYear] = useState("2023");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    month: string;
    sales: number;
    target: number;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(1000);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setDropdownOpen(false);
  //     }
  //   }

  //   function handleResize() {
  //     if (containerRef.current) {
  //       const width = containerRef.current.offsetWidth;
  //       setChartWidth(width - 48);
  //       setIsSmallScreen(width < 640);
  //     }
  //   }

  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Set a minimum width for small screens (640px is the tailwind sm breakpoint)
        const minWidth = 840;
        const width = Math.max(containerWidth, minWidth);
        setChartWidth(width - 48); // 48px accounts for padding (24px on each side)
        setIsSmallScreen(containerWidth < minWidth);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const data = chartData[selectedYear as keyof typeof chartData];

  const margin = {
    top: 20,
    right: isSmallScreen ? 10 : 20,
    bottom: isSmallScreen ? 30 : 40,
    left: isSmallScreen ? 94 : 60,
  };
  const height = 400;
  const chartHeight = height - margin.top - margin.bottom;

  const maxValue = 10000;
  const yTicks = [0, 2000, 4000, 6000, 8000, 10000];

  const barPadding = 0.8;
  const barWidth = Math.max(
    4,
    (chartWidth / data.length / 2) * (1 - barPadding)
  );
  const barSpacing = barWidth * 0;

  const formatCurrency = (value: number) => {
    return `$${value}`;
  };

  const handleMouseOver = (
    month: string,
    sales: number,
    target: number,
    x: number,
    y: number
  ) => {
    setTooltipData({ x, y, month, sales, target });
  };

  const handleMouseOut = () => {
    setTooltipData(null);
  };

  return (
    <div
      ref={containerRef}
      className="w-full sm:p-6 p-2"
      style={{
        backgroundColor: "white",
        borderRadius: "4px",
        // padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        {/* Legend container */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 mr-2 rounded-[15px]"></div>
            <span className="text-sm font-medium text-gray-600">SALES</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-sky-400 mr-2 rounded-[15px]"></div>
            <span className="text-sm font-medium text-gray-600">TARGET</span>
          </div>
        </div>

        {/* Dropdown container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between w-28 px-3 py-2 text-sm border border-gray-200 rounded-md bg-white cursor-pointer"
          >
            {selectedYear}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 z-10 w-28 mt-1 bg-white border border-gray-200 rounded-md shadow-sm">
              {years.map((year, index) => (
                <div
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setDropdownOpen(false);
                  }}
                  className={`px-3 py-2 text-sm cursor-pointer ${
                    index !== years.length - 1 ? "border-b border-gray-100" : ""
                  } hover:bg-gray-50`}
                >
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="w-full overflow-x-auto" style={{ maxWidth: "100vw" }}>
        <div className="min-w-[840px] xl:min-w-0">
          <div
            style={{
              position: "relative",
              width: "100%",
              height: `${height}px`,
              overflowX: isSmallScreen ? "auto" : "visible",
            }}
          >
            <div
              style={{
                width: isSmallScreen ? `${chartWidth}px` : "100%",
                height: "100%",
              }}
              className=""
            >
              <svg
                width={isSmallScreen ? chartWidth : "100%"}
                height={height}
                viewBox={`0 0 ${chartWidth} ${height}`}
                preserveAspectRatio="none"
                className="text-[14px] font-poppins text-text-secondary"
              >
                {/* ctx.fillStyle = "#646464"; // Your specified color
        ctx.font = `14px 'Poppins', sans-serif`; // Fixed 14px size with Poppins */}
                {/* Y-axis line */}
                <line
                  x1={margin.left}
                  y1={margin.top}
                  x2={margin.left}
                  y2={height - margin.bottom}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />

                {/* X-axis line */}
                <line
                  x1={margin.left}
                  y1={height - margin.bottom}
                  x2={chartWidth - margin.right}
                  y2={height - margin.bottom}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />

                {/* Y-axis and grid lines */}
                {yTicks.map((tick, i) => {
                  const y =
                    chartHeight - (tick / maxValue) * chartHeight + margin.top;
                  return (
                    <g key={i}>
                      <line
                        x1={margin.left}
                        y1={y}
                        x2={chartWidth - margin.right}
                        y2={y}
                        stroke="#e5e7eb"
                        strokeDasharray="3,3"
                        strokeWidth="1"
                      />
                      <text
                        className="font-poppins text-[14px] text-text-secondary"
                        x={margin.left - 10}
                        y={y}
                        textAnchor="end"
                        dominantBaseline="middle"
                        // fontSize={isSmallScreen ? "10" : "12"}
                        fill="#646464"
                      >
                        ${isSmallScreen && tick >= 10000 ? "10k" : tick}
                      </text>
                    </g>
                  );
                })}

                {/* Month labels */}
                {data.map((item, i) => {
                  const x =
                    margin.left +
                    (i * (chartWidth - margin.left - margin.right)) /
                      data.length +
                    (chartWidth - margin.left - margin.right) / data.length / 2;
                  return (
                    <text
                      key={i}
                      x={x}
                      y={height - margin.bottom / 2}
                      textAnchor="middle"
                      fontSize={isSmallScreen ? "10" : "12"}
                      className="font-poppins text-[14px] text-text-secondary"
                      fill="#646464"
                    >
                      {isSmallScreen ? item.month[0] : item.month}
                    </text>
                  );
                })}

                {/* Bars */}
                {data.map((item, i) => {
                  const x =
                    margin.left +
                    (i * (chartWidth - margin.left - margin.right)) /
                      data.length +
                    (chartWidth - margin.left - margin.right) / data.length / 2;
                  const salesHeight = (item.sales / maxValue) * chartHeight;
                  const targetHeight = (item.target / maxValue) * chartHeight;

                  const salesX = x - barWidth - barSpacing / 2;
                  const targetX = x + barSpacing / 2;

                  const salesY = chartHeight - salesHeight + margin.top;
                  const targetY = chartHeight - targetHeight + margin.top;

                  return (
                    <g key={i}>
                      <rect
                        x={salesX}
                        y={salesY}
                        width={barWidth}
                        height={salesHeight}
                        fill="#2563eb"
                        rx="5"
                        ry="5"
                        onMouseOver={() =>
                          handleMouseOver(
                            item.month,
                            item.sales,
                            item.target,
                            salesX + barWidth / 2,
                            salesY - 10
                          )
                        }
                        onMouseOut={handleMouseOut}
                      />

                      <rect
                        x={targetX}
                        y={targetY}
                        width={barWidth}
                        height={targetHeight}
                        fill="#38bdf8"
                        rx="5"
                        ry="5"
                        onMouseOver={() =>
                          handleMouseOver(
                            item.month,
                            item.sales,
                            item.target,
                            targetX + barWidth / 2,
                            targetY - 10
                          )
                        }
                        onMouseOut={handleMouseOut}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {tooltipData && (
              <div
                style={{
                  position: "absolute",
                  left: `${tooltipData.x}px`,
                  top: `${tooltipData.y}px`,
                  transform: "translate(-50%, -100%)",
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  zIndex: 20,
                  fontSize: "12px",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                  {tooltipData.month}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <span>Sales:</span>
                  <span style={{ fontWeight: 500 }}>
                    {formatCurrency(tooltipData.sales)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <span>Target:</span>
                  <span style={{ fontWeight: 500 }}>
                    {formatCurrency(tooltipData.target)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
