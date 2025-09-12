import { getSession } from "@/app/lib/session"

export async function GET(request: Request) {
    const token = await getSession('auth_token');
    return Response.json(token)
}