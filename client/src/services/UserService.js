import axios from "axios";
const axiosJWT = axios.create();
export const loginUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/user/login`,
    data
  );
  return res.data;
};
export const sendActivationCode = async (id) => {
  console.log(`Sending activation`, id);
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/user/send-activation-code/${id}`
  );
  return res.data;
};
export const verifyActivationCode = async (userId, code) => {
  console.log(userId, code);
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/user/verify-activation-code/${userId}`,
    { code }
  );
  return res.data;
};
export const getDetailsUser = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/api/user/detail/${id}`
  );
  return res.data;
};
export const createUser = async (data) => {
  let { faculty } = data;
  if (faculty === "") {
    faculty = null;
  }
  data.faculty = faculty;
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/user/create`,
    data
  );
  return res.data;
};
export const logoutUser = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/user/logout`
  );
  return res.data;
};
export const getAllUser = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/user/getall`
  );
  return res.data;
};
export const deleteUser = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/api/user/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const updateUser = async (id, access_token, data) => {
  let { faculty, role } = data;
  if (role === "Manager") {
    faculty = null;
  }
  data.faculty = faculty;
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/api/user/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
