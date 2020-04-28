export type Meme = {
  img: HTMLImageElement
  id: number
  imageDescription: string
  textDescription: string
}

export type UnloadedMeme =
| { type: 'native', id: number, url: string }
| { type: 'external', url: string }

export type User = {
  id: number
  username: string
}

export type AuthState =
| { readonly status: 'unknown' | 'no' }
| { status: 'yes', user: User, token: string }

export enum Repo {
  Own, Public
}

export type Tag = {
  id: number
  tag: string
}

export type SearchRequest = {
  own: boolean
} & (
  | { extended: false, q: string, tags: Tag[] }
  | { extended: true, tags: Tag[], qText: string, qImage: string }
)