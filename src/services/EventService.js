import axios from "axios"
const axiosJWT = axios.create()
export const createEvent = async (data) => {
    const res = await axios.post(`http://localhost:3001/api/event/create`, data)
}
