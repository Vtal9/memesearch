import Axios from "axios";
import { authHeader } from "../util/Funcs";


export async function addOrRemove(action: 'add' | 'remove', id: number) {
  await Axios.post(
    `api/configureOwnMemes?method=${action}&id=${id}`, {}, 
    {
      headers: authHeader()
    }
  )
}