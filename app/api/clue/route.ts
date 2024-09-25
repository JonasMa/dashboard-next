import { NextResponse } from "next/server";
import axios from "axios";

const CACHE_DURATION = 30 * 60; // 30 minutes in seconds

interface AccessResponse {
  access_token: string;
  analytics_id: string;
  user: {
    id: string;
    analytics_id: string;
    email: string;
  };
  consents: [];
}

let accessToken: string;
let userId: string;
export async function GET() {
  try {
    if (!accessToken) {
      const accessResponse = await axios.post<AccessResponse>(
        `https://api.helloclue.com/access-tokens`,
        {
          email: process.env.CLUE_EMAIL,
          password: process.env.CLUE_PW,
        },
        {
          headers: {
            Accept: "application/json", // Set the Accept header to application/json
            "Content-Type": "application/json",
          },
        }
      );
      accessToken = accessResponse.data.access_token;
      userId = accessResponse.data.user.id;
    }
    const profileResponse = await axios.get(
      `https://api.helloclue.com/profiles/${userId}`,
      { headers: { Authorization: accessToken } }
    );
    console.log(profileResponse.data);
    const response = NextResponse.json(profileResponse.data);
    response.headers.set(
      "Cache-Control",
      `s-maxage=${CACHE_DURATION}, stale-while-revalidate`
    );
    return response;
  } catch (error: unknown) {
    console.error("Failed to fetch clue data:", (error as Error).message);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
      } else if (error.response?.status === 404) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }
    return NextResponse.json(
      { error: "Failed to fetch clue data", details: (error as Error).message },
      { status: 500 }
    );
  }
}
