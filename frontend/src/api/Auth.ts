import { User } from "../util/Types";
import Axios from "axios";


type Response = {
  user: User
  token: string
}

type RegisterResult =
| { ok: true } & Response
| { ok: false, type: 'exists' }

export async function registerApi(username: string, password: string): Promise<RegisterResult> {
  try {
    return {
      ok: true,
      ...(await Axios.post<Response>('accounts/api/auth/register', {
        username,
        password,
        email: ''
      })).data
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.username) {
      return { ok: false, type: 'exists' }
    } else {
      throw error
    }
  }
}

type LoginResult =
| { ok: true } & Response
| { ok: false, type: 'wrong' }

export async function loginApi(username: string, password: string): Promise<LoginResult> {
  try {
    return {
      ok: true,
      ...(await Axios.post<Response>('accounts/api/auth/login', {
        username,
        password
      })).data
    }
  } catch (error) {
    if (error.response && error.response.data) {
      return { ok: false, type: 'wrong' }
    } else {
      throw error
    }
  }
}