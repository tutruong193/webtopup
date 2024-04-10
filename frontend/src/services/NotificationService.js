import axios from "axios";

export const getAllNotification = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/notification/getall`
  );
  return res.data;
};

export const readAllNotifications = async () => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/api/notification/readedall`
  );
  return res.data;
};

export const readOneNotifications = async (id) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/api/notification/readedone/${id}`
  );
  return res.data;
};
