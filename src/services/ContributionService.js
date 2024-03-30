import axios from "axios"
export const createContribution = async (data) => {
  try {
    console.log('data', data)
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/contribution/create`, data);
    return res.data;
  } catch (error) {
    console.error('Error creating contribution:', error);
    throw error;
  }
};
export const getDetailContribution = async (id) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/contribution/detail/${id}`)
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
  const res = await axios.put(`${process.env.REACT_APP_API_URL}/contribution/update/${id}`, data)
  return (res.data)
}
export const getAllContributions = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/contribution/getall`)
  return (res.data)
}
export const getDetailContributionByEvent = async (eventid, access_token) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/contribution/detailbyevent/${eventid}`)
  return (res.data)
}
