import React from 'react'
import Axios from 'axios'
import Funcs from '../util/Funcs'
import { UnloadedMeme, AuthState, User } from '../util/Types'
import { CircularProgress, IconButton, Icon, Dialog, DialogContent, DialogActions, Typography } from '@material-ui/core'
import { WithSnackbarProps, withSnackbar } from 'notistack'


type AddRemoveProps = WithSnackbarProps & {
  id: number
  openDialog: (id: number, img: HTMLImageElement) => void
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
    }).catch(error => {
      this.setState({ disabled: false })
    })
  }

  render() {
    return (
      <IconButton
        size='small'
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


function convertToPng(imgBlob: Blob) {
  const imageUrl = window.URL.createObjectURL(imgBlob)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
  const imageEl = new Image()
  return new Promise<Blob>((resolve, reject) => {
    imageEl.onload = e => {
      const target = e.target as HTMLImageElement
      canvas.width = target.width;
      canvas.height = target.height;
      ctx.drawImage(target, 0, 0, target.width, target.height);
      canvas.toBlob(blob => {
        if (blob !== null) {
          resolve(blob)
        } else {
          reject()
        }
      }, "image/png", 1);
    }
    imageEl.onerror = e => {
      console.log(e)
      reject()
    }
    imageEl.src = imageUrl
  })
}

type CopyProps = {
  img: HTMLImageElement
} & WithSnackbarProps

type CopyState = {
  disabled: boolean
}

class _Copy extends React.Component<CopyProps, CopyState> {
  state: CopyState = {
    disabled: false
  }

  async copy() {
    this.setState({ disabled: true })
    try {
      const cors_proxy = 'https://cors-anywhere.herokuapp.com/'
      let img: Response
      try {
        img = await fetch(this.props.img.src)
      } catch (e) {
        img = await fetch(cors_proxy + this.props.img.src)
      }
      let blob = await img.blob()
      const ClipboardItem: any = window['ClipboardItem' as any]
      if (blob.type !== 'image/png') {
        blob = await convertToPng(blob)
      }
      await (navigator.clipboard as any).write([
        new ClipboardItem({
            [blob.type]: blob
        })
      ]);
      this.setState({ disabled: false })
      this.props.enqueueSnackbar('Скопировано в буфер обмена')
    } catch (error) {
      this.setState({ disabled: false })
      console.log(error)
      this.props.enqueueSnackbar('Не удалось скопировать, но вы можете сделать это вручную')
    }
  }

  render() {
    return (
      <IconButton
        disabled={this.state.disabled}
        size='small'
        onClick={() => this.copy()}
        title='Копировать в буфер обмена'
      ><Icon>file_copy</Icon></IconButton>
    )
  }
}

const Copy = withSnackbar(_Copy)

type GalleryItemProps = {
  unloadedMeme: UnloadedMeme
  openDialog: (img: HTMLImageElement) => void
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
  | { type: 'foreign', img: HTMLImageElement }
}

class GalleryItem extends React.Component<GalleryItemProps, GalleryItemState> {
  state: GalleryItemState = {
    status: { type: 'loading' }
  }

  componentDidMount() {
    this.load()
  }

  componentDidUpdate(prevProps: GalleryItemProps) {
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
        Funcs.loadImage(response.data.id, response.data.url, img => {
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
      this.state.status.type === 'loading' ?
        <CircularProgress className='gallery-item' />
      :
        <div className='gallery-item'>
          <img src={this.state.status.img.src}
            onClick={() => this.openDialog()}
          />
          <div className='actions'>
            {this.props.authState.status === 'yes' && this.state.status.type === 'done' &&
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
            }
            <Copy img={this.state.status.img} />
          </div>
        </div>
    )
  }
}

function imageSize(img: HTMLImageElement) {
  const [ imgW, imgH ] = [ img.width, img.height ]
  const [ clientW, clientH ] = [ window.innerWidth, window.innerHeight ]
  const [ availableW, availableH ] = [ clientW - 64, clientH - 110 ]
  const scale = Math.min(1, availableW / imgW, availableH / imgH)
  return { width: imgW * scale, height: imgH * scale }
}

type GalleryProps = {
  list: UnloadedMeme[]
  authState: AuthState
}

type GalleryState = {
  dialogImg: HTMLImageElement | null
}

export default class Gallery extends React.Component<GalleryProps, GalleryState> {
  state: GalleryState = {
    dialogImg: null
  }

  render() {
    return (
      <div className="gallery">
        <Dialog
          maxWidth={false}
          open={this.state.dialogImg !== null}
          onClose={() => this.setState({ dialogImg: null })}
        >
          {this.state.dialogImg !== null && [
            <img src={this.state.dialogImg.src} {...imageSize(this.state.dialogImg)} key={1} />,
            <DialogActions key={2}>
              <a href={this.state.dialogImg.src} target='_blank'>
                <Typography>Открыть оригинал</Typography>
              </a>
            </DialogActions>
          ]}
        </Dialog>
        {this.props.list.map(item => (
          <GalleryItem key={item.url} unloadedMeme={item}
            authState={this.props.authState}
            openDialog={(img: HTMLImageElement) => {
              this.setState({ dialogImg: img })
          }} />
        ))}
      </div>
    )
  }
}