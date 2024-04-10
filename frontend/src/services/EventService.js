import axios from "axios"
const axiosJWT = axios.create()
export const createEvent = async (data) => {
    const res = await axios.post(`http://localhost:3001/api/event/create`, data)
    return res.data
}
export const deleteEvent = async (id, access_token) => {
    const res = await axiosJWT.delete(`http://localhost:3001/api/event/delete/${id}`, {
        headers: {
            'token': `Bearer ${access_token}`
        }
    }
    )
    return res.data
}
export const updateEvent = async (id, access_token, data) => {
    const res = await axiosJWT.put(`http://localhost:3001/api/event/update/${id}`, data, {
        headers: {
            'token': `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const getAllEvent = async () => {
    const res = await axios.get(`http://localhost:3001/api/event/getallevent`)
    return res.data
}

export const getAllEventValid = async () => {
    const res = await axios.get(`http://localhost:3001/api/event/getvalidevent`)
    return res.data
}
export const getDetailsEvent = async (id) => {
    const res = await axios.get(`http://localhost:3001/api/event/detail/${id}`)
    return res.data
}
