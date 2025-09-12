import { createSession, getSession } from "@/app/lib/session"
import { API_BASE_URL } from "@/services/api";
import axios from "axios";
import { headers } from "next/headers";

export async function POST(request: Request) {
    const token = getSession('auth_token');
    const response = await axios.post(`${API_BASE_URL}/user`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return Response.json(response.data)
}