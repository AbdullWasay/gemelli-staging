// // src/app/api/cart/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import { verifyToken } from "@/lib/auth-utils";

// const prisma = new PrismaClient();

// // Helper function to get user from token
// async function getUserFromToken(request: NextRequest) {
//   const authHeader = request.headers.get("authorization");
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return null;
//   }

//   const token = authHeader.substring(7);
//   const decoded = verifyToken(token) as { id: string; email: string } | null;

//   if (!decoded || !decoded.id) {
//     return null;
//   }

//   return decoded;
// }

// /**
//  * GET /api/cart - Get user's cart
//  */
// export async function GET(request: NextRequest) {
//   try {
//     const user = await getUserFromToken(request);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Get or create cart for user
//     let cart = await prisma.cart.findUnique({
//       where: { userId: user.id },
//       include: {
//         items: {
//           include: {
//             product: {
//               include: {
//                 productImages: {
//                   where: { isPrimary: true },
//                 },
//                 seller: {
//                   select: {
//                     id: true,
//                     name: true,
//                     email: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     // Create cart if it doesn't exist
//     if (!cart) {
//       cart = await prisma.cart.create({
//         data: {
//           userId: user.id,
//         },
//         include: {
//           items: {
//             include: {
//               product: {
//                 include: {
//                   productImages: {
//                     where: { isPrimary: true },
//                   },
//                   seller: {
//                     select: {
//                       id: true,
//                       name: true,
//                       email: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       data: { cart },
//     });
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch cart" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * POST /api/cart - Add item to cart
//  * Body: { productId: string, quantity: number, size?: string }
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const user = await getUserFromToken(request);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();
//     const { productId, quantity = 1, size } = body;

//     if (!productId) {
//       return NextResponse.json(
//         { success: false, error: "Product ID is required" },
//         { status: 400 }
//       );
//     }

//     // Verify product exists and has sufficient inventory
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });

//     if (!product) {
//       return NextResponse.json(
//         { success: false, error: "Product not found" },
//         { status: 404 }
//       );
//     }

//     if (product.inventory < quantity) {
//       return NextResponse.json(
//         { success: false, error: "Insufficient inventory" },
//         { status: 400 }
//       );
//     }

//     // Get or create cart
//     let cart = await prisma.cart.findUnique({
//       where: { userId: user.id },
//     });

//     if (!cart) {
//       cart = await prisma.cart.create({
//         data: { userId: user.id },
//       });
//     }

//     // Check if item already exists in cart
//     const existingItem = await prisma.cartItem.findUnique({
//       where: {
//         cartId_productId_size: {
//           cartId: cart.id,
//           productId: productId,
//           size: size || "",
//         },
//       },
//     });

//     let cartItem;
//     if (existingItem) {
//       // Update quantity
//       const newQuantity = existingItem.quantity + quantity;

//       if (product.inventory < newQuantity) {
//         return NextResponse.json(
//           { success: false, error: "Insufficient inventory for requested quantity" },
//           { status: 400 }
//         );
//       }

//       cartItem = await prisma.cartItem.update({
//         where: { id: existingItem.id },
//         data: { quantity: newQuantity },
//         include: {
//           product: {
//             include: {
//               productImages: {
//                 where: { isPrimary: true },
//               },
//             },
//           },
//         },
//       });
//     } else {
//       // Create new cart item
//       cartItem = await prisma.cartItem.create({
//         data: {
//           cartId: cart.id,
//           productId,
//           quantity,
//           size: size || null,
//         },
//         include: {
//           product: {
//             include: {
//               productImages: {
//                 where: { isPrimary: true },
//               },
//             },
//           },
//         },
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       data: { cartItem, message: "Item added to cart" },
//     });
//   } catch (error) {
//     console.error("Error adding to cart:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to add item to cart" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * PUT /api/cart - Update cart item quantity
//  * Body: { cartItemId: string, quantity: number }
//  */
// export async function PUT(request: NextRequest) {
//   try {
//     const user = await getUserFromToken(request);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();
//     const { cartItemId, quantity } = body;

//     if (!cartItemId || quantity === undefined) {
//       return NextResponse.json(
//         { success: false, error: "Cart item ID and quantity are required" },
//         { status: 400 }
//       );
//     }

//     if (quantity < 1) {
//       return NextResponse.json(
//         { success: false, error: "Quantity must be at least 1" },
//         { status: 400 }
//       );
//     }

//     // Get cart item with product info
//     const cartItem = await prisma.cartItem.findUnique({
//       where: { id: cartItemId },
//       include: {
//         cart: true,
//         product: true,
//       },
//     });

//     if (!cartItem) {
//       return NextResponse.json(
//         { success: false, error: "Cart item not found" },
//         { status: 404 }
//       );
//     }

//     // Verify cart belongs to user
//     if (cartItem.cart.userId !== user.id) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 403 }
//       );
//     }

//     // Check inventory
//     if (cartItem.product.inventory < quantity) {
//       return NextResponse.json(
//         { success: false, error: "Insufficient inventory" },
//         { status: 400 }
//       );
//     }

