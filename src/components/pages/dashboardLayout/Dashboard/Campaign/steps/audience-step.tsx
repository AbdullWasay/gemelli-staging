/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { Button, Input, Select } from "antd"

import TipCard from "../tip-card"


type AudienceStepProps = {
    campaignData: any
    updateCampaignData: (data: any) => void
    onNext: () => void
    isLastStep: boolean
}

export default function AudienceStep({ campaignData, updateCampaignData, onNext }: AudienceStepProps) {
    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateCampaignData({ location: e.target.value })
    }

    const handleAgeGroupChange = (value: string) => {
        updateCampaignData({ ageGroup: value })
    }

    const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateCampaignData({ interests: e.target.value })
    }

    const ageGroups = [
        { value: "18-25", label: "18-25" },
        { value: "26-35", label: "26-35" },
        { value: "36-45", label: "36-45" },
        { value: "46+", label: "46+" },
    ]

    const isFormValid =
        typeof campaignData?.location === "string" && campaignData.location.trim() &&
        typeof campaignData?.ageGroup === "string" && campaignData.ageGroup &&
        typeof campaignData?.interests === "string" && campaignData.interests.trim()


    return (
        <div>
            <h2 className="text-lg text-text-black font-semibold mb-6">Define Target Audience</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-base font-medium">Location</label>
                        <Input
                            value={campaignData?.location}
                            onChange={handleLocationChange}
                            placeholder="Enter Country, State, Or City"
                            className="w-full py-3"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-base font-medium">Age Group</label>
                        <Select
                            value={campaignData?.ageGroup}
                            onChange={handleAgeGroupChange}
                            options={ageGroups}
                            placeholder="Select age group"
                            className="w-full h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-base font-medium">Interests</label>
                        <Input

                            onChange={handleInterestsChange}
                            placeholder="Fitness Enthusiasts"
                            className="w-full py-3"
                        />
                    </div>
                </div>

                <TipCard message="Include 'fitness Enthusiasts' To Expand Reach By 15%." />
            </div>

            <div className="mt-8">
                <Button
                    onClick={onNext}
                    disabled={!isFormValid}
                    className="w-full bg-primary hover:!bg-primary/90 text-white hover:!text-white font-medium text-base h-12 rounded-xl disabled:!bg-gray-100 disabled:hover:text-white disabled:cursor-not-allowed"
                >
                    NEXT
                </Button>
            </div>
        </div>
    )
}

