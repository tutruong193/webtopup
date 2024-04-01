import axios from "axios"
export const createContribution = async (data) => {
  try {
    const res = await axios.post(`http://localhost:3001/api/contribution/create`, data);
    return res.data;
  } catch (error) {
    console.error('Error creating contribution:', error);
    throw error;
  }
};
export const deleteContribution = async (id, access_token) => {
  const res = await axios.delete(`http://localhost:3001/api/contribution/delete/${id}`)
  return (res.data)
}
export const updateContribution = async (id, data) => {
  const res = await axios.put(`http://localhost:3001/api/contribution/update/${id}`, data)
  return (res.data)
}

export const getDetailContribution = async (id) => {
  const res = await axios.get(`http://localhost:3001/api/contribution/detail/${id}`)
  return (res.data)
}
export const getSubmitedContribution = async (studentId, access_token) => {
  const res = await axios.get(`http://localhost:3001/api/contribution/contributionsubmited/${studentId}`)
  return (res.data)
}
export const getAllContributions = async () => {
  const res = await axios.get(`http://localhost:3001/api/contribution/getall`)
  return (res.data)
}

