import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    // Create the response
    const nextResponse = NextResponse.json(data);

    // Clear the cookie
    nextResponse.cookies.delete("auth_token");

    return nextResponse;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Logout failed" },
      { status: 500 }
    );
  }
}
