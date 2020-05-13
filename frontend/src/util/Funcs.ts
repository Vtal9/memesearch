import Axios from 'axios';
import Token from './Token'
import { InvisibleMeme, FullMeme, ForeignMeme, VisibleForeign } from './Types';

const YADISK_READ_TOKEN = 'AgAAAAA-tVsqAAZWU44pcDIOME6OsdH_mgZ99HM'

export async function loadImage(meme: InvisibleMeme) {
  const response = await Axios.get(
    `https://cloud-api.yandex.net:443/v1/disk/resources?path=${encodeURIComponent(meme.fileName)}`,
    {
      headers: {
        Authorization: `OAuth ${YADISK_READ_TOKEN}`
      }
    }
  )
  return await loadImageByURL(response.data.file)
}

export async function loadImageByURL(url: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

export async function makeVisible(invisibleMeme: InvisibleMeme): Promise<FullMeme> {
  return {
    ...invisibleMeme,
    img: await loadImage(invisibleMeme)
  }
}

export async function makeForeignVisible(meme: ForeignMeme): Promise<VisibleForeign> {
  return {
    ...meme,
    img: await loadImageByURL(meme.url)
  }
}

export function isForeign(meme: ForeignMeme | InvisibleMeme): meme is ForeignMeme {
  return (meme as InvisibleMeme).fileName === undefined
}

export function isNative(meme: ForeignMeme | InvisibleMeme): meme is InvisibleMeme {
  return !isForeign(meme)
}

export async function getById(id: number) {
  const invisible = (await Axios.get<InvisibleMeme>(`api/memes/${id}/`)).data
  return await makeVisible(invisible)
}

export function authHeader() {
  return {
    Authorization: `Token ${Token.get()}`
  }
}