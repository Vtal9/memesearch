import React from 'react'
import { UnloadedMeme, AuthState, User } from '../../util/Types'
import Axios from 'axios'
import { loadImage } from '../../util/Funcs'
import { CircularProgress } from '@material-ui/core'
import { AddRemove, FakeAdd } from './AddRemove'
import { Copy } from './Copy'
import { ExtraMarkup, FakeMarkup } from './ExtraMarkup'
import { TagsEdit, FakeTagsEdit } from './TagsEdit'


type Props = {
  unloadedMeme: UnloadedMeme
  openDialog: (img: HTMLImageElement, id: number | false) => void
  authState: AuthState
  onDelete?: () => void
}

type State =
| { type: 'loading' }
| { type: 'done', img: HTMLImageElement, owners: User[], id: number }
| { type: 'foreign', img: HTMLImageElement }

export default class GalleryItem extends React.Component<Props, State> {
  state: State = {
    type: 'loading'
  }

  componentDidMount() {
    this.load()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.unloadedMeme !== this.props.unloadedMeme) {
      this.setState({ type: 'loading' })
      this.load()
    }
  }

  load() {
    if (this.props.unloadedMeme.type === 'external') {
      const image = new Image()
      image.onload = () => {
        this.setState({ type: 'foreign', img: image })
      }
      image.src = this.props.unloadedMeme.url
    } else {
      Axios.get(`api/memes/${this.props.unloadedMeme.id}/`).then(response => {
        loadImage(response.data.id, response.data.url, img => {
          this.setState({
            type: 'done',
            img: img,
            owners: response.data.owner,
            id: response.data.id
          })
        }, () => {})
      })
    }
  }

  openDialog() {
    if (this.state.type !== 'loading') {
      if (this.state.type === 'done') {
        this.props.openDialog(this.state.img, this.state.id)
      } else {
        this.props.openDialog(this.state.img, false)
      }
    }
  }

  render() {
    return (
      this.state.type === 'loading' ? (
        <CircularProgress className='gallery-item' />
      ) : (
        <div className='gallery-item'>
          <img src={this.state.img.src}
            onClick={() => this.openDialog()}
          />
          {this.state.type === 'done' &&
            this.props.authState.status === 'yes' ? (
              <div className='actions'>
                <AddRemove
                  user={this.props.authState.user}
                  id={this.state.id}
                  own={this.state.owners.some(owner => 
                    this.props.authState.status === 'yes' &&
                    this.props.authState.user.id === owner.id
                  )}
                />
                <Copy img={this.state.img} />
                <ExtraMarkup
                  id={this.state.id}
                />
                <TagsEdit id={this.state.id} />
              </div>
            ) : (
              <div className="actions">
                <FakeAdd />
                <Copy img={this.state.img} />
                <FakeMarkup />
                <FakeTagsEdit />
              </div>
            )
          }
        </div>
      )
    )
  }
}