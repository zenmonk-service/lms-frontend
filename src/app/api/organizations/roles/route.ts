import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const org_uuid = request.headers.get("org_uuid");
  const response = await axios.get(`${BASE_URL}/roles`, {
    headers: {
      org_uuid: org_uuid,
    },
  });

  return NextResponse.json(response.data);
};