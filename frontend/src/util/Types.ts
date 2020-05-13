export type FullMeme = InvisibleMeme & {
  img: HTMLImageElement
}

export type InvisibleMeme = {
  id: number
  url: string
  imageDescription: string
  textDescription: string
  fileName: string
  likes: number
  dislikes: number
  tags: Tag[]
  owner: User[]
}

export type ForeignMeme = {
  url: string
}

export type VisibleForeign = ForeignMeme & {
  img: HTMLImageElement
}

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