//     // Update quantity
//     const updatedItem = await prisma.cartItem.update({
//       where: { id: cartItemId },
//       data: { quantity },
//       include: {
//         product: {
//           include: {
//             productImages: {
//               where: { isPrimary: true },
//             },
//           },
//         },
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       data: { cartItem: updatedItem, message: "Cart updated" },
//     });
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to update cart" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * DELETE /api/cart?cartItemId=xxx - Remove item from cart
//  */
// export async function DELETE(request: NextRequest) {
//   try {
//     const user = await getUserFromToken(request);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { searchParams } = new URL(request.url);
//     const cartItemId = searchParams.get("cartItemId");

//     if (!cartItemId) {
//       return NextResponse.json(
//         { success: false, error: "Cart item ID is required" },
//         { status: 400 }
//       );
//     }

//     // Verify cart item belongs to user
//     const cartItem = await prisma.cartItem.findUnique({
//       where: { id: cartItemId },
//       include: {
//         cart: true,
//       },
//     });

//     if (!cartItem) {
//       return NextResponse.json(
//         { success: false, error: "Cart item not found" },
//         { status: 404 }
//       );
//     }

//     if (cartItem.cart.userId !== user.id) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 403 }
//       );
//     }

//     // Delete cart item
//     await prisma.cartItem.delete({
//       where: { id: cartItemId },
//     });

//     return NextResponse.json({
//       success: true,
//       data: { message: "Item removed from cart" },
//     });
//   } catch (error) {
//     console.error("Error removing from cart:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to remove item from cart" },
//       { status: 500 }
//     );
//   }
// }
// src/app/api/cart/route.ts
// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);

    // Decode token - support both 'id' and 'userId'
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id?: string;
      userId?: string;
      email: string;
    };

    // Support both 'id' and 'userId' for compatibility
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return null;
    }

    return {
      userId,
      email: decoded.email,
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// GET - Fetch user's cart
export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId: decoded.userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                productImages: true,
                seller: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: decoded.userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  productImages: true,
                  seller: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: { cart },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    console.log("📥 Cart POST request received");

    const decoded = verifyToken(request);
    if (!decoded) {
      console.log("❌ Unauthorized - no valid token");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("✅ User authenticated:", decoded.userId);

    const body = await request.json();
    const { productId, quantity, size, color } = body;

    console.log("📦 Cart item data:", { productId, quantity, size, color });

    // Validate input
    if (!productId || !quantity) {
      console.log("❌ Missing required fields");
      return NextResponse.json(
        { success: false, error: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    // Check if product exists and has enough inventory
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        productImages: true,
        seller: true,
      },
    });

    if (!product) {
      console.log("❌ Product not found:", productId);
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    console.log("✅ Product found:", product.name);

    // Get or create cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId: decoded.userId },
    });

    if (!cart) {
      console.log("📦 Creating new cart for user");
      cart = await prisma.cart.create({
        data: { userId: decoded.userId },
      });
    }

    console.log("✅ Cart ID:", cart.id);

    // Normalize size and color: "Default" is treated as empty for consistency
    const normalizedSize = (!size || size === "Default") ? "" : String(size);
    const normalizedColor = color || "";

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_size_color: {
          cartId: cart.id,
          productId,
          size: normalizedSize,
          color: normalizedColor,
        },
      },
    });

    // Validate inventory: existing quantity + new quantity must not exceed stock
    const totalQuantity = (existingItem?.quantity || 0) + quantity;
    if (product.inventory < totalQuantity) {
      return NextResponse.json(
        { success: false, error: `Insufficient inventory. Only ${product.inventory} available.` },
        { status: 400 }
      );
    }

    let cartItem;
    if (existingItem) {
      console.log("🔄 Updating existing cart item");
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              productImages: true,
              seller: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    } else {
      console.log("➕ Creating new cart item");
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          size: normalizedSize,
          color: normalizedColor,
        },
        include: {
          product: {
            include: {
              productImages: true,
              seller: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    }

    console.log("✅ Cart item saved:", cartItem.id);

    return NextResponse.json({
      success: true,
      data: {
        cartItem,
        message: existingItem ? "Cart updated" : "Item added to cart",
      },
    });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || !quantity) {
      return NextResponse.json(
        { success: false, error: "Cart item ID and quantity are required" },
        { status: 400 }
      );
    }

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (cartItem.cart.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check inventory
    if (cartItem.product.inventory < quantity) {
      return NextResponse.json(
        { success: false, error: "Insufficient inventory" },
        { status: 400 }
      );
    }

    // Update quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: {
          include: {
            productImages: true,
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { cartItem: updatedCartItem },
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// DELETE - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get("cartItemId");

    if (!cartItemId) {
      return NextResponse.json(
        { success: false, error: "Cart item ID is required" },
        { status: 400 }
      );
    }

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { success: false, error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (cartItem.cart.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return NextResponse.json({
      success: true,
      data: { message: "Item removed from cart" },
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}
