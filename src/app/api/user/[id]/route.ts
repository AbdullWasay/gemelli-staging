// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { verifyToken } from "@/lib/auth-utils";
// import { TokenPayload, UserResponse } from "@/types/api";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Get the user ID from the route params
//     const userId = params.id;

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

//     // Check if the user is admin or the same user
//     if (decoded.role !== "ADMIN" && decoded.id !== userId) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Forbidden: You don't have permission to access this resource",
//         },
//         { status: 403 }
//       );
//     }

//     // Fetch user information from database
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         store: true, // Include store if user has one
//         addresses: true, // Include addresses if user has any
//       },
//     });

//     if (!user) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "User not found",
//         },
//         { status: 404 }
//       );
//     }

//     // Remove sensitive information
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password, ...userWithoutPassword } = user;

//     // Prepare response data
//     const responseData: UserResponse = userWithoutPassword;

//     return NextResponse.json(
//       {
//         success: true,
//         data: responseData,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Failed to fetch user information",
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth-utils";
import { TokenPayload, UserResponse } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to get the actual values
    const { id: userId } = await params;
    
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
    
    // Check if the user is admin or the same user
    if (decoded.role !== "ADMIN" && decoded.id !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You don't have permission to access this resource",
        },
        { status: 403 }
      );
    }
    
    // Fetch user information from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        store: true, // Include store if user has one
        addresses: true, // Include addresses if user has any
      },
    });
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }
    
    // Remove sensitive information
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    
    // Prepare response data
    const responseData: UserResponse = userWithoutPassword;
    
    return NextResponse.json(
      {
        success: true,
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user information",
      },
      { status: 500 }
    );
  }
}