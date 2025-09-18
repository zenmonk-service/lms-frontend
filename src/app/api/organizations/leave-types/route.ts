import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await axios.post(`${BASE_URL}/leave-types`, request);

  return NextResponse.json(response.data);
};