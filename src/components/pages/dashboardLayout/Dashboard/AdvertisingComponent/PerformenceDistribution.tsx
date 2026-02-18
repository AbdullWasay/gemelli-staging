"use client";

import { useState } from "react";
import Heading from "@/components/ui/Heading/Heading";
import { ArrowUpRight } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function PerformenceDistribution() {
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const handleApply = (id: string) => {
    setAppliedIds((prev) => new Set(prev).add(id));
    toast.success("Recommendation applied. Redirecting to create campaign...");
  };
  return (
    <div className=" mb-6 ">
      <div className="mx-auto ">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between ">
          <Heading className="!text-[24px] !mt-0">Advertising</Heading>

          <div className="relative">
            <select className="appearance-none rounded-md border border-gray-300 bg-bg-primary px-4 py-2 pr-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Performance Highlights */}
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Performance Highlights
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Impressions */}
          <div className="rounded-lg bg-bg-primary p-5">
            <div className="mb-2 text-3xl font-bold text-gray-900">50,000</div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Total Impressions</div>
              <div className="flex items-center text-sm font-medium text-blue-500">
                <span>200%</span>
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Total Clicks */}
          <div className="rounded-lg bg-bg-primary p-5">
            <div className="mb-2 text-3xl font-bold text-gray-900">10,000</div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Total Clicks</div>
              <div className="flex items-center text-sm font-medium text-blue-500">
                <span>200%</span>
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="rounded-lg bg-bg-primary p-5">
            <div className="mb-2 text-3xl font-bold text-purple-600">8%</div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Conversion Rate</div>
              <div className="flex items-center text-sm font-medium text-blue-500">
                <span>200%</span>
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          </div>

          {/* ROI */}
          <div className="rounded-lg bg-bg-primary p-5">
            <div className="mb-2 text-3xl font-bold text-red-500">150%</div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">ROI</div>
              <div className="flex items-center text-sm font-medium text-blue-500">
                <span>200%</span>
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Distribution and AI Recommendations */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Performance Distribution */}
          <div>
            <h2 className="mb-3 text-text-black text-lg font-semibold">
              Performance Distribution
            </h2>
            <div className="rounded-lg bg-bg-primary p-4 shadow">
              <div className="flex h-64 items-center justify-center">
                <ExactDonutChart />
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <h2 className="mb-3 text-text-black text-lg font-semibold">
              AI Recommendations
            </h2>
            <div className="rounded-lg bg-gradient-to-tr from-[#A514FA] to-[#49C8F2] p-4 shadow ">
              <div className="space-y-3">
                <div className="rounded-lg bg-bg-primary/20 p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">
                      Focus On Weekend Campaigns For Higher Engagement Rates.
                    </p>
                    <Link href="/dashboard/advertising/create-campaign">
                      <button
                        onClick={() => handleApply("weekend")}
                        disabled={appliedIds.has("weekend")}
                        className={`rounded-md px-6 py-2.5 text-sm font-medium font-poppins text-black transition-colors ${
                          appliedIds.has("weekend")
                            ? "bg-green-500 cursor-default"
                            : "bg-yellow-400 hover:bg-yellow-500"
                        }`}
                      >
                        {appliedIds.has("weekend") ? "Applied" : "Apply"}
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="rounded-lg bg-bg-primary/20 p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">
                      Campaign XYZ Has Low Conversion. Consider Revising The Content.
                    </p>
                    <Link href="/dashboard/advertising/create-campaign"><button className="rounded-md bg-yellow-400 px-6 py-2.5 text-sm font-medium text-black font-poppins hover:bg-yellow-500">
                      Apply
                    </button>
                    </Link>
                  </div>
                </div>

                <div className="rounded-lg bg-bg-primary/20 p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">
                      Ad Budget For Campaign ABC Is Running Out.
                    </p>
                    <Link href="/dashboard/advertising/create-campaign"><button className="rounded-md bg-yellow-400 px-6 py-2.5 text-sm font-medium text-black font-poppins hover:bg-yellow-500">
                      Apply
                    </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExactDonutChart() {
  // Chart data
  const data = [
    { name: "Instagram", value: 10, color: "#9333ea" },
    { name: "Google Ads", value: 20, color: "#3b82f6" },
    { name: "Facebook", value: 20, color: "#22c55e" },
    { name: "TikTok", value: 50, color: "#ef4444" },
  ];

  // Calculate the total
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calculate the start and end angles for each segment
  let startAngle = 0;
  const segments = data.map((item) => {
    const angle = (item.value / total) * 360;
    const segment = {
      ...item,
      startAngle,
      endAngle: startAngle + angle,
    };
    startAngle += angle;
    return segment;
  });

  // Function to create an SVG arc path
  interface Segment {
    name: string;
    value: number;
    color: string;
    startAngle: number;
    endAngle: number;
  }

  const createArc = (segment: Segment): string => {
    const innerRadius = 25;
    const outerRadius = 50;

    const startAngleRad = (segment.startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (segment.endAngle - 90) * (Math.PI / 180);

    const x1 = 50 + outerRadius * Math.cos(startAngleRad);
    const y1 = 50 + outerRadius * Math.sin(startAngleRad);
    const x2 = 50 + outerRadius * Math.cos(endAngleRad);
    const y2 = 50 + outerRadius * Math.sin(endAngleRad);

    const x3 = 50 + innerRadius * Math.cos(endAngleRad);
    const y3 = 50 + innerRadius * Math.sin(endAngleRad);
    const x4 = 50 + innerRadius * Math.cos(startAngleRad);
    const y4 = 50 + innerRadius * Math.sin(startAngleRad);

    const largeArcFlag =
      segment.endAngle - segment.startAngle <= 180 ? "0" : "1";

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };

  // Function to calculate label position
  const getLabelPosition = (segment: Segment): { x: number; y: number } => {
    const angle: number = (segment.startAngle + segment.endAngle) / 2 - 90;
    const angleRad: number = angle * (Math.PI / 180);
    const radius: number = 37.5; // Position between inner and outer radius

    return {
      x: 50 + radius * Math.cos(angleRad),
      y: 50 + radius * Math.sin(angleRad),
    };
  };

  return (
    //   <div className="flex w-full items-center justify-center">
    //       <div className="flex md:flex-row flex-col items-center gap-x-10">
    //         {/* Legend */}
    //         <div className=" flex md:flex-col  justify-center space-y-2 space-x-2 max-w-full flex-wrap md:mb-0 mb-5">
    //           {data.map((item, index) => (
    //             <div key={index} className="flex items-center">
    //               <div
    //                 className="mr-2 h-3 w-3 rounded-sm"
    //                 style={{ backgroundColor: item.color }}
    //               ></div>
    //               <span className="text-sm text-gray-600">{item.name}</span>
    //             </div>
    //           ))}
    //         </div>

    //         {/* Chart */}
    //         <div className="relative h-56 w-56">
    //           <svg viewBox="0 0 100 100" className="h-full w-full">
    //             {segments.map((segment, index) => (
    //               <path key={index} d={createArc(segment)} fill={segment.color} />
    //             ))}

    //             {/* Percentage labels */}
    //             {segments.map((segment, index) => {
    //               const position = getLabelPosition(segment);
    //               return (
    //                 <text
    //                   key={`label-${index}`}
    //                   x={position.x}
    //                   y={position.y}
    //                   textAnchor="middle"
    //                   dominantBaseline="middle"
    //                   fill="white"
    //                   fontWeight="bold"
    //                   fontSize="6"
    //                 >
    //                   {segment.value}%
    //                 </text>
    //               );
    //             })}
    //           </svg>
    //         </div>
    //       </div>
    //     </div>

    <div className="flex w-full items-center justify-center">
      <div className="flex md:flex-row flex-col  items-center gap-5">
        {/* Legend */}
        <div className="lg:mr-8 flex md:flex-col flex-row md:space-y-2 space-y-0 md:space-x-0 space-x-2   justify-center max-w-full flex-wrap">
          {data.map((item, index) => (
            <div key={index} className="flex items-center ">
              <div
                className="mr-2 h-3 w-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="relative md:h-56 h-48 md:w-56 w-48">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            {segments.map((segment, index) => (
              <path key={index} d={createArc(segment)} fill={segment.color} />
            ))}

            {/* Percentage labels */}
            {segments.map((segment, index) => {
              const position = getLabelPosition(segment);
              return (
                <text
                  key={`label-${index}`}
                  x={position.x}
                  y={position.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontWeight="bold"
                  fontSize="6"
                >
                  {segment.value}%
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
