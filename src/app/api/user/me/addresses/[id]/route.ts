// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { verifyToken } from "@/lib/auth-utils";
// import { TokenPayload } from "@/types/api";

// // GET - Get a specific address by ID for the current user
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const addressId = params.id;

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
//     const decoded = verifyToken(token) as TokenPayload | null;

//     if (!decoded) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Unauthorized: Invalid token",
//         },
//         { status: 401 }
//       );
//     }

//     // Fetch the address
//     const address = await prisma.address.findUnique({
//       where: { id: addressId },
//     });

//     if (!address) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Address not found",
//         },
//         { status: 404 }
//       );
//     }

//     // Check if the address belongs to the current user
//     if (address.userId !== decoded.id) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Forbidden: You don't have permission to access this resource",
//         },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         data: address,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching address:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Failed to fetch address",
//       },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update a specific address by ID for the current user
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const addressId = params.id;

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
//     const decoded = verifyToken(token) as TokenPayload | null;

//     if (!decoded) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Unauthorized: Invalid token",
//         },
//         { status: 401 }
//       );
//     }

//     // Fetch the address to check ownership
//     const existingAddress = await prisma.address.findUnique({
//       where: { id: addressId },
//     });

//     if (!existingAddress) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Address not found",
//         },
//         { status: 404 }
//       );
//     }

//     // Check if the address belongs to the current user
//     if (existingAddress.userId !== decoded.id) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Forbidden: You don't have permission to update this address",
//         },
//         { status: 403 }
//       );
//     }

//     // Parse request body
//     const body = await request.json();

//     // Fields that are allowed to be updated
//     const { country, cityState, postalCode } = body;

//     // Validate required fields
//     const updateData: {
//       country?: string;
//       cityState?: string;
//       postalCode?: string;
//     } = {};

//     if (country !== undefined) updateData.country = country;
//     if (cityState !== undefined) updateData.cityState = cityState;
//     if (postalCode !== undefined) updateData.postalCode = postalCode;

//     if (Object.keys(updateData).length === 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "No valid fields to update",
//         },
//         { status: 400 }
//       );
//     }

//     // Update the address
//     const updatedAddress = await prisma.address.update({
//       where: { id: addressId },
//       data: updateData,
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         data: updatedAddress,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating address:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Failed to update address",
//       },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete a specific address by ID for the current user
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const addressId = params.id;

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
//     const decoded = verifyToken(token) as TokenPayload | null;

//     if (!decoded) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Unauthorized: Invalid token",
//         },
//         { status: 401 }
//       );
//     }

//     // Fetch the address to check ownership
//     const existingAddress = await prisma.address.findUnique({
//       where: { id: addressId },
//     });

//     if (!existingAddress) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Address not found",
//         },
//         { status: 404 }
//       );
//     }

//     // Check if the address belongs to the current user
//     if (existingAddress.userId !== decoded.id) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Forbidden: You don't have permission to delete this address",
//         },
//         { status: 403 }
//       );
//     }

//     // Delete the address
//     await prisma.address.delete({
//       where: { id: addressId },
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Address deleted successfully",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting address:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Failed to delete address",
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth-utils";
import { TokenPayload } from "@/types/api";

// GET - Get a specific address by ID for the current user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to get the actual values
    const { id: addressId } = await params;

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
    const decoded = verifyToken(token) as TokenPayload | null;

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid token",
        },
        { status: 401 }
      );
    }

    // Fetch the address
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: "Address not found",
        },
        { status: 404 }
      );
    }

    // Check if the address belongs to the current user
    if (address.userId !== decoded.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You don't have permission to access this resource",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: address,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch address",
      },
      { status: 500 }
    );
  }
}

// PUT - Update a specific address by ID for the current user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to get the actual values
    const { id: addressId } = await params;

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
    const decoded = verifyToken(token) as TokenPayload | null;

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid token",
        },
        { status: 401 }
      );
    }

    // Fetch the address to check ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "Address not found",
        },
        { status: 404 }
      );
    }

    // Check if the address belongs to the current user
    if (existingAddress.userId !== decoded.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You don't have permission to update this address",
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Fields that are allowed to be updated
    const { country, cityState, postalCode } = body;

    // Validate required fields
    const updateData: {
      country?: string;
      cityState?: string;
      postalCode?: string;
    } = {};

    if (country !== undefined) updateData.country = country;
    if (cityState !== undefined) updateData.cityState = cityState;
    if (postalCode !== undefined) updateData.postalCode = postalCode;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid fields to update",
        },
        { status: 400 }
      );
    }

    // Update the address
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedAddress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update address",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific address by ID for the current user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to get the actual values
    const { id: addressId } = await params;

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
    const decoded = verifyToken(token) as TokenPayload | null;

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid token",
        },
        { status: 401 }
      );
    }

    // Fetch the address to check ownership
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "Address not found",
        },
        { status: 404 }
      );
    }

    // Check if the address belongs to the current user
    if (existingAddress.userId !== decoded.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You don't have permission to delete this address",
        },
        { status: 403 }
      );
    }

    // Delete the address
    await prisma.address.delete({
      where: { id: addressId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Address deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete address",
      },
      { status: 500 }
    );
  }
}