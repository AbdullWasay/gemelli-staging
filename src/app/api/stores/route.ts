import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 5;
    const productsPerStore = searchParams.get('productsPerStore') ? parseInt(searchParams.get('productsPerStore') as string) : 4;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
    const skip = (page - 1) * limit;
    
    // Fetch only stores that have products with images, in a single query
    const storesWithData = await prisma.store.findMany({
      where: {
        // Only include stores where the user has products with images
        user: {
          products: {
            some: {
              productImages: {
                some: {} // At least one product with at least one image
              }
            }
          }
        }
        
      },
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        // Include the seller (user) with each store
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePic: true,
            role: true,
            createdAt: true,
            // Include products with the user, limited by count and with images
            products: {
              where: {
                productImages: {
                  some: {} // Only products with images
                }
              },
              take: productsPerStore,
              orderBy: {
                createdAt: 'desc' // Most recent first
              },
              include: {
                productImages: true // Include product images
              }
            }
          }
        }
      }
    });

    // Count total stores with products
    const totalCount = await prisma.store.count({
      where: {
        user: {
          products: {
            some: {
              productImages: {
                some: {} // At least one product with at least one image
              }
            }
          }
        }
      }
    });

    // Format the response
    const storesWithProducts = storesWithData.map(store => {
      return {
        store: {
          id: store.id,
          storeName: store.storeName,
          storeCategory: store.storeCategory,
          storeWebsite: store.storeWebsite,
          createdAt: store.createdAt,
          updatedAt: store.updatedAt
        },
        seller: {
          id: store.user.id,
          name: store.user.name,
          email: store.user.email,
          profilePic: store.user.profilePic,
          role: store.user.role,
          createdAt: store.user.createdAt
        },
        featuredProducts: store.user.products
      };
    });

    // Filter out stores with no products
    const filteredStores = storesWithProducts.filter(store => 
      store.featuredProducts && store.featuredProducts.length > 0
    );

    return NextResponse.json({
      success: true,
      data: {
        stores: filteredStores,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching stores with products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch stores with products",
      },
      { status: 500 }
    );
  }
}
