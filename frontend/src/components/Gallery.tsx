import React from 'react'
import Axios from 'axios'
import Funcs from '../util/Funcs'
import { UnloadedMeme } from '../util/Types'
import { CircularProgress } from '@material-ui/core'


type GalleryItemProps = {
  id: number
}

type GalleryItemState = {
  status:
  | { type: 'loading' }
  | { type: 'done', img: HTMLImageElement }
}

class GalleryItem extends React.Component<GalleryItemProps, GalleryItemState> {
  state: GalleryItemState = {
    status: { type: 'loading' }
  }

  componentDidMount() {
    this.load()
  }

  componentDidUpdate(prevProps: GalleryItemProps) {
    if (prevProps.id !== this.props.id) {
      this.setState({ status: { type: 'loading' } })
      this.load()
    }
  }

  load() {
    Axios.get(`api/memes/${this.props.id}/`).then(response => {
      Funcs.loadImage(response.data.id, response.data.url, img => {
        this.setState({
          status: { type: 'done', img: img }
        })
      }, () => {})
    })
  }

  render() {
    return (
      this.state.status.type === 'loading' ?
        <CircularProgress className='gallery-item' />
      :
        <img src={this.state.status.img.src} className='gallery-item' />
    )
  }
}


type GalleryProps = {
  list: UnloadedMeme[]
}

export default class Gallery extends React.Component<GalleryProps> {
  constructor(props: GalleryProps) {
    super(props)

  }

  render() {
    return (
      <div className="gallery">
        {this.props.list.map(item => (
          <GalleryItem id={item.id} />
        ))}
      </div>
    )
  }
}