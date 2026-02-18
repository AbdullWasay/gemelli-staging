"use client"

import Image, { StaticImageData } from "next/image"

export default function ReviewCard({ id, name, role, image }: { id: string, name: string; role: string; image: string | StaticImageData }) {
    return (
        <div className="max-w-xs mx-auto font-poppins">
            <div className="relative rounded-3xl overflow-hidden bg-gray-100 mb-4">
                <div className="max-w-[350px] h-[440px] relative">
                    <Image src={image} alt={`${name} + ${id} photo`} fill className="object-cover w-full h-full" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <button className="absolute inset-0 flex items-center justify-center group" aria-label="Play Video">
                        <div className="relative">
                            <div className="relative flex items-center justify-center w-24 h-24 rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 110 110" fill="white">
                                    <circle opacity="0.2" cx="55" cy="55" r="55" fill="white" />
                                    <circle opacity="0.3" cx="55" cy="55" r="44.6875" fill="white" />
                                    <circle opacity="0.5" cx="55" cy="55" r="34.375" fill="white" />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M42.9657 31C41.9522 30.999 40.9551 31.2562 40.0686 31.7474C39.1594 32.2108 38.3935 32.9129 37.8529 33.7784C37.3124 34.644 37.0175 35.6403 37 36.6606V73.2674C37.0175 74.2877 37.3124 75.284 37.8529 76.1496C38.3935 77.0151 39.1594 77.7172 40.0686 78.1806C40.9712 78.6819 41.9885 78.9405 43.021 78.9308C44.0534 78.9212 45.0657 78.6438 45.9589 78.1257L75.5474 59.824C76.4605 59.3638 77.2279 58.6591 77.7639 57.7884C78.2999 56.9177 78.5836 55.9152 78.5832 54.8927C78.5829 53.8702 78.2985 52.8679 77.7619 51.9975C77.2253 51.1272 76.4574 50.423 75.544 49.9634L45.9554 31.7989C45.0465 31.2742 44.0152 30.9987 42.9657 31Z"
                                        fill="#fff"
                                    />
                                </svg>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            <div className="text-center">
                <h2 className="text-lg text-text-black font-semibold">{name}</h2>
                <p className="text-text-secondary">{role}</p>
            </div>
        </div>
    )
}
