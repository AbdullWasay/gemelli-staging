"use client"

import { MapModalProps } from "@/types/Orders"
import { JSX, useEffect, useRef } from "react"


export default function MapModal({ isOpen, onClose, address }: MapModalProps): JSX.Element | null {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Close modal with escape key
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Encode the address for the Google Maps URL
  const encodedAddress = encodeURIComponent(address)
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Location Map</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close map">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 flex-1 overflow-auto">
          <div className="w-full h-[400px] bg-gray-100 rounded">
            {/* For demo purposes, we'll show a placeholder. In production, replace YOUR_API_KEY with an actual Google Maps API key */}
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              src={mapUrl}
              allowFullScreen
              title="Location Map"
            ></iframe>

            {/* Placeholder map for demo */}
            <div className="w-full h-full flex items-center justify-center flex-col p-4">
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                <div className="text-center p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="font-medium">Map would display here</p>
                  <p className="text-sm text-gray-500 mt-1">Address: {address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
