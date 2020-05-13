import Axios from "axios"
import { Tag } from "../util/Types"


export async function getTags() {
  const response = await Axios.get<Tag[]>(`tags/api/all/`)
  return response.data
}