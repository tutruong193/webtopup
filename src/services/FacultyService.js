import axios from "axios"
export const getAllFaculty = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/faculty/getall`)
    return res.data
}
export const getNameFaculty = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/faculty/getname/${id}`)
    return res.data
}
