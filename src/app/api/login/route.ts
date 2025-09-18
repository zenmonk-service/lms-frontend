import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const BASE_URL = process.env.NEXT_PUBLIC_SSO_URL;
  const data = await request.json();


  try {
    const response = await axios.post(`${BASE_URL}/login`, data);
    console.log('response: ', response);

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};