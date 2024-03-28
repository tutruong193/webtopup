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
  const res = await axios.delete(`${process.env.REACT_APP_API_URL}/contribution/delete/${id}`)
  return (res.data)
}
export const getContributionsByEventAndFaculty = async (eventId, facultyId) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/contribution/list/eid=${eventId}&fid=${facultyId}`)
  return (res.data)
}
export const updateContribution = async (id, data) => {
  console.log(id, data)
  const res = await axios.put(`${process.env.REACT_APP_API_URL}/contribution/update/${id}`, data)
  return (res.data)
}

