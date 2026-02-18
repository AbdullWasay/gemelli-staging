/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo, useEffect } from "react"
import { Upload, Button } from "antd"
import { useRouter } from "next/navigation"
import { Images, Video, FileText, X } from "lucide-react"
import { toast } from "react-toastify"
import TipCard from "../tip-card"

type ContentStepProps = {
    campaignData: any
    updateCampaignData: (data: any) => void
    onNext: () => void
    isLastStep: boolean
}

function getFileFromUploadInfo(info: any): File | null {
    const file = info?.file?.originFileObj || info?.file
    return file instanceof File ? file : null
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- onNext required by step interface, used by parent
export default function ContentStep({ campaignData, updateCampaignData, onNext }: ContentStepProps) {
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const router = useRouter()

    const imageUrl = useMemo(() => {
        const img = campaignData?.adContent?.image
        const file = img?.originFileObj || img
        if (file instanceof File) {
            return URL.createObjectURL(file)
        }
        return null
    }, [campaignData?.adContent?.image])

    const videoUrl = useMemo(() => {
        const vid = campaignData?.adContent?.video
        const file = vid?.originFileObj || vid
        if (file instanceof File) {
            return URL.createObjectURL(file)
        }
        return null
    }, [campaignData?.adContent?.video])

    const handleImageUpload = (info: any) => {
        const file = getFileFromUploadInfo(info)
        if (file) {
            updateCampaignData({
                adContent: {
                    ...campaignData.adContent,
                    image: file,
                },
            })
        }
    }

    const handleVideoUpload = (info: any) => {
        const file = getFileFromUploadInfo(info)
        if (file) {
            updateCampaignData({
                adContent: {
                    ...campaignData.adContent,
                    video: file,
                },
            })
        }
    }

    const handleDocumentUpload = (info: any) => {
        const file = getFileFromUploadInfo(info)
        if (file) {
            updateCampaignData({
                adContent: {
                    ...campaignData.adContent,
                    document: file,
                },
            })
        }
    }

    const handlePreview = () => {
        setShowPreviewModal(true)
    }

    const handleSave = () => {
        toast.success("Campaign saved successfully!")
        router.push("/dashboard/advertising")
    }

    const handleDiscard = () => {
        updateCampaignData({
            adContent: {
                image: null,
                video: null,
                document: null,
                text: campaignData?.adContent?.text || "",
            },
        })
    }

    const hasContent = campaignData?.adContent?.image || campaignData?.adContent?.video || campaignData?.adContent?.document
    const docFile = campaignData?.adContent?.document
    const docName = docFile?.name || (docFile?.originFileObj?.name)

    // Revoke object URLs on unmount or when files change to avoid memory leaks
    useEffect(() => {
        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl)
            if (videoUrl) URL.revokeObjectURL(videoUrl)
        }
    }, [imageUrl, videoUrl])

    return (
        <div>
            <h2 className="text-lg text-text-black font-semibold mb-6">Upload Ad Content</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-5">
                        <Upload.Dragger
                            name="image"
                            multiple={false}
                            onChange={handleImageUpload}
                            showUploadList={false}
                            className="h-40"
                            accept="image/*"
                        >
                            <p className="flex justify-center">
                                <Images className="h-8 w-8 text-blue-500" />
                            </p>
                            <p className="text-sm text-center mt-2 font-medium">Upload Image</p>
                        </Upload.Dragger>

                        <Upload.Dragger
                            name="video"
                            multiple={false}
                            onChange={handleVideoUpload}
                            showUploadList={false}
                            className="h-40"
                            accept="video/*"
                        >
                            <p className="flex justify-center">
                                <Video className="h-8 w-8 text-blue-500" />
                            </p>
                            <p className="text-sm text-center mt-2 font-medium">Upload Video</p>
                        </Upload.Dragger>

                        <Upload.Dragger
                            name="document"
                            multiple={false}
                            onChange={handleDocumentUpload}
                            showUploadList={false}
                            className="h-40 col-span-2"
                            accept=".pdf,.doc,.docx"
                        >
                            <p className="flex justify-center">
                                <FileText className="h-8 w-8 text-blue-500" />
                            </p>
                            <p className="text-sm text-center mt-2 font-medium">Upload Text Ad</p>
                        </Upload.Dragger>
                    </div>
                </div>

                <TipCard message="Enhance Image Quality Of The Ad Image For Better Engagement." />
            </div>

            {/* Uploaded content preview */}
            {hasContent && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Uploaded Content Preview</h3>
                    <div className="flex flex-wrap gap-4">
                        {campaignData?.adContent?.image && (
                            <div className="relative">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="Uploaded"
                                        className="h-24 w-auto max-w-[200px] object-cover rounded border"
                                    />
                                ) : (
                                    <div className="h-24 w-24 bg-gray-200 rounded flex items-center justify-center">
                                        <Images className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                                <span className="text-xs text-gray-500 block mt-1">Image</span>
                            </div>
                        )}
                        {campaignData?.adContent?.video && (
                            <div>
                                {videoUrl ? (
                                    <video
                                        src={videoUrl}
                                        controls
                                        className="h-24 w-48 object-cover rounded border"
                                    />
                                ) : (
                                    <div className="h-24 w-48 bg-gray-200 rounded flex items-center justify-center">
                                        <Video className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                                <span className="text-xs text-gray-500 block mt-1">Video</span>
                            </div>
                        )}
                        {campaignData?.adContent?.document && (
                            <div className="flex items-center gap-2 p-3 bg-white rounded border">
                                <FileText className="h-8 w-8 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium truncate max-w-[180px]">{docName || "Document"}</p>
                                    <span className="text-xs text-gray-500">Document</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-5">
                <Button
                    onClick={handleDiscard}
                    className="bg-text-secondary/30 font-semibold text-sm text-[#4C4C4C] hover:!bg-text-secondary/10 h-12 w-full rounded-xl"
                >
                    DISCARD
                </Button>

                <Button
                    onClick={handlePreview}
                    className="border-2 border-primary font-semibold text-sm text-primary hover:!border-primary/80 hover:!text-primary/80 h-12 w-full rounded-xl"
                >
                    PREVIEW CAMPAIGN
                </Button>

                <Button
                    onClick={handleSave}
                    className="bg-primary hover:!bg-primary/90 font-semibold text-sm text-white hover:!text-white h-12 w-full rounded-xl"
                >
                    SAVE CAMPAIGN
                </Button>
            </div>

            {/* Preview Campaign Modal */}
            {showPreviewModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100000] p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">Campaign Preview</h3>
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Budget</p>
                                <p className="text-base">${campaignData?.budget || "—"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Duration</p>
                                <p className="text-base">{campaignData?.startDate || "—"} to {campaignData?.endDate || "—"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Platforms</p>
                                <p className="text-base">{(campaignData?.platforms || []).join(", ") || "—"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Target Audience</p>
                                <p className="text-base">Location: {campaignData?.location || "—"}, Age: {campaignData?.ageGroup || "—"}</p>
                            </div>
                            {hasContent && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">Ad Content</p>
                                    <div className="flex flex-wrap gap-3">
                                        {campaignData?.adContent?.image && imageUrl && (
                                            <img src={imageUrl} alt="Ad" className="max-h-48 rounded border" />
                                        )}
                                        {campaignData?.adContent?.video && videoUrl && (
                                            <video src={videoUrl} controls className="max-h-48 rounded border" />
                                        )}
                                        {campaignData?.adContent?.document && (
                                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                                                <FileText className="h-8 w-8 text-blue-500" />
                                                <span className="text-sm">{docName || "Document"}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t">
                            <Button
                                onClick={() => setShowPreviewModal(false)}
                                className="w-full bg-primary text-white hover:!bg-primary/90 h-12 rounded-xl"
                            >
                                Close Preview
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}