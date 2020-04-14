import React from 'react'
import Axios from 'axios'
import Funcs from '../util/Funcs'
import { UnloadedMeme, AuthState, User } from '../util/Types'
import { CircularProgress, IconButton, Icon } from '@material-ui/core'
import { WithSnackbarProps, withSnackbar } from 'notistack'


type AddRemoveProps = WithSnackbarProps & {
  id: number
  openDialog: (id: number, img: HTMLImageElement) => void
  onDelete?: () => void
  own: boolean
  user: User
}

type AddRemoveState = {
  own: boolean
  disabled: boolean
}

class _AddRemove extends React.Component<AddRemoveProps, AddRemoveState> {
  state: AddRemoveState = {
    own: this.props.own,
    disabled: false
  }

  addDelete(method: 'add' | 'remove') {
    this.setState({ disabled: true })
    Axios.post(
      `api/configureOwnMemes?method=${method}&id=${this.props.id}`, {}, 
      {
        headers: {
          Authorization: `Token ${Funcs.getToken()}`
        }
      }
    ).then(response => {
      this.setState({ disabled: false, own: !this.state.own })
      this.props.enqueueSnackbar(
        method === 'remove' ? 'Мем удалён из вашей коллекции' : 'Мем добавлен в вашу коллекцию'
      )
      if (method === 'remove' && this.props.onDelete) {
        this.props.onDelete()
      }
    }).catch(error => {
      this.setState({ disabled: false })
    })
  }

  render() {
    return (
      <IconButton
        disabled={this.state.disabled}
        onClick={() => {
          this.addDelete(this.state.own ? 'remove' : 'add')
        }}
        title={this.state.own ? 'Удалить из своей коллекции' : 'Добавить в свою коллекцию'}
      ><Icon>{this.state.own ? 'delete' : 'add'}</Icon></IconButton>
    )
  }
}

const AddRemove = withSnackbar(_AddRemove)

type GalleryItemProps = {
  id: number
  openDialog: (id: number, img: HTMLImageElement) => void
  authState: AuthState
  onDelete?: () => void
}

type Owner = {
  id: number
  username: string
  email: string
}

type GalleryItemState = {
  status:
  | { type: 'loading' }
  | { type: 'done', img: HTMLImageElement, owners: Owner[], id: number }
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
          status: { type: 'done', img: img, owners: response.data.owner, id: response.data.id }
        })
      }, () => {})
    })
  }

  openDialog() {
    if (this.state.status.type === 'done') {
      this.props.openDialog(this.props.id, this.state.status.img)
    }
  }

  render() {
    return (
      this.state.status.type === 'loading' ?
        <CircularProgress className='gallery-item' />
      :
        <div className='gallery-item'>
          <img src={this.state.status.img.src}
            onClick={() => this.openDialog()}
          />
          <div className='actions'>
            {this.props.authState.status === 'yes' &&
              <AddRemove
                user={this.props.authState.user}
                openDialog={this.props.openDialog}
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
                onDelete={this.props.onDelete}
              />
            }
          </div>
        </div>
    )
  }
}


type GalleryProps = {
  list: UnloadedMeme[]
  authState: AuthState
}

type GalleryState = {

}

export default class Gallery extends React.Component<GalleryProps> {
  constructor(props: GalleryProps) {
    super(props)

  }

  render() {
    return (
      <div className="gallery">
        {this.props.list.map(item => (
          <GalleryItem key={item.id} id={item.id}
            authState={this.props.authState}
            openDialog={(id: number, img: HTMLImageElement) => {
            
          }} />
        ))}
      </div>
    )
  }
}