"use client"

import { Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { Button } from "antd"

interface ProductCartProps {
    product: {
        id: string;
        name: string;
        size: string;
        brand: string;
        price: number;
        currency: string;
        originalPrice?: number;
        onSale?: boolean;
        imageUrl: string;
        quantity: number;
    };
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
}

export default function ViewCartCard({ product, onIncrease, onDecrease, onRemove }: ProductCartProps) {
    return (
        <div className="bg-[#F9F9F9] p-3 md:p-5 rounded-lg w-full font-poppins">
            <div className="grid grid-cols-4 md:grid-cols-5 gap-4 items-start">
                <div className="flex gap-4 col-span-3 md:col-span-4">
                    <div className="w-28 h-28 md:w-40 md:h-40 bg-white rounded-lg flex items-center justify-center">
                        <Image
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            width={100}
                            height={100}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <h3 className="text-lg md:text-xl font-semibold">{product.name}</h3>
                        <p className="text-sm md:text-base text-text-secondary/80 font-medium ">
                            SIZE : {product.size}, {product.brand}
                        </p>
                        <div className="text-primary text-base font-semibold ">
                            {product.onSale && product.originalPrice != null ? (
                                <div className="flex flex-col">
                                    <span>
                                        {product.price.toFixed(2)} {product.currency}
                                    </span>
                                    <span className="text-sm text-text-secondary/70 line-through">
                                        {product.originalPrice.toFixed(2)} {product.currency}
                                    </span>
                                </div>
                            ) : (
                                <span>
                                    {product.price.toFixed(2)} {product.currency}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col h-full justify-between items-end">
                    <button
                        className="text-[#FF3A44] hover:text-[#FF3A44]/80"
                        onClick={() => onRemove(product.id)}
                        aria-label="Remove item"
                    >
                        <Trash2 className="text-[#FF3A44]" size={20} />
                    </button>
                    <div className="flex items-center justify-end mt-0 md:mt-4">
                        <Button
                            type="default"
                            className="!w-7 !h-7 !p-0 !rounded-full bg-white border border-white flex items-center justify-center"
                            onClick={() => onIncrease(product.id)}
                            aria-label="Increase quantity"
                        >
                            <Plus size={16} className="text-gray-600" />
                        </Button>
                        <span className="mx-2 w-6 text-center text-text-secondary/70 font-semibold">
                            {product.quantity.toString().padStart(2, '0')}
                        </span>
                        <Button
                            type="default"
                            className="!w-7 !h-7 !p-0 !rounded-full bg-white border border-white flex items-center justify-center"
                            onClick={() => onDecrease(product.id)}
                            disabled={product.quantity <= 1}
                            aria-label="Decrease quantity"
                        >
                            <Minus size={16} className="text-gray-600" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}