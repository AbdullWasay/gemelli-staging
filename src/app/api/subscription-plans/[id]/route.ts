// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;

//     // Fetch subscription plan by ID
//     const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
//       where: {
//         id,
//       },
//     });

//     // Check if subscription plan exists
//     if (!subscriptionPlan) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Subscription plan not found",
//         },
//         { status: 404 }
//       );
//     }

//     // Return the subscription plan in a structured response
//     return NextResponse.json({
//       success: true,
//       message: "Subscription plan fetched successfully",
//       data: subscriptionPlan,
//     });
//   } catch (error: any) {
//     console.error("Error fetching subscription plan:", error);

//     // Return error response
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch subscription plan",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to get the actual values
    const { id } = await params;
    
    // Fetch subscription plan by ID
    const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
      where: {
        id,
      },
    });
    
    // Check if subscription plan exists
    if (!subscriptionPlan) {
      return NextResponse.json(
        {
          success: false,
          message: "Subscription plan not found",
        },
        { status: 404 }
      );
    }
    
    // Return the subscription plan in a structured response
    return NextResponse.json({
      success: true,
      message: "Subscription plan fetched successfully",
      data: subscriptionPlan,
    });
  } catch (error: any) {
    console.error("Error fetching subscription plan:", error);
    
    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch subscription plan",
        error: error.message,
      },
      { status: 500 }
    );
  }
}