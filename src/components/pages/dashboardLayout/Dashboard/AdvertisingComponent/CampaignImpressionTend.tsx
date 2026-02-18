"use client";

import type React from "react";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CampaignImpressionTend() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedDateRange, setSelectedDateRange] = useState("This Year");

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = Math.min(400, Math.max(300, containerWidth * 0.5));

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, containerWidth, containerHeight);

    ctx.fillStyle = "#f9f9f9";
    ctx.fillRect(0, 0, containerWidth, containerHeight);

    const generateDates = () => {
      const dates = [];
      const today = new Date();

      let daysToShow = 30;
      if (selectedDateRange === "Last 60 Days") daysToShow = 60;
      if (selectedDateRange === "Last 90 Days") daysToShow = 90;
      if (selectedDateRange === "This Year") {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        daysToShow = Math.floor(
          (today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
        );
      }

      const numPoints = Math.min(17, Math.max(5, Math.floor(daysToShow / 5)));
      const dayStep = Math.floor(daysToShow / (numPoints - 1));

      for (let i = 0; i < numPoints; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (daysToShow - i * dayStep));
        dates.push(date);
      }

      return dates;
    };

    const dates = generateDates();

    const instagramData = [
      1500, 2000, 1800, 2000, 2200, 1800, 1200, 2500, 3500, 4000, 5000, 4500,
      3500, 3000, 4000, 5500, 6000,
    ].slice(0, dates.length);

    const facebookData = [
      0, 1800, 2500, 4000, 4500, 5000, 4000, 3500, 3000, 3200, 3500, 3000, 2500,
      4000, 4500, 3500, 3000,
    ].slice(0, dates.length);

    const googleAdsData = [
      2000, 2200, 2500, 2800, 3000, 3500, 3700, 3500, 3000, 2500, 2000, 2500,
      3000, 3500, 4000, 3000, 1000,
    ].slice(0, dates.length);

    const tiktokData = [
      3000, 3500, 3000, 2500, 2000, 1800, 2000, 3000, 3200, 3000, 3200, 3000,
      2000, 1000, 2000, 4000, 5000,
    ].slice(0, dates.length);

    const chartPadding = { top: 20, right: 20, bottom: 100, left: 50 };
    const chartWidth = containerWidth - chartPadding.left - chartPadding.right;
    const chartHeight =
      containerHeight - chartPadding.top - chartPadding.bottom;

    let maxValue = 6000;
    if (selectedPlatform === "Instagram") {
      maxValue = Math.max(...instagramData) * 1.2;
    } else if (selectedPlatform === "Facebook") {
      maxValue = Math.max(...facebookData) * 1.2;
    } else if (selectedPlatform === "Google Ads") {
      maxValue = Math.max(...googleAdsData) * 1.2;
    } else if (selectedPlatform === "TikTok") {
      maxValue = Math.max(...tiktokData) * 1.2;
    } else {
      maxValue =
        Math.max(
          Math.max(...instagramData),
          Math.max(...facebookData),
          Math.max(...googleAdsData),
          Math.max(...tiktokData)
        ) * 1.2;
    }

    const yAxisSteps = 6;
    const yAxisStepSize = maxValue / yAxisSteps;

    ctx.beginPath();
    ctx.strokeStyle = "#e0e0e0";
    ctx.fillStyle = "#666";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";

    for (let i = 0; i <= yAxisSteps; i++) {
      const y = chartPadding.top + chartHeight - (i / yAxisSteps) * chartHeight;
      const value = i * yAxisStepSize;

      ctx.moveTo(chartPadding.left, y);
      ctx.lineTo(chartPadding.left + chartWidth, y);

      ctx.fillText(value.toLocaleString(), chartPadding.left - 10, y + 4);
    }
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#666";
    const xStep = chartWidth / (dates.length - 1);

    dates.forEach((date, i) => {
      const x = chartPadding.left + i * xStep;

      const day = date.getDate();
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear().toString().slice(-2);

      const formattedDate = `${day} ${month} ${year}`;

      ctx.save();
      ctx.translate(x, chartPadding.top + chartHeight + 20);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(formattedDate, 0, 0);
      ctx.restore();
    });

    const barIndex = Math.floor(dates.length / 2);
    const barX = chartPadding.left + barIndex * xStep;
    const barWidth = 20;

    const barGradient = ctx.createLinearGradient(
      barX,
      chartPadding.top,
      barX,
      chartPadding.top + chartHeight
    );
    barGradient.addColorStop(0, "rgba(0, 102, 255, 1)");
    barGradient.addColorStop(1, "rgba(0, 102, 255, 0.1)");

    ctx.fillStyle = barGradient;
    ctx.fillRect(barX - barWidth / 2, chartPadding.top, barWidth, chartHeight);

    const drawSmoothLine = (
      data: number[],
      color: string,
      platformName: string
    ) => {
      if (selectedPlatform !== "All" && selectedPlatform !== platformName) {
        return;
      }

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;

      for (let i = 0; i < data.length; i++) {
        const x = chartPadding.left + i * xStep;
        const y =
          chartPadding.top + chartHeight - (data[i] / maxValue) * chartHeight;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevX = chartPadding.left + (i - 1) * xStep;
          const prevY =
            chartPadding.top +
            chartHeight -
            (data[i - 1] / maxValue) * chartHeight;

          const cpX1 = prevX + xStep / 3;
          const cpX2 = x - xStep / 3;

          ctx.bezierCurveTo(cpX1, prevY, cpX2, y, x, y);
        }
      }
      ctx.stroke();

      if (color === "#00c2a8" && platformName === "Google Ads") {
        const markerIndices = [
          Math.floor(data.length * 0.2),
          Math.floor(data.length * 0.4),
          Math.floor(data.length * 0.8),
        ];

        markerIndices.forEach((i) => {
          if (i < data.length) {
            const x = chartPadding.left + i * xStep;
            const y =
              chartPadding.top +
              chartHeight -
              (data[i] / maxValue) * chartHeight;

            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      }

      if (color === "#8a3ffc" && platformName === "Instagram") {
        const markerIndices = [
          Math.floor(data.length * 0.35),
          Math.floor(data.length * 0.6),
        ];

        markerIndices.forEach((i) => {
          if (i < data.length) {
            const x = chartPadding.left + i * xStep;
            const y =
              chartPadding.top +
              chartHeight -
              (data[i] / maxValue) * chartHeight;

            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });
      }
    };

    drawSmoothLine(instagramData, "#8a3ffc", "Instagram");
    drawSmoothLine(facebookData, "#ff3b5c", "Facebook");
    drawSmoothLine(googleAdsData, "#00c2a8", "Google Ads");
    drawSmoothLine(tiktokData, "#0095ff", "TikTok");

    const legendY = chartPadding.top + chartHeight + 60;
    const legendItemWidth = chartWidth / 4;

    const drawLegendItem = (x: number, color: string, text: string) => {
      if (selectedPlatform !== "All" && selectedPlatform !== text) {
        return;
      }

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.moveTo(x, legendY);
      ctx.lineTo(x + 20, legendY);
      ctx.stroke();

      ctx.fillStyle = "#333";
      ctx.textAlign = "left";
      ctx.font = "14px Arial";
      ctx.fillText(text, x + 30, legendY + 4);
    };

    drawLegendItem(chartPadding.left, "#8a3ffc", "Instagram");
    drawLegendItem(chartPadding.left + legendItemWidth, "#ff3b5c", "Facebook");
    drawLegendItem(
      chartPadding.left + legendItemWidth * 2,
      "#00c2a8",
      "Google Ads"
    );
    drawLegendItem(
      chartPadding.left + legendItemWidth * 3,
      "#0095ff",
      "TikTok"
    );
  }, [windowWidth, selectedPlatform, selectedDateRange]);

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlatform(e.target.value);
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDateRange(e.target.value);
  };

  return (
    <div className="campaign-chart-container overflow-x-hidden">
      <div className="">
        <h2 className="text-text-black text-lg font-semibold">
          Campaign Impressions Trend
        </h2>
        <div className="flex flex-wrap gap-3 flex-row items-center justify-between my-5 pl-2">
          <div className="flex flex-wrap flex-row items-center gap-3 ">
            <div className="filter-dropdown">
              <select
                value={selectedPlatform}
                onChange={handlePlatformChange}
                className="rounded-md border !border-gray-300 !bg-bg-primary px-4 py-2 pr-8 text-sm !font-medium !text-gray-700 shadow-sm hover:!bg-gray-50 focus:!outline-none focus:!ring-2 focus:!ring-indigo-500"
              >
                <option>All</option>
                <option>Instagram</option>
                <option>Facebook</option>
                <option>Google Ads</option>
                <option>TikTok</option>
              </select>
            </div>
            <div className="filter-dropdown">
              <select
                value={selectedDateRange}
                onChange={handleDateRangeChange}
                className="rounded-md border !border-gray-300 !bg-bg-primary px-4 py-2 pr-8 text-sm !font-medium !text-gray-700 shadow-sm hover:!bg-gray-50 focus:!outline-none focus:!ring-2 focus:!ring-indigo-500"
              >
                <option>Last 30 Days</option>
                <option>Last 60 Days</option>
                <option>Last 90 Days</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
          <Link href="/dashboard/advertising/create-campaign">
            <button className="bg-primary text-white py-3 px-5 font-semibold rounded-lg text-sm">
              CREATE CAMPAIGN
            </button>
          </Link>
        </div>
      </div>
      <div className="chart-container">
        <div className="w-full overflow-x-auto" style={{ maxWidth: "100vw" }}>
          <div className="min-w-[840px] lg:min-w-full">
            <canvas ref={canvasRef}></canvas>
          </div>
        </div>
      </div>
      <style jsx>{`
        .campaign-chart-container {
          width: 100%;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .chart-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .chart-controls {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-dropdown select {
          padding: 8px 30px 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background-color: white;
          font-size: 14px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          cursor: pointer;
        }

        .create-campaign-btn {
          background-color: #0066ff;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .create-campaign-btn:hover {
          background-color: #0052cc;
        }

        .chart-container {
          width: 100%;
          background-color: #f9f9f9;
          border-radius: 8px;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .chart-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .chart-controls {
            width: 100%;
            justify-content: space-between;
          }

          .filter-dropdown select {
            max-width: 120px;
          }
        }

        @media (max-width: 480px) {
          .chart-controls {
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-dropdown select {
            width: 100%;
            max-width: none;
          }

          .create-campaign-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
