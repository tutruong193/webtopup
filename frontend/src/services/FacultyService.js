import axios from "axios";
export const getAllFaculty = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/faculty/getall`
  );
  return res.data;
};
export const getNameFaculty = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/faculty/getname/${id}`
  );
  return res.data;
};
export const updateFaculty = async (id, name) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/api/faculty/update/${id}`,
    { name }
  );
  return res.data;
};
export const addFaculty = async (name) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/faculty/create`,
    {
      name,
    }
  );
  return res.data;
};
export const deleteFaculty = async (id) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/faculty/delete/${id}`
  );
  return res.data;
};
