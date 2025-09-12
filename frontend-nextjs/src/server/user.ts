import { getSession } from "@/app/lib/session";
import { API_BASE_URL } from "@/services/api";
import ApiInstance from ".";

const getLoggedUser = async () => {
    const token = await getSession('auth_token');

    const response = await ApiInstance.get(`${API_BASE_URL}/user`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).catch((error) => {
        console.error("Error fetching user:", error);
        return {
            data: error.response ? error.response.data : { message: "An unexpected error occurred" }
        }
    });

    return response.data?.user || null;
}

export {
    getLoggedUser
}