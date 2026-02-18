/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { Input, DatePicker, Button } from "antd"
import TipCard from "../tip-card"
import type { DatePickerProps } from "antd"
import dayjs from "dayjs"

type BudgetStepProps = {
    campaignData: any
    updateCampaignData: (data: any) => void
    onNext: () => void
    isLastStep: boolean
}

export default function BudgetStep({ campaignData, updateCampaignData, onNext }: BudgetStepProps) {
    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateCampaignData({ budget: e.target.value })
    }

    const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
        updateCampaignData({ startDate: dateString })
    }

    const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
        updateCampaignData({ endDate: dateString })
    }

    // Check if the form is valid
    const isFormValid = Boolean(
        campaignData?.budget &&
        campaignData?.startDate &&
        campaignData?.endDate
    )

    return (
        <div>
            <h2 className="text-lg mb-6 text-text-black font-semibold">Set Budget And Duration</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-base font-medium">Budget Amount</label>
                        <Input
                            value={campaignData.budget || ""}
                            onChange={handleBudgetChange}
                            placeholder="Enter budget amount"
                            suffix="USD"
                            className="w-full py-3"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-base font-medium">Start Date</label>
                        <DatePicker
                            onChange={handleStartDateChange}
                            placeholder="DD/MM/YYYY"
                            className="w-full py-3"
                            value={campaignData.startDate ? dayjs(campaignData.startDate) : null}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-base font-medium">End Date</label>
                        <DatePicker
                            onChange={handleEndDateChange}
                            placeholder="DD/MM/YYYY"
                            className="w-full py-3"
                            value={campaignData.endDate ? dayjs(campaignData.endDate) : null}
                        />
                    </div>
                </div>

                <TipCard message="A budget of 500 USDT for 7 days is optimal for your goal." />
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