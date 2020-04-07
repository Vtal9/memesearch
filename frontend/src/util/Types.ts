declare namespace Types {
  interface Meme {
    img: HTMLImageElement
    id: number
    imageDescription: string
    textDescription: string
  }

  interface SnackbarError {
    msg: string
    resolved: boolean
    short?: boolean
  }

  interface User {
    id: number
    username: string
  }
}

export default Types