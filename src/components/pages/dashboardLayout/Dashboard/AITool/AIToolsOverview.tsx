import Heading from '@/components/ui/Heading/Heading'
import React from 'react'
import image1 from "@/assets/AIImage/1.png"
import image2 from "@/assets/AIImage/2.png"
import image3 from "@/assets/AIImage/3.png"
import image4 from "@/assets/AIImage/4.png"
import Image from 'next/image'
import aiImage from "@/assets/AIImage/ai.png"

const AIToolsOverview = () => {
    return (
        <div className='font-poppins'>
            <div className='mb-6'>
                <Heading className="!text-[24px]">AI Tools</Heading>
                <p className='mt-1 text-base text-text-secondary/70 font-medium'>Unlock the power of AI to improve product visibility, optimize marketing, and elevate your eCommerce experience.</p>
            </div>
            <div >
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="relative inline-block">
                        <div className="absolute top-2 left-2 xl:top-3 2xL:left-3 text-white p-5 max-w-md">
                            <p className='text-base md:text-lg xl:text-xl font-semibold'>Enhance Product Images</p>
                            <p className='mt-2 text-xs md:text-sm lg:text-base tracking-wide'> Automatically improves image quality for a professional look.</p>
                        </div>
                        <Image src={image1} alt="image1" />
                    </div>

                    <div className="relative inline-block">
                        <div className="absolute top-2 left-2 xl:top-3 2xL:left-3 text-white p-5 max-w-md">
                            <p className='text-base md:text-lg xl:text-xl font-semibold'>Generate 3D Product</p>
                            <p className='mt-2 text-xs md:text-sm lg:text-base tracking-wide'> 3D Image visuals to engage customers interactively.</p>
                        </div>
                        <Image src={image2} alt="image1" />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-5 mt-5">
                    <div className="relative inline-block">
                        <div className="absolute top-2 left-2 xl:top-3 2xL:left-3 text-white p-5 max-w-md">
                            <p className='text-base md:text-lg xl:text-xl font-semibold'>Generate Product Description</p>
                            <p className='mt-2 text-xs md:text-sm lg:text-base tracking-wide'> Save time with AI-generated product descriptions tailored to attract more buyers.</p>
                        </div>
                        <Image src={image3} alt='image1' />
                    </div>

                    <div className="relative inline-block">
                        <div className="absolute top-2 left-2 xl:top-3 2xL:left-3 text-white p-5 max-w-md">
                            <p className='text-base md:text-lg xl:text-xl font-semibold'>Create Compelling Product Titles</p>
                            <p className='mt-2 text-xs md:text-sm lg:text-base tracking-wide'>AI suggests trending and keyword-rich titles for better search visibility.</p>
                        </div>
                        <Image src={image4} alt='image1' />
                    </div>
                </div>
            </div>
            <p className='text-text-black py-7 text-base md:text-lg xl:text-xl font-semibold'>Boost Your Advertising Campaigns</p>

            <div className="rounded-xl bg-gradient-to-r from-[#A514FA] to-[#49C8F2] p-5 ">
                <div className='bg-white/10 rounded-lg p-7 flex flex-col items-center justify-center'>
                    <Image src={aiImage} alt='image1' className='w-12 h-12' />
                    <p className='text-center text-white font-medium text-base tracking-wide mt-3'>Increase Google Ads budget by 10% to boost impressions by 20%.</p>
                </div>
            </div>

            {/* <div>
                <Image src={image5} alt='image1' />
            </div> */}
        </div>
    )
}

export default AIToolsOverview