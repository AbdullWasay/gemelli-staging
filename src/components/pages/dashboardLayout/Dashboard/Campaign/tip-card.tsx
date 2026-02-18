import Image from 'next/image'
import aiImage from "@/assets/AIImage/ai.png"
export default function TipCard({ message }: { message: string }) {

    return (
        <div className="bg-gradient-to-r from-[#A514FA] to-[#49C8F2] rounded-xl p-8 flex flex-col items-center justify-center text-white font-poppins">
            <div className="mb-4">
                <Image src={aiImage} alt='image1' className='w-16 h-16' />
            </div>
            <p className="text-center text-base md:text-lg font-medium">{message}</p>
        </div>
    )
}
