import axios from "axios"
export const createContribution = async (data) => {
  const formData = data.formData;
  console.log('data', formData);
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/contribution/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return (res.data)
}
export const getDetailContribution = async (eventId, access_token) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/contribution/detail/${eventId}`)
  return (res.data)
}
export const getSubmitedContribution = async (studentId, access_token) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/contribution/contributionsubmited/${studentId}`)
  return (res.data)
}
export const deleteContribution = async (id, access_token) => {
  console.log(`deleting ${id}`)
  const res = await axios.delete(`${process.env.REACT_APP_API_URL}/contribution/delete/${id}`)
  return (res.data)
}

