"use client"

import { useState } from "react"
import { MoveLeft } from "lucide-react"
import PlatformStep from "./steps/platform-step"
import BudgetStep from "./steps/budget-step"
import AudienceStep from "./steps/audience-step"
import ContentStep from "./steps/content-step"
import Link from "next/link"


type CampaignData = {
    budget: string
    startDate: string
    endDate: string
    location: string
    ageGroup: string
    interests: string[]
    adContent: {
        image?: File | null
        video?: File | null
        document?: File | null
        text?: string
    }
    platforms: string[]
}

export default function CampaignCreator() {
    const [currentStep, setCurrentStep] = useState(0)
    const [campaignData, setCampaignData] = useState<CampaignData>({
        budget: "200",
        startDate: "",
        endDate: "",
        location: "",
        ageGroup: "18-25",
        interests: ["Fitness Enthusiasts"],
        adContent: {
            image: null,
            video: null,
            document: null,
            text: "",
        },
        platforms: [],
    })

    const steps = [
        { title: "Choose Platform", component: PlatformStep },
        { title: "Define Target Audience", component: AudienceStep },
        { title: "Set Budget And Duration", component: BudgetStep },
        { title: "Upload Ad Content", component: ContentStep },
    ]

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }



    const updateCampaignData = (data: Partial<CampaignData>) => {
        setCampaignData({ ...campaignData, ...data })
    }

    const CurrentStepComponent = steps[currentStep].component

    return (
        <div className="w-full font-poppins">
            <div className="flex items-center mb-6">
                <Link href={"/dashboard/advertising"}>
                    <button className="flex items-center ">
                        <MoveLeft className="mr-2 text-text-secondary" />
                        <span className="text-text-black font-semibold text-xl">Create Campaign</span>
                    </button>
                </Link>
            </div>

            <CurrentStepComponent
                campaignData={campaignData}
                updateCampaignData={updateCampaignData}
                onNext={handleNext}
                isLastStep={currentStep === steps.length - 1}
            />
        </div>
    )
}
