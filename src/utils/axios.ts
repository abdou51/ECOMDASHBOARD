import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Your API base URL
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(
        new CustomEvent('unauthorized', { detail: error.response })
      )
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
