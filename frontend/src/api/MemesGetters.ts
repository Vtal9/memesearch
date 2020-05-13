import Axios from 'axios'
import { authHeader } from '../util/Funcs'
import { InvisibleMeme, Tag, PureMeme } from '../util/Types'


export async function unmarkedApi() {
  const result = (await Axios.get<InvisibleMeme[]>('api/unmarkedmemes/')).data
  if (result.length === 0) {
    return null
  } else {
    return result[0]
  }
}

export async function myMemesApi(): Promise<InvisibleMeme[]> {
  return (await Axios.get<InvisibleMeme[]>('api/ownMemes/', {
    headers: authHeader()
  })).data.map(item => {
    return { ...item, type: 'native' }
  })
}

export async function randomApi(filterTags: Tag[]) {
  const usp = new URLSearchParams()
  usp.append('ban', filterTags.map(tag => tag.id).join())
  const result = (await Axios.get<PureMeme>('api/tinder?' + usp)).data
  return result
}

export async function getMeme(id: number) {
  return (await Axios.get<InvisibleMeme>(`api/memes/${id}/`)).data
}

export async function feedApi(filter: "rating" | "time" | "ratio", plusTags: number[], minusTags: number[], it: number) {
  const urlFeed = new URLSearchParams()
  urlFeed.append('filter', filter)
  urlFeed.append('tags', plusTags.join())
  urlFeed.append('ban', minusTags.join())
  urlFeed.append('it', it.toString())
  return (await Axios.post<PureMeme[]>('api/wall' + '?' + urlFeed)).data
}