import axios from "axios"
const baseUrl = "/api/budget"

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

//Get budget associated with user

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  // const config = {
  //   headers: { Authorization: token },
  // }

  const request = await axios.post(baseUrl, newObject)
  return request.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then((response) => response.data)
}

export default { getAll, create, update, setToken }
