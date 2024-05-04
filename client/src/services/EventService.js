import axios from "axios";
const axiosJWT = axios.create();
export const createEvent = async (access_token, data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/api/event/create`,
    data, {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const deleteEvent = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/api/event/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const updateEvent = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/api/event/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const getAllEvent = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/event/getallevent`
  );
  return res.data;
};

export const getAllEventValid = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/event/getvalidevent`
  );
  return res.data;
};
export const getDetailsEvent = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/event/detail/${id}`
  );
  return res.data;
};
