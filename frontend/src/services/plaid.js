import axios from "axios"
const baseUrl = "/api/plaid"

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const createLinkToken = async () => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(`${baseUrl}/create_link_token`, {}, config)
  return response.data
}

const setAccessToken = async (publicToken) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(
    `${baseUrl}/set_access_token`,
    { public_token: publicToken },
    config
  )
  return response.data
}

const getBalance = async () => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.get(`${baseUrl}/balance`, config)
  return response.data
}

export default { setToken, createLinkToken, setAccessToken, getBalance }
