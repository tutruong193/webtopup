import axios from "axios"
const axiosJWT = axios.create()
export const loginUser = async (data) => {
    const res = await axios.post(`http://localhost:3001/api/user/login`, data)
    return res.data
}
export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(`http://localhost:3001/api/user/getDetail/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}
export const createUser = async (data) => {
    const res = await axios.post(`http://localhost:3001/api/user/create`, data)
    return res.data
}
export const logoutUser = async () => {
    const res = await axios.post(`http://localhost:3001/api/user/logout`)
    return res.data
}
export const getAllUser = async () => {
    const res = await axios.get(`http://localhost:3001/api/user/getall`)
    return res.data
}