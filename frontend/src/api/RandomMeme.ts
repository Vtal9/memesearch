import Axios from 'axios'
import { authHeader } from '../util/Funcs'
import { UnloadedMeme, User, Tag } from '../util/Types'


type Item = {
  id: number
  url: string
  owner: User[]
  likes: number
  dislikes: number
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

export async function randomApi(filterTags: Tag[]) {
  const usp = new URLSearchParams()
  usp.append('ban', filterTags.map(tag => tag.id).join())
  const result = (await Axios.get<Item>('api/tinder?' + usp)).data
  return result
}

export async function getMeme(id: number) {
  return (await Axios.get<Item>(`api/memes/${id}/`)).data
}