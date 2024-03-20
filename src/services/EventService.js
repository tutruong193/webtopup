import axios from "axios"
const axiosJWT = axios.create()
export const createEvent = async (data) => {
    const res = await axios.post(`http://localhost:3001/api/event/create`, data)
    return res.data
}
export const getAllEvent = async () => {
    const res = await axios.get(`http://localhost:3001/api/event/getallevent`)
    return res.data
}
export const deleteEvent = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/event/delete/${id}`, {
        headers: {
            'token': `Bearer ${access_token}`
        }
    }
    )
    return res.data
}
