// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { verifyToken } from "@/lib/auth-utils";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const storeId = params.id;

//     // Extract the authorization header
//     const authHeader = request.headers.get("authorization");

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Unauthorized: No token provided",
//         },
//         { status: 401 }
//       );
//     }

//     // Extract and verify the token
//     const token = authHeader.split(" ")[1];
//     const decoded = verifyToken(token) as { id: string; role?: string } | null;

//     if (!decoded) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Unauthorized: Invalid token",
//         },
//         { status: 401 }
//       );
//     }

//     // Fetch store information to check permissions
//     const store = await prisma.store.findUnique({
//       where: { id: storeId },
//     });

//     if (!store) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Store not found",
//         },
//         { status: 404 }
//       );
//     }

//     // Check if user is admin or owns this store
//     if (decoded.role !== "ADMIN" && store.userId !== decoded.id) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Forbidden: You don't have permission to access this resource",
//         },
//         { status: 403 }
//       );
//     }

//     // Fetch store addresses
//     const addresses = await prisma.address.findMany({
//       where: { storeId },
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         data: addresses,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching store addresses:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Failed to fetch store addresses",
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to get the actual values
    const { id: storeId } = await params;
    
    // Extract the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: No token provided",
        },
        { status: 401 }
      );
    }
    // Extract and verify the token
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as { id: string; role?: string } | null;
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid token",
        },
        { status: 401 }
      );
    }
    // Fetch store information to check permissions
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store) {
      return NextResponse.json(
        {
          success: false,
          error: "Store not found",
        },
        { status: 404 }
      );
    }
    // Check if user is admin or owns this store
    if (decoded.role !== "ADMIN" && store.userId !== decoded.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You don't have permission to access this resource",
        },
        { status: 403 }
      );
    }
    // Fetch store addresses
    const addresses = await prisma.address.findMany({
      where: { storeId },
    });
    return NextResponse.json(
      {
        success: true,
        data: addresses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching store addresses:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch store addresses",
      },
      { status: 500 }
    );
  }
}