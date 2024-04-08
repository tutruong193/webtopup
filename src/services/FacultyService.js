import axios from "axios"
export const getAllFaculty = async () => {
    const res = await axios.get(`http://localhost:3001/api/faculty/getall`)
    return res.data
}
export const getNameFaculty = async (id) => {
    const res = await axios.get(`http://localhost:3001/api/faculty/getname/${id}`)
    return res.data
}
export const updateFaculty = async (id, name) => {
    const res = await axios.put(`http://localhost:3001/api/faculty/update/${id}`, {name})
    return res.data
}
export const addFaculty = async (name) => {
    const res = await axios.post(`http://localhost:3001/api/faculty/create`, {name})
    return res.data
}
export const deleteFaculty = async (id) => {
    const res = await axios.delete(`http://localhost:3001/api/faculty/delete/${id}`)
    return res.data
}
