/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import TipCard from "../tip-card"
import { Button } from "antd"
import img1 from "@/assets/images/campaign/1.png"
import img2 from "@/assets/images/campaign/2.png"
import img3 from "@/assets/images/campaign/3.png"
import img4 from "@/assets/images/campaign/4.png"
import Image from "next/image"

interface PlatformStepProps {
    campaignData: any
    updateCampaignData: (data: any) => void
    onNext: () => void
}

export default function PlatformStep({ campaignData, updateCampaignData, onNext }: PlatformStepProps) {
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(campaignData.platforms || [])
    const [error, setError] = useState<string | null>(null)

    const platforms = [
        { id: "google", name: "Google Ads", logo: "/google-logo.svg" },
        { id: "instagram", name: "Instagram", logo: "/instagram-logo.svg" },
        { id: "facebook", name: "Facebook", logo: "/facebook-logo.svg" },
        { id: "tiktok", name: "TikTok", logo: "/tiktok-logo.svg" },
    ]

    const togglePlatform = (platformId: string) => {
        let newSelected: string[]

        if (selectedPlatforms.includes(platformId)) {
            newSelected = []
        } else {
            newSelected = [platformId]
        }

        setSelectedPlatforms(newSelected)
        updateCampaignData({ platforms: newSelected })

        if (newSelected.length > 0) {
            setError(null)
        }
    }

    const handleNext = () => {
        if (selectedPlatforms.length === 0) {
            setError("Please select at least one platform")
            return
        }
        onNext()
    }

    return (
        <div>
            <h2 className="text-lg mb-6 text-text-black font-semibold">Choose Platform</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <div className="grid grid-cols-2 gap-5">
                        {platforms.map((platform) => (
                            <div
                                key={platform.id}
                                onClick={() => togglePlatform(platform.id)}
                                className={`bg-[#F9F9F9]
                   rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer h-[200px]
                  ${selectedPlatforms.includes(platform.id) ? "border-primary border-2" : "border-dashed border-blue-200"}
                `}
                            >
                                <div className="w-20 h-20 flex items-center justify-center">
                                    {platform.id === "google" && (
                                        <Image src={img1} alt="image1" />
                                    )}
                                    {platform.id === "instagram" && (
                                        <Image src={img2} alt="image1" />
                                    )}
                                    {platform.id === "facebook" && (
                                        <Image src={img3} alt="image1" />
                                    )}
                                    {platform.id === "tiktok" && (
                                        <Image src={img4} alt="image1" />
                                    )}
                                </div>
                                <p className="text-base text-text-black font-medium mt-2">{platform.name}</p>
                            </div>
                        ))}
                    </div>

                    {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
                </div>

                <TipCard message="For Fitness Equipment, Instagram Is Ideal For Younger Audiences." />
            </div>

            <div className="mt-8">
                <Button onClick={handleNext} className="w-full bg-primary hover:!bg-primary/90 text-white hover:!text-white font-medium text-base h-12 rounded-xl">
                    NEXT
                </Button>
            </div>
        </div>
    )
}
