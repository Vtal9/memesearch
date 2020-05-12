import Axios from 'axios'
import { authHeader } from './Funcs'


const TOKEN_KEY = 'memesearch_token'

export default {
  get() {
    return localStorage.getItem(TOKEN_KEY)
  },

  async check() {
    const response = await Axios.get('accounts/api/auth/user', {
      headers: authHeader()
    })
    return {
      id: response.data.id,
      username: response.data.username
    }
  },

  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },

  unset() {
    localStorage.removeItem(TOKEN_KEY)
  }
}