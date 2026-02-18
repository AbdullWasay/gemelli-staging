/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function SalesGraphCard() {
  // Sample data for the chart
  const data = [
    { month: "Jan", "2022": 3800, "2023": 800 },
    { month: "Feb", "2022": 4700, "2023": 3200 },
    { month: "Mar", "2022": 3600, "2023": 2800 },
    { month: "Apr", "2022": 3400, "2023": 8400 },
    { month: "May", "2022": 3300, "2023": 6800 },
    { month: "Jun", "2022": 1800, "2023": 9200 },
    { month: "Jul", "2022": 5200, "2023": 5000 },
    { month: "Aug", "2022": 6300, "2023": 6200 },
    { month: "Sep", "2022": 5400, "2023": 3800 },
    { month: "Oct", "2022": 7200, "2023": 3600 },
    { month: "Nov", "2022": 3000, "2023": 800 },
    { month: "Dec", "2022": 10000, "2023": 9800 },
  ];

  // Custom tooltip formatter
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-md">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry) => (
            <p
              key={entry.name}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {`${entry.name}: $${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Colors for the chart lines
  const colors = {
    "2022": "#10b981", // emerald-500
    "2023": "#3b82f6", // blue-500
  };

  return (
    <div className="mt-8 font-poppins">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-0">
          <h1 className="text-text-black text-[28px] md:text-[32px] font-semibold text-center md:text-left">
            Sales History
          </h1>
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-5 w-full xs:w-auto">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#00E096] rounded-sm"></div>
              <span className="text-[#005BFFCC] text-sm sm:text-base font-medium">
                2022
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-sm"></div>
              <span className="text-[#005BFFCC] text-sm sm:text-base font-medium">
                2023
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 sm:mt-3 bg-[#F9F9F9] p-4 sm:p-6 rounded-lg">
          <div className="h-64 sm:h-80 md:h-96 lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  stroke="#888888"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `$${value}`}
                  stroke="#888888"
                  domain={[0, "dataMax + 1000"]}
                  tick={{ fontSize: 12 }}
                  width={60}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ outline: "none" }}
                />
                <Line
                  key="2022"
                  type="monotone"
                  dataKey="2022"
                  stroke={colors["2022"]}
                  strokeWidth={2.5}
                  dot={(props) => {
                    const highlightMonths = ["Feb", "Jul", "Oct"];
                    if (highlightMonths.includes(props.payload.month)) {
                      return (
                        <circle
                          key={`dot-2022-${props.payload.month}`}
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          fill="white"
                          stroke={colors["2022"]}
                          strokeWidth={2}
                        />
                      );
                    }
                    return <g key={`empty-dot-2022-${props.payload.month}`} />;
                  }}
                  activeDot={{
                    r: 5,
                    fill: "white",
                    stroke: colors["2022"],
                    strokeWidth: 2,
                  }}
                />
                <Line
                  key="2023"
                  type="monotone"
                  dataKey="2023"
                  stroke={colors["2023"]}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "white",
                    stroke: colors["2023"],
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
