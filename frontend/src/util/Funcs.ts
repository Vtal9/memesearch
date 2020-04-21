import Axios from 'axios';
import Token from './Token'


export function loadImage(
  id: number, src: string,
  success: (img: HTMLImageElement) => void, failure: () => void
) {
  const img = new Image()
  img.onload = () => success(img)
  img.onerror = () => {
    Axios.get(`api/new_meme_url/?id=${id}`).then(function(response) {
      const second = new Image()
      second.onload = () => success(second)
      second.onerror = failure
      second.src = response.data[0].url
    }).catch(failure)
  }
  img.src = src
}

export function authHeader() {
  return {
    Authorization: `Token ${Token.get()}`
  }
}