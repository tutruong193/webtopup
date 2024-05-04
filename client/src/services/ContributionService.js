import axios from "axios";
export const createContribution = async (access_token, data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/contribution/create`,
      data,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating contribution:", error);
    throw error;
  }
};
export const deleteContribution = async (id, access_token) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/contribution/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const updateContribution = async (id, data) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/api/contribution/update/${id}`,
    data
  );
  return res.data;
};

export const getDetailContribution = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/contribution/detail/${id}`
  );
  return res.data;
};
export const getSubmitedContribution = async (studentId, access_token) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/contribution/contributionsubmited/${studentId}`
  );
  return res.data;
};
export const getAllContributions = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/contribution/getall`
  );
  return res.data;
};
export const updateCommentContributions = async (id, comment) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/api/contribution/updatecomment/${id}`,
    { comment }
  );
  return res.data;
};
