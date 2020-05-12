import Axios from 'axios'
import { Repo } from '../util/Types'
import { authHeader } from '../util/Funcs'


type UploadServerResponse = {
  id: number
  url: string
}

export async function uploadApi(destination: Repo, file: File) {
  const formdata = new FormData()
  formdata.append('image', file)
  formdata.append("textDescription", "")
  formdata.append("imageDescription", "")

  const headers = destination === Repo.Own ? {
    'Content-Type': 'multipart/form-data',
    ...authHeader()
  } : {
    'Content-Type': 'multipart/form-data'
  }
  const url = destination === Repo.Own ? 'api/ownMemes/' : 'api/memes/'
  try {
    return (await Axios.post<UploadServerResponse>(url, formdata, {
      headers
    })).data
  } catch (error) {
    if (error.response && error.response.data) {
      return null
    } else {
      throw error
    }
  }
}