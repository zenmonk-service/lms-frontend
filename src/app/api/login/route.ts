import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const BASE_URL = process.env.NEXT_PUBLIC_SSO_URL;
  const data = await request.json();
  try {
    const response = await axios.post(`${BASE_URL}/users/verify`, data);
    return NextResponse.json(response.data);
  } catch (error :any) {
    return NextResponse.json(
      { error: error?.response.data.description || "Internal Server Error" },
      { status: error.status ||500 }
    );
  }
};