import Axios from 'axios';
import Token from './Token'
import { PureMeme, InvisibleMeme, FullMeme } from './Types';


export async function loadImage(pureMeme: PureMeme) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => {
      Axios.get<InvisibleMeme[]>(`api/new_meme_url/?id=${pureMeme.id}`).then(function(response) {
        const secondTry = new Image()
        secondTry.onload = () => resolve(secondTry)
        secondTry.onerror = reject
        secondTry.src = response.data[0].url
      }).catch(reject)
    }
    img.src = pureMeme.url
  })
}

export async function makeVisible(invisibleMeme: InvisibleMeme): Promise<FullMeme> {
  return {
    ...invisibleMeme,
    img: await loadImage(invisibleMeme)
  }
}

export async function pureToFull(pureMeme: PureMeme) {
  const invisible = (await Axios.get<InvisibleMeme>(`api/memes/${pureMeme.id}/`)).data
  return await makeVisible(invisible)
}

export async function getById(id: number) {
  return pureToFull({ id, url: '%INCORRECT%' })
}

export function authHeader() {
  return {
    Authorization: `Token ${Token.get()}`
  }
}