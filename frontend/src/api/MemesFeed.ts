import Axios from 'axios'
import { PureMeme } from '../util/Types'

export async function memesFeedApi(filter: "rating" | "time" | "ratio", plusTags: number[], minusTags: number[], it: number) {
  const urlFeed = new URLSearchParams()
  urlFeed.append('filter', filter)
  urlFeed.append('tags', plusTags.join())
  urlFeed.append('ban', minusTags.join())
  urlFeed.append('it', it.toString())
  return (await Axios.post<PureMeme[]>('api/wall' + '?' + urlFeed)).data
}