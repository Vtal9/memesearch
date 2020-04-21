import Axios from 'axios'
import { authHeader } from '../util/Funcs'
import { UnloadedMeme } from '../util/Types'


type Item = {
  id: number
  url: string
}

export async function unmarkedApi() {
  const result = (await Axios.get<Item[]>('api/unmarkedmemes/')).data
  if (result.length === 0) {
    return null
  } else {
    return result[0]
  }
}

export async function myMemesApi(): Promise<UnloadedMeme[]> {
  return (await Axios.get<Item[]>('api/ownMemes/', {
    headers: authHeader()
  })).data.map(item => {
    return { ...item, type: 'native' }
  })
}

export async function randomApi() {
  const result = (await Axios.get<Item[]>('api/unmarkedmemes/')).data
  if (result.length === 0) {
    return null
  } else {
    return result[0]
  }
}