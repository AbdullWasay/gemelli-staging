"use client"

import { useEffect, useRef, useState } from "react"
import first from "@/assets/images/dashboard/first.png"
import second from "@/assets/images/dashboard/second.png"
import Image from "next/image"
import Link from "next/link"

export default function TopFiveProducts() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const calculateDimensions = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const isSmallScreen = containerWidth < 768

      // For small screens, use minimum 540px width with scrolling
      // For larger screens, use full available width
      const chartWidth = isSmallScreen ? Math.max(containerWidth, 540) : containerWidth
      const chartHeight = Math.min((chartWidth * 9) / 16, 500)

      setDimensions({
        width: chartWidth,
        height: chartHeight,
      })
    }

    calculateDimensions()
    const handleWindowResize = () => calculateDimensions()

    window.addEventListener("resize", handleWindowResize)
    return () => window.removeEventListener("resize", handleWindowResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const drawChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const products = [
        { name: "Product 1", value: 6200, color: "#9333ea" },
        { name: "Product 2", value: 4000, color: "#3b82f6" },
        { name: "Product 3", value: 2500, color: "#f87171" },
        { name: "Product 4", value: 4500, color: "#9333ea" },
        { name: "Product 5", value: 7000, color: "#3b82f6" },
      ]

      const maxValue = 8000
      const padding = {
        top: 40,
        right: 24,
        bottom: dimensions.height * 0.1,
        left: 94,
      }
      const chartWidth = dimensions.width - padding.left - padding.right
      const chartHeight = dimensions.height - padding.top - padding.bottom

      const dpr = window.devicePixelRatio || 1
      canvas.width = dimensions.width * dpr
      canvas.height = dimensions.height * dpr
      ctx.scale(dpr, dpr)

      // Fixed font sizing logic - consistent sizes that scale properly

      // Y-axis labels with consistent font sizing
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      const yLabels = ["$0", "$2000", "$4000", "$6000", "$8000"]
      yLabels.forEach((label, index) => {
        const y = dimensions.height - padding.bottom - index * (chartHeight / (yLabels.length - 1))

        // Set the text styling
        ctx.fillStyle = "#646464"; // Your specified color
        ctx.font = `14px 'Poppins', sans-serif`; // Fixed 14px size with Poppins

        ctx.fillText(label, padding.left - 10, y)
      })

      // Draw axes
      ctx.beginPath()
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 0.5
      ctx.moveTo(padding.left, dimensions.height - padding.bottom)
      ctx.lineTo(dimensions.width - padding.right, dimensions.height - padding.bottom)
      ctx.moveTo(padding.left, padding.top)
      ctx.lineTo(padding.left, dimensions.height - padding.bottom)
      ctx.stroke()

      const barWidth = 20
      const barSpacing = chartWidth / products.length

      products.forEach((product, index) => {
        const x = padding.left + index * barSpacing + (barSpacing - barWidth) / 2
        const barHeight = (product.value / maxValue) * chartHeight
        const y = dimensions.height - padding.bottom - barHeight

        // Draw bars with gradient for Product 3
        if (index === 2) {
          const gradient = ctx.createLinearGradient(x, y, x, dimensions.height - padding.bottom)
          gradient.addColorStop(0, "#f87171")
          gradient.addColorStop(1, "#fecaca")
          ctx.fillStyle = gradient
        } else {
          ctx.fillStyle = product.color
        }

        // Draw rounded rectangle bars
        const radius = 8
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + barWidth - radius, y)
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius)
        ctx.lineTo(x + barWidth, dimensions.height - padding.bottom - radius)
        ctx.quadraticCurveTo(
          x + barWidth,
          dimensions.height - padding.bottom,
          x + barWidth - radius,
          dimensions.height - padding.bottom,
        )
        ctx.lineTo(x + radius, dimensions.height - padding.bottom)
        ctx.quadraticCurveTo(x, dimensions.height - padding.bottom, x, dimensions.height - padding.bottom - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.fill()

  
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#646464"; 
        ctx.font = `14px 'Poppins', sans-serif`;

        const maxCharsPerLine = dimensions.width < 500 ? 8 : 12
        // Define labelFontSize to match the font size used above
        const labelFontSize = 14;
        if (product.name.length > maxCharsPerLine) {
          const middle = Math.floor(product.name.length / 2)
          const spaceIndex = product.name.lastIndexOf(" ", middle)
          const splitIndex = spaceIndex > 0 ? spaceIndex : middle

          const line1 = product.name.substring(0, splitIndex)
          const line2 = product.name.substring(splitIndex)

          ctx.fillText(line1, x + barWidth / 2, dimensions.height - padding.bottom + 8)
          ctx.fillText(line2, x + barWidth / 2, dimensions.height - padding.bottom + 8 + labelFontSize + 2)
        } else {
          ctx.fillText(product.name, x + barWidth / 2, dimensions.height - padding.bottom + 8)
        }
      })
    }

    drawChart()
  }, [dimensions])

  return (
    <div className="w-full mx-auto mt-[26px]" ref={containerRef}>
      {/* Outer container for the entire component */}
      <div className="w-full overflow-hidden">
        {/* Grid container */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-end">
          {/* Chart container with scrolling for small screens */}
          <div className="xl:col-span-2 overflow-x-auto">
            <div
              className="bg-[#F9F9F9] rounded-lg p-4 shadow-sm"
              style={{
                minWidth: "540px",
                width: dimensions.width > 540 ? "100%" : "540px",
              }}
            >
              <canvas ref={canvasRef} className="w-full" style={{ height: `${dimensions.height}px` }} />
            </div>
          </div>

          {/* Cards container */}
          <div className="flex flex-col gap-4" ref={cardsContainerRef}>
            <div className="relative">
              <Image src={first || "/placeholder.svg"} alt="first" className="object-cover" />
              <div className="absolute sm:bottom-8 bottom-4 left-1/2 -translate-x-1/2 w-full">
                <Link href={""} className="flex items-center justify-center gap-2">
                  <span className="font-poppins text uppercase text-white sm:text-[14px] text-[10px]">
                    Start advertising
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="12" viewBox="0 0 21 12" fill="none">
                    <path
                      d="M1 5.25C0.585786 5.25 0.25 5.58579 0.25 6C0.25 6.41421 0.585786 6.75 1 6.75V5.25ZM20.5303 6.53033C20.8232 6.23744 20.8232 5.76256 20.5303 5.46967L15.7574 0.696699C15.4645 0.403806 14.9896 0.403806 14.6967 0.696699C14.4038 0.989593 14.4038 1.46447 14.6967 1.75736L18.9393 6L14.6967 10.2426C14.4038 10.5355 14.4038 11.0104 14.6967 11.3033C14.9896 11.5962 15.4645 11.5962 15.7574 11.3033L20.5303 6.53033ZM1 6.75H20V5.25H1V6.75Z"
                      fill="white"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="w-full relative">
              <Image src={second || "/placeholder.svg"} alt="second" className="w-full" />
              <div className="absolute sm:bottom-8 bottom-3 left-1/2 -translate-x-1/2 w-full">
                <Link href={""} className="text-white flex items-center gap-2 uppercase justify-center">
                  <span className="font-poppins text uppercase text-white sm:text-[14px] text-[10px]">
                    Upgrade to 3D Product
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="12" viewBox="0 0 21 12" fill="none">
                    <path
                      d="M1 5.25C0.585786 5.25 0.25 5.58579 0.25 6C0.25 6.41421 0.585786 6.75 1 6.75V5.25ZM20.5303 6.53033C20.8232 6.23744 20.8232 5.76256 20.5303 5.46967L15.7574 0.696699C15.4645 0.403806 14.9896 0.403806 14.6967 0.696699C14.4038 0.989593 14.4038 1.46447 14.6967 1.75736L18.9393 6L14.6967 10.2426C14.4038 10.5355 14.4038 11.0104 14.6967 11.3033C14.9896 11.5962 15.4645 11.5962 15.7574 11.3033L20.5303 6.53033ZM1 6.75H20V5.25H1V6.75Z"
                      fill="white"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
