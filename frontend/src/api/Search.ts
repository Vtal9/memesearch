import { SearchRequest, Repo } from "../util/Types"
import Axios from "axios"
import { authHeader } from "../util/Funcs"


type Response = { id?: string, url: string }[]

export async function searchApi(request: SearchRequest, repo: Repo) {
  const qText = request.extended ? request.qText : request.q
  const qImage = request.extended ? request.qImage : request.q
  const usp = new URLSearchParams()
  usp.append('qText', qText)
  usp.append('qImage', qImage)
  if (request.extended) {
    usp.append('tags', request.tags.map(tag => tag.id).join(','))
  }
  const headers = repo === Repo.Own ? authHeader() : {}
  const api = repo === Repo.Own ? 'search/api/search/own' : 'search/api/search'

  // costyl for single-tag search
  // costyl begins
  if (request.extended && qText.trim() === '' && qImage.trim() === ''
  && repo === Repo.Public && request.tags.length === 1) {
    const tag = request.tags[0]
    return (await Axios.get<Response>(`tags/api/tagged?id=${tag.id}`)).data
  }
  // costyl ends

  return (await Axios.get<Response>(api + '/?' + usp, { headers })).data
}