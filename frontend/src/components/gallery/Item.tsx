import React from 'react'
import { UnloadedMeme, AuthState, User } from '../../util/Types'
import Axios from 'axios'
import { loadImage } from '../../util/Funcs'
import { CircularProgress } from '@material-ui/core'
import { AddRemove, FakeAdd } from './AddRemove'
import { Copy } from './Copy'
import { ExtraMarkup } from './ExtraMarkup'
import { TagsEdit } from './TagsEdit'


type Props = {
  unloadedMeme: UnloadedMeme
  openDialog: (img: HTMLImageElement) => void
  authState: AuthState
  onDelete?: () => void
}

type State = {
  status:
  | { type: 'loading' }
  | { type: 'done', img: HTMLImageElement, owners: User[], id: number }
  | { type: 'foreign', img: HTMLImageElement }
}

export default class GalleryItem extends React.Component<Props, State> {
  state: State = {
    status: { type: 'loading' }
  }

  componentDidMount() {
    this.load()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.unloadedMeme !== this.props.unloadedMeme) {
      this.setState({ status: { type: 'loading' } })
      this.load()
    }
  }

  load() {
    if (this.props.unloadedMeme.type === 'external') {
      const image = new Image()
      image.onload = () => {
        this.setState({
          status: { type: 'foreign', img: image }
        })
      }
      image.src = this.props.unloadedMeme.url
    } else {
      Axios.get(`api/memes/${this.props.unloadedMeme.id}/`).then(response => {
        loadImage(response.data.id, response.data.url, img => {
          this.setState({
            status: { type: 'done', img: img, owners: response.data.owner, id: response.data.id }
          })
        }, () => {})
      })
    }
  }

  openDialog() {
    if (this.state.status.type !== 'loading') {
      this.props.openDialog(this.state.status.img)
    }
  }

  render() {
    return (
      this.state.status.type === 'loading' ? (
        <CircularProgress className='gallery-item' />
      ) : (
        <div className='gallery-item'>
          <img src={this.state.status.img.src}
            onClick={() => this.openDialog()}
          />
          {this.state.status.type === 'done' &&
            <div className='actions'>
              {this.props.authState.status === 'yes' ? (
                <AddRemove
                  user={this.props.authState.user}
                  openDialog={this.openDialog}
                  id={this.state.status.id}
                  own={(() => {
                    const owners = this.state.status.owners
                    for (let i in owners) {
                      if (owners[i].id === this.props.authState.user.id) {
                        return true
                      }
                    }
                    return false
                  })()}
                />
              ) : (
                <FakeAdd />
              )}
              <Copy img={this.state.status.img} />
              {this.props.authState.status === 'yes' &&
                <ExtraMarkup
                  id={this.state.status.id}
                />
              }
              <TagsEdit id={this.state.status.id} />
            </div>
          }
        </div>
      )
    )
  }
}