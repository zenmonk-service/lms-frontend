import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const data = await request.json();

  try {
    const response = await axios.post(`${BASE_URL}/users`, data, {
        headers: {
            org_uuid: data.org_uuid
        }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
