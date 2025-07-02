import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

export async function apiGetAllPlans() {
    const response = await sendRequest(`${BASE_API}/plans`)
}