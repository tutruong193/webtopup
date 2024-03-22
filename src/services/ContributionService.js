import axios from "axios"
export const createContribution= async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/contribution/createfile`, data,  {
        'headers': { "Content-Type": "multipart/form-data" },
      })
    console.log(res.data)
}

