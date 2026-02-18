


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Heading from "@/components/ui/Heading/Heading"
// import Heading from "@/components/ui/Heading/Heading"

export default function SalesSettingsComponent() {
  // Delivery Policies State
  const [deliveryPolicies, setDeliveryPolicies] = useState({
    flatRate: {
      country: "Moldova",
      rate: 5,
    },
    freeDeliveryThreshold: 500,
  })

  // Return Policies State
  const [returnPolicies, setReturnPolicies] = useState({
    returnsAccepted: true,
    timeFrame: 14,
    condition: "ORIGINAL PACKAGING AND RECEIPT REQUIRED.",
  })

  // Exposure Preferences State
  const [exposurePreferences, setExposurePreferences] = useState({
    displayType: "2D IMAGES",
    promotionalMessage: "FREE SHIPPING ON LARGE ORDERS",
  })

  // Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null)

  // Form States
  const [deliveryForm, setDeliveryForm] = useState({
    flatRate: 5,
    country: "Moldova",
    threshold: 500,
  })

  const [returnForm, setReturnForm] = useState({
    returnsAccepted: true,
    timeFrame: 14,
    condition: "ORIGINAL PACKAGING AND RECEIPT REQUIRED.",
  })

  const [exposureForm, setExposureForm] = useState({
    displayType: "2D IMAGES",
    promotionalMessage: "FREE SHIPPING ON LARGE ORDERS",
  })

  // State to track updates for UI feedback
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [showUpdateInfo, setShowUpdateInfo] = useState(false)

  // Initialize form data when modal opens
  useEffect(() => {
    if (activeModal === "delivery") {
      setDeliveryForm({
        flatRate: deliveryPolicies.flatRate.rate,
        country: deliveryPolicies.flatRate.country,
        threshold: deliveryPolicies.freeDeliveryThreshold,
      })
    } else if (activeModal === "return") {
      setReturnForm({
        returnsAccepted: returnPolicies.returnsAccepted,
        timeFrame: returnPolicies.timeFrame,
        condition: returnPolicies.condition,
      })
    } else if (activeModal === "exposure") {
      setExposureForm({
        displayType: exposurePreferences.displayType,
        promotionalMessage: exposurePreferences.promotionalMessage,
      })
    }
  }, [activeModal, deliveryPolicies, returnPolicies, exposurePreferences])

  // Open modal handler
  const openModal = (modalName: string) => {
    setActiveModal(modalName)
    // Add class to body to prevent scrolling
    document.body.style.overflow = "hidden"
  }

  // Close modal handler
  const closeModal = () => {
    setActiveModal(null)
    // Remove class from body to allow scrolling
    document.body.style.overflow = "auto"
  }

  // Update handlers
  const handleUpdateDeliveryPolicy = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedDeliveryPolicies = {
      flatRate: {
        country: deliveryForm.country,
        rate: deliveryForm.flatRate,
      },
      freeDeliveryThreshold: deliveryForm.threshold,
    }

    setDeliveryPolicies(updatedDeliveryPolicies)
    console.log("Updated Delivery Policies:", updatedDeliveryPolicies)

    setLastUpdated("Delivery Policies")
    setShowUpdateInfo(true)
    closeModal()

    // Hide the update info after 5 seconds
    setTimeout(() => setShowUpdateInfo(false), 5000)
  }

  const handleUpdateReturnPolicy = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedReturnPolicies = {
      returnsAccepted: returnForm.returnsAccepted,
      timeFrame: returnForm.timeFrame,
      condition: returnForm.condition,
    }

    setReturnPolicies(updatedReturnPolicies)
    console.log("Updated Return Policies:", updatedReturnPolicies)

    setLastUpdated("Return Policies")
    setShowUpdateInfo(true)
    closeModal()

    setTimeout(() => setShowUpdateInfo(false), 5000)
  }

  const handleUpdateExposurePreferences = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedExposurePreferences = {
      displayType: exposureForm.displayType,
      promotionalMessage: exposureForm.promotionalMessage,
    }

    setExposurePreferences(updatedExposurePreferences)
    console.log("Updated Exposure Preferences:", updatedExposurePreferences)

    setLastUpdated("Exposure Preferences")
    setShowUpdateInfo(true)
    closeModal()

    setTimeout(() => setShowUpdateInfo(false), 5000)
  }

  // Form change handlers
  const handleDeliveryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setDeliveryForm((prev) => ({
      ...prev,
      [name]: name === "flatRate" || name === "threshold" ? Number(value) : value,
    }))
  }

  const handleReturnFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setReturnForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleExposureFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setExposureForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="container mx-auto py-6  md:px-6 sm:px-4 px-2">
      <Heading className="!text-[16px] mb-5 !mt-0">Sales</Heading>

      {/* Update Notification */}
      {showUpdateInfo && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700">
            <span className="font-semibold">{lastUpdated}</span> have been updated. Check the console for details.
          </p>
        </div>
      )}

      {/* Delivery Policies */}
      <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-white">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center mb-4 sm:gap-0 gap-2">
          <h2 className="text-lg font-semibold">Delivery Policies</h2>
          <button
            className="px-4 py-2 text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 w-max"
            onClick={() => openModal("delivery")}
          >
            Update Policy
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-500 mb-1">Flat Rate ({deliveryPolicies.flatRate.country})</p>
            <p className="font-medium">{deliveryPolicies.flatRate.rate} USD PER ORDER.</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Free Delivery Threshold</p>
            <p className="font-medium">FREE DELIVERY FOR ORDERS OVER {deliveryPolicies.freeDeliveryThreshold} USD</p>
          </div>
        </div>
      </div>

      {/* Return Policies */}
      <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-white">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center mb-4 sm:gap-0 gap-2">
          <h2 className="text-lg font-semibold">Return Policies</h2>
          <button
            className="px-4 py-2 text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 w-max"
            onClick={() => openModal("return")}
          >
            Update Policy
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-500 mb-1">Returns Accepted</p>
            <p className="font-medium">{returnPolicies.returnsAccepted ? "YES" : "NO"}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Time Frame</p>
            <p className="font-medium">RETURNS ACCEPTED WITHIN {returnPolicies.timeFrame} DAYS.</p>
          </div>
          <div className="sm:col-span-2 col-span-1">
            <p className="text-gray-500 mb-1">Condition</p>
            <p className="font-medium">{returnPolicies.condition}</p>
          </div>
        </div>
      </div>

      {/* Exposure Preferences */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center mb-2 sm:gap-0 gap-2">
          <h2 className="text-lg font-semibold">Exposure Preferences</h2>
          <button
            className="px-4 py-2 text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 w-max"
            onClick={() => openModal("exposure")}
          >
            Update
          </button>
        </div>

        <p className="text-gray-500 mb-4">Customize how your products are displayed to attract more buyers.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-500 mb-1">Display Type</p>
            <p className="font-medium">{exposurePreferences.displayType}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Promotional Message</p>
            <p className="font-medium">{exposurePreferences.promotionalMessage}</p>
          </div>
        </div>
      </div>



      {/* Modals */}
      {/* Delivery Policy Modal */}
      {activeModal === "delivery" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">Update Delivery Policy</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateDeliveryPolicy}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={deliveryForm.country}
                    onChange={handleDeliveryFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flat Rate (USD)</label>
                  <input
                    type="number"
                    name="flatRate"
                    value={deliveryForm.flatRate}
                    onChange={handleDeliveryFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Free Delivery Threshold (USD)</label>
                  <input
                    type="number"
                    name="threshold"
                    value={deliveryForm.threshold}
                    onChange={handleDeliveryFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Policy Modal */}
      {activeModal === "return" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">Update Return Policy</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateReturnPolicy}>
              <div className="px-6 py-4 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="returnsAccepted"
                    name="returnsAccepted"
                    checked={returnForm.returnsAccepted}
                    onChange={handleReturnFormChange}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                  />
                  <label htmlFor="returnsAccepted" className="ml-2 block text-sm text-gray-700">
                    Returns Accepted
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Frame (Days)</label>
                  <input
                    type="number"
                    name="timeFrame"
                    value={returnForm.timeFrame}
                    onChange={handleReturnFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <textarea
                    name="condition"
                    value={returnForm.condition}
                    onChange={handleReturnFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exposure Preferences Modal */}
      {activeModal === "exposure" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">Update Exposure Preferences</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateExposurePreferences}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Type</label>
                  <select
                    name="displayType"
                    value={exposureForm.displayType}
                    onChange={handleExposureFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="2D IMAGES">2D IMAGES</option>
                    <option value="3D IMAGES">3D IMAGES</option>
                    <option value="VIDEO">VIDEO</option>
                    <option value="CAROUSEL">CAROUSEL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promotional Message</label>
                  <input
                    type="text"
                    name="promotionalMessage"
                    value={exposureForm.promotionalMessage}
                    onChange={handleExposureFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
