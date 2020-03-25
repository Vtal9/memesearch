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
}

export default Types