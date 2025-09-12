import { createSession } from "@/app/lib/session"
import { API_BASE_URL } from "@/services/api";
import axios from "axios";

export async function POST(request: Request) {
    const { email, password } = await request.json()
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    
    if(response.status === 200)
    {
        await createSession('auth_token', response.data.access_token);
    }

    return Response.json(response.data)
}