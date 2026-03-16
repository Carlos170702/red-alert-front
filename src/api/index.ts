import axios from 'axios'
import { config } from '@/config'

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

api.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('ra_token')
    if (token) {
      req.headers = req.headers ?? {}
      req.headers.Authorization = `Bearer ${token}`
    }
    if (req.data instanceof FormData) {
      delete req.headers['Content-Type']
    }
    return req
  },
  (err) => Promise.reject(err)
)

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err)
  }
)
