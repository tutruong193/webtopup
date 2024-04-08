import axios from "axios"

export const getAllNotification = async () => {
    const res = await axios.get(`http://localhost:3001/api/notification/getall`)
    return res.data
}

export const readAllNotifications = async () => {
    const res = await axios.put(`http://localhost:3001/api/notification/readedall`)
    return res.data
}

export const readOneNotifications = async (id) => {
    const res = await axios.put(`http://localhost:3001/api/notification/readedone/${id}`)
    return res.data
}

