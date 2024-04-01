import axios from "axios"
export const getAllFaculty = async () => {
    const res = await axios.get(`http://localhost:3001/api/faculty/getall`)
    return res.data
}
export const getNameFaculty = async (id) => {
    const res = await axios.get(`http://localhost:3001/api/faculty/getname/${id}`)
    return res.data
}
