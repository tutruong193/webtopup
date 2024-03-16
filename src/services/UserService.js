import axios from "axios"
const axiosJWT = axios.create()
export const loginUser = async (data) => {
    const res = await axios.post(`http://localhost:3001/api/user/login`, data)
    console.log('res.data', res.data)
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
export const logoutUser = async () => {
    const res = await axios.post(`http://localhost:3001/api/user/logout`)
    return res.data
}