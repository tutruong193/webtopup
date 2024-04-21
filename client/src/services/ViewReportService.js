import axios from "axios";
export const updateReport = async (facultyId, eventId, selected) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/viewreport/update`,
    { facultyId, eventId, selected }
  );
  return res.data;
};

export const getSelectedKeys = async (facultyId, eventId) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/viewreport/getselected?facultyId=${facultyId}&eventId=${eventId}`
  );
  return res.data;
};
